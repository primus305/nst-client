import {File} from './file';
import {Agenda} from './agenda';

export class MyEvent {
  eventID: number;
  name: string;
  description: string;
  location: string;
  image: File;
  agenda: Agenda;
}
