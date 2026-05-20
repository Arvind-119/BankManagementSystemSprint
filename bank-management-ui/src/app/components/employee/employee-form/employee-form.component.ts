import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2>{{ isEditMode ? 'Edit Employee' : 'Register New Employee' }}</h2>
          <p>{{ isEditMode ? 'Update employee information' : 'Fill in the details to register a new employee' }}</p>
        </div>
        <a routerLink="/employees" class="btn btn-outline" id="btn-back-employees">← Back to Employees</a>
      </div>

      <div class="glass-card">
        <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()" id="employee-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="employeeId">Employee ID *</label>
              <input type="text" formControlName="employeeId" id="employeeId" placeholder="Enter employee ID" />
              <span class="error" *ngIf="employeeForm.get('employeeId')?.touched && employeeForm.get('employeeId')?.invalid">Employee ID is required</span>
            </div>
            <div class="form-group">
              <label for="firstName">First Name *</label>
              <input type="text" formControlName="firstName" id="firstName" placeholder="Enter first name" />
              <span class="error" *ngIf="employeeForm.get('firstName')?.touched && employeeForm.get('firstName')?.invalid">First name is required</span>
            </div>
            <div class="form-group">
              <label for="lastName">Last Name *</label>
              <input type="text" formControlName="lastName" id="lastName" placeholder="Enter last name" />
              <span class="error" *ngIf="employeeForm.get('lastName')?.touched && employeeForm.get('lastName')?.invalid">Last name is required</span>
            </div>
            <div class="form-group">
              <label for="email">Email *</label>
              <input type="email" formControlName="email" id="email" placeholder="Enter email address" />
              <span class="error" *ngIf="employeeForm.get('email')?.touched && employeeForm.get('email')?.invalid">Valid email is required</span>
            </div>
            <div class="form-group">
              <label for="age">Age *</label>
              <input type="number" formControlName="age" id="age" placeholder="Enter age" />
              <span class="error" *ngIf="employeeForm.get('age')?.touched && employeeForm.get('age')?.invalid">Age is required</span>
            </div>
            <div class="form-group">
              <label for="dateOfBirth">Date of Birth *</label>
              <input type="date" formControlName="dateOfBirth" id="dateOfBirth" />
              <span class="error" *ngIf="employeeForm.get('dateOfBirth')?.touched && employeeForm.get('dateOfBirth')?.invalid">Date of birth is required</span>
            </div>
            <div class="form-group">
              <label for="department">Department *</label>
              <select formControlName="department" id="department">
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="Operations">Operations</option>
                <option value="Marketing">Marketing</option>
                <option value="Security">Security</option>
              </select>
              <span class="error" *ngIf="employeeForm.get('department')?.touched && employeeForm.get('department')?.invalid">Department is required</span>
            </div>
            <div class="form-group">
              <label for="address">Address *</label>
              <input type="text" formControlName="address" id="address" placeholder="Enter address" />
              <span class="error" *ngIf="employeeForm.get('address')?.touched && employeeForm.get('address')?.invalid">Address is required</span>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" routerLink="/employees" id="btn-cancel-emp">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="employeeForm.invalid" id="btn-submit-employee">
              {{ isEditMode ? 'Update Employee' : 'Register Employee' }}
            </button>
          </div>
        </form>
      </div>

      <div *ngIf="message" class="toast" [ngClass]="{'toast-success': !isError, 'toast-error': isError}">{{ message }}</div>
    </div>
  `,
  styles: [`
    .page-container { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { font-size: 1.6rem; font-weight: 700; color: #fff; margin: 0 0 4px 0; }
    .page-header p { color: rgba(255,255,255,0.5); font-size: 0.85rem; margin: 0; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; text-decoration: none; border: none; font-family: 'Inter', sans-serif; }
    .btn-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; box-shadow: 0 4px 15px rgba(102,126,234,0.3); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102,126,234,0.4); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .btn-outline { background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); }
    .btn-outline:hover { background: rgba(255,255,255,0.05); color: #fff; }
    .glass-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.5px; }
    .form-group input, .form-group select { padding: 12px 16px; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-size: 0.9rem; font-family: 'Inter', sans-serif; transition: all 0.3s ease; outline: none; }
    .form-group input:focus, .form-group select:focus { border-color: rgba(102,126,234,0.5); box-shadow: 0 0 15px rgba(102,126,234,0.15); }
    .form-group input::placeholder { color: rgba(255,255,255,0.25); }
    .form-group select option { background: #1a1a2e; color: #fff; }
    .error { font-size: 0.75rem; color: #ff416c; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
    .toast { position: fixed; bottom: 24px; right: 24px; padding: 14px 24px; border-radius: 10px; font-size: 0.85rem; font-weight: 500; z-index: 1000; animation: slideUp 0.3s ease; }
    .toast-success { background: rgba(56,239,125,0.15); color: #38ef7d; border: 1px solid rgba(56,239,125,0.3); }
    .toast-error { background: rgba(255,65,108,0.15); color: #ff416c; border: 1px solid rgba(255,65,108,0.3); }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  isEditMode = false;
  employeeId!: number;
  message = '';
  isError = false;

  constructor(private fb: FormBuilder, private employeeService: EmployeeService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      employeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: [null, Validators.required],
      dateOfBirth: ['', Validators.required],
      department: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.employeeId = +params['id'];
        this.employeeService.getById(this.employeeId).subscribe({
          next: (emp) => this.employeeForm.patchValue(emp),
          error: () => this.showMessage('Failed to load employee data.', true)
        });
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) return;
    const data = this.employeeForm.value;

    if (this.isEditMode) {
      this.employeeService.update(this.employeeId, data).subscribe({
        next: () => { this.showMessage('Employee updated successfully!', false); setTimeout(() => this.router.navigate(['/employees']), 1500); },
        error: (err) => this.showMessage(err.error?.message || 'Failed to update employee.', true)
      });
    } else {
      this.employeeService.create(data).subscribe({
        next: () => { this.showMessage('Employee registered successfully!', false); setTimeout(() => this.router.navigate(['/employees']), 1500); },
        error: (err) => this.showMessage(err.error?.message || 'Failed to register employee.', true)
      });
    }
  }

  private showMessage(msg: string, error: boolean): void {
    this.message = msg; this.isError = error;
    setTimeout(() => this.message = '', 3000);
  }
}
