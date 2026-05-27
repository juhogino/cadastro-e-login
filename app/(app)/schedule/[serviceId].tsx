import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/src/context/AuthContext";
import { saveSchedule } from "@/src/storage/scheduleStorage";

const HORARIOS = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function gerarProximosDias(quantidade: number) {
  const dias = [];
  const hoje = new Date();
  for (let i = 1; i <= quantidade; i++) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() + i);
    dias.push(d);
  }
  return dias;
}

function formatarDataISO(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function Schedule() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { serviceId, titulo, prestadorEmail } = useLocalSearchParams<{
    serviceId: string;
    titulo: string;
    prestadorEmail: string;
  }>();

  const dias = gerarProximosDias(14);
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [horaSelecionada, setHoraSelecionada] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agendado, setAgendado] = useState(false);

  async function handleConfirmar() {
    if (!diaSelecionado || !horaSelecionada) {
      alert("Selecione uma data e um horário");
      return;
    }

    setLoading(true);
    try {
      await saveSchedule({
        serviceId: Number(serviceId),
        titulo,
        userEmail: user?.email ?? "",
        prestadorEmail,
        data: formatarDataISO(diaSelecionado),
        hora: horaSelecionada,
      });
      setAgendado(true);
    } catch (error: any) {
      alert(error.message ?? "Erro ao criar agendamento");
    } finally {
      setLoading(false);
    }
  }

  if (agendado) {
    const dataFormatada = diaSelecionado
      ? `${diaSelecionado.getDate()} de ${MESES[diaSelecionado.getMonth()]}`
      : "";

    return (
      <View style={styles.successContainer}>
        <Ionicons name="calendar-outline" size={90} color="#4A6CF7" />
        <Text style={styles.successTitle}>Agendado!</Text>
        <Text style={styles.successText}>
          Seu agendamento de{" "}
          <Text style={{ fontWeight: "bold" }}>{titulo}</Text> foi registrado com sucesso.
        </Text>
        <View style={styles.successDetail}>
          <View style={styles.successRow}>
            <Ionicons name="calendar-outline" size={16} color="#4A6CF7" />
            <Text style={styles.successDetailText}>{dataFormatada}</Text>
          </View>
          <View style={styles.successRow}>
            <Ionicons name="time-outline" size={16} color="#4A6CF7" />
            <Text style={styles.successDetailText}>{horaSelecionada}</Text>
          </View>
          <View style={styles.successRow}>
            <Ionicons name="person-outline" size={16} color="#4A6CF7" />
            <Text style={styles.successDetailText}>{prestadorEmail}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace("/(app)/home")}
        >
          <Text style={styles.buttonText}>Voltar para o início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      <Text style={styles.title}>Agendar serviço</Text>

      <View style={styles.serviceCard}>
        <Ionicons name="construct-outline" size={18} color="#4A6CF7" />
        <View style={{ flex: 1 }}>
          <Text style={styles.serviceTitle}>{titulo}</Text>
          <Text style={styles.serviceEmail}>{prestadorEmail}</Text>
        </View>
      </View>

      {/* Seleção de data */}
      <Text style={styles.sectionTitle}>Escolha uma data</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.diasScroll}
        contentContainerStyle={styles.diasContent}
      >
        {dias.map((dia, index) => {
          const selecionado =
            diaSelecionado && formatarDataISO(dia) === formatarDataISO(diaSelecionado);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.diaBtn, selecionado && styles.diaBtnActive]}
              onPress={() => setDiaSelecionado(dia)}
            >
              <Text style={[styles.diaSemana, selecionado && styles.diaTextActive]}>
                {DIAS_SEMANA[dia.getDay()]}
              </Text>
              <Text style={[styles.diaNumero, selecionado && styles.diaTextActive]}>
                {dia.getDate()}
              </Text>
              <Text style={[styles.diaMes, selecionado && styles.diaTextActive]}>
                {MESES[dia.getMonth()]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Seleção de horário */}
      <Text style={styles.sectionTitle}>Escolha um horário</Text>
      <View style={styles.horariosGrid}>
        {HORARIOS.map((hora) => {
          const selecionado = hora === horaSelecionada;
          return (
            <TouchableOpacity
              key={hora}
              style={[styles.horaBtn, selecionado && styles.horaBtnActive]}
              onPress={() => setHoraSelecionada(hora)}
            >
              <Text style={[styles.horaText, selecionado && styles.horaTextActive]}>
                {hora}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Resumo da seleção */}
      {(diaSelecionado || horaSelecionada) && (
        <View style={styles.resumoCard}>
          {diaSelecionado && (
            <View style={styles.resumoRow}>
              <Ionicons name="calendar-outline" size={16} color="#4A6CF7" />
              <Text style={styles.resumoText}>
                {DIAS_SEMANA[diaSelecionado.getDay()]},{" "}
                {diaSelecionado.getDate()} de {MESES[diaSelecionado.getMonth()]}
              </Text>
            </View>
          )}
          {horaSelecionada && (
            <View style={styles.resumoRow}>
              <Ionicons name="time-outline" size={16} color="#4A6CF7" />
              <Text style={styles.resumoText}>{horaSelecionada}</Text>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.confirmButton,
          (!diaSelecionado || !horaSelecionada || loading) && styles.confirmButtonDisabled,
        ]}
        onPress={handleConfirmar}
        disabled={!diaSelecionado || !horaSelecionada || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Confirmar agendamento</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF",
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 4,
    marginTop: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 20,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    padding: 16,
    marginBottom: 24,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  serviceEmail: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A",
    marginBottom: 12,
  },
  diasScroll: {
    marginBottom: 24,
  },
  diasContent: {
    gap: 10,
    paddingRight: 8,
  },
  diaBtn: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    paddingVertical: 12,
    paddingHorizontal: 14,
    minWidth: 62,
    gap: 2,
  },
  diaBtnActive: {
    backgroundColor: "#4A6CF7",
    borderColor: "#4A6CF7",
  },
  diaSemana: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  diaNumero: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E293B",
  },
  diaMes: {
    fontSize: 12,
    color: "#64748B",
  },
  diaTextActive: {
    color: "#fff",
  },
  horariosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  horaBtn: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  horaBtnActive: {
    backgroundColor: "#4A6CF7",
    borderColor: "#4A6CF7",
  },
  horaText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
  horaTextActive: {
    color: "#fff",
  },
  resumoCard: {
    backgroundColor: "#E0E7FF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    padding: 14,
    gap: 8,
    marginBottom: 20,
  },
  resumoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  resumoText: {
    color: "#1E3A8A",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#4A6CF7",
    padding: 18,
    borderRadius: 30,
  },
  confirmButtonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  successContainer: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginTop: 20,
    marginBottom: 12,
  },
  successText: {
    color: "#475569",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  successDetail: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    padding: 16,
    width: "100%",
    gap: 12,
    marginBottom: 28,
  },
  successRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  successDetailText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "500",
  },
  homeButton: {
    backgroundColor: "#4A6CF7",
    padding: 16,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
});
