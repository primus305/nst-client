import {AgendaSession} from './agenda-session';

export class Agenda {
  agendaID: number;
  name?: string;
  dateFrom?: string;
  dateTo?: string;
  sessions?: AgendaSession[];
}
