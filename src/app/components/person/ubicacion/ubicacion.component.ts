import { Component } from '@angular/core';
import { ShareService } from '../share.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.css'],
})
export class UbicacionComponent {
  arrayfiltrado: any = [];
  tercerarray: any = [];
  bloque: any;
  cantidadpuestosmayor = false;
  ocupados = [];
  puestos = [];
  sorteados = [];

  radiovalue = '';
  savedata = '';

  consecutivo = 'S';

  pasos = ['Giro', 'Datos', 'Ubicación', 'pago'];
  public paso = 2;
  cantidad = 1;
  constructor(private router: Router, private _shareService: ShareService,private spinner: NgxSpinnerService) {}
  sumar() {
    if (this.cantidad < 4 && this.cantidad > 0) {
      this.cantidad++;
      if (this.cantidad > 1) {
        this.cantidadpuestosmayor = true;
      }
    }
    this.puestos = [];
    this.sorteados = [];
    this.arrayfiltrado = [];
    this.tercerarray = [];
    this.bloque = '';
  }
  restar() {
    if (this.cantidad > 1) {
      this.cantidad--;
      if (this.cantidad > 1) {
        this.cantidadpuestosmayor = true;
      }
    }
    this.puestos = [];
    this.sorteados = [];
    this.arrayfiltrado = [];
    this.tercerarray = [];
    this.bloque = '';
  }
  cancelar() {
    localStorage.clear();
    window.location.href = '/';
  }
  async obtenerP() {
    this.spinner.show();
    this.asignar();
    setTimeout(() => {
      this.filtar();
      this.spinner.hide();
    }, 1000);

  }
  async asignar() {
    let idexpositor = '';

    const a = localStorage.getItem('LSgiro');
    const codig = JSON.parse(a!);
    const aux = localStorage.getItem('LSdatosComponent');
    const jsonaux = JSON.parse(aux!);

    const b = localStorage.getItem('LStype');
    const auxjsontype = JSON.parse(b!);

    if (auxjsontype['tipo'] == 'Empresa') {
      idexpositor = jsonaux.fcnruc;
    } else {
      if (jsonaux.fcncedula == '') {
        idexpositor = jsonaux.fcnpasaporte;
      } else {
        idexpositor = jsonaux.fcncedula;
      }
    }

    const data = {
      ID_EXPOSITOR: idexpositor,
      COD_EVENTO: '1',
      COD_CAT_NEGO: codig['codigo']?.toString(),
      CANTI_PUESTO: this.cantidad.toString(),
      CONSECUTIVO: this.consecutivo.toString(),
    };
   
    this._shareService.generarpuesto(data).subscribe(
      (resp) => {
       
        localStorage.removeItem('LSbloque');
        localStorage.setItem('LSbloque', JSON.stringify(resp));

        const auxbloque = JSON.parse(resp['bloque']);
        this.bloque = auxbloque['BLOQUE'];

        this.ocupados = JSON.parse(resp['ocupados']);
        this.puestos = JSON.parse(resp['puestos']);
        this.sorteados = JSON.parse(resp['sorteados']);
     
      },
      (error) => {
        console.log(error)
        if (error.status == 405) {

          Swal.fire({
            title: 'Error ',
            text: 'Sobrepasó limite de puestos.',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            showDenyButton: false,
            showCloseButton: false,
            confirmButtonText: 'Aceptar',
          });
        }
        if (error.status == 406) {

          Swal.fire({
            title: 'Error ',
            text: 'cupos no disponibles en la categoría',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            showDenyButton: false,
            showCloseButton: false,
            confirmButtonText: 'Aceptar',
          });
        }
   
      }
    );

    return this.sorteados;
  }
  onRadioButtonClick(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.checked) {
      this.radiovalue = target.value;
      if (this.radiovalue == 'contiguo') {
        this.consecutivo = 'S';
      } else {
        this.consecutivo = 'N';
      }
    }
    this.puestos = [];
    this.sorteados = [];
    this.arrayfiltrado = [];
    this.tercerarray = [];
    this.bloque = '';
  }

  filtar() {
    const tercerArray = this.puestos.map((puesto: any) => {
      const estaOcupado = this.ocupados.some(
        (ocupado) => ocupado['NUM_PUESTO'] == puesto['NUM_PUESTO']
      );

      estaOcupado ? (puesto['estado'] = true) : (puesto['estado'] = false);
      return puesto;
    });
    this.arrayfiltrado = tercerArray;

  
  }
  aceptar() {
    this.spinner.show();
    if (this.arrayfiltrado.length == 0) {
      this.spinner.hide();
      Swal.fire({
        title: 'Error ',
        text: 'Debe Obtener su puesto.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        showDenyButton: false,
        showCloseButton: false,
        confirmButtonText: 'Aceptar',
      });

    } else {
      this.router.navigate(['person/pago']);
      this.spinner.hide();
    }
  }
}
