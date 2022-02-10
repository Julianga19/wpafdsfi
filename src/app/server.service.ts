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

  getUsers(){
    return this.request('GET', `${environment.serverUrl}/usersAll`);
  }

  addUser(username, pwd, isAdmin, isSupervisor){
    return this.request('POST', `${environment.serverUrl}/users`,{username: username, password: pwd, isAdmin: isAdmin, isSupervisor: isSupervisor});  
  }

  deleteUser(username) {
    return this.request('PUT', `${environment.serverUrl}/users/${username}`);    
  }

  addCovered(data){    
    return this.request('POST', `${environment.serverUrl}/limit`, data);  
  }

  getPassed(number, date, limit, today, loteries){
    return this.request('GET', `${environment.serverUrl}/limit/${number}/${date}/${limit}/${today}/${loteries}`);
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

  addVendor(code){
    return this.request('POST', `${environment.serverUrl}/vendors`,{code: code});  
  }

  deleteVendor(code) {
    return this.request('PUT', `${environment.serverUrl}/vendors/${code}`);    
  }


  getEvents() {
    return this.request('GET', `${environment.serverUrl}/event`);
  }

  createEvent(event) {
    return this.request('POST', `${environment.serverUrl}/event`, event);
  }

  changeLoteryDay(code, dayOfWeek) {
    return this.request('PUT', `${environment.serverUrl}/event/${code}/${dayOfWeek}`);
  }

  deleteEvent(event) {
    return this.request('DELETE', `${environment.serverUrl}/event/${event.id}`);
  }

  graphicsByUser(){
    return this.request('GET', `${environment.serverUrl}/graphicsByUser`);   
  }

  salesByVendor(){
    return this.request('GET', `${environment.serverUrl}/salesByVendor`);   
  }
}