import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarsService } from '../../../services/cars.service';
import { NavbarComponent } from '../../shared/navbar/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer/footer.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner/loading-spinner.component';
import { Car, CarFilters } from '../../../models/car.model';

@Component({
  selector: 'app-car-catalog',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './car-catalog.component.html',
  styleUrls: ['./car-catalog.component.css']
})
export class CarCatalogComponent implements OnInit {
  cars = signal<Car[]>([]);
  filteredCars = signal<Car[]>([]);
  loading = signal(true);
  error = signal('');

  // Filtros
  filters: CarFilters = {
    segment: undefined,
    transmission: undefined,
    minSeats: undefined
  };

  selectedSegment = '';
  selectedTransmission = '';
  selectedSeats = '';

  constructor(private carsService: CarsService) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.loading.set(true);
    this.carsService.getAllCars().subscribe({
      next: (data) => {
        this.cars.set(data);
        this.filteredCars.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar el catálogo');
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    let filtered = this.cars();

    if (this.selectedSegment) {
      filtered = filtered.filter(car => car.segment === this.selectedSegment);
    }

    if (this.selectedTransmission) {
      filtered = filtered.filter(car => car.transmission === this.selectedTransmission);
    }

    if (this.selectedSeats) {
      const minSeats = parseInt(this.selectedSeats);
      filtered = filtered.filter(car => car.seats >= minSeats);
    }

    this.filteredCars.set(filtered);
  }

  clearFilters(): void {
    this.selectedSegment = '';
    this.selectedTransmission = '';
    this.selectedSeats = '';
    this.filteredCars.set(this.cars());
  }

  getSegmentLabel(segment: string): string {
    const labels: { [key: string]: string } = {
      'A': 'Premium',
      'B': 'Standard',
      'C': 'Basic'
    };
    return labels[segment] || segment;
  }

  getStarRating(rating: number): string[] {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < Math.round(rating) ? '★' : '☆');
    }
    return stars;
  }
}