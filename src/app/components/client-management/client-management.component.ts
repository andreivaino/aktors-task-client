import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClientService} from '../../services/client.service';
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ObserveService} from '../../services/utils/observe.service';

@Component({
  selector: 'app-client-management',
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.css']
})
export class ClientManagementComponent implements OnInit {

  clientForm: FormGroup;
  client: any = {};
  errorMessage;
  subscription: Subscription;

  constructor(
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private router: Router,
    private observeService: ObserveService
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.observeService.notifyClientComp
      .subscribe((res) => { this.client = res; this.initForm(); });
    this.initClient();
    this.initForm();
  }

  initClient() {
    this.client = JSON.parse(localStorage.getItem('client'));
  }

  initForm() {
    this.clientForm = this.formBuilder.group({
      personalId: [this.client.personalId, [
        Validators.required,
        Validators.pattern(/^[0-9]{5,15}$/)
      ]],
      firstName: [this.client.firstName, [
        Validators.required,
        Validators.pattern(/^[A-zЁёА-яÕõÜüÖöÄäŽž]{1,15}$/)
      ]],
      lastName: [this.client.lastName, [
        Validators.required,
        Validators.pattern(/^[A-zЁёА-яÕõÜüÖöÄäŽž]{1,20}$/)
      ]],
      address: [this.client.address, [
        Validators.required,
        Validators.pattern(/^.{5,50}$/)
      ]],
      country: [this.client.country, [
        Validators.required,
        Validators.pattern(/^[A-zЁёА-яÕõÜüÖöÄäŽž]{3,25}$/)
      ]],
      phone: [this.client.phone, [
        Validators.required,
        Validators.pattern(/([(+]*[0-9]+[()+. -]*)/)
      ]],
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
    this.updateClient(this.clientForm.value);
  }

  updateClient(client: any) {
    this.clientService.updateClient(client)
      .pipe(finalize(() => {
        if (!this.errorMessage) {
          this.router.navigate(['/clients']).then();
          window.location.reload();
        }
      }))
      .subscribe(res => {
      }, error => this.errorMessage = error);
  }

  onKey($event: KeyboardEvent) {
    this.errorMessage = null;
  }
}
