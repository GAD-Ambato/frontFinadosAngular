import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-verificandoinformacion',
  templateUrl: './verificandoinformacion.component.html',
  styleUrls: ['./verificandoinformacion.component.css'],
})
export class VerificandoinformacionComponent {
  constructor(private router: Router) {}
  Aceptar() {
    localStorage.clear();
    window.location.href = '/person/mediosPago';
  }
}
