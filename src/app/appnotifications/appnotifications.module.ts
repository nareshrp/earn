import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AppnotificationsRoutingModule } from './appnotifications-routing.module';
import { AppnotificationlistComponent } from './appnotificationlist/appnotificationlist.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppnotificationlistComponent
  ],
  imports: [
    CommonModule,
    AppnotificationsRoutingModule,
    ReactiveFormsModule
  ],
  providers:[DatePipe]
})
export class AppnotificationsModule { }
