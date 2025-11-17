import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Star, X, ExternalLink, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { User } from '../App';

interface MyRentalProps {
  onBack: () => void;
  currentUser: User | null;
}

interface RentalInfo {
  id: string;
  car: {
    brand: string;
    model: string;
    year: number;
    plate: string;
    image: string;
  };
  dates: {
    pickup: string;
    return: string;
    pickupTime: string;
    returnTime: string;
  };
  location: {
    pickup: string;
    return: string;
  };
  status: 'active' | 'completed';
}

export function MyRental({ onBack, currentUser }: MyRentalProps) {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [vehicleRating, setVehicleRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [comment, setComment] = useState('');

  // Mock rental data
  const rental: RentalInfo = {
    id: 'RNT-001',
    car: {
      brand: 'Nissan',
      model: 'X-Trail',
      year: 2020,
      plate: 'ABC-1234',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaXNzYW4lMjB4JTIwdHJhaWx8ZW58MXx8fHwxNzU5NDcxOTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    dates: {
      pickup: '10 de marzo, 2025',
      return: '15 de marzo, 2025',
      pickupTime: '10:00 AM',
      returnTime: '10:00 AM'
    },
    location: {
      pickup: 'Aeropuerto Las Américas',
      return: 'Aeropuerto Las Américas'
    },
    status: 'active'
  };

  const handleStarClick = (rating: number, type: 'vehicle' | 'service') => {
    if (type === 'vehicle') {
      setVehicleRating(rating);
    } else {
      setServiceRating(rating);
    }
  };

  const handleSubmitRating = () => {
    // Aquí iría la lógica para enviar la calificación
    console.log({
      vehicleRating,
      serviceRating,
      comment
    });
    setShowRatingModal(false);
  };

  const StarRating = ({ rating, onStarClick, type }: { rating: number; onStarClick: (rating: number, type: 'vehicle' | 'service') => void; type: 'vehicle' | 'service' }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onStarClick(star, type)}
          className="transition-colors"
        >
          <Star
            size={24}
            className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}
          />
        </button>
      ))}
    </div>
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tus rentas</p>
          <Button onClick={onBack} className="bg-black hover:bg-gray-800 text-white">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

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
              <a href="#" className="text-black">Mi renta</a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Acerca de</a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Reseñas</a>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Hola, {currentUser.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-3xl text-black mb-8">Mi renta</h1>

        {/* Rental Card */}
        <Card className="p-8 bg-white border-gray-200 mb-8">
          {/* Car Image */}
          <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-6">
            <img
              src={rental.car.image}
              alt={`${rental.car.brand} ${rental.car.model}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Car Details */}
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl text-black mb-2">
              {rental.car.brand} {rental.car.model} {rental.car.year}
            </h2>
            <p className="text-gray-600">Placa: {rental.car.plate}</p>
          </div>

          {/* Rental Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Pickup */}
            <Card className="p-4 bg-gray-50 border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <Calendar size={20} className="text-black" />
                <span className="text-black">Recogida</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">{rental.dates.pickup}</p>
                <p className="text-sm text-gray-600">{rental.dates.pickupTime}</p>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">{rental.location.pickup}</span>
              </div>
            </Card>

            {/* Return */}
            <Card className="p-4 bg-gray-50 border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <Calendar size={20} className="text-black" />
                <span className="text-black">Devolución</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">{rental.dates.return}</p>
                <p className="text-sm text-gray-600">{rental.dates.returnTime}</p>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">{rental.location.return}</span>
              </div>
            </Card>
          </div>

          {/* Important Information */}
          <Card className="p-4 bg-orange-50 border-orange-200 mb-6">
            <h3 className="text-black mb-3 flex items-center space-x-2">
              <span>⚠️</span>
              <span>Información importante</span>
            </h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Presenta tu QR al momento de recoger el vehículo</li>
              <li>• Recuerda devolver el vehículo con el tanque lleno</li>
              <li>• Revisa el vehículo antes de salir de la agencia</li>
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="flex items-center justify-center space-x-2">
              <ExternalLink size={16} />
              <span>Ver QR de reserva</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-center space-x-2">
              <Phone size={16} />
              <span>Contactar soporte</span>
            </Button>
          </div>
        </Card>

        {/* Rating Section */}
        <Card className="p-6 bg-white border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Simulación: Cuando devuelvas el vehículo, podrás calificar tu experiencia
            </p>
            <Button 
              onClick={() => setShowRatingModal(true)}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Simular devolución y calificar
            </Button>
          </div>
        </Card>
      </div>

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-black">
              Califica tu experiencia
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRatingModal(false)}
              className="absolute right-4 top-4"
            >
              <X size={20} />
            </Button>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Vehículo rentado</p>
              <p className="text-black">{rental.car.brand} {rental.car.model} {rental.car.year}</p>
            </div>

            <div>
              <h3 className="text-black mb-3">¿Cómo estuvo el vehículo?</h3>
              <StarRating 
                rating={vehicleRating} 
                onStarClick={handleStarClick} 
                type="vehicle"
              />
            </div>

            <div>
              <h3 className="text-black mb-3">¿Cómo fue el servicio?</h3>
              <StarRating 
                rating={serviceRating} 
                onStarClick={handleStarClick} 
                type="service"
              />
            </div>

            <div>
              <h3 className="text-black mb-3">Cuéntanos más (opcional)</h3>
              <Textarea
                placeholder="Ej. El vehículo estaba impecable y el servicio fue excelente..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowRatingModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmitRating}
                className="flex-1 bg-black hover:bg-gray-800 text-white"
              >
                Enviar calificación
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}