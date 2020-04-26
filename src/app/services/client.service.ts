import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {OwnHttpClient} from './http-client/own-http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private http: OwnHttpClient
  ) { }

  getClientByPersonalId(personalId) {
    return this.http.get(`${environment.API_URL}/clients/${Number(personalId)}`).pipe(
      map((res: any) => {
        return res;
      }));
  }

  getAllClients() {
    return this.http.get(`${environment.API_URL}/clients`).pipe(
      map((res: any) => {
        return res;
      }));
  }

  deleteClient(personalId) {
    return this.http.delete(`${environment.API_URL}/clients/${Number(personalId)}`).pipe(
      map((res: any) => {
        return res;
      }));
  }

  createClient(client) {
    return this.http.post(`${environment.API_URL}/clients`, client).pipe(
      map((res: any) => {
        return res;
      }));
  }

  updateClient(client) {
    return this.http.put(`${environment.API_URL}/clients`, client).pipe(
      map((res: any) => {
        return res;
      }));
  }

}
