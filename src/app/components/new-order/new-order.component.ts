import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../services/order.service';
import {ProductService} from '../../services/product.service';
import {ClientService} from '../../services/client.service';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';
import {SortingType} from '../../enums/SortingType';
import {SortingService} from '../../services/utils/sorting.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html'
})
export class NewOrderComponent implements OnInit {
  products: any[] = [];
  noOrderProducts: any[] = [];
  clients: any[] = [];
  order: any = {};
  noOrderProductsSortingType: SortingType;
  clientsSortingType: SortingType;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private clientService: ClientService,
    private router: Router,
    private sortingService: SortingService
  ) {
  }

  ngOnInit(): void {
    this.order.products = [];
    this.noOrderProductsSortingType = SortingType.Barcode;
    this.clientsSortingType = SortingType.PersonalId;
    this.loadClients();
  }

  loadProductsWithNoOrder() {
    this.productService.getProductsWithoutOrder()
      .pipe(finalize(() => {
        this.noOrderProducts = this.filterProducts();
        this.sortProducts(this.noOrderProductsSortingType);
      }))
      .subscribe((res: any[]) => this.noOrderProducts = res);
  }

  filterProducts(): any[] {
    return this.noOrderProducts.filter((product) => !this.order.products
      .find(({barcode}) => product.barcode === barcode));
  }

  addProductToOrder(product: any) {
    this.order.products.push(product);
    this.loadProductsWithNoOrder();
  }

  loadClients() {
    this.clientService.getAllClients()
      .pipe(finalize(() => {
        this.sortClients(this.clientsSortingType);
      }))
      .subscribe(res => this.clients = res);
  }

  removeProductFromOrder(product: any) {
    const isConfirmed = confirm('Do you want to remove product from this order?');
    if (isConfirmed) {
      this.order.products = this.order.products
        .filter(orderProduct => orderProduct.barcode !== product.barcode);
    }
  }

  saveOrder() {
    if (this.order.client) {
      const tempProducts = this.order.products;
      this.order.price = this.getTotalPrice();
      this.order.products = null;
      this.orderService.createOrder(this.order)
        .pipe(finalize(() => {
          if (tempProducts) {
            for (let i = 0; i < tempProducts.length; i++) {
              tempProducts[i].order = {orderNumber: this.order.orderNumber};
              if (i === tempProducts.length - 1) {
                this.productService.updateProduct(tempProducts[i])
                  .pipe(finalize(() => {
                    this.router.navigate(['/orders/' + this.order.orderNumber]).then();
                  }))
                  .subscribe();
              } else {
                this.productService.updateProduct(tempProducts[i]).subscribe();
              }}
          }
          this.router.navigate(['/orders/' + this.order.orderNumber]).then();
        }))
        .subscribe(res => this.order = res);
    } else {
      alert('Please choose client before order saving.');
      return;
    }
  }

  setClientToOrder(client: any) {
    this.order.client = client;
  }

  getTotalPrice(): number {
    let price = 0;
    if (this.order.products) {
      for (const product of this.order.products) {
        price = price + product.basePrice;
      }
    }
    return price;
  }

  get sortingType() { return SortingType; }

  sortClients(sortingType: SortingType) {
    this.clientsSortingType = sortingType;
    this.clients = this.sortingService.sortClients(sortingType, this.clients);
  }

  sortProducts(sortingType: SortingType) {
    this.noOrderProductsSortingType = sortingType;
    this.noOrderProducts = this.sortingService.sortProducts(sortingType, this.noOrderProducts);
  }

}
