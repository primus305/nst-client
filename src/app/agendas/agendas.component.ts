import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AgendaService} from '../shared/agenda-service/agenda.service';
import {Agenda} from '../model/agenda';

@Component({
  selector: 'app-agendas',
  templateUrl: './agendas.component.html',
  styleUrls: ['./agendas.component.css']
})
export class AgendasComponent implements OnInit {
  agendas: Agenda[] = [];

  constructor(private agendaService: AgendaService, private router: Router) {
  }

  ngOnInit() {
    this.agendaService.getAll()
      .subscribe(
        (agendas) => {
          this.agendas = agendas;
        },
        (error) => {
          console.log('GRESKAAA!', error);
        }
      );
  }

  selectAgenda(event: Event, agenda: Agenda) {
    this.router.navigate(['/agendas', agenda.agendaID])
    event.preventDefault();
  }
}
