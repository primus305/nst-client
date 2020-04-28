import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Speaker} from '../../../model/speaker';
import {SpeakerService} from '../../../shared/speaker-service/speaker.service';

@Component({
  selector: 'app-pick-list',
  templateUrl: './pick-list.component.html',
  styleUrls: ['./pick-list.component.css']
})
export class PickListComponent implements OnInit {
  sourceSpeakers: Speaker[];
  targetSpeakers: Speaker[] = [];
  @Output() refreshMessages = new EventEmitter();

  constructor(private speakerService: SpeakerService) {}

  ngOnInit() {
    this.getSpeakers();
    this.listenListChange();
    this.listenRefreshPanel();
  }

  getSpeakers() {
    this.speakerService.getSpeakers().subscribe(
      (data) => {
        this.sourceSpeakers = data;
      },
      (error) => {
        console.log('GRESKAAA!', error);
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
    this.getSpeakers();
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
}
