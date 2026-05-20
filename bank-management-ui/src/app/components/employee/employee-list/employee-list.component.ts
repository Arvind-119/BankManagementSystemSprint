import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2>Employees</h2>
          <p>Manage all registered bank employees</p>
        </div>
        <a routerLink="/employees/new" class="btn btn-primary" id="btn-add-employee">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Employee
        </a>
      </div>

      <div class="glass-card">
        <div class="table-toolbar">
          <div class="search-filter">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterEmployees()" placeholder="Search employees..." id="employee-search" />
          </div>
          <span class="record-count">{{ filteredEmployees.length }} records</span>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let employee of filteredEmployees" class="table-row">
                <td class="mono">{{ employee.employeeId }}</td>
                <td class="name-cell">{{ employee.firstName }} {{ employee.lastName }}</td>
                <td>{{ employee.email }}</td>
                <td><span class="dept-badge">{{ employee.department }}</span></td>
                <td>{{ employee.address }}</td>
                <td class="actions-cell">
                  <button class="btn-icon btn-edit" [routerLink]="['/employees/edit', employee.id]" id="btn-edit-employee-{{employee.id}}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button class="btn-icon btn-delete" (click)="deleteEmployee(employee.id)" id="btn-delete-employee-{{employee.id}}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="filteredEmployees.length === 0" class="empty-state">
            <p>No employees found. Click "Add Employee" to register a new employee.</p>
          </div>
        </div>
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
    .glass-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; }
    .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .search-filter { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 8px 16px; color: rgba(255,255,255,0.4); }
    .search-filter:focus-within { border-color: rgba(102,126,234,0.5); }
    .search-filter input { background: none; border: none; outline: none; color: #fff; font-size: 0.85rem; width: 250px; font-family: 'Inter', sans-serif; }
    .search-filter input::placeholder { color: rgba(255,255,255,0.3); }
    .record-count { font-size: 0.8rem; color: rgba(255,255,255,0.4); }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.5px; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }
    td { padding: 14px 16px; font-size: 0.85rem; color: rgba(255,255,255,0.8); border-bottom: 1px solid rgba(255,255,255,0.05); }
    .table-row { transition: background 0.2s; }
    .table-row:hover td { background: rgba(255,255,255,0.03); }
    .mono { font-family: 'Courier New', monospace; font-size: 0.8rem; color: rgba(255,255,255,0.6); }
    .name-cell { font-weight: 600; color: #fff; }
    .dept-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; background: rgba(0,210,255,0.15); color: #00d2ff; }
    .actions-cell { display: flex; gap: 8px; }
    .btn-icon { width: 34px; height: 34px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; }
    .btn-edit:hover { background: rgba(102,126,234,0.2); color: #667eea; border-color: rgba(102,126,234,0.3); }
    .btn-delete:hover { background: rgba(255,65,108,0.2); color: #ff416c; border-color: rgba(255,65,108,0.3); }
    .empty-state { padding: 40px; text-align: center; }
    .empty-state p { color: rgba(255,255,255,0.4); }
    .toast { position: fixed; bottom: 24px; right: 24px; padding: 14px 24px; border-radius: 10px; font-size: 0.85rem; font-weight: 500; z-index: 1000; animation: slideUp 0.3s ease; }
    .toast-success { background: rgba(56,239,125,0.15); color: #38ef7d; border: 1px solid rgba(56,239,125,0.3); }
    .toast-error { background: rgba(255,65,108,0.15); color: #ff416c; border: 1px solid rgba(255,65,108,0.3); }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm = '';
  message = '';
  isError = false;

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void { this.loadEmployees(); }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (data) => { this.employees = data; this.filteredEmployees = data; },
      error: () => this.showMessage('Failed to load employees. Is employee-service running?', true)
    });
  }

  filterEmployees(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter(e =>
      e.firstName.toLowerCase().includes(term) || e.lastName.toLowerCase().includes(term) ||
      e.email.toLowerCase().includes(term) || e.employeeId.toLowerCase().includes(term) ||
      e.department.toLowerCase().includes(term)
    );
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.delete(id).subscribe({
        next: () => { this.showMessage('Employee deleted successfully!', false); this.loadEmployees(); },
        error: () => this.showMessage('Failed to delete employee.', true)
      });
    }
  }

  private showMessage(msg: string, error: boolean): void {
    this.message = msg; this.isError = error;
    setTimeout(() => this.message = '', 3000);
  }
}
