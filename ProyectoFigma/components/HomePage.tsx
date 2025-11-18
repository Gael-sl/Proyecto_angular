import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, MapPin, Clock, Star, Users, Shield, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { User } from '../App';

interface HomePageProps {
  onViewCatalog: () => void;
  onViewSearch: () => void;
  onViewRental: () => void;
  onShowAuth: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

export function HomePage({ onViewCatalog, onViewSearch, onViewRental, onShowAuth, currentUser, onLogout }: HomePageProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Reset menu when component unmounts
  useEffect(() => {
    return () => {
      setShowMenu(false);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-lg border-b border-stone-200/50 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-serif text-sm">A</span>
              </div>
              <span className="font-serif text-xl text-stone-900 tracking-tight">Arsenior Rent</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="text-stone-700 hover:text-black transition-colors">Inicio</a>
              <a href="#como-funciona" className="text-stone-700 hover:text-black transition-colors">Cómo Funciona</a>
              <button onClick={onViewCatalog} className="text-stone-700 hover:text-black transition-colors">Vehículos</button>
              {currentUser && (
                <button onClick={onViewRental} className="text-stone-700 hover:text-black transition-colors">Mi renta</button>
              )}
              <a href="#acerca" className="text-stone-700 hover:text-black transition-colors">Acerca De</a>
              <a href="#reseñas" className="text-stone-700 hover:text-black transition-colors">Reseñas</a>
            </nav>

            {/* Auth Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <span className="text-stone-700 text-sm">Hola, {currentUser.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLogout}
                    className="hidden md:inline-flex"
                  >
                    Salir
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShowAuth}
                  className="hidden md:inline-flex bg-white/50 hover:bg-white/80"
                >
                  Registrarse
                </Button>
              )}
              
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
              >
                {showMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <>
            {/* Overlay */}
            <div 
              className="md:hidden fixed inset-0 bg-black/20 z-[9998]" 
              onClick={() => setShowMenu(false)}
            />
            {/* Menu */}
            <div className="md:hidden fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-stone-200 shadow-lg z-[9999]">
            <div className="px-4 py-6 space-y-4">
              <div className="flex items-center space-x-2 pb-4 border-b border-stone-200">
                <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
                  <span className="text-white text-xs font-serif">A</span>
                </div>
                <span className="font-serif text-lg text-stone-900">Arsenior Rent</span>
              </div>
              
              <nav className="space-y-3">
                <a 
                  href="#inicio" 
                  className="block text-stone-700 hover:text-black py-2"
                  onClick={() => setShowMenu(false)}
                >
                  Inicio
                </a>
                <a 
                  href="#como-funciona" 
                  className="block text-stone-700 hover:text-black py-2"
                  onClick={() => setShowMenu(false)}
                >
                  Cómo Funciona
                </a>
                <button 
                  onClick={() => {
                    onViewCatalog();
                    setShowMenu(false);
                  }} 
                  className="block text-stone-700 hover:text-black py-2 w-full text-left"
                >
                  Vehículos
                </button>
                {currentUser && (
                  <button 
                    onClick={() => {
                      onViewRental();
                      setShowMenu(false);
                    }} 
                    className="block text-stone-700 hover:text-black py-2 w-full text-left"
                  >
                    Mi renta
                  </button>
                )}
                <a 
                  href="#acerca" 
                  className="block text-stone-700 hover:text-black py-2"
                  onClick={() => setShowMenu(false)}
                >
                  Acerca De
                </a>
                <a 
                  href="#reseñas" 
                  className="block text-stone-700 hover:text-black py-2"
                  onClick={() => setShowMenu(false)}
                >
                  Reseñas
                </a>
              </nav>

              <div className="pt-4 border-t border-stone-200">
                {currentUser ? (
                  <div className="space-y-3">
                    <p className="text-stone-700 text-sm">Hola, {currentUser.name}</p>
                    <Button variant="outline" size="sm" onClick={onLogout} className="w-full">
                      Salir
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={onShowAuth} className="w-full">
                    Registrarse
                  </Button>
                )}
              </div>
            </div>
            </div>
          </>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-stone-900 mb-6 leading-tight">
              Experiencia Premium en
              <span className="block text-black">Renta de Vehículos</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Descubre nuestra flota de vehículos de lujo cuidadosamente seleccionados. 
              Calidad excepcional, servicio personalizado y la confianza que mereces.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 bg-white/60 backdrop-blur-sm border-stone-200/50 shadow-2xl">
            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-center space-x-3 pb-4 border-b border-stone-200">
                <MapPin className="text-black flex-shrink-0" size={20} />
                <div className="flex-1">
                  <label className="block text-stone-900 mb-2">Retiro y Devolución</label>
                  <div className="bg-stone-50 rounded-lg p-3 border border-stone-200">
                    <span className="text-stone-700">Sucursal Centro - Av. Principal 123</span>
                  </div>
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-stone-900">
                    <Calendar size={16} className="text-black" />
                    <span>Fecha de Retiro</span>
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-stone-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-stone-400 focus:border-transparent"
                  />
                  <div className="flex items-center space-x-2">
                    <Clock size={14} className="text-black" />
                    <input
                      type="time"
                      className="flex-1 p-2 border border-stone-200 rounded-md bg-white/50 text-sm"
                      defaultValue="10:00"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-stone-900">
                    <Calendar size={16} className="text-black" />
                    <span>Fecha de Devolución</span>
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-stone-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-stone-400 focus:border-transparent"
                  />
                  <div className="flex items-center space-x-2">
                    <Clock size={14} className="text-black" />
                    <input
                      type="time"
                      className="flex-1 p-2 border border-stone-200 rounded-md bg-white/50 text-sm"
                      defaultValue="18:00"
                    />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <Button
                onClick={onViewSearch}
                className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Buscar Vehículos Disponibles
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-20 bg-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">
              Renta un Vehículo en 3 Simples Pasos
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              Proceso diseñado para tu comodidad y tranquilidad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-serif text-stone-900 mb-3">1. Inicia tu Experiencia</h3>
              <p className="text-stone-600 leading-relaxed">
                Configura fechas, horarios y preferencias para comenzar tu viaje premium.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Star className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-serif text-stone-900 mb-3">2. Elige tu Vehículo</h3>
              <p className="text-stone-600 leading-relaxed">
                Explora nuestra selecta flota y elige el plan que mejor se ajuste a tus necesidades.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-serif text-stone-900 mb-3">3. Confirma tu Reserva</h3>
              <p className="text-stone-600 leading-relaxed">
                Finaliza tu reserva de forma segura y recibe la confirmación al instante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="acerca" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-6">
                Excelencia en Cada Viaje
              </h2>
              <p className="text-stone-600 text-lg mb-6 leading-relaxed">
                En Arsenior Rent, nos especializamos en brindar experiencias de movilidad premium. 
                Cada vehículo en nuestra flota es cuidadosamente seleccionado y mantenido con los 
                más altos estándares de calidad.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Award className="text-black" size={20} />
                  <span className="text-stone-700">Flota Premium</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="text-black" size={20} />
                  <span className="text-stone-700">Seguro Completo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="text-black" size={20} />
                  <span className="text-stone-700">Servicio 24/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="text-black" size={20} />
                  <span className="text-stone-700">5 Estrellas</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1758411897872-5c710b8f55bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBpbnRlcmlvciUyMHByZW1pdW18ZW58MXx8fHwxNzU5NTU1MjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Interior premium"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reseñas" className="py-20 bg-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">
              Lo que Dicen Nuestros Clientes
            </h2>
            <p className="text-stone-600 text-lg">Experiencias reales de viajeros satisfechos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "María González",
                rating: 5,
                comment: "Servicio excepcional. El BMW Serie 3 estaba impecable y el proceso fue muy sencillo.",
                date: "Hace 2 semanas"
              },
              {
                name: "Carlos Rodríguez",
                rating: 5,
                comment: "La mejor experiencia de renta que he tenido. Profesional y confiable en todo momento.",
                date: "Hace 1 mes"
              },
              {
                name: "Ana Martínez",
                rating: 5,
                comment: "El plan Premier vale cada peso. Seguro amplio y servicio al cliente de primera.",
                date: "Hace 3 semanas"
              }
            ].map((review, index) => (
              <Card key={index} className="p-6 bg-white/60 backdrop-blur-sm border-stone-200/50">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-black fill-current" />
                    ))}
                  </div>
                  <span className="text-stone-500 text-sm ml-2">{review.date}</span>
                </div>
                <p className="text-stone-700 mb-4 leading-relaxed">"{review.comment}"</p>
                <p className="text-stone-900 font-medium">{review.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12">
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
                Experiencia premium en renta de vehículos de lujo.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Servicios</h4>
              <ul className="space-y-2 text-stone-400">
                <li>Renta de Vehículos</li>
                <li>Planes Premium</li>
                <li>Seguro Completo</li>
                <li>Servicio 24/7</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Empresa</h4>
              <ul className="space-y-2 text-stone-400">
                <li>Acerca de Nosotros</li>
                <li>Términos y Condiciones</li>
                <li>Política de Privacidad</li>
                <li>Contacto</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Contacto</h4>
              <div className="space-y-2 text-stone-400">
                <p>Av. Principal 123</p>
                <p>Ciudad, Estado 12345</p>
                <p>+52 (55) 1234-5678</p>
                <p>info@arseniorrent.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-800 mt-8 pt-8 text-center text-stone-400">
            <p>&copy; 2024 Arsenior Rent. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}