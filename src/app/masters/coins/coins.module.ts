import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoinsRoutingModule } from './coins-routing.module';
import { CoinsComponent } from './coins.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    CoinsComponent
  ],
  imports: [
    CommonModule,
    CoinsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ]
})
export class CoinsModule { }
