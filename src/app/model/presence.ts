import {User} from './user';
import {MyEvent} from './my-event';

export class Presence {
  userID: number;
  eventID: number;
  user: User;
  event: MyEvent;
}
