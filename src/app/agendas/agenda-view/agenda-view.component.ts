import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AgendaSession} from '../../model/agenda-session';
import {AgendaService} from '../../shared/agenda-service/agenda.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {FullCalendar} from 'primeng';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-agenda-view',
  templateUrl: './agenda-view.component.html',
  styleUrls: ['./agenda-view.component.css'],
  providers: [DatePipe]
})
export class AgendaViewComponent implements OnInit {
  sessions: AgendaSession[] = [];
  options: any;
  events: any[] = [];
  @ViewChild('fc', {static: false}) fc: FullCalendar;

  gotoDate(date: Date) {
    this.fc.getCalendar().gotoDate(date);
  }

  constructor(private agendaService: AgendaService, private route: ActivatedRoute, private datePipe: DatePipe) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.agendaService.getAllSessions(id)
      .subscribe(
        (sessions) => {
          console.log('Sesije:', sessions);
          this.sessions = sessions;
        },
        (error) => {
          console.log('GRESKAAA!', error);
        }
      );
    for (const s of this.sessions) {
      this.events = [...this.events, {
        title: s.name,
        start: this.datePipe.transform(s.timeFrom, 'yyyy-MM-dd')
      }];
    }
    this.options = {
      plugins: [timeGridPlugin, interactionPlugin],
      defaultDate: '2020-04-29',
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'timeGridDay'
      },
      editable: true
    };
  }
}
