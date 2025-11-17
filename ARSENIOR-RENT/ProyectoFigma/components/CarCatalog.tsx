import React, { useState } from 'react';
import { ArrowLeft, Star, Users, Fuel, Settings, Shield, Crown, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Car, User } from '../App';

interface CarCatalogProps {
  cars: Car[];
  onViewCar: (car: Car) => void;
  onBack: () => void;
  currentUser: User | null;
  onShowAuth: () => void;
}

export function CarCatalog({ cars, onViewCar, onBack, currentUser, onShowAuth }: CarCatalogProps) {
  const [sortBy, setSortBy] = useState('recommended');
  const [filterBy, setFilterBy] = useState('all');

  const getStatusBadge = (status: Car['status']) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Disponible</Badge>;
      case 'rented':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Rentado</Badge>;
      case 'maintenance':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Mantenimiento</Badge>;
      default:
        return null;
    }
  };

  const filteredCars = cars.filter(car => {
    if (filterBy === 'all') return true;
    return car.status === filterBy;
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.pricePerDay - b.pricePerDay;
      case 'price-high':
        return b.pricePerDay - a.pricePerDay;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-stone-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-stone-600" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-serif text-sm">A</span>
                </div>
                <span className="font-serif text-xl text-stone-900">Arsenior Rent</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {currentUser ? (
                <span className="text-stone-700 text-sm">Hola, {currentUser.name}</span>
              ) : (
                <Button variant="outline" size="sm" onClick={onShowAuth}>
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Page Title */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">
              Nuestra Flota Premium
            </h1>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              Vehículos cuidadosamente seleccionados para ofrecerte la mejor experiencia de manejo
            </p>
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-stone-600" />
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-48 bg-white/50 border-stone-200">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los vehículos</SelectItem>
                  <SelectItem value="available">Disponibles</SelectItem>
                  <SelectItem value="rented">Rentados</SelectItem>
                  <SelectItem value="maintenance">En mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Settings size={18} className="text-stone-600" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white/50 border-stone-200">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recomendados</SelectItem>
                  <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="rating">Mejor Calificados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedCars.map((car) => (
              <Card key={car.id} className="overflow-hidden bg-white/60 backdrop-blur-sm border-stone-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                {/* Car Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(car.status)}
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <Star size={14} className="text-amber-500 fill-current" />
                      <span className="text-sm text-stone-700">{car.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Car Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-serif text-xl text-stone-900 mb-1">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-stone-600 text-sm">{car.type} • {car.year}</p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-stone-600">
                    <div className="flex items-center space-x-2">
                      <Users size={14} className="text-amber-700" />
                      <span>{car.seats} asientos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Settings size={14} className="text-amber-700" />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Fuel size={14} className="text-amber-700" />
                      <span>{car.fuel}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star size={14} className="text-amber-700" />
                      <span>{car.reviews} reseñas</span>
                    </div>
                  </div>

                  {/* Plans */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="flex items-center space-x-2">
                        <Shield size={16} className="text-stone-600" />
                        <span className="text-sm text-stone-700">Plan Base</span>
                      </div>
                      <span className="text-stone-900">${car.pricePerDay.toLocaleString()}/día</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                      <div className="flex items-center space-x-2">
                        <Crown size={16} className="text-amber-700" />
                        <span className="text-sm text-amber-700">Plan Premier</span>
                      </div>
                      <span className="text-amber-800">${(car.pricePerDay * 1.3).toLocaleString()}/día</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => onViewCar(car)}
                      disabled={car.status !== 'available'}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white transition-all duration-300 disabled:from-stone-300 disabled:to-stone-400"
                    >
                      {car.status === 'available' ? 'Ver Detalles' : 'No Disponible'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {sortedCars.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Settings size={24} className="text-stone-500" />
              </div>
              <h3 className="text-lg text-stone-900 mb-2">No se encontraron vehículos</h3>
              <p className="text-stone-600">Prueba ajustando los filtros de búsqueda</p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">
            ¿Necesitas Ayuda para Elegir?
          </h2>
          <p className="text-stone-300 mb-6 leading-relaxed">
            Nuestro equipo de expertos está disponible 24/7 para ayudarte a encontrar el vehículo perfecto para tu viaje.
          </p>
          <Button
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-stone-900"
          >
            Contactar Asesor
          </Button>
        </div>
      </section>
    </div>
  );
}