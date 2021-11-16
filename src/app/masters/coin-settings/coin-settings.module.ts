import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoinSettingsRoutingModule } from './coin-settings-routing.module';
import { CoinSettingsComponent } from './coin-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    CoinSettingsComponent
  ],
  imports: [
    CommonModule,
    CoinSettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ]
})
export class CoinSettingsModule { }
