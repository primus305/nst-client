import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Speaker} from '../../../../model/speaker';
import {SpeakerService} from '../../../../shared/speaker-service/speaker.service';
import {ActivatedRoute} from '@angular/router';
import {AgendaSession} from '../../../../model/agenda-session';

@Component({
  selector: 'app-speaker-list',
  templateUrl: './speaker-list.component.html',
  styleUrls: ['./speaker-list.component.css']
})
export class SpeakerListComponent implements OnInit, OnChanges {
  sourceSpeakers: Speaker[];
  targetSpeakers: Speaker[] = [];
  @Input() sessionSpeakers: Speaker[] = [];
  @Output() refreshMessages = new EventEmitter();
  @Output() speakersEmitter = new EventEmitter<Speaker[]>();
  @Output() targetSpeakerEmitter = new EventEmitter<Speaker[]>();
  @Input() session: AgendaSession;

  constructor(private speakerService: SpeakerService, private route: ActivatedRoute) {}

  ngOnInit() {
        this.listenListChange();
        this.listenRefreshSourceSpeakers();
        this.listenRefreshPanel();
  }

  getSpeakers() {
    this.speakerService.getNonSelectedSpeakers(this.session).subscribe(
      (data) => {
        this.sourceSpeakers = data;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.session) {
      this.getSpeakers();
    }
  }

}
