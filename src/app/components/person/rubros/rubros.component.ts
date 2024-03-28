import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share.service';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Router } from '@angular/router';
@Component({
  selector: 'app-rubros',
  templateUrl: './rubros.component.html',
  styleUrls: ['./rubros.component.css'],
})
export class RubrosComponent implements OnInit {
  arrayrubros: any=[];
valortotal:any;

  constructor(private router: Router, private _shareService: ShareService) {
    
  }
  ngOnInit(): void {
    this.traerrubros();
  }
  traerrubros() {
    const rubros = localStorage.getItem('LSRubros');
    const jsonrubros = JSON.parse(rubros!);
 
    this.arrayrubros = jsonrubros;
    this.valortotal=this.arrayrubros[0]["VALOR_TOTAL"]
  }
  Aceptar() {
    localStorage.clear();
    window.location.href = '/person/mediosPago';
    
  }
}
