import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { CustomerFormComponent } from './components/customer/customer-form/customer-form.component';
import { AccountListComponent } from './components/account/account-list/account-list.component';
import { AccountFormComponent } from './components/account/account-form/account-form.component';
import { TransactionListComponent } from './components/transaction/transaction-list/transaction-list.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'register', component: RegisterComponent },

  // Customer routes
  { path: 'my-account', component: CustomerDashboardComponent, canActivate: [authGuard], data: { role: 'customer' } },

  // Manager routes
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: { role: 'manager' } },
  { path: 'customers', component: CustomerListComponent, canActivate: [authGuard], data: { role: 'manager' } },
  { path: 'customers/new', component: CustomerFormComponent, canActivate: [authGuard], data: { role: 'manager' } },
  { path: 'customers/edit/:id', component: CustomerFormComponent, canActivate: [authGuard], data: { role: 'manager' } },
  { path: 'accounts', component: AccountListComponent, canActivate: [authGuard], data: { role: 'manager' } },
  { path: 'accounts/new', component: AccountFormComponent, canActivate: [authGuard], data: { role: 'manager' } },
  { path: 'transactions', component: TransactionListComponent, canActivate: [authGuard], data: { role: 'manager' } },

  // Fallback
  { path: '**', redirectTo: '/login' }
];
