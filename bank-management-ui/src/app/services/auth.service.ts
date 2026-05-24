import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, SessionUser } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8085/api/v1/auth';
  private sessionKey = 'bankUser';

  private currentUserSubject = new BehaviorSubject<SessionUser | null>(this.getSession());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, request);
  }

  registerByManager(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register/by-manager`, request);
  }

  updatePassword(request: { loginId: string, newPassword: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/password`, request, { responseType: 'text' });
  }

  setSession(response: LoginResponse): void {
    const user: SessionUser = {
      id: response.id,
      loginId: response.loginId,
      name: response.name,
      role: response.role,
      linkedCustomerId: response.linkedCustomerId,
      token: response.token
    };
    sessionStorage.setItem(this.sessionKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getSession(): SessionUser | null {
    const data = sessionStorage.getItem(this.sessionKey);
    if (data) {
      try {
        return JSON.parse(data) as SessionUser;
      } catch {
        return null;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.getSession() !== null;
  }

  getRole(): string | null {
    return this.getSession()?.role || null;
  }

  logout(): void {
    sessionStorage.removeItem(this.sessionKey);
    this.currentUserSubject.next(null);
  }
}
