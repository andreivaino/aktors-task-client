import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../services/product.service';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {finalize} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ObserveService} from '../../services/utils/observe.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {

  productForm: FormGroup;
  product: any = {};
  errorMessage;
  currentDate;
  subscription: Subscription;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private observeService: ObserveService
  ) { }

  ngOnInit(): void {
    this.subscription = this.observeService.notifyClientComp
      .subscribe((res) => { this.product = res; this.initForm(); });
    this.initProduct();
    this.currentDate = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    this.initForm();
  }

  initProduct() {
    this.product = JSON.parse(localStorage.getItem('product'));
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      barcode: [this.product.barcode, [
        Validators.required,
        Validators.pattern(/^[0-9]{12,13}$/)
      ]],
      name: [this.product.name, [
        Validators.required,
        Validators.pattern(/^.{1,40}$/)
      ]],
      basePrice: [this.product.basePrice, [
        Validators.required,
        Validators.pattern(/^[0-9.,]+$/)
      ]],
      description: [this.product.description, [
        Validators.required,
        Validators.pattern(/^.+$/)
      ]],
      releaseDate: [this.product.releaseDate, [
        Validators.required
      ]]
    });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.productForm.controls[controlName];
    return control.invalid && control.touched;
  }

  onSubmit() {
    const controls = this.productForm.controls;
    if (this.productForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    this.productForm.value.personalId = Number(this.productForm.value.personalId);
    this.updateProduct(this.productForm.value);
  }

  updateProduct(product: any) {
    this.productService.updateProduct(product)
      .pipe(finalize(() => {
        if (!this.errorMessage) {
          this.router.navigate(['/products']).then();
          window.location.reload();
        }
      }))
      .subscribe(res => {}, error => this.errorMessage = error);
  }

  onKey($event: KeyboardEvent) {
    this.errorMessage = null;
  }

}
