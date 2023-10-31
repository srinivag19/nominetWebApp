import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NameServerHeaderComponent } from './name-server-header/name-server-header.component';
import { NameServerInputCommonsComponent } from './name-server-input-commons/name-server-input-commons.component';
import { ManageNameServerComponent } from './manage-name-server/manage-name-server.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    NameServerHeaderComponent,
    NameServerInputCommonsComponent,
    ManageNameServerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 5000, // 15 seconds
      positionClass: 'toast-top-center'
      //progressBar: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
