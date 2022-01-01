import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { SidebarModule } from 'ng-sidebar';
import { TemplateModule } from './shared/template/template.module';
import { MetismenuAngularModule } from '@metismenu/angular';
import { NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DEFAULT_TIMEOUT, HttpInterceptorService } from './shared/services/http-interceptor.service';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { HeaderComponent } from './layouts/public-layout/header/header.component';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    CommonLayoutComponent,
    FullLayoutComponent,
    PublicLayoutComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TemplateModule,
    MetismenuAngularModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), // ToastrModule added
    SidebarModule.forRoot(), NgbModule,
    PerfectScrollbarModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyAhDYjKC1B1VjPSEgfCtsAjJRDZHbOrlCg',
    //   libraries: ['places']
    // })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    { provide: DEFAULT_TIMEOUT, useValue: 60000 },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
