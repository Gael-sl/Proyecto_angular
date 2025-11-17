import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { NavbarComponent } from '../../shared/navbar/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer/footer.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner/loading-spinner.component';
import { DashboardStats } from '../../../models/stats.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  loading = signal(true);
  error = signal('');

  readonly Math = Math;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading.set(true);
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar estadísticas');
        this.loading.set(false);
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  }

  getGrowthClass(growth: number): string {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  }

  getGrowthIcon(growth: number): string {
    return growth >= 0 ? '↑' : '↓';
  }
}