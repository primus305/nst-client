import {AgendaSession} from './agenda-session';
import {Speaker} from './speaker';

export class AgendaSessionSpeaker {
  sessionID: number;
  agendaID: number;
  speakerID: number;
  agendaSessionName?: string;
  speaker: Speaker;
  agendaSessionTimeFrom?: string;
  agendaSessionTimeTo?: string;
}
