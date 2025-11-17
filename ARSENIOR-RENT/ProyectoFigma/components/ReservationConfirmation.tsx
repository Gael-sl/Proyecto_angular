import React from 'react';
import { CheckCircle, ArrowLeft, Download, Home, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Car, User } from '../App';

interface ReservationConfirmationProps {
  car: Car;
  currentUser: User;
  reservationCode: string;
  totalAmount: number;
  onBack: () => void;
  onGoHome: () => void;
}

export function ReservationConfirmation({ 
  car, 
  currentUser, 
  reservationCode, 
  totalAmount, 
  onBack, 
  onGoHome 
}: ReservationConfirmationProps) {
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
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="font-serif text-3xl text-black mb-2">¡Reserva confirmada!</h1>
          <p className="text-gray-600">Tu reserva ha sido procesada exitosamente</p>
        </div>

        {/* QR Code Section */}
        <Card className="p-8 bg-white border-gray-200 mb-6 text-center">
          <h2 className="font-serif text-xl text-black mb-4">Código QR de reserva</h2>
          <p className="text-gray-600 mb-6">
            Presenta este código en la agencia para recoger tu vehículo
          </p>
          
          {/* QR Code placeholder */}
          <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-black rounded-lg mb-2 mx-auto flex items-center justify-center">
                <div className="grid grid-cols-8 gap-1 p-2">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500">QR Code</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            Código: <span className="font-mono text-black">{reservationCode}</span>
          </p>
        </Card>

        {/* Reservation Details */}
        <Card className="p-6 bg-white border-gray-200 mb-6">
          <h3 className="font-serif text-lg text-black mb-4">Detalles de tu reserva</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Vehículo</span>
              <span className="text-black">{car.brand} {car.model} {car.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total pagado</span>
              <span className="text-black">${totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado</span>
              <span className="text-green-600 flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Confirmada</span>
              </span>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6 bg-white border-gray-200 mb-6">
          <h3 className="font-serif text-lg text-black mb-4">Próximos pasos</h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">1</div>
              <p className="text-gray-700 text-sm">Presenta el código QR en la agencia en la fecha de recogida</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">2</div>
              <p className="text-gray-700 text-sm">Completa el pago y entrega el papeleo requerido (identificación, licencia)</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">3</div>
              <p className="text-gray-700 text-sm">Recibe tu vehículo y disfruta tu viaje</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">4</div>
              <p className="text-gray-700 text-sm">Devuelve el vehículo en la fecha acordada</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button variant="outline" onClick={onGoHome} className="flex items-center justify-center space-x-2">
            <Home size={16} />
            <span>Volver al inicio</span>
          </Button>
          <Button className="bg-black hover:bg-gray-800 text-white flex items-center justify-center space-x-2">
            <Download size={16} />
            <span>Descargar comprobante</span>
          </Button>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-16 bg-stone-900 text-white py-12">
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
                  <Phone size={16} />
                  <span>+52 (668) 123-4567</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail size={16} />
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
  );
}