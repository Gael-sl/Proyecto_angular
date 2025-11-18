import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { AdminDashboard } from './components/AdminDashboard';
import { CarCatalog } from './components/CarCatalog';
import { CarDetails } from './components/CarDetails';
import { VehicleSearch } from './components/VehicleSearch';
import { MyRental } from './components/MyRental';
import { ReservationConfirmation } from './components/ReservationConfirmation';
import { AuthModal } from './components/AuthModal';

export type User = {
  id: string;
  name: string;
  email: string;
  type: 'user' | 'admin';
};

export type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  image: string;
  pricePerDay: number;
  rating: number;
  reviews: number;
  features: string[];
  status: 'available' | 'rented' | 'maintenance' | 'inactive';
  transmission: string;
  fuel: string;
  seats: number;
};

export type Plan = 'base' | 'premier';

export type Reservation = {
  id: string;
  carId: string;
  userId: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  plan: Plan;
  extras: string[];
  totalCost: number;
  status: 'active' | 'completed' | 'cancelled';
};

export type Review = {
  id: string;
  carId: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
  userName: string;
};

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'search' | 'details' | 'rental' | 'confirmation' | 'admin'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [reservationData, setReservationData] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);

  // Mock data
  const cars: Car[] = [
    {
      id: '1',
      brand: 'BMW',
      model: 'Serie 3',
      year: 2024,
      type: 'Sedán Premium',
      image: 'https://images.unsplash.com/photo-1547731269-e4073e054f12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc2VkYW4lMjBsdXh1cnl8ZW58MXx8fHwxNzU5NDcxOTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      pricePerDay: 1200,
      rating: 4.8,
      reviews: 234,
      features: ['Aire Acondicionado', 'GPS', 'Bluetooth', 'Cámara Trasera'],
      status: 'available',
      transmission: 'Automática',
      fuel: 'Gasolina',
      seats: 5
    },
    {
      id: '2',
      brand: 'Mercedes-Benz',
      model: 'Clase C',
      year: 2024,
      type: 'Sedán Ejecutivo',
      image: 'https://images.unsplash.com/photo-1758193431355-54df41421657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBjYXIlMjBleHRlcmlvcnxlbnwxfHx8fDE3NTk1NTUyMDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      pricePerDay: 1500,
      rating: 4.9,
      reviews: 186,
      features: ['Aire Acondicionado', 'GPS', 'Bluetooth', 'Asientos de Cuero'],
      status: 'rented',
      transmission: 'Automática',
      fuel: 'Híbrido',
      seats: 5
    },
    {
      id: '3',
      brand: 'Audi',
      model: 'A4',
      year: 2023,
      type: 'Sedán Premium',
      image: 'https://images.unsplash.com/photo-1758411897872-5c710b8f55bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBpbnRlcmlvciUyMHByZW1pdW18ZW58MXx8fHwxNzU5NTU1MjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      pricePerDay: 1100,
      rating: 4.7,
      reviews: 298,
      features: ['Aire Acondicionado', 'GPS', 'Sistema de Sonido Premium'],
      status: 'maintenance',
      transmission: 'Manual',
      fuel: 'Gasolina',
      seats: 5
    },
    {
      id: '4',
      brand: 'Toyota',
      model: 'Sienna',
      year: 2020,
      type: 'Minivan Familiar',
      image: 'https://images.unsplash.com/photo-1748621019980-8c9278b61974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3lvdGElMjBzaWVubmElMjBtaW5pdmFuJTIwMjAyMHxlbnwxfHx8fDE3NTk1NjA1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      pricePerDay: 900,
      rating: 4.6,
      reviews: 142,
      features: ['Aire Acondicionado', 'GPS', 'Bluetooth', 'Puertas Eléctricas', 'Pantallas Traseras'],
      status: 'available',
      transmission: 'Automática',
      fuel: 'Gasolina',
      seats: 8
    },
    {
      id: '5',
      brand: 'Nissan',
      model: 'March',
      year: 2021,
      type: 'Compacto Urbano',
      image: 'https://images.unsplash.com/photo-1687730594701-88cdea1ef5ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaXNzYW4lMjBtYXJjaCUyMGNvbXBhY3QlMjBjYXIlMjAyMDIxfGVufDF8fHx8MTc1OTU2MDU5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      pricePerDay: 450,
      rating: 4.3,
      reviews: 89,
      features: ['Aire Acondicionado', 'Bluetooth', 'Sistema de Entretenimiento'],
      status: 'available',
      transmission: 'Manual',
      fuel: 'Gasolina',
      seats: 5
    },
    {
      id: '6',
      brand: 'Honda',
      model: 'Civic',
      year: 2019,
      type: 'Sedán Compacto',
      image: 'https://images.unsplash.com/photo-1548204467-e1dd7c65529b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25kYSUyMGNpdmljJTIwc2VkYW4lMjAyMDE5fGVufDF8fHx8MTc1OTU2MDYwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      pricePerDay: 600,
      rating: 4.4,
      reviews: 156,
      features: ['Aire Acondicionado', 'Bluetooth', 'Control de Crucero'],
      status: 'inactive',
      transmission: 'Automática',
      fuel: 'Gasolina',
      seats: 5
    }
  ];

  const handleViewCar = (car: Car) => {
    setSelectedCar(car);
    setCurrentView('details');
  };

  const handleSelectCarFromSearch = (car: Car) => {
    setSelectedCar(car);
    setCurrentView('details');
  };

  const handleReservationComplete = (data: any) => {
    setReservationData(data);
    setCurrentView('confirmation');
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowAuth(false);
    if (user.type === 'admin') {
      setCurrentView('admin');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      {currentView === 'home' && (
        <HomePage
          onViewCatalog={() => setCurrentView('catalog')}
          onViewSearch={() => setCurrentView('search')}
          onViewRental={() => setCurrentView('rental')}
          onShowAuth={() => setShowAuth(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'catalog' && (
        <CarCatalog
          cars={cars}
          onViewCar={handleViewCar}
          onBack={() => setCurrentView('home')}
          currentUser={currentUser}
          onShowAuth={() => setShowAuth(true)}
        />
      )}

      {currentView === 'search' && (
        <VehicleSearch
          cars={cars}
          onBack={() => setCurrentView('home')}
          onSelectCar={handleSelectCarFromSearch}
          currentUser={currentUser}
          onShowAuth={() => setShowAuth(true)}
        />
      )}

      {currentView === 'rental' && (
        <MyRental
          onBack={() => setCurrentView('home')}
          currentUser={currentUser}
        />
      )}

      {currentView === 'details' && selectedCar && (
        <CarDetails
          car={selectedCar}
          onBack={() => setCurrentView('search')}
          onReservationComplete={handleReservationComplete}
          currentUser={currentUser}
          onShowAuth={() => setShowAuth(true)}
        />
      )}

      {currentView === 'confirmation' && reservationData && (
        <ReservationConfirmation
          car={reservationData.car}
          currentUser={currentUser!}
          reservationCode={reservationData.reservationCode}
          totalAmount={reservationData.totalAmount}
          onBack={() => setCurrentView('details')}
          onGoHome={() => setCurrentView('home')}
        />
      )}

      {currentView === 'admin' && currentUser?.type === 'admin' && (
        <AdminDashboard
          cars={cars}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
      )}

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default App;