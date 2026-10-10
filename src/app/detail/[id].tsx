import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getPriorityStyle, getStatusStyle, STATUS_STYLE } from '@/components/ItemCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getApiErrorMessage } from '@/services/api';
import { deleteTicket, getTicket, updateTicket } from '@/services/resourceService';

import { STATUSES } from '@/constants/config';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Ticket } from '@/types/Entity';

export default function TicketDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    const data = await getTicket(id);
    setTicket(data);
  }, [id]);

  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        await load();
      } catch (error) {
        if (isActive) Alert.alert('Error', getApiErrorMessage(error));
      } finally {
        if (isActive) setLoading(false);
      }
    })();
    return () => {
      isActive = false;
    };
  }, [load]);

  const confirmStatusChange = (nextStatus: Ticket['status']) => {
    Alert.alert(
      'Cambiar estado',
      `¿Deseas cambiar el estado a "${nextStatus}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => handleUpdateStatus(nextStatus),
        },
      ],
    );
  };

  const handleUpdateStatus = async (nextStatus: Ticket['status']) => {
    if (!ticket) return;
    setUpdating(true);
    try {
      await updateTicket(ticket.id, { status: nextStatus });
      Alert.alert('Estado actualizado', 'El ticket se actualizó correctamente.', [
        { text: 'Aceptar', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error));
    } finally {
      setUpdating(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Eliminar ticket',
      'Esta acción eliminará el ticket permanentemente. ¿Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: handleDelete },
      ],
    );
  };

  const handleDelete = async () => {
    if (!ticket) return;
    setDeleting(true);
    try {
      await deleteTicket(ticket.id);
      Alert.alert('Ticket eliminado', 'El ticket fue eliminado correctamente.', [
        { text: 'Aceptar', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando ticket..." />;
  }

  if (!ticket) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.textSecondary }]}>
          No se encontró el ticket.
        </Text>
        <Pressable style={styles.dangerButton} onPress={() => router.back()}>
          <Text style={styles.dangerButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const priority = getPriorityStyle(ticket.priority);
  const status = getStatusStyle(ticket.status);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: theme.text }]}>{ticket.title}</Text>

      <View style={styles.badgesRow}>
        <View style={[styles.badge, { backgroundColor: priority.bg }]}>
          <Text style={[styles.badgeText, { color: priority.fg }]}>
            Prioridad: {ticket.priority}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: status.bg }]}>
          <Text style={[styles.badgeText, { color: status.fg }]}>
            {ticket.status}
          </Text>
        </View>
      </View>

      <View style={[styles.fieldCard, { backgroundColor: theme.backgroundElement }]}>
        <Text style={[styles.description, { color: theme.textSecondary }]}>Departamento</Text>
        <Text style={[styles.description, { color: theme.text }]}>{ticket.department}</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>Responsable</Text>
        <Text style={[styles.description, { color: theme.text }]}>
          {ticket.responsable || 'Sin asignar'}
        </Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>Fecha de creación</Text>
        <Text style={[styles.description, { color: theme.text }]}>{ticket.createdAt}</Text>
        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Descripción</Text>
          <Text style={[styles.description, { color: theme.text }]}>{ticket.description}</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Cambiar estado</Text>
      <View style={styles.statusRow}>
        {STATUSES.map((statusOption) => {
          const selected = ticket.status === statusOption;
          return (
            <Pressable
              key={statusOption}
              disabled={updating}
              onPress={() => confirmStatusChange(statusOption)}
              style={[
                styles.statusButton,
                {
                  backgroundColor: selected
                    ? STATUS_STYLE[statusOption].bg
                    : theme.backgroundElement,
                  borderColor: selected ? STATUS_STYLE[statusOption].fg : theme.backgroundSelected,
                },
              ]}>
              <Text
                style={[
                  styles.statusButtonText,
                  { color: selected ? STATUS_STYLE[statusOption].fg : theme.textSecondary },
                ]}>
                {statusOption}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        disabled={deleting}
        onPress={confirmDelete}
        style={({ pressed }) => [
          styles.dangerButton,
          { opacity: pressed || deleting ? 0.7 : 1 },
        ]}>
        <Text style={styles.dangerButtonText}>
          {deleting ? 'Eliminando...' : 'Eliminar ticket'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  badge: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  fieldCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  field: {
    gap: Spacing.one,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statusButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dangerButton: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: '#B91C1C',
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    marginTop: Spacing.two,
  },
  dangerButtonText: {
    color: '#B91C1C',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 15,
  },
});