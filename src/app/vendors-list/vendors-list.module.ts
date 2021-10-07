import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorsListRoutingModule } from './vendors-list-routing.module';
import { VendorsListComponent } from './vendors-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    VendorsListComponent
  ],
  imports: [
    CommonModule,
    VendorsListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ]
})
export class VendorsListModule { }
