import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) {
  }

  private async request(method: string, url: string, data?: any) {    

    const result = this.http.request(method, url, {
      body: data,
      responseType: 'json',
      observe: 'body',
      headers: {
      }
    });
    return new Promise((resolve, reject) => {
      result.subscribe(resolve, reject);
    });
  }

  login(user, pass){
    return this.request('GET', `${environment.serverUrl}/users/${user}/${pass}`);
  }

  addCovered(data){    
    return this.request('POST', `${environment.serverUrl}/limit`, data);  
  }

  getPassed(number, date, limit){
    return this.request('GET', `${environment.serverUrl}/limit/${number}/${date}/${limit}`);
  }

  getWinners(number, date, loteryCode){
    return this.request('GET', `${environment.serverUrl}/winners/${number}/${date}/${loteryCode}`);
  }

  addForbidden(number) {    
    return this.request('POST', `${environment.serverUrl}/forbidden`, {number: number});  
  }

  getForbidden() {
    return this.request('GET', `${environment.serverUrl}/forbidden`);
  }

  deleteForbidden(number) {
    return this.request('DELETE', `${environment.serverUrl}/forbidden/${number}`);    
  }

  getVendors() {
    return this.request('GET', `${environment.serverUrl}/vendors`);
  }

  getEvents() {
    return this.request('GET', `${environment.serverUrl}/event`);
  }

  createEvent(event) {
    return this.request('POST', `${environment.serverUrl}/event`, event);
  }

  updateEvent(event) {
    return this.request('PUT', `${environment.serverUrl}/event/${event.id}`, event);
  }

  deleteEvent(event) {
    return this.request('DELETE', `${environment.serverUrl}/event/${event.id}`);
  }
}