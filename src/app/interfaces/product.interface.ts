import { ProductType } from "../enums/product-type.enum";

export interface Product {
    id?: string;
    name: string;
    description?: string;
    costPrice?: number;
    price: number;
    type: ProductType;
    isActive: boolean;
    createAt: number;
    quantity: number;
}

export interface FilterProduct {
    stockRange?: string;
    type?: string;
    isActive?: boolean;
    clear?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}