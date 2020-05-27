import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Hall} from '../../model/hall';
import {HallService} from '../../shared/hall-service/hall.service';
import {Message} from 'primeng';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-hall-panel',
  templateUrl: './hall-panel.component.html',
  styleUrls: ['./hall-panel.component.css']
})
export class HallPanelComponent implements OnInit {
  @Output() hallSelected = new EventEmitter<Hall>();
  halls: Hall[];
  // selectedHall: Hall;
  @Input() selectedHall: Hall;
  display = false;
  msgs: Message[] = [];
  hallForm: FormGroup;

  constructor(private hallService: HallService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getHalls();
    this.listenRefreshPanel();
    this.cleanForm();
  }

  listenRefreshPanel() {
    this.hallService.refreshHallPanel
      .subscribe(
        () => {
          this.refreshPanel();
        }
      );
  }

  refreshPanel() {
    this.selectedHall = null;
    this.msgs = [];
  }

  getHalls() {
    this.hallService.getHalls().subscribe(
      (data) => {
        this.halls = data;
      },
      (error) => {
        console.log('GRESKAAA!', error);
      }
    );
  }

  showSuccessMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'success', summary: 'Success Message', detail: 'Sistem je zapamtio salu.'});
  }

  showErrorMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Sistem nije zapamtio salu.'});
  }

  saveHall() {
    const hall: Hall = {
      hallID: this.halls.length + 1,
      name: this.hallForm.get('hallName').value
    };
    this.hallService.saveHall(hall).subscribe(
      (data) => {
        console.log('Data:', data);
        this.getHalls();
        this.display = false;
        this.cleanForm();
        this.showSuccessMessage();
      },
      (error) => {
        console.log('GRESKAAA!', error);
        this.showErrorMessage();
      }
    );
  }

  showDialog() {
    this.display = true;
  }

  onSelectHall() {
    this.hallSelected.emit(this.selectedHall);
  }

  cleanForm() {
    this.hallForm = this.fb.group({
      hallName: new FormControl('', Validators.required)
    });
  }
}
