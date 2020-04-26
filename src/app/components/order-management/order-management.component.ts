import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../services/order.service';
import {finalize} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../services/product.service';
import {ClientService} from '../../services/client.service';
import {SortingType} from '../../enums/SortingType';
import {SortingService} from '../../services/utils/sorting.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html'
})
export class OrderManagementComponent implements OnInit {

  orderNumber;
  order: any = {};
  products: any = [{}];
  noOrderProducts: any = [{}];
  clients: any[] = [{}];
  productsSortingType: SortingType;
  noOrderProductsSortingType: SortingType;
  clientsSortingType: SortingType;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private sortingService: SortingService
  ) {
  }

  ngOnInit(): void {
    this.orderNumber = this.route.snapshot.paramMap.get('order_number');
    this.loadOrder();
    this.loadClients();
    this.loadProductsByOrderNumber();
    this.order.client = {};
    this.order.products = [];
    this.productsSortingType = SortingType.Barcode;
    this.noOrderProductsSortingType = SortingType.Barcode;
    this.clientsSortingType = SortingType.PersonalId;
  }

  loadOrder() {
    this.orderService.getOrderByOrderNumber(this.orderNumber)
      .subscribe(res => this.order = res,
        error => this.router.navigate(['/orders']).then());
  }

  loadProductsByOrderNumber() {
    this.productService.getProductsByOrderNumber(this.orderNumber)
      .pipe(finalize(() => {
        this.sortProducts(this.productsSortingType);
      }))
      .subscribe(res => this.products = res);
  }

  loadClients() {
    this.clientService.getAllClients()
      .pipe(finalize(() => {
        this.sortClients(this.clientsSortingType);
      }))
      .subscribe(res => this.clients = res);
  }

  loadProductsWithNoOrder() {
    this.productService.getProductsWithoutOrder()
      .pipe(finalize(() => {
        this.sortNoOrderProducts(this.noOrderProductsSortingType);
      }))
      .subscribe(res => this.noOrderProducts = res);
  }

  loadProductsAndUpdateOrder() {
    this.productService.getProductsByOrderNumber(this.orderNumber)
      .pipe(finalize(() => {
        this.updateOrder();
        this.sortProducts(this.productsSortingType);
      }))
      .subscribe(res => this.products = res);
  }

  updateOrder() {
    this.order.price = this.getTotalPrice();
    this.order.products = null;
    this.orderService.updateOrder(this.order)
      .subscribe(res => this.order = res);
  }

  removeProductFromOrder(product) {
    const isConfirmed = confirm('Do you want to remove product from this order?');
    if (isConfirmed) {
      product.order = null;
      this.productService.updateProduct(product)
        .pipe(finalize(() => {
          this.loadProductsAndUpdateOrder();
        }))
        .subscribe();
    }
  }

  getTotalPrice(): number {
    let price = 0;
    if (this.products) {
      for (const product of this.products) {
        price = price + product.basePrice;
      }
    }
    return price;
  }

  addProductToOrder(product) {
    product.order = {orderNumber: this.orderNumber};
    this.productService.updateProduct(product).pipe(
      finalize(() => {
        this.loadProductsAndUpdateOrder();
      })
    ).subscribe(() => this.loadProductsWithNoOrder());
  }

  setClientToOrder(client: any) {
    this.order.client = {personalId: Number(client.personalId)};
    this.order.products = null;
    this.orderService.updateOrder(this.order)
      .pipe(finalize(() => {
        this.loadClients();
      })).subscribe(res => this.order = res);
  }

  get sortingType() {
    return SortingType;
  }

  sortClients(sortingType: SortingType) {
    this.clientsSortingType = sortingType;
    this.clients = this.sortingService.sortClients(sortingType, this.clients);
  }

  sortNoOrderProducts(sortingType: SortingType) {
    this.noOrderProductsSortingType = sortingType;
    this.noOrderProducts = this.sortingService.sortProducts(sortingType, this.noOrderProducts);
  }

  sortProducts(sortingType: SortingType) {
    this.productsSortingType = sortingType;
    this.products = this.sortingService.sortProducts(sortingType, this.products);
  }

}
