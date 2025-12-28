export type PaymentType = 'CASH' | 'PIX' | 'DEBIT' | 'CREDIT';

export interface Payment {
  type: PaymentType;
  value: number;
}
