import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorSignupRoutingModule } from './vendor-signup-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { VendorSignupComponent } from './vendor-signup.component';
import { AgmCoreModule } from '@agm/core';



@NgModule({
  declarations: [VendorSignupComponent],
  imports: [
    CommonModule,
    VendorSignupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD2cnz4AK40h9R1Hy199mHtSbTBKJTEbwk',
      libraries: ['places']
    })
  ]
})
export class VendorSignupModule { }
