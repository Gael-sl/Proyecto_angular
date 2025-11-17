export interface Payment {
  id: number;
  reservationId: number;
  amount: number;
  type: 'deposit' | 'final' | 'extra';
  method: 'efectivo' | 'tarjeta' | 'transferencia' | 'qr';
  status: 'pendiente' | 'completado' | 'fallido';
  transactionId?: string;
  qrCode?: string;
  paidAt?: string;
  createdAt: string;
}

export interface CreatePaymentRequest {
  reservationId: number;
  amount: number;
  type: 'deposit' | 'final' | 'extra';
  method: 'efectivo' | 'tarjeta' | 'transferencia' | 'qr';
}

export interface ConfirmPaymentRequest {
  paymentId: number;
  transactionId?: string;
}