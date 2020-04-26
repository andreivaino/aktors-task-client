import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {OwnHttpClient} from './http-client/own-http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: OwnHttpClient
  ) { }

  getProductByProductId(productId) {
    return this.http.get(`${environment.API_URL}/products/${Number(productId)}`).pipe(
      map((res: any) => {
        return res;
      }));
  }

  getAllProducts() {
    return this.http.get(`${environment.API_URL}/products`).pipe(
      map((res: any) => {
        return res;
      }));
  }

  getProductsWithoutOrder() {
    return this.http.get(`${environment.API_URL}/products/no-order`).pipe(
      map((res: any) => {
        return res;
      }));
  }

  getProductsByOrderNumber(orderNumber) {
    return this.http.get(`${environment.API_URL}/products/by-order/${Number(orderNumber)}`).pipe(
      map((res: any) => {
        return res;
      }));
  }

  deleteProduct(productId) {
    return this.http.delete(`${environment.API_URL}/products/${Number(productId)}`).pipe(
      map((res: any) => {
        return res;
      }));
  }

  createProduct(product) {
    return this.http.post(`${environment.API_URL}/products`, product).pipe(
      map((res: any) => {
        return res;
      }));
  }

  updateProduct(product) {
    return this.http.put(`${environment.API_URL}/products`, product).pipe(
      map((res: any) => {
        return res;
      }));
  }

}
