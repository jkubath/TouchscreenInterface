import { Dinero as Money } from 'dinero.js';

export interface Product {
    id: string;
    name: string;
    smallImg: string;
    largeImg: string;
    price: Money;
    description: string;
    nutrition: string;
}
