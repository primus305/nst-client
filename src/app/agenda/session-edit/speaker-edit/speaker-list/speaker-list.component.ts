import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Speaker} from '../../../../model/speaker';
import {SpeakerService} from '../../../../shared/speaker-service/speaker.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-speaker-list',
  templateUrl: './speaker-list.component.html',
  styleUrls: ['./speaker-list.component.css']
})
export class SpeakerListComponent implements OnInit {
  sourceSpeakers: Speaker[];
  targetSpeakers: Speaker[] = [];
  @Input() sessionSpeakers: Speaker[] = [];
  @Output() refreshMessages = new EventEmitter();
  @Output() speakersEmitter = new EventEmitter<Speaker[]>();
  @Output() targetSpeakerEmitter = new EventEmitter<Speaker[]>();

  constructor(private speakerService: SpeakerService, private route: ActivatedRoute) {}

  ngOnInit() {
        const agenda = +this.route.snapshot.params.agenda;
        const session = +this.route.snapshot.params.id;
        this.getSessionSpeakers(agenda, session);
        this.listenListChange();
        this.listenRefreshSourceSpeakers();
        this.listenRefreshPanel();
  }

  getSpeakers() {
    this.speakerService.getSpeakers().subscribe(
      (data) => {
        this.sourceSpeakers = data;
        for (const s of this.sessionSpeakers) {
          for (let i = 0; i < this.sourceSpeakers.length; i++) {
            if (s.speakerID === this.sourceSpeakers[i].speakerID) {
              this.sourceSpeakers.splice(i, 1);
            }
          }
        }
      },
      (error) => {
        console.log('GRESKAAA!', error);
      }
    );
  }

  listenRefreshSourceSpeakers() {
    this.speakerService.refreshSourceSpeakers
      .subscribe(
        () => {
          this.getSpeakers();
        }
      );
  }

  listenRefreshPanel() {
    this.speakerService.refreshSpeakerPanel
      .subscribe(
        () => {
          this.refreshPanel();
        }
      );
  }

  refreshPanel() {
    // this.getSpeakers();
    this.targetSpeakers = [];
    this.refreshMessages.emit();
  }

  listenListChange() {
    this.speakerService.speakerAdded
      .subscribe(
        (speaker: Speaker) => {
          this.sourceSpeakers.push(speaker);
        }
      );
  }

  onSelectedSpeakersChanged() {
    this.speakerService.onSpeakerSelected(this.targetSpeakers);
  }

    getSessionSpeakers(agendaID: number, sessionID: number) {
      this.speakerService.findAllBySession(agendaID, sessionID)
        .subscribe(
          (speakers) => {
            console.log('predavaci', speakers);
            for (const s of speakers) {
              this.sessionSpeakers.push(s.speaker);
            }
            this.speakersEmitter.emit(this.sessionSpeakers);
            this.getSpeakers();
          }
        );
    }

}
