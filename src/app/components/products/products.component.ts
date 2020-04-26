import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {SortingType} from '../../enums/SortingType';
import {SortingService} from '../../services/utils/sorting.service';
import {finalize} from 'rxjs/operators';
import {OrderService} from '../../services/order.service';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {

  products: any[] = [];
  productsSortingType: SortingType;
  modal;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private sortingService: SortingService
  ) { }

  ngOnInit(): void {
    this.productsSortingType = SortingType.Barcode;
    this.modal = ModalType.New;
    this.loadProducts();
    console.log(this.products);
  }

  loadProducts() {
    this.productService.getAllProducts()
      .pipe(finalize(() => {
        this.sortProducts(this.productsSortingType);
      }))
      .subscribe(res => this.products = res);
  }

  removeProduct(product: any) {
    let isAccepted;
    if (product.order) {
      isAccepted = confirm('Do you want to remove this product? It will be also removed from order');
    } else {
      isAccepted = confirm('Do you want to remove this product?');
    }
    if (isAccepted) {
      if (product.order) {
        product.order.price = Number(product.order.price) - Number(product.basePrice);
        product.order.transactionDate = null;
        this.orderService.updateOrder(product.order).subscribe();
      }
      this.productService.deleteProduct(Number(product.barcode))
        .pipe(finalize(() => {
          this.loadProducts();
        }))
        .subscribe();
    } else {
      return;
    }
  }

  get sortingType() { return SortingType; }

  sortProducts(sortingType: SortingType) {
    this.productsSortingType = sortingType;
    this.products = this.sortingService.sortProducts(sortingType, this.products);
  }

  setModalType(modalType: ModalType) {
    this.modal = modalType;
  }

  get modalType() {
    return ModalType;
  }

  setCurrentProduct(product: any) {
    localStorage.setItem('product', JSON.stringify(product));
  }
}

export enum ModalType {
  New = 'New', Edit = 'Edit'
}
