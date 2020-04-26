import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class OwnHttpClient {

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  get(url) {
    return this.http.get(url);
  }

  delete(url) {
    return this.http.delete(url, {headers: this.headers, responseType: 'text' });
  }

  put(url, data) {
    return this.http.put(url, data, {headers: this.headers});
  }

  post(url, data) {
    return this.http.post(url, data, {headers: this.headers});
  }

}
