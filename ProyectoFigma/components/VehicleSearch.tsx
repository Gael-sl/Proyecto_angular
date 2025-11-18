import React, { useState } from 'react';
import { Star, Users, Navigation, Fuel, ArrowLeft, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Car, User } from '../App';

interface VehicleSearchProps {
  cars: Car[];
  onBack: () => void;
  onSelectCar: (car: Car) => void;
  currentUser: User | null;
  onShowAuth: () => void;
  location?: string;
  pickupDate?: string;
  returnDate?: string;
}

export function VehicleSearch({ 
  cars, 
  onBack, 
  onSelectCar,
  currentUser, 
  onShowAuth,
  location = "Los Mochis, Sinaloa",
  pickupDate = "2 de octubre",
  returnDate = "8 de octubre de 2025"
}: VehicleSearchProps) {
  const [selectedPlan, setSelectedPlan] = useState<'regular' | 'premium'>('regular');
  const [filterByType, setFilterByType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Filter cars with unified filtering
  const getFilteredCars = () => {
    let filtered = cars;

    // Apply unified filter
    if (filterByType !== 'all') {
      filtered = filtered.filter(car => {
        // Status filters
        if (filterByType === 'available') return car.status === 'available';
        
        // Type filters
        if (filterByType === 'compact') return car.type.includes('Compacto');
        if (filterByType === 'sedan') return car.type.includes('Sedán');
        if (filterByType === 'minivan') return car.type.includes('Minivan');
        
        // Transmission filters
        if (filterByType === 'automatic') return car.transmission === 'Automática';
        if (filterByType === 'manual') return car.transmission === 'Manual';
        
        // Price filters
        if (filterByType === 'low') return car.pricePerDay <= 600;
        if (filterByType === 'medium') return car.pricePerDay > 600 && car.pricePerDay <= 1200;
        if (filterByType === 'high') return car.pricePerDay > 1200;
        
        // Fuel filters
        if (filterByType === 'hybrid') return car.fuel === 'Híbrido';
        if (filterByType === 'gasoline') return car.fuel === 'Gasolina';
        
        return true;
      });
    } else {
      // Default: show only available cars
      filtered = cars.filter(car => car.status === 'available');
    }

    return filtered;
  };

  // Sort cars
  const getSortedCars = () => {
    const filtered = getFilteredCars();
    
    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.pricePerDay - b.pricePerDay);
      case 'price-high':
        return [...filtered].sort((a, b) => b.pricePerDay - a.pricePerDay);
      case 'rating':
        return [...filtered].sort((a, b) => b.rating - a.rating);
      case 'newest':
        return [...filtered].sort((a, b) => b.year - a.year);
      case 'popular':
        return [...filtered].sort((a, b) => b.reviews - a.reviews);
      case 'recommended':
      default:
        return [...filtered].sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
    }
  };

  const availableCars = getSortedCars();

  const getPlanPrice = (basePrice: number, plan: 'regular' | 'premium') => {
    return plan === 'premium' ? Math.round(basePrice * 1.3) : basePrice;
  };

  const handleSelectCar = (car: Car) => {
    onSelectCar(car);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft size={16} />
              </Button>
              <span className="font-serif text-xl text-black">Arsenior Rent</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Inicio</a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Cómo funciona</a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Vehículos</a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Mi renta</a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Acerca de</a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Reseñas</a>
            </nav>

            <div className="flex items-center space-x-4">
              {currentUser ? (
                <span className="text-gray-600">Hola, {currentUser.name}</span>
              ) : (
                <>
                  <Button variant="ghost" onClick={onShowAuth}>
                    Iniciar sesión
                  </Button>
                  <Button className="bg-black hover:bg-gray-800 text-white" onClick={onShowAuth}>
                    Registrarse
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-black mb-2">Vehículos disponibles</h1>
          <p className="text-gray-600">{location} • {pickupDate} - {returnDate}</p>
        </div>

        {/* Plan Selection */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
          <Card 
            className={`p-4 cursor-pointer transition-all border ${
              selectedPlan === 'regular' 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-black border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedPlan('regular')}
          >
            <h3 className="font-medium">Plan Regular</h3>
            <p className="text-sm opacity-80">Seguro básico incluido</p>
          </Card>

          <Card 
            className={`p-4 cursor-pointer transition-all border ${
              selectedPlan === 'premium' 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-black border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedPlan('premium')}
          >
            <h3 className="font-medium">Plan Premium</h3>
            <p className="text-sm opacity-80">Cobertura total + extras</p>
          </Card>
        </div>

        {/* Simple Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Main Filter - All Categories */}
          <div className="flex-1">
            <Select value={filterByType} onValueChange={setFilterByType}>
              <SelectTrigger className="w-full bg-white border-gray-200 h-12">
                <SelectValue placeholder="Todos los vehículos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los vehículos</SelectItem>
                <SelectItem value="available">Disponibles</SelectItem>
                <SelectItem value="compact">Compactos</SelectItem>
                <SelectItem value="sedan">Sedanes</SelectItem>
                <SelectItem value="minivan">Minivans</SelectItem>
                <SelectItem value="automatic">Transmisión Automática</SelectItem>
                <SelectItem value="manual">Transmisión Manual</SelectItem>
                <SelectItem value="low">Hasta $600/día</SelectItem>
                <SelectItem value="medium">$600 - $1,200/día</SelectItem>
                <SelectItem value="high">Más de $1,200/día</SelectItem>
                <SelectItem value="hybrid">Híbridos</SelectItem>
                <SelectItem value="gasoline">Gasolina</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="flex-1">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full bg-white border-gray-200 h-12">
                <Settings size={18} className="mr-2" />
                <SelectValue placeholder="Recomendados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recomendados</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="rating">Mejor Calificados</SelectItem>
                <SelectItem value="newest">Más Nuevos</SelectItem>
                <SelectItem value="popular">Más Populares</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Mostrando <span className="text-black">{availableCars.length}</span> vehículos disponibles
          </p>
        </div>

        {/* Vehicle Grid */}
        <div className="grid gap-6">
          {availableCars.map((car) => (
            <Card key={car.id} className="p-6 bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                {/* Car Image */}
                <div className="w-full md:w-48 h-48 md:h-32 bg-gray-100 rounded-lg overflow-hidden md:flex-shrink-0">
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Car Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="mb-3 md:mb-0">
                      <h3 className="font-serif text-xl text-black mb-2">{car.brand} {car.model} {car.year}</h3>
                      <div className="flex items-center space-x-1 mb-2">
                        <Star size={14} className="text-black fill-current" />
                        <span className="text-sm text-black">{car.rating}</span>
                        <span className="text-sm text-gray-500">({car.reviews} reseñas)</span>
                      </div>
                    </div>
                    
                    <div className="text-left md:text-right">
                      <div className="font-serif text-2xl text-black">
                        ${getPlanPrice(car.pricePerDay, selectedPlan).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">/día</div>
                    </div>
                  </div>

                  {/* Car Features */}
                  <div className="grid grid-cols-2 md:flex md:items-center md:space-x-6 gap-2 md:gap-0 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{car.seats} pasajeros</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Navigation size={14} />
                      <span>2 maletas</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>{car.transmission === 'Automática' ? '⚙️' : '🔧'}</span>
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Fuel size={14} />
                      <span>{car.fuel}</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                    <div>
                      <span className="text-sm text-gray-600">Plan {selectedPlan === 'regular' ? 'Regular' : 'Premium'}</span>
                    </div>
                    <Button 
                      className="bg-black hover:bg-gray-800 text-white w-full md:w-auto px-8"
                      onClick={() => handleSelectCar(car)}
                    >
                      Seleccionar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {availableCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay vehículos disponibles para las fechas seleccionadas.</p>
          </div>
        )}
      </div>
    </div>
  );
}