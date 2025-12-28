import { Payment } from "./payment.interface";
import { CartItem } from "./product.interface";

export interface Sale {
    id: string;
    sellerId?: string | null;
    sellerName?: string | null;
    clientId?: string | null;
    clientName?: string | null;
    cartItems: CartItem[];
    discountPercent?: number;
    discountValue?: number;
    subtotal?: number;
    total: number;
    paymentsList?: Payment[];
    createAt: Date,
    notes?: string;
}