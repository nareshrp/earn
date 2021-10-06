import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSignupRoutingModule } from './user-signup-routing.module';
import { UserSignupComponent } from './user-signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    UserSignupComponent
  ],
  imports: [
    CommonModule,
    UserSignupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ]
})
export class UserSignupModule { }
