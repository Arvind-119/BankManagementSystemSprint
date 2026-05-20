import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>{{ isEdit ? 'Edit Customer' : 'Add New Customer' }}</h1>
          <p>{{ isEdit ? 'Update customer information' : 'Fill in the details to create a new customer' }}</p>
        </div>
        <a routerLink="/customers" class="btn btn-outline" id="back-to-customers">← Back to Customers</a>
      </div>

      <div class="form-container">
        <form [formGroup]="customerForm" (ngSubmit)="onSubmit()" id="customer-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input type="text" class="form-control" id="firstName" formControlName="firstName" placeholder="Enter first name"
                [class.is-invalid]="isFieldInvalid('firstName')">
              <div *ngIf="isFieldInvalid('firstName')" class="error-message">First name is required</div>
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input type="text" class="form-control" id="lastName" formControlName="lastName" placeholder="Enter last name"
                [class.is-invalid]="isFieldInvalid('lastName')">
              <div *ngIf="isFieldInvalid('lastName')" class="error-message">Last name is required</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" class="form-control" id="email" formControlName="email" placeholder="email@example.com"
                [class.is-invalid]="isFieldInvalid('email')">
              <div *ngIf="isFieldInvalid('email')" class="error-message">
                {{ customerForm.get('email')?.errors?.['required'] ? 'Email is required' : 'Invalid email format' }}
              </div>
            </div>
            <div class="form-group">
              <label for="snnId">SNN ID</label>
              <input type="text" class="form-control" id="snnId" formControlName="snnId" placeholder="Enter SNN ID"
                [class.is-invalid]="isFieldInvalid('snnId')">
              <div *ngIf="isFieldInvalid('snnId')" class="error-message">SNN ID is required</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="age">Age</label>
              <input type="number" class="form-control" id="age" formControlName="age" placeholder="Enter age"
                [class.is-invalid]="isFieldInvalid('age')">
              <div *ngIf="isFieldInvalid('age')" class="error-message">Valid age is required</div>
            </div>
            <div class="form-group">
              <label for="dateOfBirth">Date of Birth</label>
              <input type="date" class="form-control" id="dateOfBirth" formControlName="dateOfBirth"
                [class.is-invalid]="isFieldInvalid('dateOfBirth')">
              <div *ngIf="isFieldInvalid('dateOfBirth')" class="error-message">Date of birth is required</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="bankAccountNo">Bank Account No</label>
              <input type="text" class="form-control" id="bankAccountNo" formControlName="bankAccountNo" placeholder="Enter bank account number"
                [class.is-invalid]="isFieldInvalid('bankAccountNo')">
              <div *ngIf="isFieldInvalid('bankAccountNo')" class="error-message">Bank account number is required</div>
            </div>
            <div class="form-group">
              <label for="aadharNo">Aadhar Number</label>
              <input type="text" class="form-control" id="aadharNo" formControlName="aadharNo" placeholder="12-digit Aadhar number"
                [class.is-invalid]="isFieldInvalid('aadharNo')">
              <div *ngIf="isFieldInvalid('aadharNo')" class="error-message">
                {{ customerForm.get('aadharNo')?.errors?.['required'] ? 'Aadhar number is required' : 'Must be 12 digits' }}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="panNo">PAN Number</label>
            <input type="text" class="form-control" id="panNo" formControlName="panNo" placeholder="10-character PAN number" style="text-transform: uppercase;"
              [class.is-invalid]="isFieldInvalid('panNo')">
            <div *ngIf="isFieldInvalid('panNo')" class="error-message">
              {{ customerForm.get('panNo')?.errors?.['required'] ? 'PAN number is required' : 'Must be 10 characters' }}
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="customerForm.invalid" id="submit-customer-btn">
              {{ isEdit ? '✓ Update Customer' : '+ Create Customer' }}
            </button>
            <a routerLink="/customers" class="btn btn-outline" id="cancel-customer-btn">Cancel</a>
          </div>
        </form>
      </div>

      <div *ngIf="toastMessage" class="toast" [ngClass]="toastType === 'success' ? 'toast-success' : 'toast-error'">
        {{ toastMessage }}
      </div>
    </div>
  `,
  styles: [``]
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  isEdit = false;
  customerId!: number;
  toastMessage = '';
  toastType = 'success';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      snnId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(1)]],
      dateOfBirth: ['', Validators.required],
      bankAccountNo: ['', Validators.required],
      aadharNo: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      panNo: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{10}$/)]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.customerId = +id;
      this.loadCustomer();
    }
  }

  loadCustomer(): void {
    this.customerService.getById(this.customerId).subscribe({
      next: (customer) => {
        this.customerForm.patchValue({
          snnId: customer.snnId,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          age: customer.age,
          dateOfBirth: customer.dateOfBirth,
          bankAccountNo: customer.bankAccountNo,
          aadharNo: customer.aadharNo,
          panNo: customer.panNo
        });
      },
      error: (err) => {
        console.error('Error loading customer:', err);
        this.showToast('Failed to load customer data', 'error');
      }
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) return;

    const formData = this.customerForm.value;

    if (this.isEdit) {
      this.customerService.update(this.customerId, formData).subscribe({
        next: () => {
          this.showToast('Customer updated successfully', 'success');
          setTimeout(() => this.router.navigate(['/customers']), 1500);
        },
        error: (err) => {
          console.error('Error updating customer:', err);
          this.showToast('Failed to update customer', 'error');
        }
      });
    } else {
      this.customerService.create(formData).subscribe({
        next: () => {
          this.showToast('Customer created successfully', 'success');
          setTimeout(() => this.router.navigate(['/customers']), 1500);
        },
        error: (err) => {
          console.error('Error creating customer:', err);
          this.showToast('Failed to create customer', 'error');
        }
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const f = this.customerForm.get(field);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  showToast(message: string, type: string): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 3000);
  }
}
