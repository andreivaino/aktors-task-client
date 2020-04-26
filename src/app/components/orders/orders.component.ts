import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../services/order.service';
import {finalize} from 'rxjs/operators';
import {SortingType} from '../../enums/SortingType';
import {SortingService} from '../../services/utils/sorting.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {

  orders: any = [];
  ordersSortingType: SortingType;

  constructor(
    private orderService: OrderService,
    private sortingService: SortingService
  ) {
  }

  ngOnInit(): void {
    this.ordersSortingType = SortingType.OrderNumber;
    this.loadOrders();
  }

  deleteOrder(orderNumber) {
    const isConfirmed = confirm('Do you want to confirm this order?');
    if (isConfirmed) {
      this.orderService.deleteOrder(orderNumber)
        .pipe(finalize(() => {
          this.loadOrders();
        }))
        .subscribe();
    }
  }

  get sortingType() { return SortingType; }

  removeOrder(order) {
    const isConfirmed = confirm('Do you want to remove this order?');
    if (isConfirmed) {
      this.orderService.updateOrder(order)
        .pipe(finalize(() => {
          this.orderService.deleteOrder(order.orderNumber)
            .pipe(finalize(() => {
              this.loadOrders();
            }))
            .subscribe();
        })).subscribe();
    }
  }

  loadOrders() {
    this.orderService.getAllOrders()
      .pipe(finalize(() => {
        this.sortOrders(this.ordersSortingType);
      }))
      .subscribe(res => this.orders = res);
  }

  sortOrders(sortingType: SortingType) {
    this.ordersSortingType = sortingType;
    this.orders = this.sortingService.sortOrders(sortingType, this.orders);
  }

}
