import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as enviromentComponent from '../enviroment/enviroment.component';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SaveallService {
  url: any;

  constructor(private _http: HttpClient) { 
    this.url=enviromentComponent.environment.url;

  }

}
