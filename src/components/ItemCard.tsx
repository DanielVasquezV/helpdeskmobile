import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PRIORITIES, STATUSES } from '@/constants/config';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Ticket } from '@/types/Entity';

export const PRIORITY_STYLE: Record<Ticket['priority'], { bg: string; fg: string }> = {
  Alta: { bg: '#FEE2E2', fg: '#B91C1C' },
  Media: { bg: '#FEF3C7', fg: '#B45309' },
  Baja: { bg: '#DCFCE7', fg: '#15803D' },
};

export const STATUS_STYLE: Record<Ticket['status'], { bg: string; fg: string }> = {
  Abierto: { bg: '#DBEAFE', fg: '#1D4ED8' },
  'En Proceso': { bg: '#FEF3C7', fg: '#B45309' },
  Resuelto: { bg: '#DCFCE7', fg: '#15803D' },
};

const FALLBACK_STYLE = { bg: '#E5E7EB', fg: '#4B5563' };

function matchEnum<T extends string>(value: string, allowed: readonly T[]): T | undefined {
  return allowed.find((item) => item.toLowerCase() === value.trim().toLowerCase());
}

export function getPriorityStyle(priority: string): { bg: string; fg: string } {
  const match = matchEnum(priority, PRIORITIES);
  return (match ? PRIORITY_STYLE[match] : undefined) ?? FALLBACK_STYLE;
}

export function getStatusStyle(status: string): { bg: string; fg: string } {
  const match = matchEnum(status, STATUSES);
  return (match ? STATUS_STYLE[match] : undefined) ?? FALLBACK_STYLE;
}

type ItemCardProps = {
  ticket: Ticket;
  onPress?: () => void;
};

export function ItemCard({ ticket, onPress }: ItemCardProps) {
  const theme = useTheme();
  const priority = getPriorityStyle(ticket.priority);
  const status = getStatusStyle(ticket.status);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement },
        pressed && { opacity: 0.7 },
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {ticket.title}
        </Text>
        <View style={[styles.badge, { backgroundColor: priority.bg }]}>
          <Text style={[styles.badgeText, { color: priority.fg }]}>{ticket.priority}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="business-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.department, { color: theme.textSecondary }]} numberOfLines={1}>
          {ticket.department}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="person-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.department, { color: theme.textSecondary }]} numberOfLines={1}>
          {ticket.responsable || 'Sin asignar'}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={[styles.badge, { backgroundColor: status.bg }]}>
          <Text style={[styles.badgeText, { color: status.fg }]}>{ticket.status}</Text>
        </View>
        <Text style={[styles.date, { color: theme.textSecondary }]}>{ticket.createdAt}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  department: {
    fontSize: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.one,
  },
  badge: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
  },
});