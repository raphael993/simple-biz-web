import { Product } from "./product.interface";

export interface Sale {
    id?: string;
    clientId?: string;
    productList: Array<Product>;
    totalValue: number;
    createAt: Date;
}