import {EventEmitter, Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {AgendaSession} from '../../model/agenda-session';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  sendMessage = new EventEmitter<string>();
  superSessionTimeFrom: string;
  superSessionTimeTo: string;
  superSession: AgendaSession;
  f: Date;
  t: Date;

  constructor(private datePipe: DatePipe) { }

  makeDate(group: FormGroup, from: string, to: string, dateFrom: string, dateTo: string) {
    this.f = new Date(group.controls[from].value);
    this.t = new Date(group.controls[to].value);
    const df = new Date(group.controls[dateFrom].value);
    const dt = new Date(group.controls[dateTo].value);
    this.f.setFullYear(df.getFullYear(), df.getMonth(), df.getDate());
    this.t.setFullYear(dt.getFullYear(), dt.getMonth(), dt.getDate());
  }

  dateLessThan(from: string, to: string, dateFrom: string, dateTo: string) {
    return (group: FormGroup): { [key: string]: any } => {
      this.makeDate(group, from, to, dateFrom, dateTo);
      if (this.f > this.t) {
        this.sendMessage.emit('Time from should be less than time to.');
        return {
          dates: 'Time from should be less than time to'
        };
      }
      return {};
    };
  }

  dateIntervalSubSession(from: string, to: string, dateFrom: string, dateTo: string) {
    return (group: FormGroup): { [key: string]: any } => {
      this.makeDate(group, from, to, dateFrom, dateTo);
      if (this.superSessionTimeFrom != null && this.superSessionTimeTo != null &&
        (this.f < new Date(this.superSessionTimeFrom)
          || this.f > new Date(this.superSessionTimeTo)
          || this.t < new Date(this.superSessionTimeFrom)
          || this.t > new Date(this.superSessionTimeTo))) {
        this.sendMessage.emit('Date and time  must be in super session date and time interval ['
          + this.datePipe.transform(this.superSessionTimeFrom, 'yyyy-MM-dd HH:mm') +
          ', ' + this.datePipe.transform(this.superSessionTimeTo, 'yyyy-MM-dd HH:mm') + ']');
        return {
          dates: 'Date and time must be in super session date and time interval.'
        };
      }
      return {};
    };
  }

  dateIntervalSubSessionEdit(from: string, to: string, dateFrom: string, dateTo: string) {
    return (group: FormGroup): { [key: string]: any } => {
      this.makeDate(group, from, to, dateFrom, dateTo);
      if (this.superSession != null &&
        (this.f < new Date(this.superSession.timeFrom)
          || this.f > new Date(this.superSession.timeTo)
          || this.t < new Date(this.superSession.timeFrom)
          || this.t > new Date(this.superSession.timeTo))) {
        this.sendMessage.emit('Date and time must be in super session date and time interval ['
          + this.datePipe.transform(this.superSession.timeFrom, 'yyyy-MM-dd HH:mm') +
          ', ' + this.datePipe.transform(this.superSession.timeTo, 'yyyy-MM-dd HH:mm') + ']');
        return {
          dates: 'Date and time must be in super session date and time interval.'
        };
      }
      return {};
    };
  }
}
