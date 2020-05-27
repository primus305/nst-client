import {AgendaSession} from './agenda-session';
import {User} from './user';
import {Presence} from './presence';

export class UserSession {
  sessionID: number;
  agendaID: number;
  userID: number;
  eventID: number;
  agendaSession: AgendaSession;
  presence: Presence;
}
