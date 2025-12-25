import { ProductType } from "../enums/product-type.enum";

export interface Product {
    id?: string;
    name: string;
    description?: string;
    costPrice?: number;
    price: number;
    type: ProductType;
    isActive: boolean;
    createAt: Date;
    quantity: number;
}