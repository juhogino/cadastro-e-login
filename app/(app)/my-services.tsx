import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useContext, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '@/src/context/AuthContext';
import {
  getMyContracts,
  getContractsAsPrestador,
  Contract,
} from '@/src/storage/contractStorage';
import TabBar from '@/components/TabBar';

const METODO_LABEL: Record<string, string> = {
  pix: 'PIX',
  cartao: 'Cartão',
};

export default function MyServices() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const isPrestador = user?.tipo === 'prestador';

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      const fetch = isPrestador
        ? getContractsAsPrestador(user?.email ?? '')
        : getMyContracts(user?.email ?? '');

      fetch
        .then((data) => { if (active) setContracts(data); })
        .catch(() => {})
        .finally(() => { if (active) setLoading(false); });

      return () => { active = false; };
    }, [user?.email, isPrestador])
  );

  function openChat(item: Contract) {
    router.push({
      pathname: '/(app)/chat/[contractId]' as any,
      params: {
        contractId: item.id.toString(),
        otherEmail: isPrestador ? item.userEmail : item.prestadorEmail,
        titulo: item.titulo,
      },
    });
  }

  function renderItem({ item }: { item: Contract }) {
    const subtitle = isPrestador ? item.userEmail : item.prestadorEmail;

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.iconBox}>
            <Ionicons name="construct-outline" size={20} color="#3A7DFF" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.titulo}
            </Text>
            <Text style={styles.cardSub} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
          <Text style={styles.cardPrice}>R$ {item.preco}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardBottom}>
          {item.data ? (
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={14} color="#666666" />
              <Text style={styles.detailText}>
                {item.data}{item.hora ? ` às ${item.hora}` : ''}
              </Text>
            </View>
          ) : null}
          <View style={styles.detailRow}>
            <Ionicons name="card-outline" size={14} color="#666666" />
            <Text style={styles.detailText}>
              {METODO_LABEL[item.metodoPagamento] ?? item.metodoPagamento}
            </Text>
          </View>
          <View style={[styles.badge, styles.badgeConfirmed]}>
            <Text style={styles.badgeText}>Confirmado</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.chatButton} onPress={() => openChat(item)} activeOpacity={0.8}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color="#3A7DFF" />
          <Text style={styles.chatButtonText}>
            {isPrestador ? 'Responder cliente' : 'Falar com prestador'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const screenTitle = isPrestador ? 'Meus Chats' : 'Meus Serviços';
  const emptyIcon = isPrestador ? 'chatbubbles-outline' : 'receipt-outline';
  const emptyText = isPrestador
    ? 'Nenhum serviço recebido ainda'
    : 'Nenhum serviço contratado ainda';

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{screenTitle}</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#3A7DFF" size="large" />
        </View>
      ) : (
        <FlatList
          data={contracts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name={emptyIcon} size={48} color="#C7C7CC" />
              <Text style={styles.emptyText}>{emptyText}</Text>
              {!isPrestador && (
                <TouchableOpacity
                  style={styles.browseButton}
                  onPress={() => router.push('/(app)/services' as any)}
                >
                  <Text style={styles.browseButtonText}>Explorar serviços</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}

      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0D0D0D',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 80,
  },
  emptyText: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
  },
  browseButton: {
    marginTop: 8,
    backgroundColor: '#3A7DFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D0D0D',
  },
  cardSub: {
    fontSize: 12,
    color: '#666666',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A7DFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666666',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeConfirmed: {
    backgroundColor: '#E8F5E9',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4CAF50',
  },

  // Chat button
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#3A7DFF',
    borderRadius: 12,
    paddingVertical: 10,
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A7DFF',
  },
});
