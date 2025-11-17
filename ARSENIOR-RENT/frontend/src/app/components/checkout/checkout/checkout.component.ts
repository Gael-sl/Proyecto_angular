import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReservationsService } from '../../../services/reservations.service';
import { NavbarComponent } from '../../shared/navbar/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer/footer.component';
import QRCode from 'qrcode';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutData: any = null;
  qrCodeUrl = signal('');
  loading = signal(false);
  success = signal(false);
  error = signal('');

  constructor(
    private reservationsService: ReservationsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Recuperar datos del checkout
    const data = localStorage.getItem('checkout_data');
    if (!data) {
      this.router.navigate(['/catalog']);
      return;
    }
    this.checkoutData = JSON.parse(data);
    this.generateQRCode();
  }

  async generateQRCode(): Promise<void> {
    try {
      const paymentInfo = `ARSENIOR-RENT-PAGO:${this.checkoutData.total * 0.3}:${new Date().getTime()}`;
      const qrUrl = await QRCode.toDataURL(paymentInfo, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      this.qrCodeUrl.set(qrUrl);
    } catch (err) {
      console.error('Error generando QR:', err);
    }
  }

  confirmReservation(): void {
    this.loading.set(true);
    this.error.set('');

    const reservationData = {
      carId: this.checkoutData.car.id,
      startDate: this.checkoutData.startDate,
      endDate: this.checkoutData.endDate,
      plan: this.checkoutData.plan,
      extras: this.checkoutData.extras
    };

    this.reservationsService.createReservation(reservationData).subscribe({
      next: (reservation) => {
        this.loading.set(false);
        this.success.set(true);
        localStorage.removeItem('checkout_data');
        
        // Simular confirmación de pago con QR
        setTimeout(() => {
          this.confirmPayment(reservation.id);
        }, 2000);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al crear la reserva');
      }
    });
  }

  confirmPayment(reservationId: number): void {
    this.reservationsService.confirmDeposit(reservationId, this.qrCodeUrl()).subscribe({
      next: () => {
        setTimeout(() => {
          this.router.navigate(['/my-reservations']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error confirmando pago:', err);
      }
    });
  }
}