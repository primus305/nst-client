import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { AgendaComponent } from './agenda/agenda.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import {MenubarModule} from 'primeng/menubar';
import { NavigationComponent } from './navigation/navigation.component';
import {ButtonModule} from 'primeng/button';
import {PanelModule} from 'primeng/panel';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';
import {DialogModule} from 'primeng/dialog';
import {PickListModule} from 'primeng/picklist';
import { TrackPanelComponent } from './panel/track-panel/track-panel.component';
import { SpeakerPanelComponent } from './panel/speaker-panel/speaker-panel.component';
import { PickListComponent } from './panel/speaker-panel/pick-list/pick-list.component';
import { HallPanelComponent } from './panel/hall-panel/hall-panel.component';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ListboxModule} from 'primeng/listbox';
import { SessionComponent } from './agenda/session/session.component';
import { AgendasComponent } from './agendas/agendas.component';
import {DataViewModule} from 'primeng/dataview';
import { AgendaViewComponent } from './agendas/agenda-view/agenda-view.component';
import {FullCalendarModule} from 'primeng/fullcalendar';

const appRoutes: Routes = [
  {path: '', component: AgendaComponent},
  {path: 'agenda', component: AgendaComponent},
  {path: 'agendas', component: AgendasComponent},
  {path: 'agendas/:id', component: AgendaViewComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    AgendaComponent,
    NavigationComponent,
    TrackPanelComponent,
    SpeakerPanelComponent,
    PickListComponent,
    HallPanelComponent,
    SessionComponent,
    AgendasComponent,
    AgendaViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    TimepickerModule.forRoot(),
    FormsModule,
    MenubarModule,
    ButtonModule,
    PanelModule,
    DropdownModule,
    CheckboxModule,
    DialogModule,
    PickListModule,
    MessagesModule,
    MessageModule,
    ListboxModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    DataViewModule,
    FullCalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
