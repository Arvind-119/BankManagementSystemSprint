import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SessionUser } from '../../../models/auth.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar" id="navbar">
      <div class="navbar-left">
        <button class="mobile-menu-btn" (click)="toggleSidebar()">☰</button>
        <h2 class="navbar-title">Bank Management System</h2>
      </div>
      <div class="navbar-right">
        <div class="navbar-notifications" id="notifications-btn">
          <span>🔔</span>
          <span class="notification-dot"></span>
        </div>
        <div class="navbar-profile" id="profile-btn">
          <div class="profile-avatar">
            <span>{{ getInitials() }}</span>
          </div>
          <div class="profile-info">
            <span class="profile-name">{{ user?.name || 'Admin' }}</span>
            <span class="profile-role">Branch Manager</span>
          </div>
        </div>
        <button class="btn-signout" (click)="signOut()" id="btn-manager-signout">Sign Out</button>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      height: var(--navbar-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      background: rgba(15, 15, 26, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .navbar-left { display: flex; align-items: center; }
    .navbar-title { font-size: 18px; font-weight: 700; color: var(--text-primary); }

    .navbar-right { display: flex; align-items: center; gap: 16px; }

    .navbar-notifications {
      position: relative; cursor: pointer; font-size: 18px;
      padding: 8px; border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }
    .navbar-notifications:hover { background: rgba(255, 255, 255, 0.05); }

    .notification-dot {
      position: absolute; top: 6px; right: 6px;
      width: 8px; height: 8px;
      background: var(--accent-red); border-radius: 50%;
      border: 2px solid var(--bg-primary);
    }

    .navbar-profile {
      display: flex; align-items: center; gap: 10px;
      padding: 6px 12px; border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }

    .profile-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--gradient-primary);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; color: white;
    }

    .profile-info { display: flex; flex-direction: column; }
    .profile-name { font-size: 13px; font-weight: 600; color: var(--text-primary); line-height: 1.2; }
    .profile-role { font-size: 11px; color: var(--text-muted); }

    .btn-signout {
      padding: 8px 16px;
      background: rgba(255,65,108,0.1);
      border: 1px solid rgba(255,65,108,0.2);
      border-radius: 8px;
      color: #ff416c;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-signout:hover { background: rgba(255,65,108,0.2); }
  `]
})
export class NavbarComponent implements OnInit {
  user: SessionUser | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getSession();
  }

  getInitials(): string {
    if (this.user?.name) {
      const parts = this.user.name.split(' ');
      return parts.map(p => p.charAt(0).toUpperCase()).join('').substring(0, 2);
    }
    return 'AD';
  }

  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    document.body.classList.toggle('sidebar-open');
  }
}
