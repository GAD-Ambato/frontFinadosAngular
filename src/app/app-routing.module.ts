import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FirstComponent as firstPerson } from './components/first/first.component';
import { PersonComponent } from './components/person/person.component';
import { DatosComponent as datosperson } from './components/person/datos/datos.component';
import { GiroComponent  as giroperson} from './components/person/giro/giro.component';
import { UbicacionComponent as ubicacionperson} from './components/person/ubicacion/ubicacion.component';
import { PagoComponent as pagoperson } from './components/person/pago/pago.component';

import { RubrosComponent } from './components/person/rubros/rubros.component';
import { VerificandoinformacionComponent } from './components/person/verificandoinformacion/verificandoinformacion.component';
import { MediosPagoComponent } from './components/person/medios-pago/medios-pago.component';
import { BusquedaComponent } from './components/consultas/busqueda/busqueda.component';
import { ComprobarDatosComponent } from './components/person/comprobar-datos/comprobar-datos.component';


const routes: Routes = [

  {path:"",component:firstPerson},
  {path:"person",component:PersonComponent},
  {path:"person/datos",component:datosperson},
  {path:"person/giro",component:giroperson},
  {path:"person/ubicacion",component:ubicacionperson},
  {path:"person/pago",component:pagoperson},
  {path:"person/rubros",component:RubrosComponent},
  {path:"person/verificandoinformacion",component:VerificandoinformacionComponent},
  {path:"person/mediosPago",component:MediosPagoComponent},
  {path:"person/busqueda",component:BusquedaComponent},
  {path:"person/comprobarDatos/:type/:ci/:index",component:ComprobarDatosComponent},
  {path:'**', redirectTo:'',}
 
 


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
