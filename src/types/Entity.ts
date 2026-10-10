import type { PRIORITIES, STATUSES } from '@/constants/config';

export interface Ticket {
  id: string;
  title: string;
  department: string;
  responsable: string;
  priority: (typeof PRIORITIES)[number];
  description: string;
  status: (typeof STATUSES)[number];
  createdAt: string;
}

export type TicketInput = Omit<Ticket, 'id' | 'createdAt'>;