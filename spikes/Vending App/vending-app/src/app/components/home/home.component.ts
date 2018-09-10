import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { Animation } from '../../models/animation.model';
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
    // Top and Bottom DragScrollComponents
    @ViewChild('topScroller', {read: DragScrollComponent}) topds: DragScrollComponent;
    @ViewChild('bottomScroller', {read: DragScrollComponent}) bottomds: DragScrollComponent;

    // Product Rows
    public productsTopRow: Product[];
    public productsBottomRow: Product[];

    // Navigation Buttons Source
    public topLeftNavSource = "assets/img/Button-On-Left.png";
    public topRightNavSource = "assets/img/Button-On-Right.png";
    public bottomLeftNavSource = "assets/img/Button-On-Left.png";
    public bottomRightNavSource = "assets/img/Button-On-Right.png";

    // Navigation Buttons Enabled
    public topLeftNavEnabled = true;
    public topRightNavEnabled = true;
    public bottomLeftNavEnabled = true;
    public bottomRightNavEnabled = true;

    // Navigation Button Password
    public navPassword: boolean[] = [false, false, false, false, false, false, false, false];

    // Snap Enabled
    public snapDisabled = "false";   // Note: This is a string due to the type being required by ngx-drag-scroll

    // Animations
    public productSelectionScreenShadingAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public screenLightingAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public selectedProductImageAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public selectedProductInformationAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public informationEntryScreenShadingAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public userIDAndPasswordEntryAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public passwordCheckScreenShadingAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public passwordCheckInfoAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public pastInfoScreenShadingAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public pastInfoAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};

    // Selected Product Information
    public selectedProduct: Product;

    // Selected Product Description and Quantity info
    public selectedProductDescriptionFontSize = "";       // Description font size
    public selectedProductQuantityWanted = 0;             // Quantity wanted by user
    public selectedProductMaxQuantity = 0;                // Quantity available of product
    public selectedProductQuantityWantedAtMin = false;    // Whether or not quantity is at min
    public selectedProductQuantityWantedAtMax = false;    // Whether or not quantity is at max
    public selectedProductOutOfStock = false;             // Whether or not the product is out of stock

    // Minus and Plus Buttons
    public minusButton = "assets/img/Minus-Button.png";
    public plusButton = "assets/img/Plus-Button.png";

    // Cancel and Purchase Buttons (Note: The boolean is required so that the text color can be changed along with the image)
    public cancelButton = "assets/img/Button-175.png";
    public cancelButtonPressed = false;
    public purchaseButton = "assets/img/Button-225.png";
    public purchaseButtonPressed = false;

    // Information Entry
    public enteringUserIDAndPassword = false;
    public userIDExists = false;
    public enteringUserID = false;
    public userID: string[] = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
    public userIDLength = 0;
    public userIDString = "";
    public passwordIncorrect = false;
    public enteringPassword = false;
    public password: string[] = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
    public passwordLength = 0;
    public passwordString = "";
    public userIDAndPasswordChars: string[] = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
    public checkingPassword = false;
    public viewingPastInfo = false;

    // Hexadecimal buttons
    public zeroButton = "assets/img/Button-60.png";
    public zeroButtonPressed = false;
    public oneButton = "assets/img/Button-60.png";
    public oneButtonPressed = false;
    public twoButton = "assets/img/Button-60.png";
    public twoButtonPressed = false;
    public threeButton = "assets/img/Button-60.png";
    public threeButtonPressed = false;
    public fourButton = "assets/img/Button-60.png";
    public fourButtonPressed = false;
    public fiveButton = "assets/img/Button-60.png";
    public fiveButtonPressed = false;
    public sixButton = "assets/img/Button-60.png";
    public sixButtonPressed = false;
    public sevenButton = "assets/img/Button-60.png";
    public sevenButtonPressed = false;
    public eightButton = "assets/img/Button-60.png";
    public eightButtonPressed = false;
    public nineButton = "assets/img/Button-60.png";
    public nineButtonPressed = false;
    public aButton = "assets/img/Button-60.png";
    public aButtonPressed = false;
    public bButton = "assets/img/Button-60.png";
    public bButtonPressed = false;
    public cButton = "assets/img/Button-60.png";
    public cButtonPressed = false;
    public dButton = "assets/img/Button-60.png";
    public dButtonPressed = false;
    public eButton = "assets/img/Button-60.png";
    public eButtonPressed = false;
    public fButton = "assets/img/Button-60.png";
    public fButtonPressed = false;

    // Delete, Enter, Back, and Past Info Buttons
    public deleteButton = "assets/img/Button-312.png";
    public deleteButtonPressed = false;
    public enterButton = "assets/img/Button-312.png";
    public enterButtonPressed = false;
    public backButton = "assets/img/Button-175.png";
    public backButtonPressed = false;
    public pastInfoButton = "assets/img/Button-225.png";
    public pastInfoButtonPressed = false;

    // Hexadecimal Calculations
    public passwordA: string = "";
    public passwordB: string = "";
    public passwordC: string = "";
    public passwordSum: string = "";
    public passwordProduct: string = "";
    public passwordCheck: string = "";
    public pastInfoPasswordSum: string = "";
    public pastInfoPasswordCheck: string = "";

    // Back Button 2
    public backButton2 = "assets/img/Button-175.png";
    public backButton2Pressed = false;

    // Continue Button
    public continueButton = "assets/img/Button-225.png";
    public continueButtonPressed = false;



    constructor() {
        this.loadProductsTopRow().then( result => {
            this.productsTopRow = result;
        });
        this.loadProductsBottomRow().then( result => {
            this.productsBottomRow = result;
        });
    }

    // Load the products on the top row of the vending machine
    async loadProductsTopRow(): Promise<Product[]> {
        let productsTopRow = new Array<Product>();
        let i = 0;
        const readdir = promisify(fs.readdir);
        const contents = await readdir('./src/products');
        for (let content of contents) {
            if (i % 2 === 0) {
              let product = require(`products/${content}/data.json`) as Product;

              // Create Money (Dinero) object from product data 'price' object
              try {
                product.price = new Money(product.price);
              } catch (error) {
                console.log(`Error parsing product price: ${error}`);
              }

              product.smallImg = `products/${content}/${product.smallImg}`;
              product.largeImg = `products/${content}/${product.largeImg}`;
              productsTopRow.push(product);
            }
            i++;

        }
        return productsTopRow;
    }

    // Load the products on the bottom row of the vending machine
    async loadProductsBottomRow(): Promise<Product[]> {
        let productsBottomRow = new Array<Product>();
        let i = 0;
        const readdir = promisify(fs.readdir);
        const contents = await readdir('./src/products');
        for (let content of contents) {
            if (i % 2 === 1) {
              let product = require(`products/${content}/data.json`) as Product;

              // Create Money (Dinero) object from product data 'price' object
              try {
                product.price = new Money(product.price);
              } catch (error) {
                console.log(`Error parsing product price: ${error}`);
              }

              product.smallImg = `products/${content}/${product.smallImg}`;
              product.largeImg = `products/${content}/${product.largeImg}`;
              productsBottomRow.push(product);
            }
            i++;

        }
        return productsBottomRow;
    }

    // Get the quantity available for the selected product
    getSelectedProductMaxQuantity(): void {
      let fileContent = fs.readFileSync(`/home/matt/ScreenManager/spikes/Vending App/vending-app/src/product-data/${this.selectedProduct.id}.json`, "utf8");
      let jsonContent = JSON.parse(fileContent.toString());
      this.selectedProductMaxQuantity = jsonContent.quantity;
    }

    // Update the quantity available for the selected product
    updateSelectedProductMaxQuantity(): void {
      let fileContent = fs.readFileSync(`/home/matt/ScreenManager/spikes/Vending App/vending-app/src/product-data/${this.selectedProduct.id}.json`, "utf8");
      let jsonContent = JSON.parse(fileContent.toString());
      jsonContent.quantity -= this.selectedProductQuantityWanted;
      this.selectedProductMaxQuantity = jsonContent.quantity;

      // If the quantity available is less than the quantity wanted, update the quantity wanted
      if (this.selectedProductMaxQuantity < this.selectedProductQuantityWanted) {
        this.selectedProductQuantityWanted = this.selectedProductMaxQuantity;
      }

      fs.writeFileSync(`/home/matt/ScreenManager/spikes/Vending App/vending-app/src/product-data/${this.selectedProduct.id}.json`, JSON.stringify(jsonContent, null, 2));
    }

    // The following 20 functions handle events for the 4 nav buttons:
    //   [top/bottom][Left/Right]BoundStat - Checks if the left/right boundary has been reachesLeftBound
    //   [top/bottom][Left/Right]NavClick - Moves the row left/right and disables snap when nav button is clicked
    //   [top/bottom][Left/Right]NavMouseDown - Changes image to Button-On-[Left/Right]-Pressed.png
    //   [top/bottom][Left/Right]NavMouseUp - Changes image to Button-On-[Left/Right].png
    //   [top/bottom][Left/Right]NavMouseLeave - Changes image to Button-On-[Left/Right].png
    topLeftBoundStat(reachesLeftBound: boolean) {
      this.topLeftNavEnabled = !reachesLeftBound;
    }

    topLeftNavPassword(): void {
      if (this.navPassword[0] === false) {
        this.navPassword[0] = true;
        setTimeout(() => {
          if (this.navPassword[1] === false) {
            this.navPassword[0] = false;
          }
        }, 5000);
      } else if (this.navPassword[3] === true && this.navPassword[4] === false) {
        this.navPassword[4] = true;
        setTimeout(() => {
          if (this.navPassword[5] === false) {
            this.navPassword[0] = false;
            this.navPassword[1] = false;
            this.navPassword[2] = false;
            this.navPassword[3] = false;
            this.navPassword[4] = false;
          }
        }, 5000);
      }
    }

    topLeftNavClick(): void {
        this.topds.moveLeft();
        this.snapDisabled = "false";
    }

    topLeftNavMouseDown(): void {
      this.topLeftNavSource = "assets/img/Button-On-Left-Pressed.png";
    }

    topLeftNavMouseUp(): void {
      this.topLeftNavSource = "assets/img/Button-On-Left.png";
    }

    topLeftNavMouseLeave(): void {
      this.topLeftNavSource = "assets/img/Button-On-Left.png";
    }

    topRightBoundStat(reachesRightBound: boolean) {
      this.topRightNavEnabled = !reachesRightBound;
    }

    topRightNavPassword(): void {
      if (this.navPassword[0] === true && this.navPassword[1] === false) {
        this.navPassword[1] = true;
        setTimeout(() => {
          if (this.navPassword[2] === false) {
            this.navPassword[0] = false;
            this.navPassword[1] = false;
          }
        }, 5000);
      } else if (this.navPassword[4] === true && this.navPassword[5] === false) {
        this.navPassword[5] = true;
        setTimeout(() => {
          if (this.navPassword[6] === false) {
            this.navPassword[0] = false;
            this.navPassword[1] = false;
            this.navPassword[2] = false;
            this.navPassword[3] = false;
            this.navPassword[4] = false;
            this.navPassword[5] = false;
          }
        }, 5000);
      }
    }

    topRightNavClick(): void {
        this.topds.moveRight();
        this.snapDisabled = "false";
    }

    topRightNavMouseDown(): void {
      this.topRightNavSource = "assets/img/Button-On-Right-Pressed.png";
    }

    topRightNavMouseUp(): void {
      this.topRightNavSource = "assets/img/Button-On-Right.png";
    }

    topRightNavMouseLeave(): void {
      this.topRightNavSource = "assets/img/Button-On-Right.png";
    }

    bottomLeftBoundStat(reachesLeftBound: boolean) {
      this.bottomLeftNavEnabled = !reachesLeftBound;
    }

    bottomLeftNavPassword(): void {
      if (this.navPassword[1] === true && this.navPassword[2] === false) {
        this.navPassword[2] = true;
        setTimeout(() => {
          if (this.navPassword[3] === false) {
            this.navPassword[0] = false;
            this.navPassword[1] = false;
            this.navPassword[2] = false;
          }
        }, 5000);
      } else if (this.navPassword[5] === true && this.navPassword[6] === false) {
        this.navPassword[6] = true;
        setTimeout(() => {
          if (this.navPassword[7] === false) {
            this.navPassword[0] = false;
            this.navPassword[1] = false;
            this.navPassword[2] = false;
            this.navPassword[3] = false;
            this.navPassword[4] = false;
            this.navPassword[5] = false;
            this.navPassword[6] = false;
          }
        }, 5000);
      }
    }

    bottomLeftNavClick(): void {
      this.bottomds.moveLeft();
      this.snapDisabled = "false";
    }

    bottomLeftNavMouseDown(): void {
      this.bottomLeftNavSource = "assets/img/Button-On-Left-Pressed.png";
    }

    bottomLeftNavMouseUp(): void {
      this.bottomLeftNavSource = "assets/img/Button-On-Left.png";
    }

    bottomLeftNavMouseLeave(): void {
      this.bottomLeftNavSource = "assets/img/Button-On-Left.png";
    }

    bottomRightBoundStat(reachesRightBound: boolean) {
      this.bottomRightNavEnabled = !reachesRightBound;
    }

    bottomRightNavPassword(): void {
      if (this.navPassword[2] === true && this.navPassword[3] === false) {
        this.navPassword[3] = true;
        setTimeout(() => {
          if (this.navPassword[4] === false) {
            this.navPassword[0] = false;
            this.navPassword[1] = false;
            this.navPassword[2] = false;
            this.navPassword[3] = false;
          }
        }, 5000);
      } else if (this.navPassword[6] === true && this.navPassword[7] === false) {
        this.navPassword[7] = true;

        this.enteringUserIDAndPassword = true;
        this.enterUserIDAndPassword();

        this.navPassword[0] = false;
        this.navPassword[1] = false;
        this.navPassword[2] = false;
        this.navPassword[3] = false;
        this.navPassword[4] = false;
        this.navPassword[5] = false;
        this.navPassword[6] = false;
        this.navPassword[7] = false;
      }
    }

    bottomRightNavClick(): void {
      this.bottomds.moveRight();
      this.snapDisabled = "false";
    }

    bottomRightNavMouseDown(): void {
      this.bottomRightNavSource = "assets/img/Button-On-Right-Pressed.png";
    }

    bottomRightNavMouseUp(): void {
      this.bottomRightNavSource = "assets/img/Button-On-Right.png";
    }

    bottomRightNavMouseLeave(): void {
      this.bottomRightNavSource = "assets/img/Button-On-Right.png";
    }

    // Sets values and plays animations when a product is selected
    selectProduct(product: Product): void {
        this.snapDisabled = "true";
        this.selectedProduct = product;

        // Get the quantity for the selected product and do the following:
        //   - Set the starting quantity
        //   - Decide whether the current quantity is at the min, max, or neither
        //   - Decide whether to display a total price or "Out of Stock" message
        this.getSelectedProductMaxQuantity();
        if (this.selectedProductMaxQuantity === 0) {
          this.selectedProductQuantityWanted = 0;
          this.selectedProductQuantityWantedAtMax = true;
          this.selectedProductOutOfStock = true;
        } else {
          if (this.selectedProductMaxQuantity === 1) {
            this.selectedProductQuantityWantedAtMax = true;
          } else {
            this.selectedProductQuantityWantedAtMax = false;
          }
          this.selectedProductQuantityWanted = 1;
          this.selectedProductOutOfStock = false;
        }
        this.selectedProductQuantityWantedAtMin = true;

        // Calculate a font size for the description
        this.selectedProductDescriptionFontSize = (41.0 - 1.5 * Math.sqrt(this.selectedProduct.description.length)
          + (this.selectedProduct.description.length / 100.0)) + `px`;

        // Screen Shading Animation
        this.productSelectionScreenShadingAnimation.out = false;
        this.productSelectionScreenShadingAnimation.transitionIn = true;
        setTimeout(() => {
          this.productSelectionScreenShadingAnimation.transitionIn = false;
          this.productSelectionScreenShadingAnimation.in = true;
        }, 1000);

        // Screen Lighting Animation
        this.screenLightingAnimation.out = false;
        this.screenLightingAnimation.transitionIn = true;
        setTimeout(() => {
          this.screenLightingAnimation.transitionIn = false;
          this.screenLightingAnimation.in = true;
        }, 1250);

        // Selected Product Image Animation
        this.selectedProductImageAnimation.out = false;
        this.selectedProductImageAnimation.transitionIn = true;
        setTimeout(() => {
          this.selectedProductImageAnimation.transitionIn = false;
          this.selectedProductImageAnimation.in = true;
        }, 2000);

        // Selected Product Information Animation
        this.selectedProductInformationAnimation.out = false;
        this.selectedProductInformationAnimation.transitionIn = true;
        setTimeout(() => {
          this.selectedProductInformationAnimation.transitionIn = false;
          this.selectedProductInformationAnimation.in = true;
        }, 2500);
    }

    // The following 4 functions handle events for the minus button:
    //   decreaseQuantityWanted - Decrements selectedProductQuantityWanted if it's greater than 1
    //   minusButtonMouseDown - Changes image to Minus-Button-Pressed.png
    //   minusButtonMouseUp - Changes image to Minus-Button.png
    //   minusButtonMouseLeave - Changes image to Minus-Button.png
    decreaseQuantityWanted(): void {
      if (this.selectedProductQuantityWanted > 1) {
        this.selectedProductQuantityWanted -= 1;
      }

      if (this.selectedProductQuantityWanted === 1) {
        this.selectedProductQuantityWantedAtMin = true;
      }

      if (this.selectedProductQuantityWanted < this.selectedProductMaxQuantity) {
        this.selectedProductQuantityWantedAtMax = false;
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

    // The following 4 functions handle events for the plus button:
    //   increaseQuantityWanted - Increments selectedProductQuantityWanted
    //   plusButtonMouseDown - Changes image to Plus-Button-Pressed.png
    //   plusButtonMouseUp - Changes image to Plus-Button.png
    //   plusButtonMouseLeave - Changes image to Plus-Button.png
    increaseQuantityWanted(): void {
      if (this.selectedProductQuantityWanted < this.selectedProductMaxQuantity) {
        this.selectedProductQuantityWanted += 1;
      }

      if (this.selectedProductQuantityWanted === this.selectedProductMaxQuantity) {
        this.selectedProductQuantityWantedAtMax = true;
      }

      if (this.selectedProductQuantityWanted > 1) {
        this.selectedProductQuantityWantedAtMin = false;
      }
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

    // Plays animations when the cancel button is pressed for a product
    cancelProduct(): void {
      if (this.selectedProductInformationAnimation.in === true) {

        // Screen Shading Animation
        this.productSelectionScreenShadingAnimation.in = false;
        this.productSelectionScreenShadingAnimation.transitionOut = true;
        setTimeout(() => {
          this.productSelectionScreenShadingAnimation.transitionOut = false;
          this.productSelectionScreenShadingAnimation.out = true;
          this.selectedProduct = null;
        }, 2000);

        // Screen Lighting Animation
        this.screenLightingAnimation.in = false;
        this.screenLightingAnimation.transitionOut = true;
        setTimeout(() => {
          this.screenLightingAnimation.transitionOut = false;
          this.screenLightingAnimation.out = true;
        }, 1750);

        // Selected Product Image Animation
        this.selectedProductImageAnimation.in = false;
        this.selectedProductImageAnimation.transitionOut = true;
        setTimeout(() => {
          this.selectedProductImageAnimation.transitionOut = false;
          this.selectedProductImageAnimation.out = true;
        }, 1000);

        // Selected Product Information Animation
        this.selectedProductInformationAnimation.in = false;
        this.selectedProductInformationAnimation.transitionOut = true;
        setTimeout(() => {
          this.selectedProductInformationAnimation.transitionOut = false;
          this.selectedProductInformationAnimation.out = true;
        }, 750);
      }
    }

    // The following 3 functions handle events for the cancel button:
    //   cancelButtonMouseDown - Changes image to Button-175-Pressed.png
    //   cancelButtonMouseUp - Changes image to Button-175.png
    //   cancelButtonMouseLeave - Changes image to Button-175.png
    cancelButtonMouseDown(): void {
      this.cancelButton = "assets/img/Button-175-Pressed.png";
      this.cancelButtonPressed = true;
    }

    cancelButtonMouseUp(): void {
      this.cancelButton = "assets/img/Button-175.png";
      this.cancelButtonPressed = false;
    }

    cancelButtonMouseLeave(): void {
      this.cancelButton = "assets/img/Button-175.png";
      this.cancelButtonPressed = false;
    }

    // When you purchase a product, do the following:
    //   - Update the max quantity available for the selected product
    //   - Decide whether the current quantity is at the min, max, or neither
    purchaseProduct(): void {
      this.updateSelectedProductMaxQuantity();
      if (this.selectedProductMaxQuantity === 0) {
        this.selectedProductQuantityWantedAtMin = true;
        this.selectedProductQuantityWantedAtMax = true;
        this.selectedProductOutOfStock = true;
      } else {
        if (this.selectedProductQuantityWanted === 1) {
          this.selectedProductQuantityWantedAtMin = true;
        }

        if (this.selectedProductMaxQuantity === this.selectedProductQuantityWanted) {
          this.selectedProductQuantityWantedAtMax = true;
        } else {
          this.selectedProductQuantityWantedAtMax = false;
        }
      }
    }

    // The following 3 functions handle events for the purchase button:
    //   purchaseButtonMouseDown - Changes image to Button-225-Pressed.png
    //   purchaseButtonMouseUp - Changes image to Button-225.png
    //   purchaseButtonMouseLeave - Changes image to Button-225.png
    purchaseButtonMouseDown(): void {
      this.purchaseButton = "assets/img/Button-225-Pressed.png";
      this.purchaseButtonPressed = true;
    }

    purchaseButtonMouseUp(): void {
      this.purchaseButton = "assets/img/Button-225.png";
      this.purchaseButtonPressed = false;
    }

    purchaseButtonMouseLeave(): void {
      this.purchaseButton = "assets/img/Button-225.png";
      this.purchaseButtonPressed = false;
    }

    /*****************************************************/
    // Runs when the user presses the correct combination of nav buttons
    enterUserIDAndPassword(): void {
        this.enteringUserID = true;

        // Screen Shading Animation
        this.informationEntryScreenShadingAnimation.out = false;
        this.informationEntryScreenShadingAnimation.transitionIn = true;
        setTimeout(() => {
          this.informationEntryScreenShadingAnimation.transitionIn = false;
          this.informationEntryScreenShadingAnimation.in = true;
        }, 1000);

        // User ID and Password Entry Animations
        this.userIDAndPasswordEntryAnimation.out = false;
        this.userIDAndPasswordEntryAnimation.transitionIn = true;
        setTimeout(() => {
          this.userIDAndPasswordEntryAnimation.transitionIn = false;
          this.userIDAndPasswordEntryAnimation.in = true;
        }, 1500);
    }

    // The following 64 functions handle events for the hexadecimal buttons:
    //   ___ButtonClick - Adds that character to the User ID or Password entry
    //   ___ButtonMouseDown - Changes image to Button-60-Pressed.png
    //   ___ButtonMouseUp - Changes image to Button-60.png
    //   ___ButtonMouseLeave - Changes image to Button-60.png
    zeroButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "0";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "0";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "0";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "0";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "0";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "0";
        }
        this.passwordLength++;
      }
    }

    zeroButtonMouseDown(): void {
      this.zeroButton = "assets/img/Button-60-Pressed.png";
      this.zeroButtonPressed = true;
    }

    zeroButtonMouseUp(): void {
      this.zeroButton = "assets/img/Button-60.png";
      this.zeroButtonPressed = false;
    }

    zeroButtonMouseLeave(): void {
      this.zeroButton = "assets/img/Button-60.png";
      this.zeroButtonPressed = false;
    }

    oneButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "1";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "1";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "1";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "1";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "1";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "1";
        }
        this.passwordLength++;
      }
    }

    oneButtonMouseDown(): void {
      this.oneButton = "assets/img/Button-60-Pressed.png";
      this.oneButtonPressed = true;
    }

    oneButtonMouseUp(): void {
      this.oneButton = "assets/img/Button-60.png";
      this.oneButtonPressed = false;
    }

    oneButtonMouseLeave(): void {
      this.oneButton = "assets/img/Button-60.png";
      this.oneButtonPressed = false;
    }

    twoButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "2";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "2";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "2";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "2";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "2";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "2";
        }
        this.passwordLength++;
      }
    }

    twoButtonMouseDown(): void {
      this.twoButton = "assets/img/Button-60-Pressed.png";
      this.twoButtonPressed = true;
    }

    twoButtonMouseUp(): void {
      this.twoButton = "assets/img/Button-60.png";
      this.twoButtonPressed = false;
    }

    twoButtonMouseLeave(): void {
      this.twoButton = "assets/img/Button-60.png";
      this.twoButtonPressed = false;
    }

    threeButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "3";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "3";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "3";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "3";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "3";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "3";
        }
        this.passwordLength++;
      }
    }

    threeButtonMouseDown(): void {
      this.threeButton = "assets/img/Button-60-Pressed.png";
      this.threeButtonPressed = true;
    }

    threeButtonMouseUp(): void {
      this.threeButton = "assets/img/Button-60.png";
      this.threeButtonPressed = false;
    }

    threeButtonMouseLeave(): void {
      this.threeButton = "assets/img/Button-60.png";
      this.threeButtonPressed = false;
    }

    fourButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "4";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "4";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "4";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "4";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "4";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "4";
        }
        this.passwordLength++;
      }
    }

    fourButtonMouseDown(): void {
      this.fourButton = "assets/img/Button-60-Pressed.png";
      this.fourButtonPressed = true;
    }

    fourButtonMouseUp(): void {
      this.fourButton = "assets/img/Button-60.png";
      this.fourButtonPressed = false;
    }

    fourButtonMouseLeave(): void {
      this.fourButton = "assets/img/Button-60.png";
      this.fourButtonPressed = false;
    }

    fiveButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "5";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "5";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "5";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "5";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "5";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "5";
        }
        this.passwordLength++;
      }
    }

    fiveButtonMouseDown(): void {
      this.fiveButton = "assets/img/Button-60-Pressed.png";
      this.fiveButtonPressed = true;
    }

    fiveButtonMouseUp(): void {
      this.fiveButton = "assets/img/Button-60.png";
      this.fiveButtonPressed = false;
    }

    fiveButtonMouseLeave(): void {
      this.fiveButton = "assets/img/Button-60.png";
      this.fiveButtonPressed = false;
    }

    sixButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "6";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "6";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "6";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "6";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "6";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "6";
        }
        this.passwordLength++;
      }
    }

    sixButtonMouseDown(): void {
      this.sixButton = "assets/img/Button-60-Pressed.png";
      this.sixButtonPressed = true;
    }

    sixButtonMouseUp(): void {
      this.sixButton = "assets/img/Button-60.png";
      this.sixButtonPressed = false;
    }

    sixButtonMouseLeave(): void {
      this.sixButton = "assets/img/Button-60.png";
      this.sixButtonPressed = false;
    }

    sevenButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "7";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "7";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "7";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "7";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "7";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "7";
        }
        this.passwordLength++;
      }
    }

    sevenButtonMouseDown(): void {
      this.sevenButton = "assets/img/Button-60-Pressed.png";
      this.sevenButtonPressed = true;
    }

    sevenButtonMouseUp(): void {
      this.sevenButton = "assets/img/Button-60.png";
      this.sevenButtonPressed = false;
    }

    sevenButtonMouseLeave(): void {
      this.sevenButton = "assets/img/Button-60.png";
      this.sevenButtonPressed = false;
    }

    eightButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "8";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "8";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "8";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "8";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "8";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "8";
        }
        this.passwordLength++;
      }
    }

    eightButtonMouseDown(): void {
      this.eightButton = "assets/img/Button-60-Pressed.png";
      this.eightButtonPressed = true;
    }

    eightButtonMouseUp(): void {
      this.eightButton = "assets/img/Button-60.png";
      this.eightButtonPressed = false;
    }

    eightButtonMouseLeave(): void {
      this.eightButton = "assets/img/Button-60.png";
      this.eightButtonPressed = false;
    }

    nineButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "9";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "9";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "9";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "9";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "9";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "9";
        }
        this.passwordLength++;
      }
    }

    nineButtonMouseDown(): void {
      this.nineButton = "assets/img/Button-60-Pressed.png";
      this.nineButtonPressed = true;
    }

    nineButtonMouseUp(): void {
      this.nineButton = "assets/img/Button-60.png";
      this.nineButtonPressed = false;
    }

    nineButtonMouseLeave(): void {
      this.nineButton = "assets/img/Button-60.png";
      this.nineButtonPressed = false;
    }

    aButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "A";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "A";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "A";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "A";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "A";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "A";
        }
        this.passwordLength++;
      }
    }

    aButtonMouseDown(): void {
      this.aButton = "assets/img/Button-60-Pressed.png";
      this.aButtonPressed = true;
    }

    aButtonMouseUp(): void {
      this.aButton = "assets/img/Button-60.png";
      this.aButtonPressed = false;
    }

    aButtonMouseLeave(): void {
      this.aButton = "assets/img/Button-60.png";
      this.aButtonPressed = false;
    }

    bButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "B";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "B";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "B";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "B";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "B";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "B";
        }
        this.passwordLength++;
      }
    }

    bButtonMouseDown(): void {
      this.bButton = "assets/img/Button-60-Pressed.png";
      this.bButtonPressed = true;
    }

    bButtonMouseUp(): void {
      this.bButton = "assets/img/Button-60.png";
      this.bButtonPressed = false;
    }

    bButtonMouseLeave(): void {
      this.bButton = "assets/img/Button-60.png";
      this.bButtonPressed = false;
    }

    cButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "C";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "C";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "C";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "C";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "C";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "C";
        }
        this.passwordLength++;
      }
    }

    cButtonMouseDown(): void {
      this.cButton = "assets/img/Button-60-Pressed.png";
      this.cButtonPressed = true;
    }

    cButtonMouseUp(): void {
      this.cButton = "assets/img/Button-60.png";
      this.cButtonPressed = false;
    }

    cButtonMouseLeave(): void {
      this.cButton = "assets/img/Button-60.png";
      this.cButtonPressed = false;
    }

    dButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "D";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "D";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "D";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "D";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "D";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "D";
        }
        this.passwordLength++;
      }
    }

    dButtonMouseDown(): void {
      this.dButton = "assets/img/Button-60-Pressed.png";
      this.dButtonPressed = true;
    }

    dButtonMouseUp(): void {
      this.dButton = "assets/img/Button-60.png";
      this.dButtonPressed = false;
    }

    dButtonMouseLeave(): void {
      this.dButton = "assets/img/Button-60.png";
      this.dButtonPressed = false;
    }

    eButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "E";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "E";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "E";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "E";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "E";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "E";
        }
        this.passwordLength++;
      }
    }

    eButtonMouseDown(): void {
      this.eButton = "assets/img/Button-60-Pressed.png";
      this.eButtonPressed = true;
    }

    eButtonMouseUp(): void {
      this.eButton = "assets/img/Button-60.png";
      this.eButtonPressed = false;
    }

    eButtonMouseLeave(): void {
      this.eButton = "assets/img/Button-60.png";
      this.eButtonPressed = false;
    }

    fButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength < this.userID.length) {
        this.userID[this.userIDLength] = "F";
        this.userIDAndPasswordChars[this.userIDLength] = "*";
        this.userIDLength++;
      } else if (this.enteringPassword === true && this.passwordLength < this.password.length) {
        this.passwordIncorrect = false;
        this.password[this.passwordLength] = "F";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "F";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "F";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "F";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "F";
        }
        this.passwordLength++;
      }
    }

    fButtonMouseDown(): void {
      this.fButton = "assets/img/Button-60-Pressed.png";
      this.fButtonPressed = true;
    }

    fButtonMouseUp(): void {
      this.fButton = "assets/img/Button-60.png";
      this.fButtonPressed = false;
    }

    fButtonMouseLeave(): void {
      this.fButton = "assets/img/Button-60.png";
      this.fButtonPressed = false;
    }

    // The following 4 functions handle events for the delete button:
    //   deleteButtonClick - Removes a character from the User ID or Password entry
    //   deleteButtonMouseDown - Changes image to Button-312-Pressed.png
    //   deleteButtonMouseUp - Changes image to Button-312.png
    //   deleteButtonMouseLeave - Changes image to Button-312.png
    deleteButtonClick(): void {
      if (this.enteringUserID === true && this.userIDLength > 0) {
        this.userIDLength--;
        this.userID[this.userIDLength] = "";
        this.userIDAndPasswordChars[this.userIDLength] = "";
      } else if (this.enteringPassword === true && this.passwordLength > 0) {
        this.passwordIncorrect = false;
        this.passwordLength--;
        this.password[this.passwordLength] = "";
        if (this.passwordLength >= 15) {
          this.userIDAndPasswordChars[this.passwordLength + 3] = "";
        } else if (this.passwordLength >= 10) {
          this.userIDAndPasswordChars[this.passwordLength + 2] = "";
        } else if (this.passwordLength >= 5) {
          this.userIDAndPasswordChars[this.passwordLength + 1] = "";
        } else {
          this.userIDAndPasswordChars[this.passwordLength] = "";
        }
      }
    }

    deleteButtonMouseDown(): void {
      this.deleteButton = "assets/img/Button-312-Pressed.png";
      this.deleteButtonPressed = true;
    }

    deleteButtonMouseUp(): void {
      this.deleteButton = "assets/img/Button-312.png";
      this.deleteButtonPressed = false;
    }

    deleteButtonMouseLeave(): void {
      this.deleteButton = "assets/img/Button-312.png";
      this.deleteButtonPressed = false;
    }

    // The following 4 functions handle events for the enter button:
    //   enterButtonClick - Submits the User ID or Password
    //   enterButtonMouseDown - Changes image to Button-312-Pressed.png
    //   enterButtonMouseUp - Changes image to Button-312.png
    //   enterButtonMouseLeave - Changes image to Button-312.png
    enterButtonClick(): void {
      if (this.enteringUserID === true) {
        this.enteringUserID = false;
        this.enteringPassword = true;

        let i = 0;
        while (i < this.userIDAndPasswordChars.length) {
          this.userIDAndPasswordChars[i] = "";
          i++;
        }

        this.userIDString = "";
        i = 0;
        while (i < this.userID.length) {
          this.userIDString = this.userIDString + this.userID[i];
          i++;
        }

        try {
          let exists = fs.statSync(`/home/matt/ScreenManager/spikes/Vending App/vending-app/src/user-data/${this.userIDString}.json`);
          this.userIDExists = true;
        } catch (error) {
          this.userIDExists = false;
        }

        if (this.userIDExists === true) {
          let fileContent = fs.readFileSync(`/home/matt/ScreenManager/spikes/Vending App/vending-app/src/user-data/${this.userIDString}.json`, "utf8");
          let jsonContent = JSON.parse(fileContent.toString());
          this.passwordB = jsonContent.passwordB;
          this.passwordC = jsonContent.passwordC;
          this.pastInfoPasswordSum = jsonContent.pastInfoPasswordSum;
          this.pastInfoPasswordCheck = jsonContent.pastInfoPasswordCheck;
        } else {
          this.passwordC = this.generateHex(20);
          while (this.compareHex("1000000000000000", this.passwordC) > 0) {
            this.passwordC = this.generateHex(20);
          }
          this.passwordB = this.generateHex(20);
          while (this.compareHex(this.passwordB, this.passwordC) >= 0) {
            this.passwordB = this.generateHex(20);
          }
          let j = 0;
          this.pastInfoPasswordSum = "81A2E0063BB7C5E42F21";
          this.pastInfoPasswordCheck = "C2510CD533EFE3099AD6"
          while (j < this.userID.length) {
            let k = 0;
            let passwordSumHexToAdd = "";
            let passwordCheckHexToAdd = "";
            while (k < this.pastInfoPasswordSum.length) {
              if (k % 16 === 0) {
                passwordSumHexToAdd = passwordSumHexToAdd + this.setLengthOfHex(this.modHex(this.multiplyHex(this.userID[j], "1"), "10"), 1);
              } else {
                passwordSumHexToAdd = passwordSumHexToAdd + this.setLengthOfHex(this.modHex(this.multiplyHex(this.userID[j], this.decToHex(k % 16)), "10"), 1);
              }
              k++;
            }
            k = 0;
            while (k < this.pastInfoPasswordCheck.length) {
              if (k % 16 === 0) {
                passwordCheckHexToAdd = this.setLengthOfHex(this.modHex(this.multiplyHex(this.userID[j], "1"), "10"), 1) + passwordCheckHexToAdd;
              } else {
                passwordCheckHexToAdd = this.setLengthOfHex(this.modHex(this.multiplyHex(this.userID[j], this.decToHex(k % 16)), "10"), 1) + passwordCheckHexToAdd;
              }
              k++;
            }
            this.pastInfoPasswordSum = this.setLengthOfHex(this.modHex(this.addHex(this.pastInfoPasswordSum, passwordSumHexToAdd), "100000000000000000000"), 20);
            this.pastInfoPasswordCheck = this.setLengthOfHex(this.modHex(this.addHex(this.pastInfoPasswordCheck, passwordCheckHexToAdd), "100000000000000000000"), 20);
            j++;
          }
        }

        this.pastInfoPasswordSum = this.pastInfoPasswordSum.substr(0, 5) + "-" + this.pastInfoPasswordSum.substr(5, 5) + "-" +
                                   this.pastInfoPasswordSum.substr(10, 5) + "-" + this.pastInfoPasswordSum.substr(15);
        this.pastInfoPasswordCheck = this.pastInfoPasswordCheck.substr(0, 5) + "-" + this.pastInfoPasswordCheck.substr(5, 5) + "-" +
                                     this.pastInfoPasswordCheck.substr(10, 5) + "-" + this.pastInfoPasswordCheck.substr(15);

        i = 0;
        while(i < this.userID.length) {
          this.userID[i] = "";
          i++;
        }
        this.userIDLength = 0;

        this.userIDAndPasswordChars[5] = "-";
        this.userIDAndPasswordChars[11] = "-";
        this.userIDAndPasswordChars[17] = "-";

        this.passwordA = this.generateHex(20);
        while (this.compareHex(this.passwordA, this.passwordC) >= 0) {
          this.passwordA = this.generateHex(20);
        }
        this.passwordSum = this.modHex(this.addHex(this.passwordA, this.passwordB), this.passwordC);
        this.passwordSum = this.setLengthOfHex(this.passwordSum, 20);
        this.passwordSum = this.passwordSum.substr(0, 5) + "-" + this.passwordSum.substr(5, 5) + "-" +
                           this.passwordSum.substr(10, 5) + "-" + this.passwordSum.substr(15);
        this.passwordProduct = this.modHex(this.multiplyHex(this.passwordA, this.passwordB), this.passwordC);
        this.passwordProduct = this.setLengthOfHex(this.passwordProduct, 20);
      } else if (this.enteringPassword === true) {
        this.passwordString = "";

        let i = 0;
        while (i < this.passwordLength) {
          this.passwordString = this.passwordString + this.password[i];
          i++;
        }

        let passwordCorrect = true;
        if (this.passwordString.length === this.passwordProduct.length) {
          let j = 0;
          while (j < this.passwordString.length) {
            if (this.passwordString[j] != this.passwordProduct[j]) {
              passwordCorrect = false;
            }
            j++;
          }
        } else {
          passwordCorrect = false;
        }

        if (passwordCorrect === true && this.userIDExists === true) {
          console.log("CORRECT");

          this.pastInfoPasswordSum = this.passwordSum;
          this.passwordCheck = this.setLengthOfHex(this.modHex(this.multiplyHex(this.multiplyHex(this.multiplyHex(this.modHex(this.passwordA, this.passwordB), this.modHex(this.passwordB, this.passwordA)), this.modHex(this.passwordC, this.passwordA)), this.modHex(this.passwordC, this.passwordB)), "100000000000000000000"), 20);
          this.pastInfoPasswordCheck = this.passwordCheck;
          this.displayPasswordCheck();

          let fileContent = fs.readFileSync(`/home/matt/ScreenManager/spikes/Vending App/vending-app/src/user-data/${this.userIDString}.json`, "utf8");
          let jsonContent = JSON.parse(fileContent.toString());
          this.passwordB = this.setLengthOfHex(this.modHex(this.addHex(this.passwordB, this.multiplyHex(this.passwordC, this.passwordC)), "100000000000000000000"), 20);
          this.passwordC = this.setLengthOfHex(this.modHex(this.addHex(this.passwordC, this.multiplyHex(this.passwordA, this.passwordA)), "100000000000000000000"), 20);
          while (this.compareHex(this.passwordB, this.passwordC) >= 0 || this.compareHex("1000000000000000", this.passwordC) >= 0) {
            this.passwordB = this.setLengthOfHex(this.modHex(this.addHex(this.passwordB, this.multiplyHex(this.passwordC, this.passwordC)), "100000000000000000000"), 20);
            this.passwordC = this.setLengthOfHex(this.modHex(this.addHex(this.passwordC, this.multiplyHex(this.passwordA, this.passwordA)), "100000000000000000000"), 20);
          }

          jsonContent.passwordB = this.passwordB;
          jsonContent.passwordC = this.passwordC;
          jsonContent.pastInfoPasswordSum = this.pastInfoPasswordSum;
          jsonContent.pastInfoPasswordCheck = this.pastInfoPasswordCheck;
          this.userIDExists = false;
          this.passwordA = "";
          this.passwordB = "";
          this.passwordC = "";
          fs.writeFileSync(`/home/matt/ScreenManager/spikes/Vending App/vending-app/src/user-data/${this.userIDString}.json`, JSON.stringify(jsonContent, null, 2));
          this.userIDString = "";
          this.passwordString = "";

          i = 0;
          while (i < this.userIDAndPasswordChars.length) {
            this.userIDAndPasswordChars[i] = "";
            i++;
          }

          i = 0;
          while (i < this.password.length) {
            this.password[i] = "";
            i++;
          }
          this.passwordLength = 0;
        } else {
          this.passwordIncorrect = true;
        }
      }
    }

    enterButtonMouseDown(): void {
      this.enterButton = "assets/img/Button-312-Pressed.png";
      this.enterButtonPressed = true;
    }

    enterButtonMouseUp(): void {
      this.enterButton = "assets/img/Button-312.png";
      this.enterButtonPressed = false;
    }

    enterButtonMouseLeave(): void {
      this.enterButton = "assets/img/Button-312.png";
      this.enterButtonPressed = false;
    }

    backButtonClick(): void {
      if (this.enteringPassword === true) {
        this.enteringPassword = false;
        this.passwordIncorrect = false;
        this.enteringUserID = true;
        this.userIDExists = false;
        this.passwordA = "";
        this.passwordB = "";
        this.passwordC = "";
        this.userIDString = "";

        let i = 0;
        while (i < this.userIDAndPasswordChars.length) {
          this.userIDAndPasswordChars[i] = "";
          i++;
        }

        i = 0;
        while (i < this.password.length) {
          this.password[i] = "";
          i++;
        }
        this.passwordLength = 0;
      } else if (this.enteringUserID === true) {
        this.enteringUserID = false;

        // Screen Shading Animation
        this.informationEntryScreenShadingAnimation.in = false;
        this.informationEntryScreenShadingAnimation.transitionOut = true;
        setTimeout(() => {
          this.informationEntryScreenShadingAnimation.transitionOut = false;
          this.informationEntryScreenShadingAnimation.out = true;

          let i = 0;
          while (i < this.userIDAndPasswordChars.length) {
            this.userIDAndPasswordChars[i] = "";
            i++;
          }

          i = 0;
          while (i < this.userID.length) {
            this.userID[i] = "";
            i++;
          }
          this.userIDLength = 0;
        }, 2000);

        // User ID and Password Entry Animations
        this.userIDAndPasswordEntryAnimation.in = false;
        this.userIDAndPasswordEntryAnimation.transitionOut = true;
        setTimeout(() => {
          this.userIDAndPasswordEntryAnimation.transitionOut = false;
          this.userIDAndPasswordEntryAnimation.out = true;
        }, 1000);
      }
    }

    backButtonMouseDown(): void {
      this.backButton = "assets/img/Button-175-Pressed.png";
      this.backButtonPressed = true;
    }

    backButtonMouseUp(): void {
      this.backButton = "assets/img/Button-175.png";
      this.backButtonPressed = false;
    }

    backButtonMouseLeave(): void {
      this.backButton = "assets/img/Button-175.png";
      this.backButtonPressed = false;
    }

    pastInfoButtonClick(): void {
      this.viewingPastInfo = true;

      // Screen Shading Animation
      this.pastInfoScreenShadingAnimation.out = false;
      this.pastInfoScreenShadingAnimation.transitionIn = true;
      setTimeout(() => {
        this.pastInfoScreenShadingAnimation.transitionIn = false;
        this.pastInfoScreenShadingAnimation.in = true;
      }, 1000);

      this.pastInfoAnimation.out = false;
      this.pastInfoAnimation.transitionIn = true;
      setTimeout(() => {
        this.pastInfoAnimation.transitionIn = false;
        this.pastInfoAnimation.in = true;
      }, 1500);
    }

    pastInfoButtonMouseDown(): void {
      this.pastInfoButton = "assets/img/Button-225-Pressed.png";
      this.pastInfoButtonPressed = true;
    }

    pastInfoButtonMouseUp(): void {
      this.pastInfoButton = "assets/img/Button-225.png";
      this.pastInfoButtonPressed = false;
    }

    pastInfoButtonMouseLeave(): void {
      this.pastInfoButton = "assets/img/Button-225.png";
      this.pastInfoButtonPressed = false;
    }

    backButton2Click(): void {
      // Screen Shading Animation
      this.pastInfoScreenShadingAnimation.in = false;
      this.pastInfoScreenShadingAnimation.transitionOut = true;
      setTimeout(() => {
        this.pastInfoScreenShadingAnimation.transitionOut = false;
        this.pastInfoScreenShadingAnimation.out = true;

        this.viewingPastInfo = false;
      }, 2000);

      this.pastInfoAnimation.in = false;
      this.pastInfoAnimation.transitionOut = true;
      setTimeout(() => {
        this.pastInfoAnimation.transitionOut = false;
        this.pastInfoAnimation.out = true;
      }, 1500);

    }

    backButton2MouseDown(): void {
      this.backButton2 = "assets/img/Button-175-Pressed.png";
      this.backButton2Pressed = true;
    }

    backButton2MouseUp(): void {
      this.backButton2 = "assets/img/Button-175.png";
      this.backButton2Pressed = false;
    }

    backButton2MouseLeave(): void {
      this.backButton2 = "assets/img/Button-175.png";
      this.backButton2Pressed = false;
    }

    displayPasswordCheck(): void {
      this.checkingPassword = true;

      // Screen Shading Animation
      this.passwordCheckScreenShadingAnimation.out = false;
      this.passwordCheckScreenShadingAnimation.transitionIn = true;
      setTimeout(() => {
        this.passwordCheckScreenShadingAnimation.transitionIn = false;
        this.passwordCheckScreenShadingAnimation.in = true;
      }, 1000);

      this.passwordCheckInfoAnimation.out = false;
      this.passwordCheckInfoAnimation.transitionIn = true;
      setTimeout(() => {
        this.passwordCheckInfoAnimation.transitionIn = false;
        this.passwordCheckInfoAnimation.in = true;
      }, 1500);

    }

    continueButtonClick(): void {
      // Screen Shading Animation
      this.passwordCheckScreenShadingAnimation.in = false;
      this.passwordCheckScreenShadingAnimation.transitionOut = true;
      setTimeout(() => {
        this.passwordCheckScreenShadingAnimation.transitionOut = false;
        this.passwordCheckScreenShadingAnimation.out = true;

        this.checkingPassword = false;
      }, 2000);

      this.passwordCheckInfoAnimation.in = false;
      this.passwordCheckInfoAnimation.transitionOut = true;
      setTimeout(() => {
        this.passwordCheckInfoAnimation.transitionOut = false;
        this.passwordCheckInfoAnimation.out = true;
      }, 1500);

      // User ID and Password Entry Animations
      this.userIDAndPasswordEntryAnimation.in = false;
      this.userIDAndPasswordEntryAnimation.transitionOut = true;
      setTimeout(() => {
        this.userIDAndPasswordEntryAnimation.transitionOut = false;
        this.userIDAndPasswordEntryAnimation.out = true;
      }, 1000);
    }

    continueButtonMouseDown(): void {
      this.continueButton = "assets/img/Button-225-Pressed.png";
      this.continueButtonPressed = true;
    }

    contineButtonMouseUp(): void {
      this.continueButton = "assets/img/Button-225.png";
      this.continueButtonPressed = false;
    }

    continueButtonMouseLeave(): void {
      this.continueButton = "assets/img/Button-225.png";
      this.continueButtonPressed = false;
    }

    decToHex(decimal: number): string {
      switch(decimal) {
        case 0: {
          return "0";
        }
        case 1: {
          return "1";
        }
        case 2: {
          return "2";
        }
        case 3: {
          return "3";
        }
        case 4: {
          return "4";
        }
        case 5: {
          return "5";
        }
        case 6: {
          return "6";
        }
        case 7: {
          return "7";
        }
        case 8: {
          return "8";
        }
        case 9: {
          return "9";
        }
        case 10: {
          return "A";
        }
        case 11: {
          return "B";
        }
        case 12: {
          return "C";
        }
        case 13: {
          return "D";
        }
        case 14: {
          return "E";
        }
        case 15: {
          return "F";
        }
      }
    }

    hexToDec(hexadecimal: string): number {
      switch(hexadecimal) {
        case "0": {
          return 0;
        }
        case "1": {
          return 1;
        }
        case "2": {
          return 2;
        }
        case "3": {
          return 3;
        }
        case "4": {
          return 4;
        }
        case "5": {
          return 5;
        }
        case "6": {
          return 6;
        }
        case "7": {
          return 7;
        }
        case "8": {
          return 8;
        }
        case "9": {
          return 9;
        }
        case "A": {
          return 10;
        }
        case "B": {
          return 11;
        }
        case "C": {
          return 12;
        }
        case "D": {
          return 13;
        }
        case "E": {
          return 14;
        }
        case "F": {
          return 15;
        }
      }
    }

    addHex(hexA: string, hexB: string): string {
      let answer = "";

      if (hexA.length < hexB.length) {
        hexA = this.setLengthOfHex(hexA, hexB.length);
      } else if (hexB.length < hexA.length) {
        hexB = this.setLengthOfHex(hexB, hexA.length);
      }

      let i = hexA.length - 1;
      let carry = 0;
      while (i >= 0) {
        let decA = this.hexToDec(hexA[i]);
        let decB = this.hexToDec(hexB[i]);
        let sum = decA + decB + carry;
        answer = this.decToHex(sum % 16) + answer;
        if (sum >= 16) {
          carry = 1;
        } else {
          carry = 0;
        }
        i--;
      }

      if (carry === 1) {
        answer = "1" + answer;
      }

      return answer;
    }

    subtractHex(hexA: string, hexB: string): string {
      let answer = "";

      if (hexA.length < hexB.length) {
        hexA = this.setLengthOfHex(hexA, hexB.length);
      } else if (hexB.length < hexA.length) {
        hexB = this.setLengthOfHex(hexB, hexA.length);
      }

      let i = hexA.length - 1;
      while (i >= 0) {
        let decA = this.hexToDec(hexA[i]);
        let decB = this.hexToDec(hexB[i]);
        if (decA >= decB) {
          let difference = decA - decB;
          answer = this.decToHex(difference) + answer;
        } else {
          let j = i - 1;
          while (this.hexToDec(hexA[j]) === 0) {
            j--;
          }
          hexA = hexA.substr(0, j) + this.decToHex(this.hexToDec(hexA[j]) - 1) + hexA.substr(j + 1);
          j++;
          while (j < i) {
            hexA = hexA.substr(0, j) + "F" + hexA.substr(j);
            j++;
          }
          let difference = (decA + 16) - decB;
          answer = this.decToHex(difference) + answer;
        }
        i--;
      }

      return answer;
    }

    multiplyHex(hexA: string, hexB: string): string {
      let product = "0";

      let i = hexB.length - 1;
      while (i >= 0) {
        let j = 0;
        while (j < this.hexToDec(hexB[i])) {
          product = this.addHex(product, hexA);
          j++;
        }
        hexA = hexA + "0";
        i--;
      }

      return product;
    }

    modHex(hexA: string, hexB: string): string {
      if (this.hexToDec(hexB) === 0) {
        return "-1";
      }

      while (this.compareHex(hexA, hexB) >= 0) {
        let hexBCopy1 = hexB;
        let hexBCopy2 = hexB;
        while (this.compareHex(hexA, hexBCopy1) === 1) {
          hexBCopy1 = hexBCopy1 + "0";
          if (this.compareHex(hexA, hexBCopy1) >= 0) {
            hexBCopy2 = hexBCopy1;
          }
        }
        hexA = this.subtractHex(hexA, hexBCopy2);
      }

      return hexA;
    }

    generateHex(length: number): string {
      let randomHex = "";
      let i = 1;
      while (i <= length) {
        randomHex = randomHex + this.decToHex(Math.floor(Math.random() * 16));
        i++;
      }

      return randomHex;
    }

    setLengthOfHex(hex: string, length: number): string {
      while (hex.length < length) {
        hex = "0" + hex;
      }

      while (hex.length > length) {
        hex = hex.substr(1, hex.length - 1);
      }

      return hex;
    }

    compareHex(hexA: string, hexB: string): number {
      if (hexA.length < hexB.length) {
        hexA = this.setLengthOfHex(hexA, hexB.length);
      } else if (hexB.length < hexA.length) {
        hexB = this.setLengthOfHex(hexB, hexA.length);
      }

      let i = 0;
      while (i < hexA.length) {
        if (this.hexToDec(hexA[i]) > this.hexToDec(hexB[i])) {
          return 1;
        } else if (this.hexToDec(hexA[i]) < this.hexToDec(hexB[i])) {
          return -1;
        }
        i++;
      }
      return 0;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }
}
