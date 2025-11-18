import React, { useState } from 'react';
import { 
  Car as CarIcon, 
  Users, 
  Star, 
  BarChart3, 
  LogOut, 
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Navigation,
  CheckCircle,
  AlertCircle,
  Wrench,
  FileText,
  Menu
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Car, User } from '../App';

interface AdminDashboardProps {
  cars: Car[];
  onLogout: () => void;
  currentUser: User;
}

interface ActiveRental {
  id: string;
  carId: string;
  carName: string;
  customerName: string;
  startDate: string;
  endDate: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'en_ruta' | 'estacionado' | 'regresando';
}

interface Reservation {
  id: string;
  carId: string;
  carName: string;
  customerName: string;
  pickupDate: string;
  returnDate: string;
  status: 'confirmada' | 'pendiente' | 'cancelada';
  totalAmount: number;
}

export function AdminDashboard({ cars, onLogout, currentUser }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  // Mock data para las diferentes secciones
  const activeRentals: ActiveRental[] = [
    {
      id: '1',
      carId: '1',
      carName: 'BMW Serie 3 2024',
      customerName: 'María González',
      startDate: '2024-01-15',
      endDate: '2024-01-18',
      currentLocation: {
        lat: 25.6866,
        lng: -100.3161,
        address: 'Centro de Monterrey, N.L.'
      },
      status: 'en_ruta'
    },
    {
      id: '2',
      carId: '2',
      carName: 'Mercedes-Benz Clase C',
      customerName: 'Carlos Rodríguez',
      startDate: '2024-01-14',
      endDate: '2024-01-16',
      currentLocation: {
        lat: 25.7617,
        lng: -100.4013,
        address: 'San Pedro Garza García, N.L.'
      },
      status: 'estacionado'
    }
  ];

  const reservations: Reservation[] = [
    {
      id: '1',
      carId: '1',
      carName: 'BMW Serie 3 2024',
      customerName: 'Ana Martínez',
      pickupDate: '2024-01-20',
      returnDate: '2024-01-23',
      status: 'confirmada',
      totalAmount: 3600
    },
    {
      id: '2',
      carId: '3',
      carName: 'Audi A4 2023',
      customerName: 'Luis Hernández',
      pickupDate: '2024-01-22',
      returnDate: '2024-01-25',
      status: 'pendiente',
      totalAmount: 3300
    }
  ];

  const userReviews = [
    {
      id: '1',
      userName: 'María González',
      carName: 'BMW Serie 3',
      rating: 5,
      comment: 'Excelente vehículo, muy cómodo y en perfectas condiciones.',
      date: '2024-01-15'
    },
    {
      id: '2',
      userName: 'Carlos Rodríguez',
      carName: 'Mercedes-Benz Clase C',
      rating: 4,
      comment: 'Buen servicio, aunque el proceso de entrega fue un poco lento.',
      date: '2024-01-12'
    }
  ];

  const customerRatings = [
    {
      id: '1',
      userName: 'María González',
      carName: 'BMW Serie 3',
      adminRating: 5,
      adminComment: 'Cliente excelente, vehículo devuelto en perfectas condiciones.',
      date: '2024-01-15',
      damageReport: false
    },
    {
      id: '2',
      userName: 'Luis Hernández',
      carName: 'Audi A4',
      adminRating: 2,
      adminComment: 'Rayones menores en la puerta del conductor.',
      date: '2024-01-08',
      damageReport: true
    }
  ];

  const getStatusColor = (status: Car['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rented':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-600 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Car['status']) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'rented':
        return 'Rentado';
      case 'maintenance':
        return 'Mantenimiento';
      case 'inactive':
        return 'Dado de baja';
      default:
        return 'Desconocido';
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'inventario', label: 'Inventario', icon: CarIcon },
    { id: 'reservas', label: 'Reservas', icon: Calendar },
    { id: 'rentas', label: 'Rentas activas', icon: MapPin },
    { id: 'calificaciones-vehiculos', label: 'Calificaciones de vehículos', icon: Star },
    { id: 'calificaciones-usuarios', label: 'Calificaciones de usuarios', icon: Users },
    { id: 'mantenimiento', label: 'Mantenimiento', icon: Wrench },
    { id: 'reportes', label: 'Reportes', icon: FileText }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h1 className="font-serif text-2xl text-black">Reportes y Analytics</h1>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Ingresos del mes */}
              <Card className="p-6 bg-white border-gray-200/50 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                      <DollarSign size={18} />
                      <span className="text-sm">Ingresos del mes</span>
                    </div>
                    <div className="text-3xl font-serif text-black mb-1">$45,230</div>
                    <div className="flex items-center space-x-1">
                      <span className="text-green-600 text-sm">+12%</span>
                      <TrendingUp size={14} className="text-green-600" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Reservas completadas */}
              <Card className="p-6 bg-white border-gray-200/50 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                      <CheckCircle size={18} />
                      <span className="text-sm">Reservas completadas</span>
                    </div>
                    <div className="text-3xl font-serif text-black mb-1">34</div>
                    <div className="flex items-center space-x-1">
                      <span className="text-green-600 text-sm">+8%</span>
                      <TrendingUp size={14} className="text-green-600" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Nuevos clientes */}
              <Card className="p-6 bg-white border-gray-200/50 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                      <Users size={18} />
                      <span className="text-sm">Nuevos clientes</span>
                    </div>
                    <div className="text-3xl font-serif text-black mb-1">12</div>
                    <div className="flex items-center space-x-1">
                      <span className="text-green-600 text-sm">+15%</span>
                      <TrendingUp size={14} className="text-green-600" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Tasa de ocupación */}
              <Card className="p-6 bg-white border-gray-200/50 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                      <BarChart3 size={18} />
                      <span className="text-sm">Tasa de ocupación</span>
                    </div>
                    <div className="text-3xl font-serif text-black mb-1">78%</div>
                    <div className="flex items-center space-x-1">
                      <span className="text-green-600 text-sm">+5%</span>
                      <TrendingUp size={14} className="text-green-600" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Vehículos más rentados */}
            <Card className="p-6 bg-white border-gray-200/50">
              <h2 className="font-serif text-xl text-black mb-6">Vehículos más rentados</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-black mb-1">Toyota Sienna 2022</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-stone-800 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="ml-4 text-black font-medium">12</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-black mb-1">Nissan X-Trail 2020</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-stone-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div className="ml-4 text-black font-medium">10</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-black mb-1">BMW Serie 3 2024</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-stone-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div className="ml-4 text-black font-medium">8</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-black mb-1">Mercedes-Benz Clase C 2024</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-stone-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div className="ml-4 text-black font-medium">6</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-black mb-1">Nissan March 2021</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-stone-300 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div className="ml-4 text-black font-medium">4</div>
                </div>
              </div>
            </Card>

            {/* Rendimiento por período */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-white border-gray-200/50">
                <h2 className="font-serif text-xl text-black mb-6">Rendimiento Mensual</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Octubre 2024</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-black font-medium">$45,230</span>
                      <Badge className="bg-green-100 text-green-800">+12%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Septiembre 2024</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-black font-medium">$40,420</span>
                      <Badge className="bg-green-100 text-green-800">+8%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Agosto 2024</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-black font-medium">$37,590</span>
                      <Badge className="bg-red-100 text-red-800">-3%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600">Julio 2024</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-black font-medium">$38,780</span>
                      <Badge className="bg-green-100 text-green-800">+15%</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border-gray-200/50">
                <h2 className="font-serif text-xl text-black mb-6">Satisfacción del Cliente</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Calificación Promedio</span>
                      <span className="text-2xl font-serif text-black">4.7</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} className={`${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">(1,247 reseñas)</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">5 estrellas</span>
                      </div>
                      <div className="flex items-center space-x-2 flex-1 ml-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '68%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600 w-10">68%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">4 estrellas</span>
                      </div>
                      <div className="flex items-center space-x-2 flex-1 ml-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '22%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600 w-10">22%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">3 estrellas</span>
                      </div>
                      <div className="flex items-center space-x-2 flex-1 ml-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '7%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600 w-10">7%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">2 estrellas</span>
                      </div>
                      <div className="flex items-center space-x-2 flex-1 ml-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-400 h-2 rounded-full" style={{ width: '2%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600 w-10">2%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">1 estrella</span>
                      </div>
                      <div className="flex items-center space-x-2 flex-1 ml-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-400 h-2 rounded-full" style={{ width: '1%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600 w-10">1%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Análisis detallado */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 bg-white border-gray-200/50">
                <h3 className="font-serif text-lg text-black mb-4">Estado de Flota</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Disponibles</span>
                    </div>
                    <span className="text-black font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Rentados</span>
                    </div>
                    <span className="text-black font-medium">1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Mantenimiento</span>
                    </div>
                    <span className="text-black font-medium">1</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border-gray-200/50">
                <h3 className="font-serif text-lg text-black mb-4">Tendencias</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Día más rentable</span>
                    <span className="text-black font-medium">Viernes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Horario pico</span>
                    <span className="text-black font-medium">2:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duración promedio</span>
                    <span className="text-black font-medium">3.2 días</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border-gray-200/50">
                <h3 className="font-serif text-lg text-black mb-4">Proyecciones</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ingresos meta</span>
                    <span className="text-black font-medium">$50,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Progreso</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      <span className="text-black font-medium text-sm">90%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Días restantes</span>
                    <span className="text-black font-medium">27</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'inventario':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="font-serif text-2xl text-black">Inventario</h1>
              <Button 
                className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto"
                onClick={() => setShowAddVehicle(true)}
              >
                <Plus size={16} className="mr-2" />
                Agregar vehículo
              </Button>
            </div>
            
            <div className="grid gap-4">
              {cars.map((car) => (
                <Card key={car.id} className="p-6 bg-white border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-black">{car.brand} {car.model} {car.year}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-gray-600 gap-1 sm:gap-0">
                        <span>Categoría: {car.type}</span>
                        <span>Placa: ABC-{car.id.padStart(3, '0')}</span>
                        <span>Año: {car.year}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-4">
                      <Badge className={getStatusColor(car.status)}>
                        {getStatusText(car.status)}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit size={16} className="text-gray-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className={car.status === 'inactive' ? 'text-green-600' : 'text-red-600'}
                        >
                          {car.status === 'inactive' ? (
                            <CheckCircle size={16} />
                          ) : (
                            <AlertCircle size={16} />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'reservas':
        return (
          <div className="space-y-6">
            <h1 className="font-serif text-2xl text-black">Reservas</h1>
            <div className="grid gap-4">
              {reservations.map((reservation) => (
                <Card key={reservation.id} className="p-6 bg-white border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-black">{reservation.carName}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-gray-600 gap-1 sm:gap-0">
                        <span>Cliente: {reservation.customerName}</span>
                        <span>{reservation.pickupDate} - {reservation.returnDate}</span>
                        <span>${reservation.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    <Badge className={reservation.status === 'confirmada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {reservation.status === 'confirmada' ? 'Confirmada' : 'Pendiente'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'rentas':
        return (
          <div className="space-y-6">
            <h1 className="font-serif text-2xl text-black">Rentas activas</h1>
            
            {/* Mapa en tiempo real (simulado) */}
            <Card className="p-6 bg-white border-gray-200">
              <h3 className="font-serif text-lg text-black mb-4">Mapa en tiempo real</h3>
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Mapa de vehículos en tiempo real</p>
                  <p className="text-sm text-gray-500">{activeRentals.length} vehículos activos</p>
                </div>
              </div>
            </Card>

            <div className="grid gap-4">
              {activeRentals.map((rental) => (
                <Card key={rental.id} className="p-6 bg-white border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-black">{rental.carName}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-gray-600 gap-1 sm:gap-0">
                        <span>Cliente: {rental.customerName}</span>
                        <span>Ubicación: {rental.currentLocation.address}</span>
                        <span>{rental.startDate} - {rental.endDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-2">
                      <Badge className={rental.status === 'en_ruta' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                        {rental.status === 'en_ruta' ? 'En ruta' : 'Estacionado'}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MapPin size={16} className="text-gray-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'calificaciones-vehiculos':
        return (
          <div className="space-y-6">
            <h1 className="font-serif text-2xl text-black">Calificaciones de vehículos</h1>
            <div className="grid gap-4">
              {userReviews.map((review) => (
                <Card key={review.id} className="p-6 bg-white border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-black">{review.userName}</p>
                        <p className="text-gray-600 text-sm">{review.carName}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? "text-black fill-current" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <p className="text-gray-500 text-sm">{review.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">"{review.comment}"</p>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'calificaciones-usuarios':
        return (
          <div className="space-y-6">
            <h1 className="font-serif text-2xl text-black">Calificaciones de usuarios</h1>
            <div className="grid gap-4">
              {customerRatings.map((rating) => (
                <Card key={rating.id} className="p-6 bg-white border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-black">{rating.userName}</p>
                        <p className="text-gray-600 text-sm">{rating.carName}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < rating.adminRating ? "text-black fill-current" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <p className="text-gray-500 text-sm">{rating.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">"{rating.adminComment}"</p>
                  <div className="flex items-center space-x-4">
                    {rating.damageReport ? (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle size={16} />
                        <span className="text-sm">Reporte de daños</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle size={16} />
                        <span className="text-sm">Sin daños</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'mantenimiento':
        return (
          <div className="space-y-6">
            <h1 className="font-serif text-2xl text-black">Mantenimiento</h1>
            <div className="grid gap-4">
              {cars.filter(car => car.status === 'maintenance').map((car) => (
                <Card key={car.id} className="p-6 bg-white border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-black">{car.brand} {car.model} {car.year}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-gray-600 gap-1 sm:gap-0">
                        <span>Tipo: {car.type}</span>
                        <span>Fecha inicio: 15/01/2024</span>
                        <span>Estimado: 3 días</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-4">
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        En mantenimiento
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit size={16} className="text-gray-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'reportes':
        return (
          <div className="space-y-6">
            <h1 className="font-serif text-2xl text-black">Reportes</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-white border-gray-200">
                <h3 className="font-serif text-lg text-black mb-4">Ingresos Mensuales</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Enero 2024</span>
                    <span className="text-black">$385,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diciembre 2023</span>
                    <span className="text-black">$320,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Noviembre 2023</span>
                    <span className="text-black">$298,000</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border-gray-200">
                <h3 className="font-serif text-lg text-black mb-4">Vehículos Populares</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">BMW Serie 3</span>
                    <span className="text-black">89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mercedes Clase C</span>
                    <span className="text-black">76%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Audi A4</span>
                    <span className="text-black">63%</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-transparent z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-lg text-black">Arsenior Rent</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            ×
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-black text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={20} className="mr-3 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <LogOut size={16} />
            <span>Salir</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu size={20} />
              </Button>
              <h2 className="font-serif text-xl text-black">Admin</h2>
            </div>
            <div className="flex items-center space-x-4">
              <LogOut size={20} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6">
          {renderContent()}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Add Vehicle Modal */}
      <Dialog open={showAddVehicle} onOpenChange={setShowAddVehicle}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-black">Agregar Nuevo Vehículo</DialogTitle>
          </DialogHeader>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Marca */}
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Input id="brand" placeholder="ej. Toyota" />
              </div>

              {/* Modelo */}
              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input id="model" placeholder="ej. Corolla" />
              </div>

              {/* Año */}
              <div className="space-y-2">
                <Label htmlFor="year">Año</Label>
                <Input id="year" type="number" placeholder="2024" min="2000" max="2025" />
              </div>

              {/* Tipo */}
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedán Premium">Sedán Premium</SelectItem>
                    <SelectItem value="Sedán Ejecutivo">Sedán Ejecutivo</SelectItem>
                    <SelectItem value="Sedán Compacto">Sedán Compacto</SelectItem>
                    <SelectItem value="Minivan Familiar">Minivan Familiar</SelectItem>
                    <SelectItem value="Compacto Urbano">Compacto Urbano</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transmisión */}
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmisión</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar transmisión" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automática">Automática</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Combustible */}
              <div className="space-y-2">
                <Label htmlFor="fuel">Combustible</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar combustible" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gasolina">Gasolina</SelectItem>
                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                    <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Asientos */}
              <div className="space-y-2">
                <Label htmlFor="seats">Asientos</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Número de asientos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 asientos</SelectItem>
                    <SelectItem value="5">5 asientos</SelectItem>
                    <SelectItem value="7">7 asientos</SelectItem>
                    <SelectItem value="8">8 asientos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Precio por día */}
              <div className="space-y-2">
                <Label htmlFor="price">Precio por día (MXN)</Label>
                <Input id="price" type="number" placeholder="450" min="0" />
              </div>
            </div>

            {/* URL de imagen */}
            <div className="space-y-2">
              <Label htmlFor="image">URL de imagen</Label>
              <Input id="image" placeholder="https://images.unsplash.com/..." />
            </div>

            {/* Características */}
            <div className="space-y-2">
              <Label htmlFor="features">Características (separadas por coma)</Label>
              <Input id="features" placeholder="Aire Acondicionado, GPS, Bluetooth" />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddVehicle(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-black hover:bg-gray-800 text-white"
              >
                <Plus size={16} className="mr-2" />
                Agregar Vehículo
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}