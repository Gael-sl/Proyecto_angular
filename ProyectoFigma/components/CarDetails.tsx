import React, { useState } from 'react';
import { ArrowLeft, Star, Users, Fuel, Settings, Calendar, MapPin, Plus, Minus, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Car, User } from '../App';

interface CarDetailsProps {
  car: Car;
  onBack: () => void;
  onReservationComplete: (reservationData: any) => void;
  currentUser: User | null;
  onShowAuth: () => void;
}

interface Extra {
  id: string;
  name: string;
  pricePerDay: number;
  quantity: number;
}

interface ClientData {
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  address: string;
}

export function CarDetails({ car, onBack, onReservationComplete, currentUser, onShowAuth }: CarDetailsProps) {
  const [selectedPlan, setSelectedPlan] = useState<'regular' | 'premium'>('regular');
  const [extras, setExtras] = useState<Extra[]>([
    { id: '1', name: 'Silla para bebé', pricePerDay: 350, quantity: 0 },
    { id: '2', name: 'GPS', pricePerDay: 250, quantity: 0 },
    { id: '3', name: 'Conductor adicional', pricePerDay: 400, quantity: 0 },
    { id: '4', name: 'Tanque lleno', pricePerDay: 500, quantity: 0 }
  ]);

  const [clientData, setClientData] = useState<ClientData>({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    licenseNumber: '',
    address: ''
  });

  const [acceptContract, setAcceptContract] = useState(false);

  const days = 5; // Simulando 5 días de renta
  const basePricePerDay = car.pricePerDay;
  const premiumMultiplier = 1.5;
  const currentPricePerDay = selectedPlan === 'premium' ? basePricePerDay * premiumMultiplier : basePricePerDay;
  
  const updateExtraQuantity = (id: string, change: number) => {
    setExtras(extras.map(extra => 
      extra.id === id 
        ? { ...extra, quantity: Math.max(0, extra.quantity + change) }
        : extra
    ));
  };

  const calculateExtrasTotal = () => {
    return extras.reduce((total, extra) => total + (extra.pricePerDay * extra.quantity * days), 0);
  };

  const calculateTotal = () => {
    return (currentPricePerDay * days) + calculateExtrasTotal();
  };

  const handleReserve = () => {
    if (!currentUser) {
      onShowAuth();
      return;
    }

    if (!acceptContract) {
      alert('Debes aceptar los términos y condiciones del contrato de renta');
      return;
    }

    if (!clientData.fullName || !clientData.email || !clientData.phone || !clientData.licenseNumber) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const reservationData = {
      car,
      clientData,
      selectedPlan,
      extras: extras.filter(extra => extra.quantity > 0),
      totalAmount: calculateTotal(),
      reservationCode: `AR-${Date.now().toString().slice(-6)}`
    };

    onReservationComplete(reservationData);
  };

  const handleClientDataChange = (field: keyof ClientData, value: string) => {
    setClientData(prev => ({
      ...prev,
      [field]: value
    }));
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
              <a href="#" className="text-black">Vehículos</a>
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Car Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Title */}
            <div>
              <Badge className="mb-2 bg-gray-100 text-gray-800">Compacto</Badge>
              <h1 className="font-serif text-3xl text-black mb-2">
                {car.brand} {car.model} {car.year}
              </h1>
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(car.rating) ? "text-black fill-current" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-black ml-2">{car.rating}</span>
                <span className="text-sm text-gray-500">({car.reviews} reseñas)</span>
              </div>
            </div>

            {/* Car Image */}
            <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Car Description */}
            <div>
              <p className="text-gray-600">
                Compacto eficiente y económico, perfecto para la ciudad. Fácil de manejar y estacionar.
              </p>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-black mb-4">Especificaciones</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-gray-500" />
                  <span className="text-gray-600">{car.seats} pasajeros</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings size={16} className="text-gray-500" />
                  <span className="text-gray-600">{car.transmission}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Fuel size={16} className="text-gray-500" />
                  <span className="text-gray-600">{car.fuel}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">2 maletas</span>
                </div>
              </div>
            </div>

            {/* Client Data Form */}
            {currentUser && (
              <Card className="p-6 bg-white border-gray-200">
                <h3 className="text-black mb-4">Tus datos</h3>
                
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={clientData.fullName}
                      onChange={(e) => handleClientDataChange('fullName', e.target.value)}
                      placeholder="Juan Pérez García"
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Correo electrónico <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        value={clientData.email}
                        onChange={(e) => handleClientDataChange('email', e.target.value)}
                        placeholder="contacto@ejemplo.com"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Teléfono <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={clientData.phone}
                        onChange={(e) => handleClientDataChange('phone', e.target.value)}
                        placeholder="(668) 123-4567"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Número de licencia <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={clientData.licenseNumber}
                      onChange={(e) => handleClientDataChange('licenseNumber', e.target.value)}
                      placeholder="ABC123456"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Dirección</label>
                    <Textarea
                      value={clientData.address}
                      onChange={(e) => handleClientDataChange('address', e.target.value)}
                      placeholder="Calle, número, colonia, ciudad"
                      className="w-full resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Contract Section */}
            {currentUser && (
              <Card className="p-6 bg-white border-gray-200">
                <h3 className="text-black mb-4">Contrato de renta</h3>
                
                <div className="text-sm text-gray-700 space-y-2 mb-4">
                  <p>Al aceptar este contrato, confirmas que:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Tienes licencia de conducir vigente</li>
                    <li>El vehículo será usado de manera responsable</li>
                    <li>Aceptas las términos de seguro y cobertura</li>
                    <li>Te comprometes a devolver el vehículo en las condiciones recibidas</li>
                    <li>Eres responsable de multas y daños durante el período de renta</li>
                  </ul>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="contract"
                    checked={acceptContract}
                    onCheckedChange={setAcceptContract}
                  />
                  <label htmlFor="contract" className="text-sm text-gray-700 cursor-pointer">
                    Acepto los términos y condiciones del contrato de renta
                  </label>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            {/* Booking Summary Card */}
            <Card className="p-6 bg-white border-gray-200">
              <h3 className="text-black mb-4">Resumen de reserva</h3>
              
              {/* Dates */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-black" />
                  <div>
                    <p className="text-sm text-black">2 de octubre de 2025</p>
                    <p className="text-xs text-gray-500">Recogida</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-black" />
                  <div>
                    <p className="text-sm text-black">8 de octubre de 2025</p>
                    <p className="text-xs text-gray-500">Devolución</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={16} className="text-black" />
                  <div>
                    <p className="text-sm text-black">Los Mochis, Sinaloa</p>
                    <p className="text-xs text-gray-500">Ubicación</p>
                  </div>
                </div>
              </div>

              {/* Plan Selection */}
              <div className="mb-6">
                <h4 className="text-black mb-3">Plan</h4>
                <div className="space-y-3">
                  <div 
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedPlan === 'regular' 
                        ? 'border-black bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan('regular')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-black">Regular</p>
                        <p className="text-xs text-gray-500">Seguro básico</p>
                      </div>
                      <p className="text-black">${basePricePerDay.toLocaleString()}/día</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedPlan === 'premium' 
                        ? 'border-black bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan('premium')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-black">Premium</p>
                        <p className="text-xs text-gray-500">Cobertura total</p>
                      </div>
                      <p className="text-black">${Math.round(basePricePerDay * premiumMultiplier).toLocaleString()}/día</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extras */}
              <div className="mb-6">
                <h4 className="text-black mb-3">Extras</h4>
                <div className="space-y-3">
                  {extras.map((extra) => (
                    <div key={extra.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-black">{extra.name}</p>
                        <p className="text-xs text-gray-500">+${extra.pricePerDay.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateExtraQuantity(extra.id, -1)}
                          disabled={extra.quantity === 0}
                          className="w-8 h-8 p-0"
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center text-sm">{extra.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateExtraQuantity(extra.id, 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal ({days} días)</span>
                  <span className="text-black">${(currentPricePerDay * days).toLocaleString()}</span>
                </div>
                {calculateExtrasTotal() > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Extras</span>
                    <span className="text-black">${calculateExtrasTotal().toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg">
                  <span className="text-black">Total</span>
                  <span className="text-black">${calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Reserve Button */}
              <Button 
                className="w-full mt-6 bg-black hover:bg-gray-800 text-white"
                onClick={handleReserve}
              >
                Reservar ahora
              </Button>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 bg-stone-900 text-white py-12 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-black font-serif text-sm">A</span>
                  </div>
                  <span className="font-serif text-xl">Arsenior Rent</span>
                </div>
                <p className="text-stone-400 leading-relaxed">
                  Tu mejor opción para renta de vehículos premium. Calidad, confianza y experiencia excepcional.
                </p>
              </div>

              <div>
                <h4 className="mb-4">Enlaces rápidos</h4>
                <ul className="space-y-2 text-stone-400">
                  <li><a href="#" className="hover:text-white transition-colors">Inicio</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cómo funciona</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Vehículos</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Acerca de</a></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4">Soporte</h4>
                <ul className="space-y-2 text-stone-400">
                  <li><a href="#" className="hover:text-white transition-colors">Preguntas frecuentes</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Términos y condiciones</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4">Contacto</h4>
                <ul className="space-y-2 text-stone-400">
                  <li className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span>Los Mochis, Sinaloa, México</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>📞</span>
                    <span>+52 (668) 123-4567</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>✉️</span>
                    <span>info@arseniorrent.com</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-stone-700 mt-8 pt-8 text-center text-stone-400">
              <p>&copy; 2025 Arsenior Rent. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}