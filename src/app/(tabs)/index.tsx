import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { ItemCard, PRIORITY_STYLE, STATUS_STYLE } from '@/components/ItemCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getApiErrorMessage } from '@/services/api';
import { getTickets } from '@/services/resourceService';

import { PRIORITIES, STATUSES } from '@/constants/config';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Ticket } from '@/types/Entity';

type FilterValue = 'Todos' | Ticket['priority'] | Ticket['status'];

function FilterChip({
  label,
  selected,
  onPress,
  color,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected
            ? color ?? '#3c87f7'
            : theme.backgroundElement,
          borderColor: color ?? '#3c87f7',
        },
      ]}>
      <Text
        style={[
          styles.chipText,
          { color: selected ? (color ? '#000' : '#fff') : theme.textSecondary },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function TicketsScreen() {
  const theme = useTheme();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<FilterValue>('Todos');
  const [statusFilter, setStatusFilter] = useState<FilterValue>('Todos');

  const loadTickets = useCallback(async () => {
    const data = await getTickets();
    setTickets(data);
  }, []);

  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        await loadTickets();
        if (isActive) setError(null);
      } catch (error) {
        if (isActive) setError(getApiErrorMessage(error));
      } finally {
        if (isActive) setLoading(false);
      }
    })();
    return () => {
      isActive = false;
    };
  }, [loadTickets]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadTickets();
      setError(null);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setRefreshing(false);
    }
  }, [loadTickets]);

  const handleRetry = useCallback(async () => {
    setLoading(true);
    try {
      await loadTickets();
      setError(null);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [loadTickets]);

  const filteredTickets = tickets.filter(
    (ticket) =>
      (priorityFilter === 'Todos' || ticket.priority === priorityFilter) &&
      (statusFilter === 'Todos' || ticket.status === statusFilter),
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading ? (
        <LoadingSpinner message="Cargando tickets..." />
      ) : (
        <>
          <View style={styles.filters}>
            <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>
              Prioridad
            </Text>
            <View style={styles.chipRow}>
              <FilterChip
                label="Todos"
                selected={priorityFilter === 'Todos'}
                onPress={() => setPriorityFilter('Todos')}
              />
              {PRIORITIES.map((priority) => (
                <FilterChip
                  key={priority}
                  label={priority}
                  selected={priorityFilter === priority}
                  onPress={() => setPriorityFilter(priority)}
                  color={PRIORITY_STYLE[priority].bg}
                />
              ))}
            </View>

            <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>
              Estado
            </Text>
            <View style={styles.chipRow}>
              <FilterChip
                label="Todos"
                selected={statusFilter === 'Todos'}
                onPress={() => setStatusFilter('Todos')}
              />
              {STATUSES.map((status) => (
                <FilterChip
                  key={status}
                  label={status}
                  selected={statusFilter === status}
                  onPress={() => setStatusFilter(status)}
                  color={STATUS_STYLE[status].bg}
                />
              ))}
            </View>
          </View>

          {error ? (
            <View style={styles.centerState}>
              <Text style={[styles.errorText, { color: '#B91C1C' }]}>{error}</Text>
              <Pressable
                style={[styles.retryButton, { backgroundColor: '#3c87f7' }]}
                onPress={handleRetry}>
                <Text style={styles.retryText}>Reintentar</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={filteredTickets}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              style={styles.list}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor="#3c87f7"
                />
              }
              ListEmptyComponent={
                <View style={styles.centerState}>
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    No hay tickets que coincidan con los filtros.
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <ItemCard
                  ticket={item}
                  onPress={() => router.push(`/detail/${item.id}`)}
                />
              )}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filters: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  chip: {
    borderWidth: 1,
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.three,
    gap: Spacing.three,
    flexGrow: 1,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
  },
  retryButton: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
  },
});