import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaintenanceService } from '../../../services/maintenance.service';
import { CarsService } from '../../../services/cars.service';
import { Maintenance, MaintenanceItem } from '../../../models/maintenance.model';
import { Car } from '../../../models/car.model';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';

interface MaintenanceFormData {
  carId: number;
  types: string[];
  startDate: string;
  endDate: string;
  mechanic: string;
  items: MaintenanceItem[];
  status: 'en_proceso' | 'completado' | 'programado';
  notes: string;
}

@Component({
  selector: 'app-admin-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './admin-maintenance.component.html',
  styleUrl: './admin-maintenance.component.css'
})
export class AdminMaintenanceComponent implements OnInit {
  maintenances = signal<Maintenance[]>([]);
  availableCars = signal<Car[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  showModal = signal(false);
  editingMaintenance = signal<Maintenance | null>(null);
  filterStatus: 'all' | 'en_proceso' | 'completado' | 'programado' = 'all';

  maintenanceTypes = [
    'Preventivo',
    'Correctivo',
    'Revisión General',
    'Cambio de Aceite',
    'Cambio de Filtros',
    'Sistema de Frenos',
    'Alineación',
    'Balanceo'
  ];

  itemCategories = [
    'Aceite',
    'Filtros',
    'Frenos',
    'Llantas',
    'Suspensión',
    'Batería',
    'Transmisión',
    'Motor',
    'Electricidad',
    'Carrocería'
  ];

  formData: MaintenanceFormData = {
    carId: 0,
    types: [],
    startDate: '',
    endDate: '',
    mechanic: '',
    items: [],
    status: 'programado',
    notes: ''
  };

  constructor(
    private maintenanceService: MaintenanceService,
    private carsService: CarsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    Promise.all([
      this.maintenanceService.getAllMaintenances().toPromise(),
      this.carsService.getAllCars().toPromise()
    ])
      .then(([maintenances, cars]) => {
        this.maintenances.set(maintenances || []);
        this.availableCars.set(cars || []);
        this.loading.set(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        this.error.set('Error al cargar los datos. Por favor, intenta de nuevo.');
        this.loading.set(false);
      });
  }

  // Filters and Stats
  getFilteredMaintenances(): Maintenance[] {
    if (this.filterStatus === 'all') {
      return this.maintenances();
    }
    return this.maintenances().filter(m => m.status === this.filterStatus);
  }

  getMaintenancesByStatus(status: string): Maintenance[] {
    return this.maintenances().filter(m => m.status === status);
  }

  getTotalSpent(): number {
    return this.maintenances()
      .filter(m => m.status === 'completado')
      .reduce((sum, m) => sum + m.totalCost, 0);
  }

  getCategoryBreakdown(): Array<{ name: string; total: number; count: number }> {
    const breakdown = new Map<string, { total: number; count: number }>();

    this.maintenances().forEach(maintenance => {
      maintenance.items.forEach(item => {
        const current = breakdown.get(item.category) || { total: 0, count: 0 };
        breakdown.set(item.category, {
          total: current.total + item.cost,
          count: current.count + 1
        });
      });
    });

    return Array.from(breakdown.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total);
  }

  // Modal Management
  openModal(maintenance?: Maintenance): void {
    if (maintenance) {
      this.editingMaintenance.set(maintenance);
      this.formData = {
        carId: maintenance.car.id,
        types: [...maintenance.types],
        startDate: maintenance.startDate,
        endDate: maintenance.endDate || '',
        mechanic: maintenance.mechanic,
        items: maintenance.items.map(item => ({ ...item })),
        status: maintenance.status,
        notes: maintenance.notes || ''
      };
    } else {
      this.editingMaintenance.set(null);
      this.resetForm();
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingMaintenance.set(null);
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      carId: 0,
      types: [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      mechanic: '',
      items: [],
      status: 'programado',
      notes: ''
    };
  }

  // Form Management
  toggleMaintenanceType(type: string): void {
    const index = this.formData.types.indexOf(type);
    if (index > -1) {
      this.formData.types.splice(index, 1);
    } else {
      this.formData.types.push(type);
    }
  }

  addItem(): void {
    this.formData.items.push({
      id: Date.now(), // Temporary ID
      category: '',
      description: '',
      cost: 0
    });
  }

  removeItem(index: number): void {
    this.formData.items.splice(index, 1);
  }

  calculateTotal(): number {
    return this.formData.items.reduce((sum, item) => sum + (item.cost || 0), 0);
  }

  // CRUD Operations
  saveMaintenance(): void {
    // Validation
    if (!this.formData.carId) {
      alert('Por favor selecciona un vehículo');
      return;
    }

    if (this.formData.types.length === 0) {
      alert('Por favor selecciona al menos un tipo de mantenimiento');
      return;
    }

    if (!this.formData.mechanic.trim()) {
      alert('Por favor ingresa el nombre del mecánico');
      return;
    }

    if (!this.formData.startDate) {
      alert('Por favor selecciona la fecha de inicio');
      return;
    }

    if (this.formData.items.length === 0) {
      alert('Por favor agrega al menos un item de mantenimiento');
      return;
    }

    // Check items validity
    const invalidItem = this.formData.items.find(
      item => !item.category || !item.description.trim() || item.cost <= 0
    );
    if (invalidItem) {
      alert('Por favor completa todos los items correctamente');
      return;
    }

    this.loading.set(true);

    const maintenanceData = {
      carId: this.formData.carId,
      types: this.formData.types,
      startDate: this.formData.startDate,
      endDate: this.formData.endDate || undefined,
      mechanic: this.formData.mechanic,
      items: this.formData.items,
      totalCost: this.calculateTotal(),
      status: this.formData.status,
      notes: this.formData.notes || undefined
    };

    const operation = this.editingMaintenance()
      ? this.maintenanceService.updateMaintenance(this.editingMaintenance()!.id, maintenanceData)
      : this.maintenanceService.createMaintenance(maintenanceData);

    operation.subscribe({
      next: () => {
        this.loadData();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error saving maintenance:', err);
        alert('Error al guardar el mantenimiento. Por favor, intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }

  completeMaintenance(id: number): void {
    if (!confirm('¿Marcar este mantenimiento como completado?')) {
      return;
    }

    this.loading.set(true);
    this.maintenanceService.updateMaintenanceStatus(id, 'completado').subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => {
        console.error('Error updating status:', err);
        alert('Error al actualizar el estado. Por favor, intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }

  deleteMaintenance(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este mantenimiento?')) {
      return;
    }

    this.loading.set(true);
    this.maintenanceService.deleteMaintenance(id).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => {
        console.error('Error deleting maintenance:', err);
        alert('Error al eliminar el mantenimiento. Por favor, intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }

  // Utility Methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'en_proceso': 'En Proceso',
      'completado': 'Completado',
      'programado': 'Programado'
    };
    return statusMap[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'en_proceso': 'badge-warning',
      'completado': 'badge-success',
      'programado': 'badge-info'
    };
    return classMap[status] || '';
  }
}
