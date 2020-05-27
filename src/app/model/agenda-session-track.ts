import {AgendaSession} from './agenda-session';
import {Track} from './track';

export class AgendaSessionTrack {
  sessionID: number;
  agendaID: number;
  trackID: number;
  agendaSession: AgendaSession;
  track: Track;
}
