import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-comprobar-datos',
  templateUrl: './comprobar-datos.component.html',
  styleUrls: ['./comprobar-datos.component.css'],
})
export class ComprobarDatosComponent implements OnInit {
  parametroRecibido: string;
  parametroRecibido2: string;
  index=0;
  existeusuario = true;
  arrayresp = [];

  constructor(
    private route: ActivatedRoute,
    private _shareService: ShareService,
    private router: Router
  ) {}
  ngOnInit(): void {
    try {
      this.parametroRecibido = this.route.snapshot.params['type'];
      this.parametroRecibido2 = this.route.snapshot.params['ci'];
      this.index = this.route.snapshot.params['index'];
      console.log('El parametro recibido es ');
      console.log(this.parametroRecibido);
      console.log(this.parametroRecibido2);
      this.consultardatos();
    } catch (error) {
      this.router.navigate(['/']);
    }
  }
  consultardatos() {
    this._shareService
      .buscar(this.parametroRecibido, this.parametroRecibido2)
      .subscribe({
        next: (resp) => {
          console.log('----');
          console.log(resp);
          if (resp == null || resp.length == 0) {
            this.existeusuario = false;
          } else {
            this.existeusuario = true;
            console.log(resp);
       
            this.arrayresp = resp;
          }
        },
      });
  }
}
