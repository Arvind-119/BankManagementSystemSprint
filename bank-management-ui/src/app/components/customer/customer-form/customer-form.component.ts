import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Edit Customer</h1>
          <p>Update customer information</p>
        </div>
        <a routerLink="/customers" class="btn btn-outline" id="back-to-customers">← Back to Customers</a>
      </div>

      <div class="form-container">
        <form [formGroup]="customerForm" (ngSubmit)="onSubmit()" id="customer-form">
          <h3 class="form-section-title">Personal Information</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name *</label>
              <input type="text" class="form-control" id="firstName" formControlName="firstName" placeholder="Enter first name"
                [class.is-invalid]="isFieldInvalid('firstName')">
              <div *ngIf="isFieldInvalid('firstName')" class="error-message">First name is required (letters only, max 50)</div>
            </div>
            <div class="form-group">
              <label for="lastName">Last Name *</label>
              <input type="text" class="form-control" id="lastName" formControlName="lastName" placeholder="Enter last name"
                [class.is-invalid]="isFieldInvalid('lastName')">
              <div *ngIf="isFieldInvalid('lastName')" class="error-message">Last name is required (letters only, max 50)</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="email">Email Address *</label>
              <input type="email" class="form-control" id="email" formControlName="email" placeholder="email@example.com"
                [class.is-invalid]="isFieldInvalid('email')">
              <div *ngIf="isFieldInvalid('email')" class="error-message">
                {{ customerForm.get('email')?.errors?.['required'] ? 'Email is required' : 'Invalid email format' }}
              </div>
            </div>
            <div class="form-group">
              <label for="snnId">SSN ID *</label>
              <input type="text" class="form-control" id="snnId" formControlName="snnId" placeholder="12-digit SSN ID" maxlength="12"
                [class.is-invalid]="isFieldInvalid('snnId')">
              <div *ngIf="isFieldInvalid('snnId')" class="error-message">SSN ID must be exactly 12 digits</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="contact">Contact Number</label>
              <input type="text" class="form-control" id="contact" formControlName="contact" placeholder="10-digit mobile" maxlength="10"
                [class.is-invalid]="isFieldInvalid('contact')">
              <div *ngIf="isFieldInvalid('contact')" class="error-message">Must be 10 digits starting with 6-9</div>
            </div>
            <div class="form-group">
              <label for="address">Address</label>
              <input type="text" class="form-control" id="address" formControlName="address" placeholder="Enter address" maxlength="100">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="age">Age</label>
              <input type="number" class="form-control" id="age" formControlName="age" placeholder="Enter age"
                [class.is-invalid]="isFieldInvalid('age')">
              <div *ngIf="isFieldInvalid('age')" class="error-message">Valid age is required (1-120)</div>
            </div>
            <div class="form-group">
              <label for="dateOfBirth">Date of Birth</label>
              <input type="date" class="form-control" id="dateOfBirth" formControlName="dateOfBirth">
            </div>
          </div>

          <h3 class="form-section-title">Banking Information</h3>
            <div class="form-row">
            <div class="form-group" *ngIf="isEdit">
              <label>Bank Account No</label>
              <div class="readonly-field">{{ originalBankAccountNo || '—' }}</div>
            </div>
            <div class="form-group">
              <label for="aadharNo">Aadhaar Number</label>
              <input type="text" class="form-control" id="aadharNo" formControlName="aadharNo" placeholder="12-digit Aadhaar" maxlength="12"
                [class.is-invalid]="isFieldInvalid('aadharNo')">
              <div *ngIf="isFieldInvalid('aadharNo')" class="error-message">Must be exactly 12 digits</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="panNo">PAN Number</label>
              <input type="text" class="form-control" id="panNo" formControlName="panNo" placeholder="ABCDE1234F" maxlength="10"
                style="text-transform: uppercase;"
                [class.is-invalid]="isFieldInvalid('panNo')">
              <div *ngIf="isFieldInvalid('panNo')" class="error-message">PAN format: 5 letters, 4 digits, 1 letter</div>
            </div>
            <div class="form-group">
              <label for="gender">Gender</label>
              <select class="form-control" id="gender" formControlName="gender">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="maritalStatus">Marital Status</label>
            <select class="form-control" id="maritalStatus" formControlName="maritalStatus">
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="customerForm.invalid || isSubmitting" id="submit-customer-btn" [class.shake-animation]="hasError">
              {{ isSubmitting ? 'Saving...' : '✓ Update Customer' }}
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
  styles: [`
    .form-section-title { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; margin-top: 24px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .form-section-title:first-of-type { margin-top: 0; }
    select.form-control { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
    select.form-control option { background: #1a1a2e; color: #fff; }
    .readonly-field { padding: 10px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: rgba(255,255,255,0.5); font-family: 'JetBrains Mono', monospace; font-size: 13px; }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-5px); }
      40%, 80% { transform: translateX(5px); }
    }
    .shake-animation { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
  `]
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  isEdit = false;
  customerId!: number;
  toastMessage = '';
  toastType = 'success';
  isSubmitting = false;
  hasError = false;
  originalBankAccountNo = '';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      snnId: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,50}$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,50}$/)]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      address: [''],
      age: ['', [Validators.min(1), Validators.max(120)]],
      dateOfBirth: [''],
      aadharNo: ['', [Validators.pattern(/^\d{12}$/)]],
      panNo: ['', [Validators.pattern(/^[A-Za-z]{5}\d{4}[A-Za-z]$/)]],
      gender: [''],
      maritalStatus: ['']
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
          contact: customer.contact,
          address: customer.address,
          age: customer.age,
          dateOfBirth: customer.dateOfBirth,
          aadharNo: customer.aadharNo,
          panNo: customer.panNo,
          gender: customer.gender,
          maritalStatus: customer.maritalStatus
        });
        this.originalBankAccountNo = customer.bankAccountNo || '';
      },
      error: (err) => {
        console.error('Error loading customer:', err);
        this.showToast('Failed to load customer data', 'error');
      }
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) return;
    this.isSubmitting = true;

    const formData = this.customerForm.value;

    const updateData = { ...formData, bankAccountNo: this.originalBankAccountNo };
    this.customerService.update(this.customerId, updateData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showToast('Customer updated successfully', 'success');
        setTimeout(() => this.router.navigate(['/customers']), 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error updating customer:', err);
        this.showToast(err.error?.message || 'Failed to update customer', 'error');
        this.triggerErrorAnimation();
      }
    });
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

  triggerErrorAnimation(): void {
    this.hasError = true;
    setTimeout(() => this.hasError = false, 400);
  }
}
