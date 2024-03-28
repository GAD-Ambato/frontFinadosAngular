import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private readonly http:HttpClient) { }


  getLocation(lng:number,lat:number){
   return this.http.get<any>(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=pk.eyJ1IjoidmlsbGVndWl0YXMiLCJhIjoiY2xjdjNkOXgxMWZncTNvbXZxcnVveWc4ZCJ9.y2WaP-2a68ty3RSkcEvmQg`)
  }


  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({ lon: resp.coords.longitude, lat: resp.coords.latitude });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  
}