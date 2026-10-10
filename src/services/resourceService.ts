import { api } from '@/services/api';

import { PRIORITIES, STATUSES, TICKETS_ENDPOINT } from '@/constants/config';
import type { Ticket, TicketInput } from '@/types/Entity';

function normalizeEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  if (typeof value !== 'string') return fallback;
  const match = allowed.find((item) => item.toLowerCase() === value.trim().toLowerCase());
  return match ?? fallback;
}

function normalizeTicket(raw: Record<string, unknown>): Ticket {
  return {
    id: String(raw.id ?? ''),
    title: String(raw.title ?? ''),
    department: String(raw.department ?? ''),
    responsable: String(raw.responsable ?? ''),
    priority: normalizeEnum(raw.priority, PRIORITIES, 'Media'),
    description: String(raw.description ?? ''),
    status: normalizeEnum(raw.status, STATUSES, 'Abierto'),
    createdAt: String(raw.createdAt ?? ''),
  };
}

export async function getTickets(): Promise<Ticket[]> {
  const { data } = await api.get<Record<string, unknown>[]>(TICKETS_ENDPOINT);
  return data.map(normalizeTicket);
}

export async function getTicket(id: string): Promise<Ticket> {
  const { data } = await api.get<Record<string, unknown>>(`${TICKETS_ENDPOINT}/${id}`);
  return normalizeTicket(data);
}

export async function createTicket(input: TicketInput): Promise<Ticket> {
  const { data } = await api.post<Record<string, unknown>>(TICKETS_ENDPOINT, input);
  return normalizeTicket(data);
}

export async function updateTicket(id: string, input: Partial<TicketInput>): Promise<Ticket> {
  const { data } = await api.put<Record<string, unknown>>(`${TICKETS_ENDPOINT}/${id}`, input);
  return normalizeTicket(data);
}

export async function deleteTicket(id: string): Promise<void> {
  await api.delete(`${TICKETS_ENDPOINT}/${id}`);
}