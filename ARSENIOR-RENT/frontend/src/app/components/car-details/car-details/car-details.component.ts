import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarsService } from '../../../services/cars.service';
import { AuthService } from '../../../services/auth.service';
import { NavbarComponent } from '../../shared/navbar/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer/footer.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner/loading-spinner.component';
import { Car } from '../../../models/car.model';
import { ExtraEquipment, DEFAULT_EXTRAS } from '../../../models/extra.model';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {
  car = signal<Car | null>(null);
  loading = signal(true);
  error = signal('');

  // Dates
  startDate = '';
  endDate = '';
  totalDays = 0;

  // Plan selection
  selectedPlan: 'Regular' | 'Premium' = 'Regular';

  // Extras
  availableExtras: ExtraEquipment[] = DEFAULT_EXTRAS;
  selectedExtras: { [key: number]: number } = {};

  // Pricing
  subtotal = 0;
  extrasTotal = 0;
  total = 0;

  constructor(
    private carsService: CarsService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const carId = this.route.snapshot.params['id'];
    this.loadCarDetails(carId);
  }

  loadCarDetails(id: number): void {
    this.loading.set(true);
    this.carsService.getCarById(id).subscribe({
      next: (data) => {
        this.car.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('No se pudo cargar el vehículo');
        this.loading.set(false);
      }
    });
  }

  calculateTotal(): void {
    const car = this.car();
    if (!car || !this.startDate || !this.endDate) return;

    // Calculate days
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diff = end.getTime() - start.getTime();
    this.totalDays = Math.ceil(diff / (1000 * 3600 * 24));

    if (this.totalDays <= 0) {
      this.totalDays = 0;
      this.subtotal = 0;
      this.total = 0;
      return;
    }

    // Subtotal
    this.subtotal = car.pricePerDay * this.totalDays;

    // Plan Premium adds 20%
    if (this.selectedPlan === 'Premium') {
      this.subtotal *= 1.2;
    }

    // Extras
    this.extrasTotal = 0;
    Object.keys(this.selectedExtras).forEach(key => {
      const extraId = parseInt(key);
      const quantity = this.selectedExtras[extraId];
      if (quantity > 0) {
        const extra = this.availableExtras.find(e => e.id === extraId);
        if (extra) {
          this.extrasTotal += extra.price * quantity;
        }
      }
    });

    this.total = this.subtotal + this.extrasTotal;
  }

  get minDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  toggleExtra(extraId: number): void {
    if (this.selectedExtras[extraId]) {
      this.selectedExtras[extraId]++;
    } else {
      this.selectedExtras[extraId] = 1;
    }
    this.calculateTotal();
  }

  removeExtra(extraId: number): void {
    if (this.selectedExtras[extraId] > 0) {
      this.selectedExtras[extraId]--;
      if (this.selectedExtras[extraId] === 0) {
        delete this.selectedExtras[extraId];
      }
    }
    this.calculateTotal();
  }

  proceedToCheckout(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/car/${this.car()?.id}` }
      });
      return;
    }

    if (!this.startDate || !this.endDate || this.totalDays <= 0) {
      alert('Por favor selecciona fechas válidas');
      return;
    }

    // Guardar en localStorage para el checkout
    const checkoutData = {
      car: this.car(),
      startDate: this.startDate,
      endDate: this.endDate,
      plan: this.selectedPlan,
      extras: this.getSelectedExtrasArray(),
      totalDays: this.totalDays,
      subtotal: this.subtotal,
      extrasTotal: this.extrasTotal,
      total: this.total
    };

    localStorage.setItem('checkout_data', JSON.stringify(checkoutData));
    this.router.navigate(['/checkout', this.car()?.id]);
  }

  getSelectedExtrasArray() {
    const extras: any[] = [];
    Object.keys(this.selectedExtras).forEach(key => {
      const extraId = parseInt(key);
      const quantity = this.selectedExtras[extraId];
      if (quantity > 0) {
        const extra = this.availableExtras.find(e => e.id === extraId);
        if (extra) {
          extras.push({
            id: extra.id,
            name: extra.name,
            price: extra.price,
            quantity: quantity
          });
        }
      }
    });
    return extras;
  }

  getStarRating(rating: number): string[] {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < Math.round(rating) ? '★' : '☆');
    }
    return stars;
  }

  getSegmentLabel(segment: string): string {
    const labels: { [key: string]: string } = {
      'A': 'Premium',
      'B': 'Standard',
      'C': 'Basic'
    };
    return labels[segment] || segment;
  }
}