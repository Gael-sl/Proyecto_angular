import { Component, OnInit, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrackingService } from '../../../services/tracking.service';
import { NavbarComponent } from '../../shared/navbar/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer/footer.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner/loading-spinner.component';
import { ActiveRental } from '../../../models/tracking.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-admin-tracking',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './admin-tracking.component.html',
  styleUrls: ['./admin-tracking.component.css']
})
export class AdminTrackingComponent implements OnInit, AfterViewInit {
  activeRentals = signal<ActiveRental[]>([]);
  loading = signal(true);
  error = signal('');

  private map: L.Map | null = null;
  private markers: L.Marker[] = [];

  constructor(private trackingService: TrackingService) {}

  ngOnInit(): void {
    this.loadActiveRentals();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    // Inicializar mapa centrado en México
    this.map = L.map('map').setView([23.6345, -102.5528], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }


  formatTimestamp(ts?: string): string {
    if (!ts) return '';
    return new Date(ts).toLocaleString();
  }
  loadActiveRentals(): void {
    this.loading.set(true);
    this.trackingService.getActiveRentals().subscribe({
      next: (data) => {
        this.activeRentals.set(data);
        this.loading.set(false);
        this.updateMarkers();
      },
      error: (err) => {
        this.error.set('Error al cargar tracking');
        this.loading.set(false);
      }
    });
  }

  updateMarkers(): void {
    if (!this.map) return;

    // Limpiar markers anteriores
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Agregar nuevos markers
    this.activeRentals().forEach(rental => {
      if (rental.currentLocation && this.map) {
        const marker = L.marker([
          rental.currentLocation.latitude,
          rental.currentLocation.longitude
        ]).addTo(this.map);

        marker.bindPopup(`
          <div class="p-2">
            <p class="font-semibold">${rental.car.brand} ${rental.car.model}</p>
            <p class="text-sm text-gray-600">${rental.user.firstName} ${rental.user.lastName}</p>
            <p class="text-xs text-gray-500">Última actualización: ${new Date(rental.currentLocation.timestamp).toLocaleString()}</p>
          </div>
        `);

        this.markers.push(marker);
      }
    });
  }

  refreshData(): void {
    this.loadActiveRentals();
  }
}