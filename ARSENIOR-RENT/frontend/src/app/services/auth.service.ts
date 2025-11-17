import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse 
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Signals para estado reactivo
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);
  isAdmin = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    if (this.isBrowser()) {
      this.loadUserFromStorage();
    }
  }

  // Cargar usuario del localStorage al iniciar
  private loadUserFromStorage(): void {
    if (!this.isBrowser()) return;

    const token = localStorage.getItem('arsenior_token');
    const userStr = localStorage.getItem('arsenior_user');

    if (token && userStr) {
      try {
        const user: User = JSON.parse(userStr);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        this.isAdmin.set(user.role === 'admin');
      } catch (error) {
        this.logout();
      }
    }
  }

  // Registro
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  // Login
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  // Manejar autenticación exitosa
  private handleAuthSuccess(response: AuthResponse): void {
    if (this.isBrowser()) {
      localStorage.setItem('arsenior_token', response.token);
      localStorage.setItem('arsenior_user', JSON.stringify(response.user));
    }
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
    this.isAdmin.set(response.user.role === 'admin');
  }

  // Logout
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('arsenior_token');
      localStorage.removeItem('arsenior_user');
    }
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.isAdmin.set(false);
    this.router.navigate(['/login']);
  }

  // Obtener perfil actualizado
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`)
      .pipe(
        tap(user => {
          if (this.isBrowser()) {
            localStorage.setItem('arsenior_user', JSON.stringify(user));
          }
          this.currentUser.set(user);
        })
      );
  }

  // Helper para detectar ejecución en navegador (evitar errores en SSR)
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Verificar si el token es válido
  verifyToken(): Observable<{ valid: boolean }> {
    return this.http.get<{ valid: boolean }>(`${this.apiUrl}/verify`);
  }
}