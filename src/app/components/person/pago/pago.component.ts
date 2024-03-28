import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShareService } from '../share.service';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Swal from 'sweetalert2';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'person-app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css'],
})
export class PagoComponent implements OnInit {
  pasos = ['Datos', 'giro', 'Ubicación', 'pago'];
  public paso = 5;
  habilitarboton = true;
  contenedor8l = false;
  contenedor50l = false;
  public idProvincia: any;
  public idCiudad: any;
  public idGiro: any;
  public COD_BLOQ: any;
  public tipoDocumento = '';

  public eventoActivo: any = {};
  public formulariorecuperado: any;
  public bloqueRecuperado: any;
  constructor(private router: Router, private _shareService: ShareService) {}
  public tipo = '';
  public dataeresartesano = 'N';
  public urldocumentos = '';
  public dataparticipasconcurso = 'N';

  ngOnInit(): void {
    this.recuperardata();
  }

  recuperardata() {
    const formDataJSONtype = localStorage.getItem('LStype');
    const formDataJSON = localStorage.getItem('LSgiro');
    const formdatarecuperado = localStorage.getItem('LSdatosComponent');
    const auxdataeresartesano = localStorage.getItem('LSeresartesano')!;
    this.dataeresartesano = JSON.parse(auxdataeresartesano) || 'N';
    const auxdataparticipasconcurso = localStorage.getItem(
      'LSparticipasenconcurso'
    )!;
    this.dataparticipasconcurso = JSON.parse(auxdataparticipasconcurso) || 'N';
    const auxurl = localStorage.getItem('LSurl')!;
    this.urldocumentos = JSON.parse(auxurl);
    const jsonprovinciaid = localStorage.getItem('LSidProvincia')!;
    const jsonciudadid = localStorage.getItem('LScodciudad')!;
    const lsbloque = localStorage.getItem('LSbloque')!;
    const auxeveact = localStorage.getItem('LSeventoActivo')!;
    console.log("...=====> "+auxeveact)
    this.eventoActivo = JSON.parse(auxeveact);
console.log("eventos activos")
console.log(this.eventoActivo)
    this.bloqueRecuperado = JSON.parse(lsbloque);
    const jsonprov = JSON.parse(jsonprovinciaid);
    const jsonciudad = JSON.parse(jsonciudadid);
    const auxidProvincia = jsonprov;
    const auxidCiudad = jsonciudad;
    this.idProvincia = auxidProvincia['proCodigo'];
    this.idCiudad = auxidCiudad['canCodigo'];

    const auxtype = JSON.parse(formDataJSONtype!);
    const girojson = JSON.parse(formDataJSON!);
    this.idGiro = girojson['codigo'];
    if (girojson['nombre'] == 'ARTESANIAS') {
      this.contenedor8l = true;
      this.contenedor50l = false;
    }
    if (girojson['nombre'] == 'MERCADERIA') {
      this.contenedor8l = true;
      this.contenedor50l = false;
    }
    if (girojson['nombre'] == 'ALIMENTOS') {
      this.contenedor8l = false;
      this.contenedor50l = true;
    }
    this.formulariorecuperado = JSON.parse(formdatarecuperado!);
    this.tipo = auxtype['tipo'];


    if (this.tipo == 'Persona') {
      const auxtipodocu = localStorage.getItem('LStipoDocumento')!;
  
      this.tipoDocumento = auxtipodocu;
    } else {
      this.tipoDocumento = 'RUC';
    }

    const cod = JSON.parse(this.bloqueRecuperado['bloque']);
    this.COD_BLOQ = cod['COD_BLOQ'];
  
  }
  modalnoaceptaterminosycondiciones() {
    Swal.fire({
      title: 'No se puede continuar',
      text: 'Es necesario que leas y aceptes todos los términos y condiciones',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      showDenyButton: false,
      showCloseButton: false,
      confirmButtonText: 'Aceptar',
    });
  }
  errorAlregistrarse() {
    Swal.fire({
      title: 'Error al registrarse',
      text: 'Es necesario que leas y aceptes todos los términos y condiciones',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      showDenyButton: false,
      showCloseButton: false,
      confirmButtonText: 'Aceptar',
    });
  }
  Pagar() {
   // this.habilitarboton = false;
    const haylocalstorage = localStorage.getItem('LStype');
    if (haylocalstorage !== null) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      let todosMarcados = true;
      checkboxes.forEach(function (checkbox: any) {
        if (!checkbox.checked) {
          todosMarcados = false;
          return; // Sal del bucle tan pronto como encuentres uno no marcado
        }
      });
      if (todosMarcados) {
        console.log("todos marcados")
        const auxlongitud = this.bloqueRecuperado['sorteados'];
        const long = JSON.parse(auxlongitud);
        //si es empresa mando ruc si es persona mando fcncedula
        const aux = localStorage.getItem('LStype');
        const json = JSON.parse(aux!);
        let aux2ci = '';
        let aux2id = '';
        if (json['tipo'] == 'Persona') {
          if (this.formulariorecuperado['fcncedula'] == '') {
            aux2ci = this.formulariorecuperado['fcnpasaporte'];
            aux2id = 'PAS';
          } else {
            aux2ci = this.formulariorecuperado['fcncedula'];
            aux2id = 'CED';
          }
          const data = {
            SESSION_ID: this.urldocumentos,
            COD_EVENTO: this.eventoActivo['codigo'],
            COD_CAT_NEGO: this.idGiro,
            COD_BLOQ: this.COD_BLOQ,
            CAN_PUESTO: long.length,

            expositor: {
              id: aux2ci,
              codEvento: this.eventoActivo['codigo'],
              nombre: this.formulariorecuperado['fcnnombre'],
              tipoId: this.tipoDocumento,
              telefono: this.formulariorecuperado['fcntelefono'],
              correo: this.formulariorecuperado['fcncorreo'],
              provincia: this.idProvincia,
              ciudad: this.idCiudad,
              idRepLegal: this.formulariorecuperado['fcnIdRepresentanteLegal'],
              repLegal: this.formulariorecuperado['fcnRepresentanteLegal'],
              estado: this.eventoActivo['estado'],
              artesano: this.dataeresartesano,
              sorteo: this.dataparticipasconcurso,
            },
            puestos: JSON.parse(this.bloqueRecuperado['sorteados']),
          };


          this._shareService.GuardarData(data).subscribe(
            (resp) => {
            console.log("la respuesta es "+ resp)
              if (resp['success'] == true) {
                Swal.fire({
                  title: 'Guardado exitoso',
                  text: 'Puedes realizar tu pago en cualquier medio.',
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  showDenyButton: false,
                  showCloseButton: false,
                  confirmButtonText: 'Aceptar',
                }).then((result) => {
                  if (result.isConfirmed) {
                    localStorage.removeItem('LSRubros');
                    localStorage.setItem(
                      'LSRubros',
                      JSON.stringify(JSON.parse(resp['datos']))
                    );
                    const formDataJSON = localStorage.getItem('LSgiro');
                    const aux = JSON.parse(formDataJSON!);
                    const nombre = aux['nombre'];
                    if (nombre == 'ARTESANIAS') {
                      window.location.href = '/person/verificandoinformacion';
                    } else {
                      window.location.href = '/person/rubros';
                    }
                  }
                });
              } else {
                this.errorAlregistrarse();
              }
            },
            (error) => {
              console.log("el error es:"+error.status)
              if (error.status == 407  || error.status== 0) {
                Swal.fire({
                  title: 'Error',
                  text: 'Puestos reservados por otra persona.',
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  showDenyButton: false,
                  showCloseButton: false,
                  confirmButtonText: 'Aceptar',
                }).then((result) => {
                  window.location.href = '/person/ubicacion';
                })

                
              }
              if (error.status == 410) {
                Swal.fire({
                  title: 'Error',
                  text: 'Puestos reservados por otra persona.',
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  showDenyButton: false,
                  showCloseButton: false,
                  confirmButtonText: 'Aceptar',
                }).then((result) => {
                  window.location.href = '/person/ubicacion';
                });
              }

              if (error.status == 411) {
                Swal.fire({
                  title: 'Error',
                  text: 'Error en los datos de la persona solicitante.',
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  showDenyButton: false,
                  showCloseButton: false,
                  confirmButtonText: 'Aceptar',
                });
              }
              if (error.status == 412) {
                Swal.fire({
                  title: 'problema de consistencia',
                  text: 'Vuelva a intentarlo.',
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
        } else {
          //empresa
          const data = {
            SESSION_ID: this.urldocumentos,
            COD_EVENTO: this.eventoActivo['codigo'],
            COD_CAT_NEGO: this.idGiro,
            COD_BLOQ: this.COD_BLOQ,
            CAN_PUESTO: long.length,
            expositor: {
              id: this.formulariorecuperado['fcnruc'],
              codEvento: this.eventoActivo['codigo'],
              nombre: this.formulariorecuperado['fcnnombre'],
              tipoId: this.tipoDocumento,
              telefono: this.formulariorecuperado['fcntelefono'],
              correo: this.formulariorecuperado['fcncorreo'],
              provincia: this.idProvincia,
              ciudad: this.idCiudad,
              idRepLegal: this.formulariorecuperado['fcnIdRepresentanteLegal'],
              repLegal: this.formulariorecuperado['fcnRepresentanteLegal'],
              estado: this.eventoActivo['estado'],
              artesano: this.dataeresartesano,
              sorteo: this.dataparticipasconcurso,
            },
            puestos: JSON.parse(this.bloqueRecuperado['sorteados']),
          };

       

          this._shareService.GuardarData(data).subscribe(
            (resp) => {
           
              if (resp['success'] == true) {
                Swal.fire({
                  title: 'Guardado exitoso',
                  text: 'Puedes realizar tu pago en cualquier medio.',
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  showDenyButton: false,
                  showCloseButton: false,
                  confirmButtonText: 'Aceptar',
                }).then((result) => {
                  if (result.isConfirmed) {
                    localStorage.removeItem('LSRubros');
                    localStorage.setItem(
                      'LSRubros',
                      JSON.stringify(JSON.parse(resp['datos']))
                    );
                    const formDataJSON = localStorage.getItem('LSgiro');
                    const aux = JSON.parse(formDataJSON!);
                    const nombre = aux['nombre'];
                    if (nombre == 'ARTESANIAS') {
                      window.location.href = '/person/verificandoinformacion';
                    } else {
                      window.location.href = '/person/rubros';
                    }
                  }
                });
              } else {
                this.errorAlregistrarse();
              }
              this.habilitarboton=true;
            },

            (error) => {
              console.log("error......"+error)
           
              if (error.status == 410) {
                Swal.fire({
                  title: 'Error',
                  text: 'Puestos reservados por otra persona.',
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  showDenyButton: false,
                  showCloseButton: false,
                  confirmButtonText: 'Aceptar',
                }).then((result) => {
                  window.location.href = '/person/ubicacion';
                });
                this.habilitarboton=true;
              }
              if (error.status == 407 || error.status== 0) {
                Swal.fire({
                  title: 'Error',
                  text: 'Puestos reservados por otra persona.',
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  showDenyButton: false,
                  showCloseButton: false,
                  confirmButtonText: 'Aceptar',
                });
                this.habilitarboton=true;
              }
              if (error.status == 411) {
                Swal.fire({
                  title: 'Error',
                  text: 'Error en los datos de la persona solicitante.',
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  showDenyButton: false,
                  showCloseButton: false,
                  confirmButtonText: 'Aceptar',
                });
                this.habilitarboton=true;
              }
              if (error.status == 412) {
                Swal.fire({
                  title: 'problema de consistencia',
                  text: 'Vuelva a intentarlo.',
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  showDenyButton: false,
                  showCloseButton: false,
                  confirmButtonText: 'Aceptar',
                });
                this.habilitarboton=true;
              }
            }
          );
        }
        this.habilitarboton=true;
      } else {
        this.modalnoaceptaterminosycondiciones();
        // alert('');
      this.habilitarboton=true;
      }
     
    } else {
      Swal.fire({
        title: 'Vuelva a iniciar ',
        text: 'Debes llenar tus datos nuevamente .',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        showDenyButton: false,
        showCloseButton: false,
        confirmButtonText: 'Aceptar',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/';
        }
      });
    }
    this.habilitarboton=true;
  }

  cancelar() {
    localStorage.clear();
    window.location.href = '/';
  }
}
