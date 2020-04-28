import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class ObserveService {
  private notifyClient = new Subject<any>();
  private notifyProduct = new Subject<any>();

  notifyClientComp = this.notifyProduct.asObservable();
  notifyProductComp = this.notifyProduct.asObservable();

  constructor() {}

  public notifyClientManagement(data: any) {
    if (data) {
      this.notifyClient.next(data);
    }
  }

  public notifyProductManagement(data: any) {
    if (data) {
      this.notifyProduct.next(data);
    }
  }

}
