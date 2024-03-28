import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirstComponent } from './components/first/first.component';

import { PersonComponent } from './components/person/person.component';
import { CompanyComponent } from './components/company/company.component';
import { DatosComponent as datosperson } from './components/person/datos/datos.component';
import { GiroComponent as giroperson } from './components/person/giro/giro.component';
import { UbicacionComponent as ubiperson } from './components/person/ubicacion/ubicacion.component';
import { PagoComponent as pagoPerson } from './components/person/pago/pago.component';
import { StepperComponent as stepperperson } from './components/person/stepper/stepper.component';
import { StepperComponent as stepperCompany } from './components/company/stepper/stepper.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RubrosComponent } from './components/person/rubros/rubros.component';
import { VerificandoinformacionComponent } from './components/person/verificandoinformacion/verificandoinformacion.component';
import { RequestInterceptorService } from './core/services/request-interceptor.service';
import { MediosPagoComponent } from './components/person/medios-pago/medios-pago.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BusquedaComponent } from './components/consultas/busqueda/busqueda.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ComprobarDatosComponent } from './components/person/comprobar-datos/comprobar-datos.component';
@NgModule({
  declarations: [
    AppComponent,
    FirstComponent,

    datosperson,
    giroperson,
    ubiperson,
    pagoPerson,
    stepperperson,
    PersonComponent,
    CompanyComponent,
    stepperCompany,
    RubrosComponent,
    VerificandoinformacionComponent,
    MediosPagoComponent,
    BusquedaComponent,
    ComprobarDatosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
