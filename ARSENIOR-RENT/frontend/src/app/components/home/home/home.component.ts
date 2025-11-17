import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  howItWorksSteps = [
    {
      number: '01',
      title: 'Inicia tu Experiencia',
      description: 'Explora nuestro catálogo premium y selecciona el vehículo perfecto para tu viaje.'
    },
    {
      number: '02',
      title: 'Personaliza tu Plan',
      description: 'Elige entre nuestros planes Base o Premier y agrega equipamiento extra a tu medida.'
    },
    {
      number: '03',
      title: 'Confirma y Conduce',
      description: 'Realiza el pago de anticipo mediante código QR y recoge tu vehículo en nuestra sucursal.'
    }
  ];

  features = [
    {
      icon: '🚗',
      title: 'Flota Premium',
      description: 'Vehículos de lujo y alta gama, perfectamente mantenidos y equipados.'
    },
    {
      icon: '⭐',
      title: 'Sistema de Calificaciones',
      description: 'Transparencia total con calificaciones bidireccionales entre usuarios y vehículos.'
    },
    {
      icon: '📍',
      title: 'Tracking en Tiempo Real',
      description: 'Monitoreo GPS de tu vehículo para tu seguridad y tranquilidad.'
    },
    {
      icon: '💳',
      title: 'Pago Seguro con QR',
      description: 'Sistema de pagos moderno y seguro con códigos QR.'
    }
  ];

  ngOnInit(): void {
    // Scroll to top on component load (only in browser)
    if (typeof window !== 'undefined' && window?.scrollTo) {
      window.scrollTo(0, 0);
    }
  }
}