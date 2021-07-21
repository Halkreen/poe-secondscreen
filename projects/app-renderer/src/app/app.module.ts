import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';

import { AppComponent } from './app.component';
import { LeftPanelModule } from './left-panel/left-panel.module';
import { RightPanelModule } from './right-panel/right-panel.module';
import { PassiveModalModule } from './components/passive-modal/passive-modal.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    StoreModule.forRoot({}),
    LeftPanelModule,
    RightPanelModule,
    HttpClientModule,
    PassiveModalModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
