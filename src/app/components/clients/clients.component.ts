import {Component, Input, OnInit} from '@angular/core';
import {ClientService} from '../../services/client.service';
import {SortingType} from '../../enums/SortingType';
import {SortingService} from '../../services/utils/sorting.service';
import {finalize} from 'rxjs/operators';
import {OrderService} from '../../services/order.service';
import {ClientManagementComponent} from '../client-management/client-management.component';
import {ObserveService} from '../../services/utils/observe.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {

  clients: any[] = [];
  clientsSortingType: SortingType;
  firstCmp;
  modal;

  constructor(
    private clientService: ClientService,
    private orderService: OrderService,
    private sortingService: SortingService,
    private observeService: ObserveService
  ) { }

  ngOnInit(): void {
    this.clientsSortingType = SortingType.PersonalId;
    this.modal = ModalType.New;
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAllClients()
      .pipe(finalize(() => {
        this.sortClients(this.clientsSortingType);
      }))
      .subscribe(res => this.clients = res);
  }

  updateOrders(client: any) {
    if (client.orders.length) {
      for (let i = 0; i < client.orders.length; i++) {
        client.orders[i].client = {personalId: client.personalId};
        this.orderService.updateOrder(client.orders[i])
          .pipe(finalize(() => {
            if (i === client.orders.length - 1) {
              this.deleteClient(client.personalId);
            }
          }))
          .subscribe();
      }
    } else {
      this.deleteClient(client.personalId);
    }
  }

  removeClient(client: any) {
    if (confirm('Do you want to remove this client? All client\'s orders will be also removed')) {
      this.updateOrders(client);
    } else {
      return;
    }
  }

  deleteClient(personalId: number) {
    this.clientService.deleteClient(personalId)
      .pipe(finalize(() => {
        this.loadClients();
      }))
      .subscribe();
  }

  get sortingType() { return SortingType; }

  sortClients(sortingType: SortingType) {
    this.clientsSortingType = sortingType;
    this.clients = this.sortingService.sortClients(sortingType, this.clients);
  }

  setModalType(modalType: ModalType) {
    this.modal = modalType;
  }

  get modalType() {
    return ModalType;
  }

  setCurrentClient(client: any) {
    localStorage.setItem('client', JSON.stringify(client));
  }

  notifyClientManagement(client: any) {
    this.observeService.notifyClientManagement(client);
  }

}

export enum ModalType {
  New = 'New', Edit = 'Edit'
}
