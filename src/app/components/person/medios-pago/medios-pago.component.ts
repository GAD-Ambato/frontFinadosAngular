import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
// import { Map, marker, tileLayer } from 'leaflet';
@Component({
  selector: 'app-medios-pago',
  templateUrl: './medios-pago.component.html',
  styleUrls: ['./medios-pago.component.css'],
})
export class MediosPagoComponent implements OnInit {
  // map: any;
  products: any = [];
  productFilter: any[] | null = null;
  page = 1;
  pageSize = 1000;
  collectionSize = 0;
  _searchTerm = '';
  /*  */
  filter = new FormControl('', { nonNullable: true });
  jsonubicacion: any = [];
  constructor(private http: HttpClient) {}
  dataDirection: any;
  items: any[] = [];
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  // ngAfterViewInit(): void {
  //   this.map = new Map('map').setView(
  //     [-1.2546157984606352, -78.62347835459238],
  //     13
  //   );

  //   tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
  //     maxZoom: 20,
  //     attribution:
  //       '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //   }).addTo(this.map);

  //   // marker([-1.2546157984606352, -78.62347835459238]).addTo(this.map);
  // }
  seleccionarFila(lat: any, long: any) {
 
    // marker([lat, long]).addTo(this.map);
  }

  ngOnInit() {
    this.http.get('assets/UBICACIONCOMERCIOS.json').subscribe({
      next: (data: any) => {
        this.products = data;
        this.productFilter = this.products;
        this.collectionSize = this.productFilter!.length;
      },
    });
  }
  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(val: string) {
    this._searchTerm = val;
    this.productFilter = this.filter2(val);
  }
  filter2(v: string) {
    return this.products.filter(
      (x: any) => x.AGENCIA.toLowerCase().indexOf(v.toLowerCase()) !== -1,
      (y: any) => y.CIUDAD.toLowerCase().indexOf(v.toLowerCase()) !== -1,
      (z: any) => z.PROVINCIA.toLowerCase().indexOf(v.toLowerCase()) !== -1
    );
  }
}

function search(this: any, text: string): any[] {

  return this.jsonubicacion.filter((country: { name: string }) => {
    const term = text.toLowerCase();
    return country.name.toLowerCase().includes(term);
  });
}
