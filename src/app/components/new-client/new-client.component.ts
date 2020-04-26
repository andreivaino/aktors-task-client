import { Component, OnInit } from '@angular/core';
import {ClientService} from '../../services/client.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css']
})
export class NewClientComponent implements OnInit {

  clientForm: FormGroup;
  errorMessage;

  constructor(
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.clientForm = this.formBuilder.group({
      personalId: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{5,15}$/)
      ]],
      firstName: [null, [
        Validators.required,
        Validators.pattern(/^[A-zЁёА-яÕõÜüÖöÄäŽž]{1,15}$/)
      ]],
      lastName: [null, [
        Validators.required,
        Validators.pattern(/^[A-zЁёА-яÕõÜüÖöÄäŽž]{1,20}$/)
      ]],
      address: [null, [
        Validators.required,
        Validators.pattern(/^.{5,50}$/)
      ]],
      country: [null, [
        Validators.required,
        Validators.pattern(/^[A-zЁёА-яÕõÜüÖöÄäŽž]{3,25}$/)
      ]],
      phone: [null, [
        Validators.required,
        Validators.pattern(/([(+]*[0-9]+[()+. -]*)/)
      ]]
    });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.clientForm.controls[controlName];
    return control.invalid && control.touched;
  }

  onSubmit() {
    const controls = this.clientForm.controls;
    if (this.clientForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    this.clientForm.value.personalId = Number(this.clientForm.value.personalId);
    this.createClient(this.clientForm.value);
  }

  createClient(client: any) {
    this.clientService.createClient(client)
      .pipe(finalize(() => {
        if (!this.errorMessage) {
          this.router.navigate(['/clients']).then();
          window.location.reload();
        }
      }))
      .subscribe(res => {}, error => this.errorMessage = error);
  }

  onKey($event: KeyboardEvent) {
    this.errorMessage = null;
  }
}
