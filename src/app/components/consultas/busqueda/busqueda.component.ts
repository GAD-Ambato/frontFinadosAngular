import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../person/share.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as QRCode from 'qrcode';
import * as enviromentComponent from '../../enviroment/enviroment.component';

import {
  Content,
  StyleDictionary,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';

// Registra tus fuentes personalizadas
(window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css'],
})
export class BusquedaComponent implements OnInit {

  //datos de data seguro
htmlContent: string;
nombresCompletos="";
fechaNacimiento=""
datos:any




  ////
  imageDataUrl: string;
  data: any;
  index = 0;
  cedula = '';
  public _url: any = enviromentComponent.environment.url;
  qrData = ''; // El contenido que deseas en el código QR
  qrCode = '';
  public url: string;
  constructor(
    private router: Router,
    private _shareService: ShareService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}
  tipo = '';
  total = 0;
  arrayresp: any = [];
  form!: FormGroup;

  ngOnInit(): void {
    console.log('');
    this.cargarImagen('assets/home/Ambato.png');
    this.crearFormulario();
  }
  crearFormulario() {
    this.form = this.fb.group({
      fcnnumero: [''],
    });
  }
  seleccioneTipoDocumento(event: any) {
    console.log(event.target.value);
    this.tipo = event.target.value;
  }
  consultar() {
  



    const data={"TIPO_DOC":this.tipo,"NUM_DOC":this.form.value.fcnnumero};
    console.log(data)
    this._shareService
    .consultardataseguro(data)
    .subscribe({
      next: (resp) => {
        console.log("****data seguro**")
    
      console.log(resp)
      this.datos= JSON.parse( resp["datos"])
      console.log("*****datos***")
      console.log(this.datos)
      console.log(this.datos["fechaNacimiento"])
      this.nombresCompletos=this.datos["nombre"]
      this.fechaNacimiento=this.datos["fechaNacimiento"]
    

      },
    });







    this.spinner.show();
    this.cedula = this.form.value.fcnnumero;
    const ur = `finados.ambato.gob.ec/person/comprobarDatos/${this.cedula}`;

    QRCode.toDataURL(ur, (err, url) => {
      if (!err) {
        this.qrCode = url;
      }
    });
    if (this.tipo == '' || this.form.value.fcnnumero == '') {
      this.spinner.hide();
      Swal.fire({
        title: 'Campos vacíos',

        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        showDenyButton: false,
        showCloseButton: false,
        confirmButtonText: 'Aceptar',
      });
    } else {
      console.log(this.tipo), console.log(this.form.value.fcnnumero);
      this._shareService
        .buscar(this.tipo, this.form.value.fcnnumero)
        .subscribe({
          next: (resp) => {
            console.log('resp....');
            console.log(resp);

            if (resp == null || resp.length == 0) {
              this.spinner.hide();
              Swal.fire({
                title: 'Los datos ingresados',
                text: 'no han reservado puestos en la feria ',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                showDenyButton: false,
                showCloseButton: false,
                confirmButtonText: 'Aceptar',
              });
            } else {
              // this.total=resp[0]["valFac"]|| '0';

              this.arrayresp = resp;
              let suma = 0;
              for (let i = 0; i < this.arrayresp.length; i++) {
                console.log('entra al for');
                suma = suma + this.arrayresp[i]['valFac'];
                this.total = suma;

                console.log(suma);
              }
              this.spinner.hide();
            }
          },
        });
    }
  }
  cargarImagen(rutaImagen: string) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', rutaImagen, true);
    xhr.responseType = 'blob';

    xhr.onload = () => {
      const blob = xhr.response;

      const lector = new FileReader();
      lector.onload = (e: any) => {
        this.imageDataUrl = e.target.result;
      };
      lector.readAsDataURL(blob);
    };

