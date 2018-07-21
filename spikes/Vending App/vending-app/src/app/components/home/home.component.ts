import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import * as fs from 'fs';
import { promisify } from 'util';
import { TouchBarSlider } from 'electron';
import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public products: Product[];

    constructor() {
        this.loadProducts().then( result => {
            this.products = result;
            console.log(result);
        });
    }

    async loadProducts(): Promise<Product[]> {
        let products = new Array<Product>();
        const readdir = promisify(fs.readdir);
        const contents = await readdir('./src/products');
        for (let content of contents) {
            let product = require(`products/${content}/data.json`) as Product;
            product.img = `products/${content}/${product.img}`;
            products.push(product);
            
        }
        return products;
    }

    ngOnInit() {
    }
}
