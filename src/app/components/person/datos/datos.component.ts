import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShareService } from '../share.service';
import Swal from 'sweetalert2';
import * as enviromentComponent from '../../enviroment/enviroment.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'person-app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css'],
})
export class DatosComponent implements OnInit {
  visibleartesano = false;
  public _url: any = enviromentComponent.environment.url;
  urlfinal = '';
  soloesundocumento = false;
  seleccionoNacionalidad = false;
  esecuatoriano = true;
  tipoPersonaEmpresa: any;
  habilitaPreguntasArtesano: any = false;
  habilitaPreguntasEmpresa: any = false;
  escogioalgo = false;
  typeselected: any = {};
  urlimagenes: any = '';
  girorecuperado: any = 0;
  listarequisitos: any = [];

  requisitocedula: File | null = null;
  requisitotitulo: File | null = null;
  requisitoruc: File | null = null;
  requisitofoto: File | null = null;

  eresartesano = false;
  participaconcurso = false;

  existeusuario = false;
  cedulavalida: any = 0;
  usuarioapi: any = {};
  dataEnviar: any = {};
  public provinces: any = [];
  public cities: any = [];
  public datarecuperadaFirst = {};
  selectedProvince: any;
  selectedCity: any;
  valorInputPersona = '';
  valorInputPasaporte = '';
  valorInputEmpresa = '';

  constructor(
    private fb: FormBuilder,

    private router: Router,
    private _shareService: ShareService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.paso = 1;
    this.crearFormulario();

    this.getProvinces();
    this.recuperaridgiro();
  }

  @Input() currentStep = 1;
  pasos = ['Giro', 'Datos', 'Ubicación', 'pago'];
  public paso = 1;
  form!: FormGroup;

  recuperaridgiro() {
    const formDataJSONtype = localStorage.getItem('LStype');
    const formDataJSON = localStorage.getItem('LSgiro');
    const auxtype = JSON.parse(formDataJSONtype!);
    const aux = JSON.parse(formDataJSON!);
    const cod = aux['codigo'];
    const nombre = aux['nombre'];

    this.tipoPersonaEmpresa = auxtype['tipo'];

    if (this.tipoPersonaEmpresa == 'Empresa') {
      this.habilitaPreguntasEmpresa = true;
    } else {
      this.habilitaPreguntasEmpresa = false;
    }
    if (nombre == 'ARTESANIAS') {
      this.habilitaPreguntasArtesano = true;

      this.guardosiesartesano('S');
      this.eresartesano = true;
    } else {
      this.habilitaPreguntasArtesano = false;
      this.guardosiesartesano('N');
      this.eresartesano = false;
    }

    setTimeout(() => {
      this.listarrequisitos(cod);
    }, 1000);
  }
  guardosiesartesano(nombre: any) {
    localStorage.removeItem('LSeresartesano');
    localStorage.setItem('LSeresartesano', JSON.stringify(nombre));
  }
  listarrequisitos(id: any) {
    this._shareService.getrequisitos(id).subscribe({
      next: (resp) => {
        this.listarequisitos = resp;
      },
    });
  }