    xhr.send();
  }

  async generatePDF(_data: any, index: any) {
    console.log(_data);
    this.data = _data;
    this.index = index;

    pdfMake.fonts = {
      Roboto: {
        normal:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
      },
    };

    /*   const qr = await generateQr(""); */
    const styles: StyleDictionary = {
      titulo: {
        alignment: 'center',
        fontSize: 18,
        marginTop: 33,
        marginBottom: 20,
        bold: true,
      },
      text: {
        fontSize: 12,
        alignment: 'justify',
        marginTop: 3,
        margin:4

      },
      text2: {
        fontSize: 12,
        alignment: 'left',
        marginTop: 3,
        margin:4

      },
      titulo2: {
        fontSize: 14,
        alignment: 'left',
        marginTop: 3,
        margin:4,
        bold:true

      },
      firma: {
        fontSize: 12,
        alignment: 'center',
        
        margin:5,
      

      },
      ptsfirma: {
        fontSize: 14,
        alignment: 'center',
        
        marginTop:120,
        marginBottom:5,
        bold:true

      },

    };
    const qr: any = undefined;
    const content: Content[] = [
      {
        image: this.imageDataUrl, // Replace 'path/to/your/image.jpg' with the actual path to your image
        width: 150, // You can adjust the width of the image as needed
        height: 50, // You can adjust the height of the image as needed
        alignment: 'center', // You can change the alignment as needed (e.g., 'center', 'left', 'right')
        margin: [0, 3], // You can adjust the top and bottom margins as needed
      },

      { text: ' Acta Entrega Recepción del Puesto', style: 'titulo' },
      {
        absolutePosition: { x: 450, y: 10 },
        qr: `https://finados.ambato.gob.ec/person/comprobarDatos/${this.tipo}/${this.cedula}/${this.index}`,
        fit: 100,
      },
  
      {
        text: 'Al aceptar la entrega del puesto el usuario se compromete a :',
        style: 'titulo2',
      },
      {
        text: '1. El adjudicatario del espacio, no podrá ceder, donar o arrendar total o parcialmente a otras personas su espacio asignado, ni cambiar el giro de negocio; de comprobarse esta infracción será desalojado del lugar de expendio sin lugar a reclamo alguno.',
        style: 'text',
      },
      {
        text: '2. Está prohibido la venta de sustancias psicotrópicas(drogas,marihuana,cocaína) bebidas alcohólicas y/o de moderación.',
        style: 'text',
      },
      {
        text: '3. No hacer uso de equipos de amplificación o altos parlantes que ocasionen molestias a los expositores,comerciantes y público general',
        style: 'text',
      },
      {
        text: '4. Queda terminantemente prohibido ocupar espacios adicionales a los asignados o del área asignada.',
        style: 'text',
      },
      {
        text: '5. Está prohibida el trabajo de menores de edad (0-15 años) o cualquier tipo de explotación laboral o económica.',
        style: 'text',
      },
      {
        text: '6. Cumplir con los horarios establecidos por la feria (08:00 a 24:00H)',
        style: 'text',
      },
      {
        text: '7. No obstruir con sus ventas los pasillos de circulación peatonal.',
        style: 'text',
      },
      {
        text: '8. Los expositores deberán instalar sus estands manteniendo los estándares de calidad y no deberán ser instalados con plásticos. Usted debe llevar su propia carpa de manera obligatoria.',
        style: 'text',
      },

      {
        text: '9. El horario de carga y descarga será de 07:00am - 09:00am (2 horas), será de estricto cumplimiento para todos los feriantes.',
        style: 'text',
      },

      {
        text: '10. Los feriantes y expositores que mantengan actitudes reñidas en contra de la ética y la moral ,serán puestos a órdenes de las autoridades competentes.',
        style: 'text',
      },

      {
        text: '11. Los arrendatarios deberán cumplir con las disposiciones que establece la ordenanza de la Feria de Finados.',
        style: 'text',
      },

      {
        text: '12. Por el incumplimiento de estos términos se puede revocar el permiso.',
        style: 'text',
      },
      {
        text: '13. Prohibido el acceso de vehículos al recinto ferial.',
        style: 'text',
      },

      {
        text: '14. Acepto que la información proporcionada es verídica.',
        style: 'text',
      },

      // basic usage


    ];
   
    content.push(
      ['     '],
      ['     '],
      
      ['     '],
      ['     '],
      ['     '],
      ['     '],
      ['     '],
      ['     '],
      ['     '],
      ['     '],
      ['     '],
      ['     '],
      ['     '],
      ['     '],
      ['     '],
     
    
     
    );

    content.push({
      columns: [
        {
          text: 'Cédula del beneficiario:  ',
          style: 'titulo2',
        },
        {
          text: this.cedula,
          style: 'text2',
        },
      ],
    });
    content.push({
      columns: [
        {
          text: 'Nombre del beneficiario:  ',
          style: 'titulo2',
        },
        {
          text: this.nombresCompletos,
          style: 'text2',
        },
      ],
    });
    content.push({
      columns: [
        {
          text: 'Fecha de Nacimiento:  ',
          style: 'titulo2',
        },
        {
          text: this.fechaNacimiento,
          style: 'text2',
        },
      ],
    });
    content.push({
      columns: [
        {
          text: 'Número de Solicitud:  ',
          style: 'titulo2',
        },
        {
          text:  _data.cod_solicitud,
          style: 'text2',
        },
      ],
    });
    content.push({
      columns: [
        {
          text: 'Giro de Negocio:  ',
          style: 'titulo2',
        },
        {
          text: _data.nomNego,
          style: 'text2',
        },
      ],
    });
    content.push({
      columns: [
        {
          text: 'Bloque:  ',
          style: 'titulo2',
        },
        {
          text:  _data.nomBloq,
          style: 'text2',
        },
      ],
    });
    content.push({
      columns: [
        {
          text: 'Número de Puestos:  ',
          style: 'titulo2',
        },
        {
          text:  _data.numPuesto,
          style: 'text2',
        },
      ],
    });
    content.push({
      columns: [
        {
          text: 'Estado Solicitud:  ',
          style: 'titulo2',
        },
        {
          text:  _data.estSolicitud,
          style: 'text2',
        },
      ],
    });
    content.push({
      columns: [
        {
          text: 'Subtotal:  ',
          style: 'titulo2',
        },
        {
          text:   _data.valFac,
          style: 'text2',
        },
      ],
    });
    content.push(
  
      
      {
        text:"..............................",
        style:"ptsfirma"
      }    ,
      {
        text:"Recibí conforme",
        style:"firma"
      }    ,
      {
        text:_data.nombre,
        style:"firma"
      } ,
      {
        text:this.cedula,
        style:"firma"
      } 
                  
    );
    const documentDefinition: TDocumentDefinitions = {
      content,
      styles,
    };

    pdfMake.createPdf(documentDefinition).download('actaRecepcionPuesto.pdf');
  }
  irprueba() {
    this.router.navigate([
      'person/comprobarDatos',
      this.tipo,
      this.cedula,
      this.index,
    ]);
  }
}
function generateQr() {
  throw new Error('Function not implemented.');
}
