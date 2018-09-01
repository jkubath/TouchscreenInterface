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

    public topLeftNav = "assets/img/Button-On-Left.png";
    public topRightNav = "assets/img/Button-On-Right.png";
    public bottomLeftNav = "assets/img/Button-On-Left.png";
    public bottomRightNav = "assets/img/Button-On-Right.png";
    public topLeftNavDisabled = "block";
    public topRightNavDisabled = "block";
    public bottomLeftNavDisabled = "block";
    public bottomRightNavDisabled = "block";
    public snapDisabled = "false";
    public productHidden = true;
    public productSelectedAnimation = false;
    public productShown = false;
    public productCanceledAnimation = false;

    
    public screenShadingProductHidden = true;
    public screenShadingProductSelectedAnimationActive = false;
    public screenShadingProductShown = false;
    public screenShadingProductCanceledAnimationActive = false;
    public screenCircularHighlightProductHidden = true;
    public screenCircularHighlightProductSelectedAnimationActive = false;
    public screenCircularHighlightProductShown = false;
    public screenCircularHighlightProductCanceledAnimationActive = false;

   
    public selectedProductImageAreaProductHidden = true;
    public selectedProductImageAreaProductSelectedAnimationActive = false;
    public selectedProductImageAreaProductShown = false;
    public selectedProductImageAreaProductCanceledAnimationActive = false;
    public selectedProductInformationAreaProductHidden = true;
    public selectedProductInformationAreaProductSelectedAnimationActive = false;
    public selectedProductInformationAreaProductShown = false;
    public selectedProductInformationAreaProductCanceledAnimationActive = false;

     /* each attribute already exists in product and so is redundant to have global variables for
    public selectedProductImage: string = "";
    public selectedProductName: string = "";
    public selectedProductDescription: string = "";
    public selectedProductPrice: Money = {};
    */

    public selectedProduct: Product;

    public selectedProductDescriptionFontSize = "";
    public selectedProductQuantityWanted = 0;

    public minusButton = "assets/img/Minus-Button.png";
    public plusButton = "assets/img/Plus-Button.png";
    public cancelButton = "assets/img/Button-175.png";
    public cancelButtonClicked = false;
    public purchaseButton = "assets/img/Button-225.png";
    public purchaseButtonClicked = false;

    constructor() {
        this.loadProducts1().then( result => {
            this.products1 = result;
        });
        this.loadProducts2().then( result => {
            this.products2 = result;
        });
    }

    async loadProducts1(): Promise<Product[]> {
        let products1 = new Array<Product>();
        let i = 0;
        const readdir = promisify(fs.readdir);
        const contents = await readdir('./src/products');
        for (let content of contents) {
            if (i % 2 === 0) {
              let product = require(`products/${content}/data.json`) as Product;

              // create Money (Dinero) object from product data 'price' object
              try {
                product.price = new Money(product.price);
              } catch (error) {
                console.log(`Error parsing product price: ${error}`);
              }

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
        let i = 0;
        const readdir = promisify(fs.readdir);
        const contents = await readdir('./src/products');
        for (let content of contents) {
            if (i % 2 === 1) {
              let product = require(`products/${content}/data.json`) as Product;
              
              // create Money (Dinero) object from product data 'price' object
              try {
                product.price = new Money(product.price);
              } catch (error) {
                console.log(`Error parsing product price: ${error}`);
              }

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
      if (reachesLeftBound === true) {
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
      if (reachesRightBound === true) {
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
      if (reachesLeftBound === true) {
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
      if (reachesRightBound === true) {
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

    screenShadingSelectedProductAnimation(): void {
      this.screenShadingProductHidden = false;
      this.screenShadingProductSelectedAnimationActive = true;
      setTimeout(() => {
        this.screenShadingProductShown = true;
        this.screenShadingProductSelectedAnimationActive = false;
      }, 1000);
    }

    screenCircularHighlightSelectedProductAnimation(): void {
      this.screenCircularHighlightProductHidden = false;
      this.screenCircularHighlightProductSelectedAnimationActive = true;
      setTimeout(() => {
        this.screenCircularHighlightProductShown = true;
        this.screenCircularHighlightProductSelectedAnimationActive = false;
      }, 1250);
    }

    selectedProductImageAreaSelectedProductAnimation(): void {
      this.selectedProductImageAreaProductHidden = false;
      this.selectedProductImageAreaProductSelectedAnimationActive = true;
      setTimeout(() => {
        this.selectedProductImageAreaProductShown = true;
        this.selectedProductImageAreaProductSelectedAnimationActive = false;
      }, 2000);
    }

    selectedProductInformationAreaSelectedProductAnimation(): void {
      this.selectedProductInformationAreaProductHidden = false;
      this.selectedProductInformationAreaProductSelectedAnimationActive = true;
      setTimeout(() => {
        this.selectedProductInformationAreaProductShown = true;
        this.selectedProductInformationAreaProductSelectedAnimationActive = false;
      }, 2500);
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

    screenShadingCanceledProductAnimation(): void {
      if (this.selectedProductInformationAreaProductShown === true) {
        this.screenShadingProductShown = false;
        this.screenShadingProductCanceledAnimationActive = true;
        setTimeout(() => {
          this.screenShadingProductHidden = true;
          this.screenShadingProductCanceledAnimationActive = false;
        }, 2000);
      }
    }

    screenCircularHighlightCanceledProductAnimation(): void {
      if (this.selectedProductInformationAreaProductShown === true) {
        this.screenCircularHighlightProductShown = false;
        this.screenCircularHighlightProductCanceledAnimationActive = true;
        setTimeout(() => {
          this.screenCircularHighlightProductHidden = true;
          this.screenCircularHighlightProductCanceledAnimationActive = false;
        }, 1750);
      }
    }

    selectedProductImageAreaCanceledProductAnimation(): void {
      if (this.selectedProductInformationAreaProductShown === true) {
        this.selectedProductImageAreaProductShown = false;
        this.selectedProductImageAreaProductCanceledAnimationActive = true;
        setTimeout(() => {
          this.selectedProductImageAreaProductHidden = true;
          this.selectedProductImageAreaProductCanceledAnimationActive = false;
        }, 1000);
      }
    }

    selectedProductInformationAreaCanceledProductAnimation(): void {
      if (this.selectedProductInformationAreaProductShown === true) {
        this.selectedProductInformationAreaProductShown = false;
        this.selectedProductInformationAreaProductCanceledAnimationActive = true;
        setTimeout(() => {
          this.selectedProductInformationAreaProductHidden = true;
          this.selectedProductInformationAreaProductCanceledAnimationActive = false;
        }, 750);
      }
    }

    cancelButtonMouseDown(): void {
      this.cancelButton = "assets/img/Button-175-Pressed.png";
      this.cancelButtonClicked = true;
    }

    cancelButtonMouseUp(): void {
      this.cancelButton = "assets/img/Button-175.png";
      this.cancelButtonClicked = false;
    }

    cancelButtonMouseLeave(): void {
      this.cancelButton = "assets/img/Button-175.png";
      this.cancelButtonClicked = false;
    }

    purchaseButtonMouseDown(): void {
      this.purchaseButton = "assets/img/Button-225-Pressed.png";
      this.purchaseButtonClicked = true;
    }

    purchaseButtonMouseUp(): void {
      this.purchaseButton = "assets/img/Button-225.png";
      this.purchaseButtonClicked = false;
    }

    purchaseButtonMouseLeave(): void {
      this.purchaseButton = "assets/img/Button-225.png";
      this.purchaseButtonClicked = false;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }
}
