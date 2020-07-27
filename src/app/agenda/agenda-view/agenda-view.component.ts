import { Component, OnInit } from '@angular/core';
import {AgendaSession} from '../../model/agenda-session';
import {AgendaService} from '../../shared/agenda-service/agenda.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Agenda} from '../../model/agenda';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-agenda-view',
  templateUrl: './agenda-view.component.html',
  styleUrls: ['./agenda-view.component.css'],
  providers: [DatePipe]
})
export class AgendaViewComponent implements OnInit {
  agenda: Agenda;
  events: any[] = [];

  options: any;

  constructor(private agendaService: AgendaService, private route: ActivatedRoute, private datePipe: DatePipe,
              private router: Router) {
  }

  ngOnInit() {
    const id = +this.route.snapshot.params.id;
    const eventID = +this.route.snapshot.params.eventID;
    this.getAgenda(id);
    this.options = {
      plugins: [timeGridPlugin, interactionPlugin],
      // srediti defaultDate
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'timeGridWeek, timeGridDay'
      },
      eventClick: (e) =>  {
        this.router.navigate(['/session', eventID, this.agenda.agendaID, e.event.id],
          {state: {mode: 'AW'}});
      }
    };
  }

  getAgenda(id) {
    this.agendaService.findById(id)
      .subscribe(
        (agenda) => {
          this.agenda = agenda;
          this.postavi();
        },
        (error) => {
          console.log('GRESKAAA!', error);
        }
      );
  }

  postavi() {
    this.agenda.sessions.forEach(session => {
      if (session.superSession == null) {
        this.events = [...this.events, {
          id: session.sessionID,
          title: session.name,
          start: this.datePipe.transform(session.timeFrom, 'yyyy-MM-ddTHH:mm'),
          end: this.datePipe.transform(session.timeTo, 'yyyy-MM-ddTHH:mm')
        }];
      }
    });
  }
}
