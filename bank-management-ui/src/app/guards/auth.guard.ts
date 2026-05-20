import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRole = route.data?.['role'];
  if (expectedRole && authService.getRole() !== expectedRole) {
    alert('Access denied. You do not have permission to access this page.');
    router.navigate(['/login']);
    return false;
  }

  return true;
};

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const role = authService.getRole();
    if (role === 'manager') {
      router.navigate(['/dashboard']);
    } else if (role === 'customer') {
      router.navigate(['/my-account']);
    }
    return false;
  }

  return true;
};
