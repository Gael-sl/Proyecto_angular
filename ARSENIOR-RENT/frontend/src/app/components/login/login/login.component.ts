import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NavbarComponent } from '../../shared/navbar/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer/footer.component';
import { LoginRequest } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };

  loading = false;
  error = '';
  returnUrl = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Obtener la URL de retorno si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        
        // Redirigir según el rol
        if (response.user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate([this.returnUrl]);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      }
    });
  }
}