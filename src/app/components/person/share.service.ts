import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as enviromentComponent from '../enviroment/enviroment.component';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ShareService {
  public url: string;
  public cat: number;
  constructor(private _http: HttpClient) {
    this.url = enviromentComponent.environment.url;
    this.cat = enviromentComponent.environment.codigocategoria;
  }

  //para local
  getEventosActivos(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get<any>(
      `${this.url}/api/WsFinados/rest/metodo/cEventosActivos`,
      { headers }
    );
  }
  listprovince(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get<any>(
      `${this.url}/api/WsFinados/rest/metodo/cProvicias`,
      { headers }
    );
  }
  listcitybyid(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get<any>(
      `${this.url}/api/WsFinados/rest/metodo/cCantones/${id}`,
      { headers }
    );
  }
  listarCategorias(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get<any>(
      `${this.url}/api/WsFinados/rest/metodo/cCategorias/1`,
      { headers }
    );
  }
  verificarUsuariobyCi(datos: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post<any>(
      `${this.url}/api/WsFinados/rest/metodo/cDatoSeguro`,
      datos,
      { headers }
    );
  }
  validarcedula(ci: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get<any>(
      `${this.url}/api/WsFinados/rest/metodo/validaCedula/${ci}`,
      { headers }
    );
  }
  generarpuesto(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post<any>(
      `${this.url}/api/WsFinados/rest/metodo/cPuestosLibres`,
      data,
      { headers }
    );
  }

  getrequisitos(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get<any>(
      `${this.url}/api/WsFinados/rest/metodo/cRequisitos/${id}`,
      { headers }
    );
  }

  GuardarData(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post<any>(
      `${this.url}/api/WsFinados/rest/metodo/saveSolicitud`,
      data,
      { headers }
    );
  }
  buscar(tipo: any, numero: any): Observable<any> {
    const data = {
      type: tipo,
      id_expositor: numero,
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post<any>(
      `${this.url}/api/WsFinados/rest/metodo/cPuestosExpositor`,
      data,
      { headers }
    );
  }
  consultardataseguro(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post<any>(
      `${this.url}/api/WsFinados/rest/metodo/cDatos`,
      data,
      { headers }
    );
  }
}
