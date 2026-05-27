import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/src/context/AuthContext";
import { saveContract } from "@/src/storage/contractStorage";

type MetodoPagamento = "pix" | "cartao";

const HORARIOS = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];
const DIAS_SEMANA_CURTO = ["D", "S", "T", "Q", "Q", "S", "S"];
const MESES_NOMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const MESES_CURTO = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

function formatarDataISO(date: Date) {
  return date.toISOString().split("T")[0];
}

function diasDoMes(ano: number, mes: number) {
  return new Date(ano, mes + 1, 0).getDate();
}

function primeiroDiaDaSemana(ano: number, mes: number) {
  return new Date(ano, mes, 1).getDay();
}

// ─── Calendário inline ────────────────────────────────────────────────────────

function Calendario({
  selecionado,
  onSelecionar,
  onFechar,
}: {
  selecionado: Date | null;
  onSelecionar: (d: Date) => void;
  onFechar: () => void;
}) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());

  function navegar(delta: number) {
    const d = new Date(ano, mes + delta, 1);
    setMes(d.getMonth());
    setAno(d.getFullYear());
  }

  const totalDias = diasDoMes(ano, mes);
  const offset = primeiroDiaDaSemana(ano, mes);
  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];

  return (
    <View style={cal.container}>
      {/* cabeçalho do mês */}
      <View style={cal.header}>
        <TouchableOpacity onPress={() => navegar(-1)} style={cal.navBtn}>
          <Ionicons name="chevron-back" size={20} color="#1E3A8A" />
        </TouchableOpacity>
        <Text style={cal.mesAno}>
          {MESES_NOMES[mes]} {ano}
        </Text>
        <TouchableOpacity onPress={() => navegar(1)} style={cal.navBtn}>
          <Ionicons name="chevron-forward" size={20} color="#1E3A8A" />
        </TouchableOpacity>
      </View>

      {/* dias da semana */}
      <View style={cal.semanaRow}>
        {DIAS_SEMANA_CURTO.map((d, i) => (
          <Text key={i} style={cal.semanaLabel}>{d}</Text>
        ))}
      </View>

      {/* grid de dias */}
      <View style={cal.grid}>
        {cells.map((dia, i) => {
          if (!dia) return <View key={i} style={cal.cell} />;

          const data = new Date(ano, mes, dia);
          const passado = data < hoje;
          const isSelecionado =
            selecionado && formatarDataISO(data) === formatarDataISO(selecionado);

          return (
            <TouchableOpacity
              key={i}
              style={[
                cal.cell,
                isSelecionado && cal.cellSelected,
                passado && cal.cellDisabled,
              ]}
              onPress={() => {
                if (!passado) {
                  onSelecionar(data);
                  onFechar();
                }
              }}
              disabled={passado}
            >
              <Text
                style={[
                  cal.cellText,
                  isSelecionado && cal.cellTextSelected,
                  passado && cal.cellTextDisabled,
                ]}
              >
                {dia}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function Contract() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { serviceId, titulo, prestadorEmail, preco } = useLocalSearchParams<{
    serviceId: string;
    titulo: string;
    prestadorEmail: string;
    preco: string;
  }>();

  // Stepper
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 – Agendamento
  const [calendarAberto, setCalendarAberto] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horaSelecionada, setHoraSelecionada] = useState<string | null>(null);

  // Step 2 – Pagamento
  const [metodo, setMetodo] = useState<MetodoPagamento>("pix");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");

  const [loading, setLoading] = useState(false);
  const [concluido, setConcluido] = useState(false);

  function formatarCartao(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatarValidade(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  function dataFormatadaBR(date: Date) {
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  }

  async function handleConfirmar() {
    if (metodo === "cartao") {
      const digits = numeroCartao.replace(/\s/g, "");
      if (digits.length < 16 || !validade || cvv.length < 3 || !nomeCartao) {
        alert("Preencha todos os dados do cartão");
        return;
      }
    }

    setLoading(true);
    try {
      await saveContract({
        serviceId: Number(serviceId),
        titulo,
        preco,
        userEmail: user?.email ?? "",
        prestadorEmail,
        metodoPagamento: metodo,
        data: dataSelecionada ? formatarDataISO(dataSelecionada) : undefined,
        hora: horaSelecionada ?? undefined,
      });
      setConcluido(true);
    } catch (error: any) {
      alert(error.message ?? "Erro ao confirmar contratação");
    } finally {
      setLoading(false);
    }
  }

  // ── Tela de sucesso ──
  if (concluido) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={90} color="#22C55E" />
        <Text style={styles.successTitle}>Contratação confirmada!</Text>
        <Text style={styles.successText}>
          Seu serviço de <Text style={{ fontWeight: "bold" }}>{titulo}</Text> foi agendado e o pagamento registrado com sucesso.
        </Text>
        <View style={styles.successDetail}>
          {dataSelecionada && (
            <View style={styles.successRow}>
              <Ionicons name="calendar-outline" size={16} color="#4A6CF7" />
              <Text style={styles.successDetailText}>
                {dataFormatadaBR(dataSelecionada)}{horaSelecionada ? ` às ${horaSelecionada}` : ""}
              </Text>
            </View>
          )}
          <View style={styles.successRow}>
            <Ionicons name="cash-outline" size={16} color="#4A6CF7" />
            <Text style={styles.successDetailText}>R$ {preco}</Text>
          </View>
          <View style={styles.successRow}>
            <Ionicons name={metodo === "pix" ? "qr-code-outline" : "card-outline"} size={16} color="#4A6CF7" />
            <Text style={styles.successDetailText}>
              {metodo === "pix" ? "PIX" : "Cartão de crédito"}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.homeButton} onPress={() => router.replace("/(app)/home")}>
          <Text style={styles.buttonText}>Voltar para o início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Step 1: Agendamento ──
  if (step === 1) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
        </TouchableOpacity>

        {/* Stepper */}
        <View style={styles.stepper}>
          <View style={styles.stepActive}>
            <Text style={styles.stepNumActive}>1</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepInactive}>
            <Text style={styles.stepNumInactive}>2</Text>
          </View>
        </View>
        <Text style={styles.stepLabel}>Agendamento</Text>

        {/* Serviço */}
        <View style={styles.serviceCard}>
          <Ionicons name="construct-outline" size={18} color="#4A6CF7" />
          <View style={{ flex: 1 }}>
            <Text style={styles.serviceTitle}>{titulo}</Text>
            <Text style={styles.serviceEmail}>{prestadorEmail}</Text>
          </View>
        </View>

        {/* Botão de abrir calendário */}
        <Text style={styles.sectionTitle}>Data do serviço</Text>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => setCalendarAberto(!calendarAberto)}
        >
          <Ionicons name="calendar-outline" size={20} color="#4A6CF7" />
          <Text style={styles.calendarButtonText}>
            {dataSelecionada ? dataFormatadaBR(dataSelecionada) : "Escolher data"}
          </Text>
          <Ionicons
            name={calendarAberto ? "chevron-up" : "chevron-down"}
            size={18}
            color="#64748B"
          />
        </TouchableOpacity>

        {calendarAberto && (
          <Calendario
            selecionado={dataSelecionada}
            onSelecionar={setDataSelecionada}
            onFechar={() => setCalendarAberto(false)}
          />
        )}

        {/* Horários */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Horário</Text>
        <View style={styles.horariosGrid}>
          {HORARIOS.map((hora) => {
            const ativo = hora === horaSelecionada;
            return (
              <TouchableOpacity
                key={hora}
                style={[styles.horaBtn, ativo && styles.horaBtnActive]}
                onPress={() => setHoraSelecionada(hora)}
              >
                <Text style={[styles.horaText, ativo && styles.horaTextActive]}>{hora}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Resumo seleção */}
        {(dataSelecionada || horaSelecionada) && (
          <View style={styles.resumoCard}>
            {dataSelecionada && (
              <View style={styles.resumoRow}>
                <Ionicons name="calendar-outline" size={15} color="#4A6CF7" />
                <Text style={styles.resumoText}>{dataFormatadaBR(dataSelecionada)}</Text>
              </View>
            )}
            {horaSelecionada && (
              <View style={styles.resumoRow}>
                <Ionicons name="time-outline" size={15} color="#4A6CF7" />
                <Text style={styles.resumoText}>{horaSelecionada}</Text>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            (!dataSelecionada || !horaSelecionada) && styles.buttonDisabled,
          ]}
          onPress={() => setStep(2)}
          disabled={!dataSelecionada || !horaSelecionada}
        >
          <Text style={styles.buttonText}>Próximo · Pagamento</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ── Step 2: Pagamento ──
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
        <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      {/* Stepper */}
      <View style={styles.stepper}>
        <View style={styles.stepDone}>
          <Ionicons name="checkmark" size={14} color="#fff" />
        </View>
        <View style={[styles.stepLine, styles.stepLineDone]} />
        <View style={styles.stepActive}>
          <Text style={styles.stepNumActive}>2</Text>
        </View>
      </View>
      <Text style={styles.stepLabel}>Pagamento</Text>

      {/* Resumo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumo</Text>
        <View style={styles.row}>
          <Ionicons name="construct-outline" size={16} color="#64748B" />
          <Text style={styles.label}>Serviço</Text>
          <Text style={styles.value}>{titulo}</Text>
        </View>
        {dataSelecionada && (
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={16} color="#64748B" />
            <Text style={styles.label}>Data</Text>
            <Text style={styles.value}>
              {dataFormatadaBR(dataSelecionada)} às {horaSelecionada}
            </Text>
          </View>
        )}
        <View style={styles.row}>
          <Ionicons name="cash-outline" size={16} color="#64748B" />
          <Text style={styles.label}>Valor</Text>
          <Text style={[styles.value, styles.preco]}>R$ {preco}</Text>
        </View>
      </View>

      {/* Método */}
      <Text style={styles.sectionTitle}>Forma de pagamento</Text>
      <View style={styles.metodosRow}>
        <TouchableOpacity
          style={[styles.metodoBtn, metodo === "pix" && styles.metodoBtnActive]}
          onPress={() => setMetodo("pix")}
        >
          <Ionicons name="qr-code-outline" size={22} color={metodo === "pix" ? "#4A6CF7" : "#64748B"} />
          <Text style={[styles.metodoText, metodo === "pix" && styles.metodoTextActive]}>PIX</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.metodoBtn, metodo === "cartao" && styles.metodoBtnActive]}
          onPress={() => setMetodo("cartao")}
        >
          <Ionicons name="card-outline" size={22} color={metodo === "cartao" ? "#4A6CF7" : "#64748B"} />
          <Text style={[styles.metodoText, metodo === "cartao" && styles.metodoTextActive]}>Cartão</Text>
        </TouchableOpacity>
      </View>

      {/* PIX */}
      {metodo === "pix" && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chave PIX</Text>
          <View style={styles.pixBox}>
            <Ionicons name="qr-code-outline" size={48} color="#4A6CF7" />
            <Text style={styles.pixChave}>marketplace@pagamento.com</Text>
            <Text style={styles.pixInfo}>
              Após confirmar, você terá 30 minutos para realizar o pagamento.
            </Text>
          </View>
        </View>
      )}

      {/* Cartão */}
      {metodo === "cartao" && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados do cartão</Text>

          <Text style={styles.inputLabel}>Número do cartão</Text>
          <TextInput
            style={styles.input}
            placeholder="0000 0000 0000 0000"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={numeroCartao}
            onChangeText={(v) => setNumeroCartao(formatarCartao(v))}
            maxLength={19}
          />

          <Text style={styles.inputLabel}>Nome no cartão</Text>
          <TextInput
            style={styles.input}
            placeholder="NOME SOBRENOME"
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
            value={nomeCartao}
            onChangeText={setNomeCartao}
          />

          <View style={styles.rowInputs}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Validade</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/AA"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={validade}
                onChangeText={(v) => setValidade(formatarValidade(v))}
                maxLength={5}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                secureTextEntry
                value={cvv}
                onChangeText={(v) => setCvv(v.replace(/\D/g, "").slice(0, 3))}
                maxLength={3}
              />
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.confirmButton, loading && styles.buttonDisabled]}
        onPress={handleConfirmar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="lock-closed-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Confirmar pagamento · R$ {preco}</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Simulação para fins educacionais. Nenhum valor real será cobrado.
      </Text>
    </ScrollView>
  );
}

// ─── Estilos do calendário ────────────────────────────────────────────────────

const cal = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    padding: 16,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  navBtn: {
    padding: 6,
  },
  mesAno: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  semanaRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  semanaLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  cellSelected: {
    backgroundColor: "#4A6CF7",
  },
  cellDisabled: {
    opacity: 0.3,
  },
  cellText: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "500",
  },
  cellTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  cellTextDisabled: {
    color: "#94A3B8",
  },
});

// ─── Estilos gerais ───────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEF2FF" },
  content: { padding: 24, paddingBottom: 48 },
  backButton: {
    alignSelf: "flex-start",
    padding: 4,
    marginTop: 40,
    marginBottom: 12,
  },

  // Stepper
  stepper: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  stepActive: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#4A6CF7", alignItems: "center", justifyContent: "center",
  },
  stepInactive: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#CBD5F5", alignItems: "center", justifyContent: "center",
  },
  stepDone: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#22C55E", alignItems: "center", justifyContent: "center",
  },
  stepLine: { flex: 1, height: 2, backgroundColor: "#CBD5F5", marginHorizontal: 6 },
  stepLineDone: { backgroundColor: "#22C55E" },
  stepNumActive: { color: "#fff", fontWeight: "700", fontSize: 13 },
  stepNumInactive: { color: "#64748B", fontWeight: "700", fontSize: 13 },
  stepLabel: { fontSize: 22, fontWeight: "bold", color: "#1E3A8A", marginBottom: 20 },

  // Serviço
  serviceCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#fff", borderRadius: 16, borderWidth: 1,
    borderColor: "#CBD5F5", padding: 16, marginBottom: 20,
  },
  serviceTitle: { fontSize: 15, fontWeight: "700", color: "#1E293B" },
  serviceEmail: { fontSize: 13, color: "#64748B", marginTop: 2 },

  sectionTitle: { fontSize: 15, fontWeight: "600", color: "#1E3A8A", marginBottom: 10 },

  // Calendário
  calendarButton: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "#fff", borderRadius: 14, borderWidth: 1,
    borderColor: "#CBD5F5", padding: 14, marginBottom: 12,
  },
  calendarButtonText: { flex: 1, fontSize: 15, color: "#1E293B", fontWeight: "500" },

  // Horários
  horariosGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  horaBtn: {
    backgroundColor: "#fff", borderRadius: 12, borderWidth: 1,
    borderColor: "#CBD5F5", paddingVertical: 10, paddingHorizontal: 16,
  },
  horaBtnActive: { backgroundColor: "#4A6CF7", borderColor: "#4A6CF7" },
  horaText: { fontSize: 14, fontWeight: "600", color: "#334155" },
  horaTextActive: { color: "#fff" },

  // Resumo
  resumoCard: {
    backgroundColor: "#E0E7FF", borderRadius: 12, borderWidth: 1,
    borderColor: "#C7D2FE", padding: 12, gap: 6, marginBottom: 16,
  },
  resumoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  resumoText: { color: "#1E3A8A", fontSize: 13, fontWeight: "600" },

  // Botões step 1
  nextButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: "#4A6CF7", padding: 18, borderRadius: 30,
  },

  // Pagamento
  card: {
    backgroundColor: "#fff", borderRadius: 20, borderWidth: 1,
    borderColor: "#CBD5F5", padding: 20, marginBottom: 20, gap: 12,
  },
  cardTitle: {
    fontSize: 13, fontWeight: "700", color: "#64748B",
    textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowInputs: { flexDirection: "row", gap: 12 },
  label: { color: "#64748B", fontSize: 14, flex: 1 },
  value: { color: "#1E293B", fontSize: 14, fontWeight: "600", flexShrink: 1, textAlign: "right" },
  preco: { color: "#4A6CF7", fontSize: 16 },

  metodosRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  metodoBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: "#fff", borderRadius: 14, borderWidth: 1,
    borderColor: "#CBD5F5", padding: 14,
  },
  metodoBtnActive: { borderColor: "#4A6CF7", backgroundColor: "#E0E7FF" },
  metodoText: { color: "#64748B", fontWeight: "600", fontSize: 15 },
  metodoTextActive: { color: "#4A6CF7" },

  pixBox: { alignItems: "center", gap: 12, paddingVertical: 8 },
  pixChave: { fontSize: 16, fontWeight: "700", color: "#1E3A8A" },
  pixInfo: { color: "#64748B", fontSize: 13, textAlign: "center", lineHeight: 20 },

  inputLabel: { fontSize: 13, fontWeight: "600", color: "#64748B", marginBottom: 6 },
  input: {
    backgroundColor: "#F8FAFF", borderWidth: 1, borderColor: "#CBD5F5",
    borderRadius: 12, padding: 13, fontSize: 15, color: "#1E293B", marginBottom: 14,
  },

  confirmButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: "#4A6CF7", padding: 18, borderRadius: 30, marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  disclaimer: { color: "#94A3B8", fontSize: 12, textAlign: "center" },

  // Sucesso
  successContainer: {
    flex: 1, backgroundColor: "#EEF2FF", padding: 32,
    alignItems: "center", justifyContent: "center",
  },
  successTitle: { fontSize: 26, fontWeight: "bold", color: "#1E3A8A", marginTop: 20, marginBottom: 12 },
  successText: { color: "#475569", fontSize: 15, textAlign: "center", lineHeight: 24, marginBottom: 20 },
  successDetail: {
    backgroundColor: "#fff", borderRadius: 16, borderWidth: 1,
    borderColor: "#CBD5F5", padding: 16, width: "100%", gap: 12, marginBottom: 28,
  },
  successRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  successDetailText: { color: "#334155", fontSize: 14, fontWeight: "500" },
  homeButton: {
    backgroundColor: "#4A6CF7", padding: 16, borderRadius: 30,
    width: "100%", alignItems: "center",
  },
});
