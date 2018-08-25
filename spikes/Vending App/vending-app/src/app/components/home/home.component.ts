import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Product } from '../../models/product.model';
import * as fs from 'fs';
import { promisify } from 'util';
import { TouchBarSlider } from 'electron';
import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';
import { DragScrollComponent } from 'ngx-drag-scroll';

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
    public screenShadingProductHidden: boolean = true;
    public screenShadingProductSelectedAnimationActive: boolean = false;
    public screenShadingProductShown: boolean = false;
    public screenShadingProductCanceledAnimationActive: boolean = false;
    public screenCircularHighlightProductHidden: boolean = true;
    public screenCircularHighlightProductSelectedAnimationActive: boolean = false;
    public screenCircularHighlightProductShown: boolean = false;
    public screenCircularHighlightProductCanceledAnimationActive: boolean = false;
    public selectedProductImageAreaProductHidden: boolean = true;
    public selectedProductImageAreaProductSelectedAnimationActive: boolean = false;
    public selectedProductImageAreaProductShown: boolean = false;
    public selectedProductImageAreaProductCanceledAnimationActive: boolean = false;
    public selectedProductInformationAreaProductHidden: boolean = true;
    public selectedProductInformationAreaProductSelectedAnimationActive: boolean = false;
    public selectedProductInformationAreaProductShown: boolean = false;
    public selectedProductInformationAreaProductCanceledAnimationActive: boolean = false;
    public selectedProductImage: string = "";
    public selectedProductName: string = "";
    public selectedProductDescription: string = "";
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

    selectProduct(id: string): void {
        this.snapDisabled = "true";
        this.selectedProductQuantityWanted = 1;

        for (let product of this.products1) {
          if (product.id == id) {
            this.selectedProductImage = `${product.largeImg}`;
            this.selectedProductName = `${product.name}`;
            this.selectedProductDescription = `${product.description}`;
            this.selectedProductDescriptionFontSize = (41.0 - 1.5 * Math.sqrt(this.selectedProductDescription.length) + (this.selectedProductDescription.length / 100.0)) + `px`;
          }
        }
        for (let product of this.products2) {
          if (product.id == id) {
            this.selectedProductImage = `${product.largeImg}`;
            this.selectedProductName = `${product.name}`;
            this.selectedProductDescription = `${product.description}`;
            this.selectedProductDescriptionFontSize = (41.0 - 1.5 * Math.sqrt(this.selectedProductDescription.length) + (this.selectedProductDescription.length / 100.0)) + `px`;
          }
        }

        console.log(id);
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
      if (this.selectedProductInformationAreaProductShown == true) {
        this.screenShadingProductShown = false;
        this.screenShadingProductCanceledAnimationActive = true;
        setTimeout(() => {
          this.screenShadingProductHidden = true;
          this.screenShadingProductCanceledAnimationActive = false;
        }, 2000);
      }
    }

    screenCircularHighlightCanceledProductAnimation(): void {
      if (this.selectedProductInformationAreaProductShown == true) {
        this.screenCircularHighlightProductShown = false;
        this.screenCircularHighlightProductCanceledAnimationActive = true;
        setTimeout(() => {
          this.screenCircularHighlightProductHidden = true;
          this.screenCircularHighlightProductCanceledAnimationActive = false;
        }, 1750);
      }
    }

    selectedProductImageAreaCanceledProductAnimation(): void {
      if (this.selectedProductInformationAreaProductShown == true) {
        this.selectedProductImageAreaProductShown = false;
        this.selectedProductImageAreaProductCanceledAnimationActive = true;
        setTimeout(() => {
          this.selectedProductImageAreaProductHidden = true;
          this.selectedProductImageAreaProductCanceledAnimationActive = false;
        }, 1000);
      }
    }

    selectedProductInformationAreaCanceledProductAnimation(): void {
      if (this.selectedProductInformationAreaProductShown == true) {
        this.selectedProductInformationAreaProductShown = false;
        this.selectedProductInformationAreaProductCanceledAnimationActive = true;
        setTimeout(() => {
          this.selectedProductInformationAreaProductHidden = true;
          this.selectedProductInformationAreaProductCanceledAnimationActive = false;
        }, 750);
      }
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }
}
