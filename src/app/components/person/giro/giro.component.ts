import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-giro',
  templateUrl: './giro.component.html',
  styleUrls: ['./giro.component.css'],
})
export class GiroComponent  implements OnInit {
  public requisitos: any = [];
  apareceartesania=false;

  colores = ['rgb(241, 164, 91)', 'rgb(49, 171, 232)', 'rgb(204, 136, 245)'];
  pasos = ['Giro', 'Datos', 'Ubicación', 'pago'];
  public paso = 0;
  public datosRecuperados = {};
  
  public listCategorias: any = [];

  constructor(private _shareservice: ShareService, 
    private router: Router,
    private spinner: NgxSpinnerService
    ) {
    //  this.GetListaeventosActivos();
  
    // this.LSdatos();
  }
  ngOnInit(): void {
    this.Getcategorias();
   const aux=localStorage.getItem("apareceartesania")
   const jsonaux=JSON.parse(aux!)
  
  }

  LSdatos() {
    const formDataJSON = localStorage.getItem('LSdatosComponent');
    if (formDataJSON) {
      this.datosRecuperados = JSON.parse(formDataJSON);
    }

  }

  Getcategorias() {
    this._shareservice.listarCategorias().subscribe((resp) => {
     
      this.listCategorias = resp;
    });
  }
  seleccionaCategoria(codigo: any, codEvento: any, estado: any, nombre: any) {
    this.spinner.show();
    setTimeout(() => {
      const data = {
        codigo: codigo,
        codEvento: codEvento,
        estado: estado,
        nombre: nombre,
      };
    
      this.borrarElementoLocalStorage();
      localStorage.setItem('LSgiro', JSON.stringify(data));
      this.router.navigate(['person/datos']);
      this.spinner.hide();
    }, 1000);

   
  }

  borrarElementoLocalStorage() {
    localStorage.removeItem('LSgiro');
  }
  // Aceptar() {

  //   this.router.navigate(['person/ubicacion']);
  // }
}
