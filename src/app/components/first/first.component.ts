import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ShareService } from '../person/share.service';
@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.css'],
})
export class FirstComponent implements OnInit {
  constructor(
    private router: Router,
    private _shareservice: ShareService,
    private http: HttpClient,
  ) {}
  apareceartesanias=true;
  dataRecuperada: any = {};
  datafirstPage: any = {};
  eventosactivos: any = [];
  tipo = '';
  ngOnInit(): void {
    this.GetListaeventosActivos();
    setTimeout(() => {
      this.getActivos();
    }, 2000);
  }
  persona = false;
  company = false;

  seleccionaPersona() {
    this.persona = true;
    this.company = false;
    this.guardarEnLocalStorage('Persona');
    this.apareceartesanias=true;
    localStorage.removeItem("LSapareceartesania")
    localStorage.setItem('LSapareceartesania', JSON.stringify(this.apareceartesanias));
    
    window.location.href = '/person/giro';
  }
  seleccionaEmpresa() {
    this.company = true;
    this.persona = false;
    this.apareceartesanias=false;
    this.guardarEnLocalStorage('Empresa');
    localStorage.removeItem("LSapareceartesania")
    localStorage.setItem('LSapareceartesania', JSON.stringify(this.apareceartesanias));
    window.location.href = '/person/giro';
  }
  seleccionaPuntosPago(){
    window.location.href = '/person/mediosPago';
  }
  validar() {
    this.cargarDesdeLocalStorage();
  }
  guardarEnLocalStorage(type: any) {
    this.borrarElementoLocalStorage();
    // Convierte el objeto formData a JSON y guárdalo en el localStorage
    this.datafirstPage = {
      tipo: type,
    };
    localStorage.setItem('LStype', JSON.stringify(this.datafirstPage));
  }

  borrarElementoLocalStorage() {
    localStorage.removeItem('LStype');
  }
  cargarDesdeLocalStorage() {
    const formDataJSON = localStorage.getItem('LStype');
    if (formDataJSON) {
      this.dataRecuperada = JSON.parse(formDataJSON);
    }
  }
  GetListaeventosActivos() {
    this._shareservice.getEventosActivos().subscribe((resp) => {
      this.eventosactivos = resp;
console.log(resp)
    },(error)=>{
      console.log("error "+error)
     
     // this.GetListaeventosActivos()
    }
    
    );
  }

  getActivos() {
    localStorage.removeItem('LSeventoActivo');
    for (let i = 0; i < this.eventosactivos.length; i++) {
      if (this.eventosactivos[i]['estado'] == 'A') {

        localStorage.setItem(
          'LSeventoActivo',
          JSON.stringify(this.eventosactivos[i])
        );
      }
    }
  }
  consultar(){
    console.log("")
    window.location.href = '/person/busqueda';

  }
  mapa(){
    window.open ( 'https://gadambato-my.sharepoint.com/:b:/g/personal/gadmaapps_ambato_gob_ec/EXXVmXfkrHxMm6lTFCx0cSQBdofdS9riD18w3GGAiAvVbg?e=ZpjxG1','_blank');
      
  }
}
