import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NameServerHeaderComponent } from './name-server-header/name-server-header.component';
import { NameServerInputCommonsComponent } from './name-server-input-commons/name-server-input-commons.component';
import { ManageNameServerComponent } from './manage-name-server/manage-name-server.component';

@NgModule({
  declarations: [
    AppComponent,
    NameServerHeaderComponent,
    NameServerInputCommonsComponent,
    ManageNameServerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
