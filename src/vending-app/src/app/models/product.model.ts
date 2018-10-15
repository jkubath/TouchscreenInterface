import { Dinero as Money } from 'dinero.js';
import { SafeResourceUrl } from '@angular/platform-browser';

export interface Product {
    id: string;
    name: string;
    smallImg: string;
    largeImg: string;
    smallImgData: SafeResourceUrl;
    largeImgData: SafeResourceUrl;
    price: Money;
    description: string;
    nutrition: string;
}
