import { Dinero as Money } from 'dinero';

export class Product {
    public id: string;
    public name: string;
    public smallImg: string;
    public largeImg: string;
    public price: Money;
    public description: string;
    public nutrition: string;

    constructor() {}
}
