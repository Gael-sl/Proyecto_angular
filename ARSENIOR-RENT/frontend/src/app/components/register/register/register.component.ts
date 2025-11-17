import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NavbarComponent } from '../../shared/navbar/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer/footer.component';
import { RegisterRequest } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData: RegisterRequest = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  };

  confirmPassword = '';
  loading = false;
  error = '';
  success = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Validaciones
    if (!this.formData.email || !this.formData.password || 
        !this.formData.firstName || !this.formData.lastName || 
        !this.formData.phone) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    if (this.formData.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    if (this.formData.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.formData).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/catalog']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al registrar. Intenta de nuevo.';
      }
    });
  }
}