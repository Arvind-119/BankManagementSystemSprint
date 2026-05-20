import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <!-- Full layout for manager pages -->
    <div class="app-layout" *ngIf="showManagerLayout">
      <div class="sidebar-overlay" (click)="closeSidebar()"></div>
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <app-navbar></app-navbar>
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>

    <!-- No layout wrapper for login, register, and customer dashboard (they have their own) -->
    <div *ngIf="!showManagerLayout">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background: #0f0f1a;
    }
    .main-content {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .page-content {
      flex: 1;
      padding: 32px;
      overflow-y: auto;
    }
  `]
})
export class AppComponent {
  title = 'Bank Management System';
  showManagerLayout = false;

  private managerRoutes = ['/dashboard', '/customers', '/accounts', '/transactions'];

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.closeSidebar();
      const url = e.urlAfterRedirects || e.url;
      this.showManagerLayout = this.managerRoutes.some(r => url.startsWith(r));
    });
  }

  closeSidebar() {
    document.body.classList.remove('sidebar-open');
  }
}
