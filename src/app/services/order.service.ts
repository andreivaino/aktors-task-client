import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {map} from 'rxjs/operators';
import {OwnHttpClient} from './http-client/own-http-client.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: OwnHttpClient
  ) { }

  getOrderByOrderNumber(orderNumber) {
    return this.http.get(`${environment.API_URL}/orders/${Number(orderNumber)}`).pipe(
      map((res: any) => {
        return res;
      }));
  }

  getAllOrders() {
    return this.http.get(`${environment.API_URL}/orders`).pipe(
      map((res: any) => {
        return res;
      }));
  }

  deleteOrder(orderNumber) {
    return this.http.delete(`${environment.API_URL}/orders/${Number(orderNumber)}`).pipe(
      map((res: any) => {
        return res;
      }));
  }

  createOrder(order) {
    return this.http.post(`${environment.API_URL}/orders`, order).pipe(
      map((res: any) => {
        return res;
      }));
  }

  updateOrder(order) {
    return this.http.put(`${environment.API_URL}/orders`, order).pipe(
      map((res: any) => {
        return res;
      }));
  }

}
