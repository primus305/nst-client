import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { AgendaComponent } from './agenda/agenda.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
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
import {DataViewModule} from 'primeng/dataview';
import {FullCalendarModule} from 'primeng/fullcalendar';
import { EventsComponent } from './events/events.component';
import { EventViewComponent } from './events/event-view/event-view.component';
import {AgendaViewComponent} from './agenda/agenda-view/agenda-view.component';
import { FooterComponent } from './navigation/footer/footer.component';
import {GMapModule} from 'primeng/gmap';
import { EventCreateComponent } from './events/event-create/event-create.component';
import {FileUploadModule} from 'primeng/fileupload';
import {NgxWebstorageModule} from 'ngx-webstorage';
import { SessionViewComponent } from './agenda/session-view/session-view.component';
import {AccordionModule} from 'primeng/accordion';
import {CarouselModule} from 'primeng/carousel';
import { AddAttendeesComponent } from './events/add-attendees/add-attendees.component';
import {RadioButtonModule} from 'primeng/radiobutton';
import { LoginComponent } from './login/login.component';
import {BasicAuthInterceptor} from './interceptor/auth.interceptor';
import {AdminGuardService} from './guard/admin/admin-guard.service';
import {MatButtonModule} from '@angular/material/button';
import { FavoriteButtonComponent } from './agenda/session-view/favorite-button/favorite-button.component';
import {MatIconModule} from '@angular/material';
import {TooltipModule} from 'primeng/tooltip';
import { MySessionsComponent } from './my-sessions/my-sessions.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {TabViewModule} from 'primeng/tabview';
import { SessionEditComponent } from './agenda/session-edit/session-edit.component';
import { SpeakerEditComponent } from './agenda/session-edit/speaker-edit/speaker-edit.component';
import { SpeakerListComponent } from './agenda/session-edit/speaker-edit/speaker-list/speaker-list.component';
import { TrackEditComponent } from './agenda/session-edit/track-edit/track-edit.component';
import { EventEditComponent } from './events/event-edit/event-edit.component';
import {DatePipe} from '@angular/common';
import {SpeakerGuardService} from './guard/speaker/speaker-guard.service';

const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'agenda', component: AgendaComponent, canActivate: [AdminGuardService]},
  {path: 'events', component: EventsComponent},
  {path: 'events/:id', component: EventViewComponent},
  {path: 'agenda-view/:eventID/:id', component: AgendaViewComponent},
  {path: 'event-create', component: EventCreateComponent, canActivate: [AdminGuardService]},
  {path: 'session/:eventID/:agenda/:id', component: SessionViewComponent},
  {path: 'add-attendees/:id', component: AddAttendeesComponent, canActivate: [AdminGuardService]},
  {path: 'my-sessions', component: MySessionsComponent},
  {path: 'session-edit/:eventID/:agenda/:id', component: SessionEditComponent, canActivate: [SpeakerGuardService]},
  {path: 'event-edit/:id', component: EventEditComponent, canActivate: [AdminGuardService]}
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
    AgendaViewComponent,
    EventsComponent,
    EventViewComponent,
    FooterComponent,
    EventCreateComponent,
    SessionViewComponent,
    AddAttendeesComponent,
    LoginComponent,
    FavoriteButtonComponent,
    MySessionsComponent,
    SessionEditComponent,
    SpeakerEditComponent,
    SpeakerListComponent,
    TrackEditComponent,
    EventEditComponent
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
    FullCalendarModule,
    GMapModule,
    FileUploadModule,
    NgxWebstorageModule.forRoot(),
    AccordionModule,
    CarouselModule,
    RadioButtonModule,
    MatButtonModule,
    MatIconModule,
    TooltipModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    TabViewModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true }, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
