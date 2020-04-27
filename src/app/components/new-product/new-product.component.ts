import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  productForm: FormGroup;
  errorMessage;
  currentDate;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentDate = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    this.initForm();
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      barcode: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{12,13}$/)
      ]],
      name: [null, [
        Validators.required,
        Validators.pattern(/^.{1,40}$/)
      ]],
      basePrice: [null, [
        Validators.required,
        Validators.pattern(/^[0-9.,]+$/)
      ]],
      description: [null, [
        Validators.required,
        Validators.pattern(/^.+$/)
      ]],
      releaseDate: [null, [
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
    this.createProduct(this.productForm.value);
  }

  createProduct(product: any) {
    this.productService.createProduct(product)
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