  ModalerroresInput() {
    Swal.fire({
      title: 'No se puede continuar',
      text: 'Debes ingresar información correcta , por favor revisa los campos nuevamente.',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      showDenyButton: false,
      showCloseButton: false,
      confirmButtonText: 'Aceptar',
    });
  }
  dialogcedulainvalida() {
    Swal.fire({
      title: 'Cédula incorrecta',
      text: 'Debes ingresar información correcta , por favor revisa el campo nuevamente',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      showDenyButton: false,
      showCloseButton: false,
      confirmButtonText: 'Aceptar',
    });
  }
  crearFormulario() {
    this.form = this.fb.group({
      fcncedula: [],
      fcnruc: [],
      fcnpasaporte: [],
      fcnnombre: ['', [Validators.required, Validators.minLength(5)]],
      fcnIdRepresentanteLegal: ['', Validators.minLength(10)],
      fcnRepresentanteLegal: [],

      fcntelefono: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern('^[0-9]{0,10}$'),
        ],
      ],
      fcncorreo: ['', [Validators.required, Validators.email]],
      fcnprovince: ['', Validators.required],
      fcncities: ['', Validators.required],
    });
  }
  onFilesSelectedCedula(event: any) {
    this.requisitocedula = event.target.value;
  }
  onFilesSelectedTitulo(event: any) {
    this.requisitotitulo = event.target.value;
  }
  onFilesSelectedRuc(event: any) {
    this.requisitoruc = event.target.value;
  }
  onFilesSelectedFoto(event: any) {
    this.requisitofoto = event.target.value;
  }
  errorSinArchivos() {
    Swal.fire({
      title: 'Error',
      text: 'subir archivos necesarios',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      showDenyButton: false,
      showCloseButton: false,
      confirmButtonText: 'Aceptar',
    });
  }
  guardar() {
    if (this.tipoPersonaEmpresa == 'Empresa') {
      //empresa-no pregunto si tiene naciolalidad
      if (this.form.value.fcnruc == '') {
        Swal.fire({
          title: 'RUC vacio',
          text: 'Ingrese correctamente el RUC',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          showDenyButton: false,
          showCloseButton: false,
          confirmButtonText: 'Aceptar',
        });
      } else {
        if (this.form.invalid) {
          Swal.fire({
            title: 'No se puede continuar',
            text: 'Recuerda llenar los datos de manera correcta',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            showDenyButton: false,
            showCloseButton: false,
            confirmButtonText: 'Aceptar',
          });
        } else {
          //pasa
          if (this.listarequisitos.length > 0 && this.urlimagenes == '') {
            Swal.fire({
              title: 'No se puede continuar',
              text: 'Debe subir los archivos',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              showDenyButton: false,
              showCloseButton: false,
              confirmButtonText: 'Aceptar',
            });
          } else {
            this.guardarEnLocalStorage(this.form.value);
            this.router.navigate(['person/ubicacion']);
          }
        }
      }
    } else {
      //persona
      if (this.seleccionoNacionalidad == true) {
        if (this.esecuatoriano) {
          if (this.form.value.fcncedula == '') {
            Swal.fire({
              title: 'Cédula vacio',
              text: 'Ingrese correctamente el RUC',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              showDenyButton: false,
              showCloseButton: false,
              confirmButtonText: 'Aceptar',
            });
          } else {
            if (this.form.invalid) {
              Swal.fire({
                title: 'No se puede continuar',
                text: 'Recuerda llenar los datos de manera correcta',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                showDenyButton: false,
                showCloseButton: false,
                confirmButtonText: 'Aceptar',
              });
            } else {
              if (this.listarequisitos.length > 0 && this.urlimagenes == '') {
                Swal.fire({
                  title: 'No se puede continuar',
                  text: 'Debe subir los archivos',
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  showDenyButton: false,
                  showCloseButton: false,
                  confirmButtonText: 'Aceptar',
                });
              } else {
                this.guardarEnLocalStorage(this.form.value);
                this.router.navigate(['person/ubicacion']);
              }
            }
          }
        } else {
          if (this.form.invalid) {
            Swal.fire({
              title: 'No se puede continuar',
              text: 'Recuerda llenar los datos de manera correcta',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              showDenyButton: false,
              showCloseButton: false,
              confirmButtonText: 'Aceptar',
            });
          } else {
            if (this.listarequisitos.length > 0 && this.urlimagenes == '') {
              Swal.fire({
                title: 'No se puede continuar',
                text: 'Debe subir los archivos',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                showDenyButton: false,
                showCloseButton: false,
                confirmButtonText: 'Aceptar',
              });
            } else {
              this.guardarEnLocalStorage(this.form.value);
              this.router.navigate(['person/ubicacion']);
            }
          }
        }
      } else {
        Swal.fire({
          title: 'Escoja',
          text: 'Seleccione Nacionalidad...',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          showDenyButton: false,
          showCloseButton: false,
          confirmButtonText: 'Aceptar',
        });
      }
    }
  }
  get cedulanovalida() {
    return this.form.get('fcncedula');
  }
  get telefononovalida() {
    return (
      this.form.get('fcntelefono')?.invalid &&
      this.form.get('fcntelefono')?.touched
    );
  }
  get correonovalida() {
    return (
      this.form.get('fcncorreo')?.invalid && this.form.get('fcncorreo')?.touched
    );
  }
  get provincianovalida() {
    return (
      this.form.get('fcnprovince')?.invalid &&
      this.form.get('fcnprovince')?.touched
    );
  }
  get ciudadnovalida() {
    return (
      this.form.get('fcncities')?.invalid && this.form.get('fcncities')?.touched
    );
  }

  getProvinces() {
    this._shareService.listprovince().subscribe((resp) => {
      this.provinces = resp;
    });
  }
  onProvinceSelected(event: any) {
    this.cities = [];
    // Aquí puedes manejar la opción seleccionada
    this.selectedProvince = event.target.value;
    const idselected = this.provinces.find(
      (resp: { proNombre: any }) => resp.proNombre === this.selectedProvince
    );

    localStorage.removeItem('LSidProvincia');
    localStorage.setItem('LSidProvincia', JSON.stringify(idselected));
    this.findCitybyId(idselected['proCodigo']);
  }
  findCitybyId(id: any) {
    this._shareService.listcitybyid(id).subscribe((resp) => {
      this.cities = resp;
    });
  }
  onCitySelected(event: any) {
    // Aquí puedes manejar la opción seleccionada
    this.selectedCity = event.target.value;

    this.selectedCity = event.target.value;
    const idselected = this.cities.find(
      (resp: { canNombre: any }) => resp.canNombre === this.selectedCity
    );

    localStorage.removeItem('LScodciudad');
    localStorage.setItem('LScodciudad', JSON.stringify(idselected));
  }

  onRadioButtonClickSeleccioneProcedencia(event: Event) {
    const target = event.target as HTMLInputElement;

    this.seleccionoNacionalidad = true;
    if (target.value == 'S') {
      this.esecuatoriano = true;
      this.valorInputPasaporte = '';
      this.valorInputEmpresa = '';
    } else {
      //es extrangero
      this.esecuatoriano = false;
      this.valorInputPersona = '';
      this.valorInputEmpresa = '';
    }
  }
  onRadioButtonClick2(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.value == 'si') {
      this.participaconcurso = true;
      this.guardosiparticipasenconcurso('S');
    } else {
      this.participaconcurso = false;
      this.guardosiparticipasenconcurso('N');
    }
  }

  guardosiparticipasenconcurso(nombre: any) {
    localStorage.removeItem('LSparticipasenconcurso');
    localStorage.setItem('LSparticipasenconcurso', JSON.stringify(nombre));
  }
  borrarElementoLocalStorage() {
    localStorage.removeItem('LSdatosComponent');
  }
  guardarEnLocalStorage(formulario: any) {
    this.borrarElementoLocalStorage();
    // Convierte el objeto formData a JSON y guárdalo en el localStorage
    localStorage.setItem('LSdatosComponent', JSON.stringify(formulario));
  }

  ingreseRUCcorrecto() {
    Swal.fire({
      title: 'RUC incorrecto',
      text: 'Ingrese correctamente el RUC....',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      showDenyButton: false,
      showCloseButton: false,
      confirmButtonText: 'Aceptar',
    });
  }
  verificaUsuarioPersona(cedula: any) {
    let codigoeventoactivo = '';
    const aux = localStorage.getItem('LSeventoActivo');
    const aujson = JSON.parse(aux!);

    if (aujson['estado'] == 'A') {
      codigoeventoactivo = aujson['codigo'];
    }

    if (cedula.target.value.length == 10) {
      const dat = {
        COD_EVENTO: codigoeventoactivo,
        TIPO_DOC: 'CED',
        NUM_DOC: cedula.target.value,
      };

      this._shareService.verificarUsuariobyCi(dat).subscribe(
        (resp) => {
          console.log("___")
          console.log(resp)
          this.usuarioapi = resp;
          localStorage.removeItem('LStipoDocumento');
          localStorage.setItem('LStipoDocumento', 'CED');
        },
        (error) => {
          if (error.status == 401) {
            this.nohayconexioncondataseguro();
            this.valorInputPersona = '';
          }

          if (error.status == 402) {
            this.dialogcedulainvalida();
            this.valorInputPersona = '';
          }

          if (error.status == 405) {
            this.notienepuestosdisponibles();
            this.valorInputPersona = '';
          }
        }
      );
    } else {
      Swal.fire({
        title: 'Error ',
        text: 'No es Cédula',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        showDenyButton: false,
        showCloseButton: false,
        confirmButtonText: 'Aceptar',
      });
    }
  }
  verificaUsuarioPasaporte(pasaporte: any) {
    let codigoeventoactivo = '';
    const aux = localStorage.getItem('LSeventoActivo');
    const aujson = JSON.parse(aux!);

    if (aujson['estado'] == 'A') {
      codigoeventoactivo = aujson['codigo'];
    }

    localStorage.removeItem('LStipoDocumento');
    localStorage.setItem('LStipoDocumento', 'PAS');
  }
  verificaUsuarioEmpresa(cedula: any) {
    let codigoeventoactivo = '';
    const aux = localStorage.getItem('LSeventoActivo');
    const aujson = JSON.parse(aux!);

    if (aujson['estado'] == 'A') {
      codigoeventoactivo = aujson['codigo'];
    }

    if (cedula.target.value.length == 13) {
      const dat = {
        COD_EVENTO: codigoeventoactivo,
        TIPO_DOC: 'RUC',
        NUM_DOC: cedula.target.value,
      };

      this._shareService.verificarUsuariobyCi(dat).subscribe(
        (resp) => {
          this.usuarioapi = resp;
          localStorage.removeItem('LStipoDocumento');
          localStorage.setItem('LStipoDocumento', 'RUC');
        },

        (error) => {
          if (error.status == 403) {
            this.rucincorrecto();
            this.valorInputEmpresa = '';
          }
          if (error.status == 401) {
            this.nohayconexioncondataseguro();
            this.valorInputEmpresa = '';
          }
        }
      );
    } else {
      this.solopuedesingresarruc();
    }
  }
  solopuedesingresarruc() {
    Swal.fire({
      title: 'Error ',
      text: 'Tienes que ingresar RUC',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      showDenyButton: false,
      showCloseButton: false,
      confirmButtonText: 'Aceptar',
    });
  }
  validacedula(cedula: any) {
    this._shareService.validarcedula(cedula).subscribe((resp) => {
      console.log('');
    });
  }
  guardarRULarchivosenlocalstorage(url: any) {
    this.borrarurldeLocalStorage();
    // Convierte el objeto formData a JSON y guárdalo en el localStorage
    const arraySerializadoCedula = JSON.stringify(url);
    localStorage.removeItem('LSurl');
    localStorage.setItem('LSurl', arraySerializadoCedula);
  }
  borrarurldeLocalStorage() {
    localStorage.removeItem('LSurl');
  }
  Datoscontinuar() {
    this.spinner.show();
    this.subirarchivos();
    setTimeout(() => {
      this.guardar();

      this.spinner.hide();
    }, 1000);
  }
  subirarchivos() {
    const formData = new FormData();

    const fileInputs = document.querySelectorAll('input[type="file"]');

    if (fileInputs.length == 1) {
      /* utilizo la otra api */
      this.urlfinal = `${this._url}/upload-unique`;
    } else {
      this.urlfinal = `${this._url}/upload`;
    }

    fileInputs.forEach((fileInput: any, index) => {
      const files = fileInput.files;

      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          // Obtener el nombre del campo input
          const inputName = fileInput.name;
          // Agregar el archivo al FormData con un nombre único que incluya el nombre del campo input
          // formData.append(`${inputName}`, files[i]);
          formData.append(`imagenes`, files[i]);
          formData.append(`ids`, inputName);
        }
      }
    });

    // Realizar la solicitud POST con formData

    fetch(this.urlfinal, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log("response")
        console.log(response);

        if (response.ok) {
          // La solicitud fue exitosa, puedes leer el contenido de la respuesta
          return response.text(); // O response.json() si se espera JSON
        } else {
          Swal.fire({
            title: 'Error en los requisitos',
            text: 'Suba correctamente los archivos',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            showDenyButton: false,
            showCloseButton: false,
            confirmButtonText: 'Aceptar',
          });
          // Puedes lanzar una excepción o manejar el error aquí
          return response.json();
        }
      })
      .then((data) => {
        console.log("data")
        console.log(data)
        // Aquí puedes trabajar con la respuesta del servidor contenida en "data"

        const jsondata = JSON.parse(data);
        const stringjson = jsondata['objData'];

        const jsondobjectdata = JSON.parse(stringjson);
        this.urlimagenes = jsondobjectdata['SESSION_ID'];

        this.guardarRULarchivosenlocalstorage(this.urlimagenes);

        //guardo en el local storage el url que me devuelve
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
        // Maneja el error si es necesario
      });
  }
  cargarDesdeLocalStorage() {
    const formDataJSON = localStorage.getItem('LStype');
    if (formDataJSON) {
      this.typeselected = JSON.parse(formDataJSON);
    }
  }

  nohayconexioncondataseguro() {
    Swal.fire({
      title: 'Error Consulta',
      text: 'Existe un problema con data seguro.',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      showDenyButton: false,
      showCloseButton: false,
      confirmButtonText: 'Aceptar',
    });
  }
  notienepuestosdisponibles() {
    Swal.fire({
      title: 'No disponible',
      text: 'el usuario ya no dispone de puestos',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      showDenyButton: false,
      showCloseButton: false,
      confirmButtonText: 'Aceptar',
    });
  }
  rucincorrecto() {
    Swal.fire({
      title: 'Error',
      text: 'RUC incorrecto, ingrese correctamente',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      showDenyButton: false,
      showCloseButton: false,
      confirmButtonText: 'Aceptar',
    });
  }

  cancelar() {
    localStorage.clear();
    window.location.href = '/';
  }
}
