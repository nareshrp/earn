import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealsRoutingModule } from './deals-routing.module';
import { DealsListComponent } from './deals-list/deals-list.component';
import { CreateDealComponent } from './create-deal/create-deal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AgmCoreModule } from '@agm/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  declarations: [
    DealsListComponent,
    CreateDealComponent,

  ],
  imports: [
    CommonModule,
    DealsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD2cnz4AK40h9R1Hy199mHtSbTBKJTEbwk',
      libraries: ['geometry']
    }),
    CKEditorModule
  ]
})
export class DealsModule { }
