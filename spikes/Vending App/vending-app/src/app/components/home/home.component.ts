import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Product } from '../../models/product.model';
import * as fs from 'fs';
import { promisify } from 'util';
import { TouchBarSlider } from 'electron';
import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';
import { DragScrollComponent } from 'ngx-drag-scroll';
import Money from 'dinero.js';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

    @ViewChild('topScroller', {read: DragScrollComponent}) topds: DragScrollComponent;
    @ViewChild('bottomScroller', {read: DragScrollComponent}) bottomds: DragScrollComponent;

    public products1: Product[];
    public products2: Product[];

    public topLeftNav: string = "assets/img/Button-On-Left.png";
    public topRightNav: string = "assets/img/Button-On-Right.png";
    public bottomLeftNav: string = "assets/img/Button-On-Left.png";
    public bottomRightNav: string = "assets/img/Button-On-Right.png";
    public topLeftNavDisabled: string = "block";
    public topRightNavDisabled: string = "block";
    public bottomLeftNavDisabled: string = "block";
    public bottomRightNavDisabled: string = "block";
    public snapDisabled: string = "false";
    public productHidden: boolean = true;
    public productSelectedAnimation: boolean = false;
    public productShown: boolean = false;
    public productCanceledAnimation: boolean = false;

    /* each attribute already exists in product and so is redundant to have global variables for
    public selectedProductImage: string = "";
    public selectedProductName: string = "";
    public selectedProductDescription: string = "";
    public selectedProductPrice: Money = {};
    */
    public selectedProduct: Product = {} as Product;

    public selectedProductDescriptionFontSize: string = "";
    public selectedProductQuantityWanted: number = 0;

    public minusButton: string = "assets/img/Minus-Button.png";
    public plusButton: string = "assets/img/Plus-Button.png";

    constructor() {
        this.loadProducts1().then( result => {
            this.products1 = result;
            console.log(result);
        });
        this.loadProducts2().then( result => {
            this.products2 = result;
            console.log(result);
        });
    }

    async loadProducts1(): Promise<Product[]> {
        let products1 = new Array<Product>();
        let i: number = 0;
        const readdir = promisify(fs.readdir);
        const contents = await readdir('./src/products');
        for (let content of contents) {
            if (i % 2 == 0) {
              let product = require(`products/${content}/data.json`) as Product;
              product.price = new Money(product.price);
              console.log(product.price);
              product.smallImg = `products/${content}/${product.smallImg}`;
              product.largeImg = `products/${content}/${product.largeImg}`;
              products1.push(product);
            }
            i++;

        }
        return products1;
    }

    async loadProducts2(): Promise<Product[]> {
        let products2 = new Array<Product>();
        let i: number = 0;
        const readdir = promisify(fs.readdir);
        const contents = await readdir('./src/products');
        for (let content of contents) {
            if (i % 2 == 1) {
              let product = require(`products/${content}/data.json`) as Product;
              product.price = new Money(product.price);
              product.smallImg = `products/${content}/${product.smallImg}`;
              product.largeImg = `products/${content}/${product.largeImg}`;
              products2.push(product);
            }
            i++;

        }
        return products2;
    }

    topScrollLeft(): void {
        this.topds.moveLeft();
        this.snapDisabled = "false";
    }

    topScrollRight(): void {
        this.topds.moveRight();
        this.snapDisabled = "false";
    }

    bottomScrollLeft(): void {
      this.bottomds.moveLeft();
      this.snapDisabled = "false";
    }

    bottomScrollRight(): void {
      this.bottomds.moveRight();
      this.snapDisabled = "false";
    }

    topLeftBoundStat(reachesLeftBound: boolean) {
      if (reachesLeftBound == true) {
        this.topLeftNavDisabled = "none";
      } else {
        this.topLeftNavDisabled = "block";
      }
    }

    topLeftNavMouseDown(): void {
      this.topLeftNav = "assets/img/Button-On-Left-Pressed.png";
    }

    topLeftNavMouseUp(): void {
      this.topLeftNav = "assets/img/Button-On-Left.png";
    }

    topLeftNavMouseLeave(): void {
      this.topLeftNav = "assets/img/Button-On-Left.png";
    }

    topRightBoundStat(reachesRightBound: boolean) {
      if (reachesRightBound == true) {
        this.topRightNavDisabled = "none";
      } else {
        this.topRightNavDisabled = "block";
      }
    }

    topRightNavMouseDown(): void {
      this.topRightNav = "assets/img/Button-On-Right-Pressed.png";
    }

    topRightNavMouseUp(): void {
      this.topRightNav = "assets/img/Button-On-Right.png";
    }

    topRightNavMouseLeave(): void {
      this.topRightNav = "assets/img/Button-On-Right.png";
    }

    bottomLeftBoundStat(reachesLeftBound: boolean) {
      if (reachesLeftBound == true) {
        this.bottomLeftNavDisabled = "none";
      } else {
        this.bottomLeftNavDisabled = "block";
      }
    }

    bottomLeftNavMouseDown(): void {
      this.bottomLeftNav = "assets/img/Button-On-Left-Pressed.png";
    }

    bottomLeftNavMouseUp(): void {
      this.bottomLeftNav = "assets/img/Button-On-Left.png";
    }

    bottomLeftNavMouseLeave(): void {
      this.bottomLeftNav = "assets/img/Button-On-Left.png";
    }

    bottomRightBoundStat(reachesRightBound: boolean) {
      if (reachesRightBound == true) {
        this.bottomRightNavDisabled = "none";
      } else {
        this.bottomRightNavDisabled = "block";
      }
    }

    bottomRightNavMouseDown(): void {
      this.bottomRightNav = "assets/img/Button-On-Right-Pressed.png";
    }

    bottomRightNavMouseUp(): void {
      this.bottomRightNav = "assets/img/Button-On-Right.png";
    }

    bottomRightNavMouseLeave(): void {
      this.bottomRightNav = "assets/img/Button-On-Right.png";
    }

    selectProduct(product: Product): void {
        this.snapDisabled = "true";
        this.selectedProductQuantityWanted = 1;
        this.selectedProduct = product;
        this.selectedProductDescriptionFontSize = (41.0 - 1.5 * Math.sqrt(this.selectedProduct.description.length)
          + (this.selectedProduct.description.length / 100.0)) + `px`;
    }

    selectedProductAnimation(): void {
      this.productHidden = false;
      this.productSelectedAnimation = true;
      setTimeout(() => {
        this.productShown = true;
        this.productSelectedAnimation = false;
      }, 700);
    }

    decreaseQuantityWanted(): void {
      if (this.selectedProductQuantityWanted > 1) {
        this.selectedProductQuantityWanted -= 1;
      }
    }

    minusButtonMouseDown(): void {
      this.minusButton = "assets/img/Minus-Button-Pressed.png";
    }

    minusButtonMouseUp(): void {
      this.minusButton = "assets/img/Minus-Button.png";
    }

    minusButtonMouseLeave(): void {
      this.minusButton = "assets/img/Minus-Button.png";
    }

    increaseQuantityWanted(): void {
      this.selectedProductQuantityWanted += 1;
    }

    plusButtonMouseDown(): void {
      this.plusButton = "assets/img/Plus-Button-Pressed.png";
    }

    plusButtonMouseUp(): void {
      this.plusButton = "assets/img/Plus-Button.png";
    }

    plusButtonMouseLeave(): void {
      this.plusButton = "assets/img/Plus-Button.png";
    }

    canceledProductAnimation(): void {
      this.productShown = false;
      this.productCanceledAnimation = true;
      setTimeout(() => {
        this.productCanceledAnimation = false;
        this.productHidden = true;
      }, 700);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }
}
