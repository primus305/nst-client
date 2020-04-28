import {Hall} from './hall';
import {AgendaSessionSpeaker} from './agenda-session-speaker';
import {AgendaSessionTrack} from './agenda-session-track';

export class AgendaSession {

    sessionID: number;
    agendaID: number;
    superSession: AgendaSession;
    name: string;
    timeFrom: string;
    timeTo: string;
    hall: Hall;
    sessionOverview: string;
    tracks: AgendaSessionTrack[];
    speakers: AgendaSessionSpeaker[];
}
