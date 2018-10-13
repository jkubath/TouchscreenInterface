import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { Animation } from '../../models/animation.model';
import { NavButtonSource } from '../../models/navButtonSource.model';
import { NavButtonEnabled } from '../../models/navButtonEnabled.model';
import { Button } from '../../models/button.model';
import { Login } from '../../models/login.model';
import * as fs from 'fs';
import { promisify } from 'util';
import { TouchBarSlider } from 'electron';
import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';
import { DragScrollComponent } from 'ngx-drag-scroll';
import Money from 'dinero.js';
import { cd } from 'shelljs';
import { exec } from 'shelljs';
import { Buttons as ButtonsSet } from '../../configs/buttons.config';



@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
    // Top and Bottom DragScrollComponents
    @ViewChild('topScroller', { read: DragScrollComponent }) topds: DragScrollComponent;
    @ViewChild('bottomScroller', { read: DragScrollComponent }) bottomds: DragScrollComponent;

    // Product Rows
    public productsTopRow: Product[];
    public productsBottomRow: Product[];

    // Navigation Buttons Source/Enabled
    public navButtonSource: NavButtonSource = {
        topLeft: "assets/img/Button-On-Left.png",
        topRight: "assets/img/Button-On-Right.png",
        bottomLeft: "assets/img/Button-On-Left.png",
        bottomRight: "assets/img/Button-On-Right.png"
    };
    public navButtonEnabled: NavButtonEnabled = { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true };

    // Navigation Button Password
    public navPasswordSequence = ["topLeft", "topRight", "bottomLeft", "bottomRight", "topLeft", "topRight", "bottomLeft", "bottomRight"];
    public navPasswordPosition = 0;

    // Product Rotation
    public productRotationCounterTopRow = 0;
    public productRotationCounterBottomRow = 0;
    public productRotationDirectionTopRow = "right";
    public productRotationDirectionBottomRow = "right";

    // Snap Enabled
    public snapDisabled = "false";   // Note: This is a string due to the type being required by ngx-drag-scroll

    // Animations
    // Product Selecting
    public productSelectingScreenShadingAnimation: Animation = { out: true, transitionIn: false, in: false, transitionOut: false };
    public productSelectingScreenLightingAnimation: Animation = { out: true, transitionIn: false, in: false, transitionOut: false };
    public selectedProductImageAnimation: Animation = { out: true, transitionIn: false, in: false, transitionOut: false };
    public selectedProductInformationAnimation: Animation = { out: true, transitionIn: false, in: false, transitionOut: false };
    public selectedProductPurchasePaymentScreenShadingAnimation = { out: true, transitionIn: false, in: false, transitionOut: false };
    public selectedProductPurchasePaymentContentAnimation = { out: true, transitionIn: false, in: false, transitionOut: false };
    // System Configuration
    public systemConfigScreenShadingAnimation: Animation = { out: true, transitionIn: false, in: false, transitionOut: false };
    public systemConfigLoginAnimation: Animation = { out: true, transitionIn: false, in: false, transitionOut: false };
    public systemConfigPasswordCheckScreenShadingAnimation: Animation = { out: true, transitionIn: false, in: false, transitionOut: false };
    public systemConfigPasswordCheckContentAnimation: Animation = { out: true, transitionIn: false, in: false, transitionOut: false };
    public systemConfigPastInfoScreenShadingAnimation: Animation = { out: true, transitionIn: false, in: false, transitionOut: false };
    public systemConfigPastInfoContentAnimation: Animation = { out: true, transitionIn: false, in: false, transitionOut: false };
    public systemConfigProductEditingContentAnimation: Animation = { out: true, transitionIn: false, in: false, transitionOut: false };
    public systemConfigProductEditingPageChangeLeftAnimation: Animation = { out: true, transitionIn: false, in: false, transitionOut: false };
    public systemConfigProductEditingPageChangeRightAnimation: Animation = { out: true, transitionIn: false, in: false, transitionOut: false };

    // Selected Product Information
    public selectedProduct: Product;

    // Selected Product Description and Quantity info
    public selectedProductDescriptionFontSize = "";       // Description font size
    public selectedProductQuantityWanted = 0;             // Quantity wanted by user
    public selectedProductMaxQuantity = 0;                // Quantity available of product
    public selectedProductQuantityWantedAtMin = false;    // Whether or not quantity is at min
    public selectedProductQuantityWantedAtMax = false;    // Whether or not quantity is at max
    public selectedProductOutOfStock = false;             // Whether or not the product is out of stock

    // Buttons
    public buttons: Button[] = ButtonsSet;

    // Information Entry
    public userID: Login = { valid: false, chars: [...Array(23).fill('')], length: 0, string: "" } as Login;
    public password: Login = { valid: true, chars: [...Array(20).fill('')], length: 0, string: "" } as Login;

    public userIDAndPasswordChars = [...Array(23).fill('')];      // Current characters in the User ID/Password entry area
    public enteringUserID = false;
    public enteringPassword = false;
    public enteringPayment = false;
    public viewingPastInfo = false;
    public checkingPassword = false;
    public editingProduct = false;

    // Hexadecimal Calculations
    public admin = "none";
    public passwordA = "";
    public passwordB = "";
    public passwordC = "";
    public passwordSum = "";
    public passwordProduct = "";
    public passwordCheck = "";
    public pastInfoPasswordSum = "";
    public pastInfoPasswordCheck = "";

    // Product Editing
    public productEditingProductIDs: string[];
    public productEditingProductNames: string[];
    public productEditingProductQuantitiesAvailable: number[];
    public productEditingProductQuantitiesAvailableAtMin: boolean[];
    public productEditingProductQuantitiesAvailableAtMax: boolean[];
    public productEditingCurrentPageProductIDs = [...Array(5).fill("")];
    public productEditingCurrentPageProductNames = [...Array(5).fill("")];
    public productEditingCurrentPageProductQuantitiesAvailable = [...Array(5).fill(0)];
    public productEditingCurrentPageProductQuantitiesAvailableAtMin = [...Array(5).fill(false)];
    public productEditingCurrentPageProductQuantitiesAvailableAtMax = [...Array(5).fill(false)];
    public productEditingProductDisplay = [...Array(5).fill("")];
    public pageChangerAtMin = false;
    public pageChangerAtMax = false;
    public productEditingNavCurrentPageNumber = 1;
    public productEditingNavTotalPageNumbers = 1;


    // Load the products on the top row of the vending machine
    loadProductsTopRow(): Product[] {
        let productsTopRow = new Array<Product>();
        let contents = fs.readdirSync('./src/products');
        fs.readFile('./src/product-setup.json', (err, fileContent) => {
          if (err) throw err;
          let jsonContent = JSON.parse(fileContent.toString());
          let i = 0;
          while (i < jsonContent.topRow.length) {
            for (let content of contents) {
              if (jsonContent.topRow[i] === content) {
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
            }
            i++;
          }
        });

        return productsTopRow;
    }

    // Load the products on the bottom row of the vending machine
    loadProductsBottomRow(): Product[] {
        let productsBottomRow = new Array<Product>();
        let contents = fs.readdirSync('./src/products');
        fs.readFile('./src/product-setup.json', (err, fileContent) => {
          if (err) throw err;
          let jsonContent = JSON.parse(fileContent.toString());
          let i = 0;
          while (i < jsonContent.bottomRow.length) {
            for (let content of contents) {
              if (jsonContent.bottomRow[i] === content) {
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
            }
            i++;
          }
        });

        return productsBottomRow;
    }

    // Get the quantity available for the selected product
    getSelectedProductMaxQuantity(): void {
        let fileContent = fs.readFileSync(`./src/product-data/${this.selectedProduct.id}.json`, "utf8");
        let jsonContent = JSON.parse(fileContent.toString());
        this.selectedProductMaxQuantity = jsonContent.quantity;
    }

    // Update the quantity available for the selected product
    updateSelectedProductMaxQuantity(): void {
        let fileContent = fs.readFileSync(`./src/product-data/${this.selectedProduct.id}.json`, "utf8");
        let jsonContent = JSON.parse(fileContent.toString());
        jsonContent.quantity -= this.selectedProductQuantityWanted;
        this.selectedProductMaxQuantity = jsonContent.quantity;

        // If the quantity available is less than the quantity wanted, update the quantity wanted
        if (this.selectedProductMaxQuantity < this.selectedProductQuantityWanted) {
            this.selectedProductQuantityWanted = this.selectedProductMaxQuantity;
        }

        fs.writeFileSync(`./src/product-data/${this.selectedProduct.id}.json`, JSON.stringify(jsonContent, null, 2));
    }

    // Get the quantities available for all products
    getProductEditingProductQuantitiesAvailable(): void {
      let productNum = 0;
      let i = 0;

      // Create arrays for all of the product editing information
      this.productEditingProductIDs = new Array(this.productsTopRow.length + this.productsBottomRow.length).fill("");
      this.productEditingProductNames = new Array(this.productsTopRow.length + this.productsBottomRow.length).fill("");
      this.productEditingProductQuantitiesAvailable = new Array(this.productsTopRow.length + this.productsBottomRow.length).fill(0);
      this.productEditingProductQuantitiesAvailableAtMin = new Array(this.productsTopRow.length + this.productsBottomRow.length).fill(false);
      this.productEditingProductQuantitiesAvailableAtMax = new Array(this.productsTopRow.length + this.productsBottomRow.length).fill(false);

      // Loop through the top row, reading in the product IDs, names, and quantities, and setting the atMax/atMin values depending on the quantity
      while (i < (this.productsTopRow.length + this.productsBottomRow.length)) {
        // Copy the ID and name from the data that has already been loaded
        if (i < this.productsTopRow.length) {
          this.productEditingProductIDs[productNum] = this.productsTopRow[i].id;
          this.productEditingProductNames[productNum] = this.productsTopRow[i].name;
        } else {
          this.productEditingProductIDs[productNum] = this.productsBottomRow[i - this.productsTopRow.length].id;
          this.productEditingProductNames[productNum] = this.productsBottomRow[i - this.productsTopRow.length].name;
        }

        // Open the product's respective file in product-data
        let fileContent = fs.readFileSync(`./src/product-data/${this.productEditingProductIDs[productNum]}.json`, "utf8");
        let jsonContent = JSON.parse(fileContent.toString());

        // Read the product's quantity available
        this.productEditingProductQuantitiesAvailable[productNum] = jsonContent.quantity;

        // Note if the product quantity is at 0
        if (this.productEditingProductQuantitiesAvailable[productNum] === 0) {
          this.productEditingProductQuantitiesAvailableAtMin[productNum] = true;
        } else {
          this.productEditingProductQuantitiesAvailableAtMin[productNum] = false;
        }

        // Note if the product quantity is at 100
        if (this.productEditingProductQuantitiesAvailable[productNum] === 100) {
          this.productEditingProductQuantitiesAvailableAtMax[productNum] = true;
        } else {
          this.productEditingProductQuantitiesAvailableAtMax[productNum] = false;
        }

        productNum++;
        i++;
      }

      // Set up the page navigation
      // Set the product editing to start with the first page
      this.pageChangerAtMin = true;
      this.productEditingNavCurrentPageNumber = 1;

      // Calculate how many pages there will be
      if (productNum % 5 === 0) {
        this.productEditingNavTotalPageNumbers = productNum / 5;
      } else {
        this.productEditingNavTotalPageNumbers = ((productNum - (productNum % 5)) / 5) + 1;
      }

      // Set pageChangerAtMax depending on whether there is 1 page or more than 1 page
      if (this.productEditingNavTotalPageNumbers === 1) {
        this.pageChangerAtMax = true;
      } else {
        this.pageChangerAtMax = false;
      }

      i = 0;
      // Assign the information for the products shown on the first page of the product editor
      while (i < 5 && i < productNum) {
        if (i < productNum) {
          this.productEditingCurrentPageProductIDs[i] = this.productEditingProductIDs[i];
          this.productEditingCurrentPageProductNames[i] = this.productEditingProductNames[i];
          this.productEditingCurrentPageProductQuantitiesAvailable[i] = this.productEditingProductQuantitiesAvailable[i];
          this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i] = this.productEditingProductQuantitiesAvailableAtMin[i];
          this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i] = this.productEditingProductQuantitiesAvailableAtMax[i];
          this.productEditingProductDisplay[i] = "block";
        } else {
          this.productEditingCurrentPageProductIDs[i] = "";
          this.productEditingCurrentPageProductNames[i] = "";
          this.productEditingCurrentPageProductQuantitiesAvailable[i] = 0;
          this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i] = false;
          this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i] = false;
          this.productEditingProductDisplay[i] = "none";
        }

        i++;
      }
    }

    // Update the quantities available for all products
    updateProductEditingProductQuantitiesAvailable(): void {
      let i = 0;
      while (i < this.productEditingProductIDs.length) {
        let fileContent = fs.readFileSync(`./src/product-data/${this.productEditingProductIDs[i]}.json`, "utf8");
        let jsonContent = JSON.parse(fileContent.toString());

        jsonContent.quantity = this.productEditingProductQuantitiesAvailable[i];
        fs.writeFileSync(`./src/product-data/${this.productEditingProductIDs[i]}.json`, JSON.stringify(jsonContent, null, 2));
        i++;
      }
    }

    // Handle events of the navigation buttons
    navEvent(event: string, location: string, imageSource: string, reachesBound: boolean): void {
        // If this is a "password" event...
        if (event === "password") {
            // If the correct button in the sequence was pressed...
            if (this.navPasswordSequence[this.navPasswordPosition] === location) {
                // Increment the position in the password
                this.navPasswordPosition++;

                // If the entire password has been entered...
                if (this.navPasswordPosition === this.navPasswordSequence.length) {
                  // Change to entering the user ID
                  this.enteringUserID = true;

                  // Increment the product rotation counters so the products won't rotate
                  this.productRotationCounterTopRow++;
                  this.productRotationCounterBottomRow++;

                  // Play animations for screen shading and the login area
                  this.playInAnimation(this.systemConfigScreenShadingAnimation, 0, 1000);
                  this.playInAnimation(this.systemConfigLoginAnimation, 750, 750);

                  // Reset the password
                  this.navPasswordPosition = 0;
                // Otherwise, if the entire password has not yet been entered...
                } else {
                    // Update previous password position
                    let previousPasswordPosition = this.navPasswordPosition - 1;

                    // Set a 5 second timeout that will reset the password if the next
                    //   character is not entered within 5 seconds
                    setTimeout(() => {
                        if (this.navPasswordPosition === previousPasswordPosition + 1) {
                            this.navPasswordPosition = 0;
                        }
                    }, 5000);
                }
            // Otherwise, if the button pressed is not the next one in the sequence...
            } else {
                // Reset the password
                this.navPasswordPosition = 0;
            }
        // Otherwise, if this is a "click" event...
        } else if (event === "click") {
            // Move the products based on which button is pressed, enable snap, and reset the
            //   product rotation counters (causing product rotation to pause temporarily)
            if (location === "topLeft") {
                this.topds.moveLeft();
            } else if (location === "topRight") {
                this.topds.moveRight();
            } else if (location === "bottomLeft") {
                this.bottomds.moveLeft();
            } else if (location === "bottomRight") {
                this.bottomds.moveRight();
            }
            this.snapDisabled = "false";
            this.resetProductRotationCounters();
        // Otherwise, if this is a "reachesBound" event...
        } else if (event === "reachesBound") {
            // Enable/Disable the respective nav button
            this.navButtonEnabled[location] = !reachesBound;
        // Otherwise, if this is a "mousedown" event...
        } else if (event === "productmousedown") {
            // Increment the product rotation counters (which prevents products from
            //   rotating while the products are being dragged)
            this.productRotationCounterTopRow++;
            this.productRotationCounterBottomRow++;
        // Otherwise, if this is a "mouseup" event
        } else if (event === "productmouseup") {
            // Decrement the product rotation counters and reset the product rotation counters
            this.productRotationCounterTopRow--;
            this.productRotationCounterBottomRow--;
            this.resetProductRotationCounters();
        // Otherwise, assign the passed image source to the nav button
        } else {
            this.navButtonSource[location] = imageSource;
        }
    }

    // Causes product rotation to stop until a given amount of time has passed
    //   without any interaction with the products
    resetProductRotationCounters(): void {
      // Increment the product rotation counters
      this.productRotationCounterTopRow++;
      this.productRotationCounterBottomRow++;

      // After a given amount of time has passed...
      setTimeout(() => {
        // Decrement the product rotation counter for top row
        this.productRotationCounterTopRow--;

        // If it has been the given amount of time since the last time
        //   productRotationCounterTopRow was incremented...
        if (this.productRotationCounterTopRow === 0) {
          // Begin rotating the products in the top row
          this.rotateProductsTopRow();
        }
      }, 10000);

      // After a given amount of time has passed...
      setTimeout(() => {
        // Decrement the product rotation counter for bottom row
        this.productRotationCounterBottomRow--;

        // If it has been the given amount of time since the last time
        //   productRotationCounterBottomRow was incremented...
        if (this.productRotationCounterBottomRow === 0) {
          // Begin rotating the products in the bottom row
          this.rotateProductsBottomRow();
        }
      }, 12500);
    }

    // Rotates the products on the top row in given intervals
    rotateProductsTopRow(): void {
      // Change the direction the products are rotating if the top row is at
      //   either end of the products
      if (this.navButtonEnabled["topLeft"] === false) {
        this.productRotationDirectionTopRow = "right";
      } else if (this.navButtonEnabled["topRight"] === false) {
        this.productRotationDirectionTopRow = "left";
      }

      // Rotate the products in the chosen direction
      if (this.productRotationDirectionTopRow === "right") {
        this.topds.moveRight();
      } else if (this.productRotationDirectionTopRow === "left") {
        this.topds.moveLeft();
      }

      // After a given amount of time has passed...
      setTimeout(() => {
        // If something hasn't been done that would cause the products to stop rotating...
        if (this.productRotationCounterTopRow === 0) {
          // Rotate the products in the top row
          this.rotateProductsTopRow();
        }
      }, 5000);
    }

    // Rotates the products on the bottom row in given intervals
    rotateProductsBottomRow(): void {
      // Change the direction the products are rotating if the bottom row is at
      //   either end of the products
      if (this.navButtonEnabled["bottomLeft"] === false) {
        this.productRotationDirectionBottomRow = "right";
      } else if (this.navButtonEnabled["bottomRight"] === false) {
        this.productRotationDirectionBottomRow = "left";
      }

      // Rotate the products in the chosen direction
      if (this.productRotationDirectionBottomRow === "right") {
        this.bottomds.moveRight();
      } else if (this.productRotationDirectionBottomRow === "left") {
        this.bottomds.moveLeft();
      }

      // After a given amount of time has passed...
      setTimeout(() => {
        // If something hasn't been done that would cause the products to stop rotating...
        if (this.productRotationCounterBottomRow === 0) {
          // Rotate the products in the bottom row
          this.rotateProductsBottomRow();
        }
      }, 5000);
    }

    // Play the animation used to transition from the "out" state to the "in" state
    playInAnimation(animation: Animation, before: number, duration: number): void {
        setTimeout(() => {
            animation["out"] = false;
            animation["transitionIn"] = true;
            setTimeout(() => {
                animation["transitionIn"] = false;
                animation["in"] = true;
            }, duration);
        }, before);
    }

    // Play the animation used to transition from the "in" state to the "out" state
    playOutAnimation(animation: Animation, before: number, duration: number): void {
        setTimeout(() => {
            animation["in"] = false;
            animation["transitionOut"] = true;
            setTimeout(() => {
                animation["transitionOut"] = false;
                animation["out"] = true;
            }, duration);
        }, before);
    }

    // Runs when a product is selected in the vending machine
    selectProduct(product: Product): void {
        // Disable snapping, set selectedProduct to the product passed, and increment
        //   the product rotation counters (so products won't rotate when a product is selected)
        this.snapDisabled = "true";
        this.selectedProduct = product;
        this.productRotationCounterTopRow++;
        this.productRotationCounterBottomRow++;

        // Get the max quantity for the selected product
        this.getSelectedProductMaxQuantity();

        // If the max quantity is 0...
        if (this.selectedProductMaxQuantity === 0) {
            // Set quantity wanted to 0 and mark that it is at its max and out of stock
            this.selectedProductQuantityWanted = 0;
            this.selectedProductQuantityWantedAtMax = true;
            this.selectedProductOutOfStock = true;
        // Otherwise, if the max quantity is not 0...
        } else {
            // If the max quantity is 1...
            if (this.selectedProductMaxQuantity === 1) {
                // Mark that the quantity wanted is at its max
                this.selectedProductQuantityWantedAtMax = true;
            // Otherwise, if the max quantity is greater than 1...
            } else {
                // Mark that the quantity wanted is not at its max...
                this.selectedProductQuantityWantedAtMax = false;
            }

            // Set the quantity wanted to 1 and mark that it isn't out of stock
            this.selectedProductQuantityWanted = 1;
            this.selectedProductOutOfStock = false;
        }

        // Set the quantity wanted to be at its min
        this.selectedProductQuantityWantedAtMin = true;

        // Calculate a font size for the description
        this.selectedProductDescriptionFontSize = (41.0 - 1.5 * Math.sqrt(this.selectedProduct.description.length)
            + (this.selectedProduct.description.length / 100.0)) + `px`;

        // Play animations for the screen shading, screen lighting, product image, and product information
        this.playInAnimation(this.productSelectingScreenShadingAnimation, 0, 1000);
        this.playInAnimation(this.productSelectingScreenLightingAnimation, 375, 875);
        this.playInAnimation(this.selectedProductImageAnimation, 1000, 1000);
        this.playInAnimation(this.selectedProductInformationAnimation, 1250, 1250);
    }

    // Runs when the decrement button for a selected product is pressed
    decreaseQuantityWanted(): void {
        // If the selectedProductInformationAnimation is finished...
        if (this.selectedProductInformationAnimation.in === true) {
            // If the selected product quantity wanted is greater than 1, decrement it
            if (this.selectedProductQuantityWanted > 1) {
                this.selectedProductQuantityWanted -= 1;
            }

            // If the selected product quantity wanted is equal to 1, mark that it is at the minimum
            if (this.selectedProductQuantityWanted === 1) {
                this.selectedProductQuantityWantedAtMin = true;
            }

            // If the selected product quantity wanted is less than the max, mark that it is not at the maximum
            if (this.selectedProductQuantityWanted < this.selectedProductMaxQuantity) {
                this.selectedProductQuantityWantedAtMax = false;
            }
        }
    }

    // Runs when the increment button for a selected product is pressed
    increaseQuantityWanted(): void {
        // If the selectedProductInformationAnimation is finished...
        if (this.selectedProductInformationAnimation.in === true) {
            // If the selected product quantity wanted is less than the max, increment it
            if (this.selectedProductQuantityWanted < this.selectedProductMaxQuantity) {
                this.selectedProductQuantityWanted += 1;
            }

            // If the selected product quantity wanted is equal to the max, mark that it is at the maximum
            if (this.selectedProductQuantityWanted === this.selectedProductMaxQuantity) {
                this.selectedProductQuantityWantedAtMax = true;
            }

            // If the selected product quantity wanted is greater than 1, mark that it is not at the minimum
            if (this.selectedProductQuantityWanted > 1) {
                this.selectedProductQuantityWantedAtMin = false;
            }
        }
    }

    // Runs when you click the "cancel" button in a product selection
    cancelProduct(): void {
        // If the selectedProductInformationAnimation is finished...
        if (this.selectedProductInformationAnimation.in === true) {
            // Play animations for the product information, product image, screen lighting, and screen shading
            this.playOutAnimation(this.selectedProductInformationAnimation, 0, 750);
            this.playOutAnimation(this.selectedProductImageAnimation, 0, 1000);
            this.playOutAnimation(this.productSelectingScreenLightingAnimation, 0, 1750);
            this.playOutAnimation(this.productSelectingScreenShadingAnimation, 0, 2000);

            // After the animation has finished...
            setTimeout(() => {
                // Mark that a product is no longer selected
                this.selectedProduct = null;

                // Decrement the product rotation counters and reset the product rotation counters
                this.productRotationCounterTopRow--;
                this.productRotationCounterBottomRow--;
                this.resetProductRotationCounters();
            }, 2000);
        }
    }

    // Runs when you click the "purchase" button in a product selection
    purchaseProduct(): void {
        // If the selectedProductInformationAnimation is finished...
        if (this.selectedProductInformationAnimation.in === true) {
            // Update the selected product's max quantity
            this.updateSelectedProductMaxQuantity();

            // If all of this product have now been bought...
            if (this.selectedProductMaxQuantity === 0) {
                // Mark that the product is now at its min and max, and out of stock
                this.selectedProductQuantityWantedAtMin = true;
                this.selectedProductQuantityWantedAtMax = true;
                this.selectedProductOutOfStock = true;
            // Otherwise, if there are still some of this product available...
            } else {
                // If the selected product quantity is now at 1...
                if (this.selectedProductQuantityWanted === 1) {
                    // Mark that the product is now at its min
                    this.selectedProductQuantityWantedAtMin = true;
                }

                // If the selected product quantity is at the number of that product available...
                if (this.selectedProductMaxQuantity === this.selectedProductQuantityWanted) {
                    // Mark that the product is now at its max
                    this.selectedProductQuantityWantedAtMax = true;
                } else {
                    // Otherwise, mark that the product is not at its max
                    this.selectedProductQuantityWantedAtMax = false;
                }
            }

            // Bring up payment entry
            this.enteringPayment = true;

            // Play animations for screen shading and content
            this.playInAnimation(this.selectedProductPurchasePaymentScreenShadingAnimation, 0, 1000);
            this.playInAnimation(this.selectedProductPurchasePaymentContentAnimation, 500, 1500);
        }
    }

    // Runs when you click the "continue" button after purchasing a product
    selectedProductPurchasePaymentContinueButtonClick(): void {
      // Play animations for canceling a product, screen shading, and content
      this.cancelProduct();
      this.playOutAnimation(this.selectedProductPurchasePaymentContentAnimation, 0, 1500);
      this.playOutAnimation(this.selectedProductPurchasePaymentScreenShadingAnimation, 0, 2000);

      // After the animation has finished...
      setTimeout(() => {
          // Mark that the user is no longer entering a payment
          this.enteringPayment = false;
      }, 2000);
    }

    // Adds the passed character to the current entry
    hexButtonClick(character: string): void {
        // If the systemConfigLoginAnimation is finished...
        if (this.systemConfigLoginAnimation.in === true) {
            // If the user is entering the user id, and the current length is less than the max...
            if (this.enteringUserID === true && this.userID.length < this.userID.chars.length) {
                // Add the character to userID.chars, add an asterisk to userIDAndPasswordChars,
                //   and increment userID.length
                this.userID.chars[this.userID.length] = character;
                this.userIDAndPasswordChars[this.userID.length] = "*";
                this.userID.length++;
            // Otherwise, if the user is entering the password and the current length is less than the max...
            } else if (this.enteringPassword === true && this.password.length < this.password.chars.length) {
                // Mark the password as valid (making the color of the text "white"), and add the character
                //   to password.chars
                this.password.valid = true;
                this.password.chars[this.password.length] = character;

                // Depending on the current length of the password, assign the character to the
                //   correct location in userIDAndPasswordChars (minding the dash characters)
                if (this.password.length >= 15) {
                    this.userIDAndPasswordChars[this.password.length + 3] = character;
                } else if (this.password.length >= 10) {
                    this.userIDAndPasswordChars[this.password.length + 2] = character;
                } else if (this.password.length >= 5) {
                    this.userIDAndPasswordChars[this.password.length + 1] = character;
                } else {
                    this.userIDAndPasswordChars[this.password.length] = character;
                }

                // Increment password.length
                this.password.length++;
            }
        }
    }

    // Removes a character from the current entry
    deleteButtonClick(): void {
        // If the systemConfigLoginAnimation is finished...
        if (this.systemConfigLoginAnimation.in === true) {
            // If the user is entering the user id, and the current length is greater than 0...
            if (this.enteringUserID === true && this.userID.length > 0) {
                // Decrement userID.length and remove the character/asterisk from userID.chars
                //   and userIDAndPasswordChars
                this.userID.length--;
                this.userID.chars[this.userID.length] = "";
                this.userIDAndPasswordChars[this.userID.length] = "";
            // Otherwise, if the user is entering the password and the current length is greater than 0...
            } else if (this.enteringPassword === true && this.password.length > 0) {
                // Mark the password as valid (making the color of the text "white") and decrement
                //   password.length
                this.password.valid = true;
                this.password.length--;

                // Remove the character from password.chars and userIDAndPasswordChars (minding
                //   the dash characters)
                this.password.chars[this.password.length] = "";
                if (this.password.length >= 15) {
                    this.userIDAndPasswordChars[this.password.length + 3] = "";
                } else if (this.password.length >= 10) {
                    this.userIDAndPasswordChars[this.password.length + 2] = "";
                } else if (this.password.length >= 5) {
                    this.userIDAndPasswordChars[this.password.length + 1] = "";
                } else {
                    this.userIDAndPasswordChars[this.password.length] = "";
                }
            }
        }
    }

    // Submits the current entry
    enterButtonClick(): void {
        // If the systemConfigLoginAnimation is finished...
        if (this.systemConfigLoginAnimation.in === true) {
            // If the user is entering the user id...
            if (this.enteringUserID === true) {
                // Change from entering the user id to entering the password
                this.enteringUserID = false;
                this.enteringPassword = true;

                // Clear userIDAndPasswordChars and insert dashes
                let i = 0;
                while (i < this.userIDAndPasswordChars.length) {
                    this.userIDAndPasswordChars[i] = "";
                    i++;
                }
                this.userIDAndPasswordChars[5] = "-";
                this.userIDAndPasswordChars[11] = "-";
                this.userIDAndPasswordChars[17] = "-";

                // Clear userID.string and copy userID.chars over to it
                this.userID.string = "";
                i = 0;
                while (i < this.userID.length) {
                    this.userID.string = this.userID.string + this.userID.chars[i];
                    i++;
                }

                // Check if the user id is valid
                try {
                    let exists = fs.statSync(`./src/user-data/${this.userID.string}.json`);
                    this.userID.valid = true;
                } catch (error) {
                    this.userID.valid = false;
                }

                // If the user id is valid...
                if (this.userID.valid === true) {
                    // Open the user's user-data file and copy over the values of admin, passwordB,
                    //   passwordC, pastInfoPasswordSum, and pastInfoPasswordCheck
                    let fileContent = fs.readFileSync(`./src/user-data/${this.userID.string}.json`, "utf8");
                    let jsonContent = JSON.parse(fileContent.toString());
                    if (jsonContent.admin === "true") {
                      this.admin = "block";
                    } else {
                      this.admin = "none";
                    }
                    this.passwordB = jsonContent.passwordB;
                    this.passwordC = jsonContent.passwordC;
                    this.pastInfoPasswordSum = jsonContent.pastInfoPasswordSum;
                    this.pastInfoPasswordCheck = jsonContent.pastInfoPasswordCheck;
                // Otherwise, if the user id is not valid...
                } else {
                    // Generate a passwordC and passwordB, making sure that the value of
                    //   passwordC is at least 16 characters in length and the value of
                    //   passwordB is less than the value of passwordC
                    this.passwordC = this.generateHex(20);
                    while (this.compareHex("1000000000000000", this.passwordC) > 0) {
                        this.passwordC = this.generateHex(20);
                    }
                    this.passwordB = this.generateHex(20);
                    while (this.compareHex(this.passwordB, this.passwordC) >= 0) {
                        this.passwordB = this.generateHex(20);
                    }

                    // Use set values of pastInfoPasswordSum and pastInfoPasswordCheck so that
                    //   the same results will occur every time for an invalid user id
                    let j = 0;
                    this.pastInfoPasswordSum = "81A2E0063BB7C5E42F21";
                    this.pastInfoPasswordCheck = "C2510CD533EFE3099AD6";

                    // Generate a pastInfoPasswordSum and pastInfoPasswordCheck
                    while (j < this.userID.length) {
                        let k = 0;
                        let passwordSumHexToAdd = "";
                        let passwordCheckHexToAdd = "";
                        while (k < this.pastInfoPasswordSum.length) {
                            if (k % 16 === 0) {
                                passwordSumHexToAdd = passwordSumHexToAdd + this.setLengthOfHex(this.modHex(this.multiplyHex(this.userID.chars[j], "1"), "10"), 1);
                            } else {
                                passwordSumHexToAdd = passwordSumHexToAdd + this.setLengthOfHex(this.modHex(this.multiplyHex(this.userID.chars[j], this.decToHex(k % 16)), "10"), 1);
                            }
                            k++;
                        }
                        k = 0;
                        while (k < this.pastInfoPasswordCheck.length) {
                            if (k % 16 === 0) {
                                passwordCheckHexToAdd = this.setLengthOfHex(this.modHex(this.multiplyHex(this.userID.chars[j], "1"), "10"), 1) + passwordCheckHexToAdd;
                            } else {
                                passwordCheckHexToAdd = this.setLengthOfHex(this.modHex(this.multiplyHex(this.userID.chars[j], this.decToHex(k % 16)), "10"), 1) + passwordCheckHexToAdd;
                            }
                            k++;
                        }
                        this.pastInfoPasswordSum = this.setLengthOfHex(this.modHex(this.addHex(this.pastInfoPasswordSum, passwordSumHexToAdd), "100000000000000000000"), 20);
                        this.pastInfoPasswordCheck = this.setLengthOfHex(this.modHex(this.addHex(this.pastInfoPasswordCheck, passwordCheckHexToAdd), "100000000000000000000"), 20);
                        j++;
                    }
                }

                // Insert dashes in the pastInfoPasswordSum and pastInfoPasswordCheck
                this.pastInfoPasswordSum = this.pastInfoPasswordSum.substr(0, 5) + "-" + this.pastInfoPasswordSum.substr(5, 5) + "-" +
                    this.pastInfoPasswordSum.substr(10, 5) + "-" + this.pastInfoPasswordSum.substr(15);
                this.pastInfoPasswordCheck = this.pastInfoPasswordCheck.substr(0, 5) + "-" + this.pastInfoPasswordCheck.substr(5, 5) + "-" +
                    this.pastInfoPasswordCheck.substr(10, 5) + "-" + this.pastInfoPasswordCheck.substr(15);

                // Clear userID.chars and set userID.length to 0
                i = 0;
                while (i < this.userID.length) {
                    this.userID.chars[i] = "";
                    i++;
                }
                this.userID.length = 0;

                // Generate a value for passwordA, making sure that it is less than passwordC
                this.passwordA = this.generateHex(20);
                while (this.compareHex(this.passwordA, this.passwordC) >= 0) {
                    this.passwordA = this.generateHex(20);
                }

                // Calculate values for passwordSum and passwordProduct, inserting dashes
                //   in passwordSum so it is easier to read for the user
                this.passwordSum = this.modHex(this.addHex(this.passwordA, this.passwordB), this.passwordC);
                this.passwordSum = this.setLengthOfHex(this.passwordSum, 20);
                this.passwordSum = this.passwordSum.substr(0, 5) + "-" + this.passwordSum.substr(5, 5) + "-" +
                    this.passwordSum.substr(10, 5) + "-" + this.passwordSum.substr(15);
                this.passwordProduct = this.modHex(this.multiplyHex(this.passwordA, this.passwordB), this.passwordC);
                this.passwordProduct = this.setLengthOfHex(this.passwordProduct, 20);
            // Otherwise, if the user is entering the password...
            } else if (this.enteringPassword === true) {
                // Clear password.string and copy password.chars over to it
                this.password.string = "";
                let i = 0;
                while (i < this.password.length) {
                    this.password.string = this.password.string + this.password.chars[i];
                    i++;
                }

                // Declare passwordCorrect and set it to true, setting it to false
                //   if the entered password is not the same length as the calculated
                //   passwordProduct or any of the characters in the two or different
                let passwordCorrect = true;
                if (this.password.string.length === this.passwordProduct.length) {
                    let j = 0;
                    while (j < this.password.string.length) {
                        if (this.password.string[j] !== this.passwordProduct[j]) {
                            passwordCorrect = false;
                        }
                        j++;
                    }
                } else {
                    passwordCorrect = false;
                }

                // If the correct password is entered and the user id was valid...
                if (passwordCorrect === true && this.userID.valid === true) {
                    // Set pastInfoPasswordSum to the value of passwordSum with the dashes removed,
                    //   calculate passwordCheck (assigning it to pastInfoPasswordCheck as well),
                    //   insert dashes into passwordCheck, and change from entering the password
                    //   to checking the password
                    this.pastInfoPasswordSum = this.passwordSum.substr(0, 5) + this.passwordSum.substr(6, 5) + this.passwordSum.substr(12, 5) + this.passwordSum.substr(18);
                    this.passwordCheck = this.setLengthOfHex(this.modHex(this.multiplyHex(this.multiplyHex(this.multiplyHex(this.modHex(this.passwordA, this.passwordB), this.modHex(this.passwordB, this.passwordA)), this.modHex(this.passwordC, this.passwordA)), this.modHex(this.passwordC, this.passwordB)), "100000000000000000000"), 20);
                    this.pastInfoPasswordCheck = this.passwordCheck;
                    this.passwordCheck = this.passwordCheck.substr(0, 5) + "-" + this.passwordCheck.substr(5, 5) + "-" + this.passwordCheck.substr(10, 5) + "-" + this.passwordCheck.substr(15);
                    this.enteringPassword = false;
                    this.checkingPassword = true;

                    // Play animations for the screen shading and password check content
                    this.playInAnimation(this.systemConfigPasswordCheckScreenShadingAnimation, 0, 1000);
                    this.playInAnimation(this.systemConfigPasswordCheckContentAnimation, 500, 1500);



                    // Generate new values for passwordB and passwordC, regenerating the values
                    //   if passwordC is not at least 16 characters long or passwordB is greater
                    //   than or equal to passwordC
                    this.passwordB = this.setLengthOfHex(this.modHex(this.addHex(this.passwordB, this.multiplyHex(this.passwordC, this.passwordC)), "100000000000000000000"), 20);
                    this.passwordC = this.setLengthOfHex(this.modHex(this.addHex(this.passwordC, this.multiplyHex(this.passwordA, this.passwordA)), "100000000000000000000"), 20);
                    while (this.compareHex(this.passwordB, this.passwordC) >= 0 || this.compareHex("1000000000000000", this.passwordC) >= 0) {
                        this.passwordB = this.setLengthOfHex(this.modHex(this.addHex(this.passwordB, this.multiplyHex(this.passwordC, this.passwordC)), "100000000000000000000"), 20);
                        this.passwordC = this.setLengthOfHex(this.modHex(this.addHex(this.passwordC, this.multiplyHex(this.passwordA, this.passwordA)), "100000000000000000000"), 20);
                    }

                    // Open the user's user-data file, writing to it the values of
                    //   passwordB, passwordC, pastInfoPasswordSum, and pastInfoPasswordCheck
                    let fileContent = fs.readFileSync(`./src/user-data/${this.userID.string}.json`, "utf8");
                    let jsonContent = JSON.parse(fileContent.toString());
                    jsonContent.passwordB = this.passwordB;
                    jsonContent.passwordC = this.passwordC;
                    jsonContent.pastInfoPasswordSum = this.pastInfoPasswordSum;
                    jsonContent.pastInfoPasswordCheck = this.pastInfoPasswordCheck;
                    fs.writeFileSync(`./src/user-data/${this.userID.string}.json`, JSON.stringify(jsonContent, null, 2));

                    // Set userID.valid to false and clear passwordA, passwordB, passwordC,
                    //   userID.string, and password.string
                    this.userID.valid = false;
                    this.passwordA = "";
                    this.passwordB = "";
                    this.passwordC = "";
                    this.userID.string = "";
                    this.password.string = "";

                    // Clear userIDAndPasswordChars
                    i = 0;
                    while (i < this.userIDAndPasswordChars.length) {
                        this.userIDAndPasswordChars[i] = "";
                        i++;
                    }

                    // Clear password.chars and set password.length to 0
                    i = 0;
                    while (i < this.password.length) {
                        this.password.chars[i] = "";
                        i++;
                    }
                    this.password.length = 0;
                // Otherwise, if the password entered is incorrect or an invalid user id
                //   was entered...
                } else {
                    // Set password.valid to false
                    this.password.valid = false;
                }
            }
        }
    }

    // Goes back to the previous page of login
    loginBackButtonClick(): void {
        // If the systemConfigLoginAnimation is finished...
        if (this.systemConfigLoginAnimation.in === true) {
            // If the user is entering the password...
            if (this.enteringPassword === true) {
                // Change from entering the password to entering the user id
                this.enteringPassword = false;
                this.enteringUserID = true;

                // Set password.valid to true and userID.valid to false
                this.password.valid = true;
                this.userID.valid = false;

                // Clear admin, passwordA, passwordB, passwordC, and userID.string
                this.admin = "none";
                this.passwordA = "";
                this.passwordB = "";
                this.passwordC = "";
                this.userID.string = "";

                // Clear userIDAndPasswordChars
                let i = 0;
                while (i < this.userIDAndPasswordChars.length) {
                    this.userIDAndPasswordChars[i] = "";
                    i++;
                }

                // Clear password.chars and set password.length to 0
                i = 0;
                while (i < this.password.length) {
                    this.password.chars[i] = "";
                    i++;
                }
                this.password.length = 0;
            // Otherwise, if the user is entering the user id...
            } else if (this.enteringUserID === true) {
                // Play animations for the login and screen shading
                this.playOutAnimation(this.systemConfigLoginAnimation, 0, 1000);
                this.playOutAnimation(this.systemConfigScreenShadingAnimation, 0, 2000);

                // After the animation has finished...
                setTimeout(() => {
                    // Change to no longer entering user id
                    this.enteringUserID = false;

                    // Clear userIDAndPasswordChars
                    let i = 0;
                    while (i < this.userIDAndPasswordChars.length) {
                        this.userIDAndPasswordChars[i] = "";
                        i++;
                    }

                    // Clear userID.chars and set userID.length to 0
                    i = 0;
                    while (i < this.userID.length) {
                        this.userID.chars[i] = "";
                        i++;
                    }
                    this.userID.length = 0;

                    // Decrement the product rotation counters and reset the product rotation counters
                    this.productRotationCounterTopRow--;
                    this.productRotationCounterBottomRow--;
                    this.resetProductRotationCounters();
                }, 2000);
            }
        }
    }

    // Displays past info
    pastInfoButtonClick(): void {
        // If the systemConfigLoginAnimation is finished...
        if (this.systemConfigLoginAnimation.in === true) {
            // Change to viewing past info
            this.viewingPastInfo = true;

            // Play animations for screen shading and past info
            this.playInAnimation(this.systemConfigPastInfoScreenShadingAnimation, 0, 1000);
            this.playInAnimation(this.systemConfigPastInfoContentAnimation, 750, 750);
        }
    }

    // Hides past info
    pastInfoBackButtonClick(): void {
        // If the systemConfigLoginAnimation is finished...
        if (this.systemConfigPastInfoContentAnimation.in === true) {

            // Play animations for past info and screen shading
            this.playOutAnimation(this.systemConfigPastInfoContentAnimation, 0, 1000);
            this.playOutAnimation(this.systemConfigPastInfoScreenShadingAnimation, 0, 2000);

            // After the animation has finished...
            setTimeout(() => {
                // Change to no longer viewing past info
                this.viewingPastInfo = false;
            }, 2000);
        }
    }

    // Continues from password check info
    systemConfigPasswordCheckContinueButtonClick(): void {
        // If the systemConfigPasswordCheckContentAnimation is finished...
        if (this.systemConfigPasswordCheckContentAnimation.in === true) {
            // Change to editing products
            this.editingProduct = true;

            // Get all the current product quantities
            this.getProductEditingProductQuantitiesAvailable();

            // Play animations for login, password check content, screen shading, and product editing content
            this.playOutAnimation(this.systemConfigLoginAnimation, 0, 1000);
            this.playOutAnimation(this.systemConfigPasswordCheckContentAnimation, 0, 1500);
            this.playOutAnimation(this.systemConfigPasswordCheckScreenShadingAnimation, 0, 2000);
            this.playInAnimation(this.systemConfigProductEditingContentAnimation, 1000, 1000);

            // After the animation has finished...
            setTimeout(() => {
                // Change to no longer checking password
                this.checkingPassword = false;
            }, 2000);
        }
    }

    // Regain access to Ubuntu
    exitButtonClick(): void {
      // Execute the script that "ends" the program (disables all restrictions)
      cd('~/ScreenManager/src/setup/end');
      exec('make run', {async:true});
    }

    // Runs when the decrement button for one of the products being edited is pressed
    decreaseQuantityAvailable(productPosition: number): void {
      // If the systemConfigProductEditingContentAnimation is finished...
      if (this.systemConfigProductEditingContentAnimation.in === true) {
        // If the product whose button is pressed has a quantity greater than 0, decrement it
        if (this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] > 0) {
          this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] -= 1;
        }

        // If the product whose button is pressed has a quantity of 0, mark that it is at the minimum
        if (this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] === 0) {
          this.productEditingCurrentPageProductQuantitiesAvailableAtMin[productPosition] = true;
        }

        // If the product whose button is pressed has a quantity less than 100, mark that it is not at the maximum
        if (this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] < 100) {
          this.productEditingCurrentPageProductQuantitiesAvailableAtMax[productPosition] = false;
        }

        // Copy the current page product info over to the overall product info (saved even when pages are changed)
        let i = (this.productEditingNavCurrentPageNumber - 1) * 5;
        while (i < (this.productEditingNavCurrentPageNumber * 5) && i < this.productEditingProductIDs.length) {
          this.productEditingProductQuantitiesAvailable[i] = this.productEditingCurrentPageProductQuantitiesAvailable[i % 5];
          this.productEditingProductQuantitiesAvailableAtMin[i] = this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5];
          this.productEditingProductQuantitiesAvailableAtMax[i] = this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5];
          i++;
        }
      }
    }

    // Runs when the increment button for one of the products being edited is pressed
    increaseQuantityAvailable(productPosition: number): void {
      // If the systemConfigProductEditingContentAnimation is finished...
      if (this.systemConfigProductEditingContentAnimation.in === true) {
        // If the product whose button is pressed has a quantity less than 100, increment it
        if (this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] < 100) {
          this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] += 1;
        }

        // If the product whose button is pressed has a quantity of 100, mark that it is at the maximum
        if (this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] === 100) {
          this.productEditingCurrentPageProductQuantitiesAvailableAtMax[productPosition] = true;
        }

        // If the product whose button is pressed has a quantity greater than 0, mark that it is not at the minimum
        if (this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] > 0) {
          this.productEditingCurrentPageProductQuantitiesAvailableAtMin[productPosition] = false;
        }

        // Copy the current page product info over to the overall product info (saved even when the pages are changed)
        let i = (this.productEditingNavCurrentPageNumber - 1) * 5;
        while (i < (this.productEditingNavCurrentPageNumber * 5) && i < this.productEditingProductIDs.length) {
          this.productEditingProductQuantitiesAvailable[i] = this.productEditingCurrentPageProductQuantitiesAvailable[i % 5];
          this.productEditingProductQuantitiesAvailableAtMin[i] = this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5];
          this.productEditingProductQuantitiesAvailableAtMax[i] = this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5];
          i++;
        }
      }
    }

    // Runs when the "cancel" button in product editing is pressed
    cancelChanges(): void {
      // If the systemConfigProductEditingContentAnimation, systemConfigProductEditingPageChangeLeftAnimation,
      //   and systemConfigProductEditingPageChnageRightAnimation are finished...
      if (this.systemConfigProductEditingContentAnimation.in === true && this.systemConfigProductEditingPageChangeLeftAnimation.out === true &&
          this.systemConfigProductEditingPageChangeRightAnimation.out === true) {

        // Play animation for product editing content and screen shading
        this.playOutAnimation(this.systemConfigProductEditingContentAnimation, 0, 1000);
        this.playOutAnimation(this.systemConfigScreenShadingAnimation, 0, 2000);

        // After the animation has finished...
        setTimeout(() => {
          // Change to no longer editing products and clear admin status
          this.editingProduct = false;
          this.admin = "none";

          // Decrement the product rotation counters and reset the product rotation counters
          this.productRotationCounterTopRow--;
          this.productRotationCounterBottomRow--;
          this.resetProductRotationCounters();
        }, 2000);
      }
    }

    // Runs when the page number is decreased in product editing
    decreasePageNumber(): void {
      // If the systemConfigProductEditingContentAnimation, systemConfigProductEditingPageChangeLeftAnimation,
      //   and systemConfigProductEditingPageChnageRightAnimation are finished...
      if (this.systemConfigProductEditingContentAnimation.in === true && this.systemConfigProductEditingPageChangeLeftAnimation.out === true &&
          this.systemConfigProductEditingPageChangeRightAnimation.out === true) {
        // If the page number is greater than 1, decrement it
        if (this.productEditingNavCurrentPageNumber > 1) {
          this.productEditingNavCurrentPageNumber -= 1;
        }

        // If the page number is 1, mark that it is at the minimum
        if (this.productEditingNavCurrentPageNumber === 1) {
          this.pageChangerAtMin = true;
        }

        // If the page number is less than the total number of pages, mark that it is not at the maximum
        if (this.productEditingNavCurrentPageNumber < this.productEditingNavTotalPageNumbers) {
          this.pageChangerAtMax = false;
        }

        // Play animation for moving old information out to the right side of the screen
        this.playInAnimation(this.systemConfigProductEditingPageChangeLeftAnimation, 0, 400);

        // After the animation has finished...
        setTimeout(() => {
          // Save previous page information and load new page information
          let i = (this.productEditingNavCurrentPageNumber - 1) * 5;
          while (i < (this.productEditingNavCurrentPageNumber * 5)) {
            // If the number of products hasn't been exceeded yet...
            if (i < this.productEditingProductIDs.length) {
              // Load new product IDs and names
              this.productEditingCurrentPageProductIDs[i % 5] = this.productEditingProductIDs[i];
              this.productEditingCurrentPageProductNames[i % 5] = this.productEditingProductNames[i];

              // Save old product quantities and atMin/atMax values and load new product quantities and atMin/atMax values
              this.productEditingProductQuantitiesAvailable[i + 5] = this.productEditingCurrentPageProductQuantitiesAvailable[i % 5];
              this.productEditingCurrentPageProductQuantitiesAvailable[i % 5] = this.productEditingProductQuantitiesAvailable[i];
              this.productEditingProductQuantitiesAvailableAtMin[i + 5] = this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5];
              this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5] = this.productEditingProductQuantitiesAvailableAtMin[i];
              this.productEditingProductQuantitiesAvailableAtMax[i + 5] = this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5];
              this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5] = this.productEditingProductQuantitiesAvailableAtMax[i];

              // Set the product's display value to "block" (displaying the info and buttons)
              this.productEditingProductDisplay[i % 5] = "block";
            // Otherwise, if the number of products has been exceeded (may occur on last page)...
            } else {
              // Clear the product IDs and names
              this.productEditingCurrentPageProductIDs[i % 5] = "";
              this.productEditingCurrentPageProductNames[i % 5] = "";

              // Save old product quantities and atMin/atMax values and clear them
              this.productEditingProductQuantitiesAvailable[i + 5] = this.productEditingCurrentPageProductQuantitiesAvailable[i % 5];
              this.productEditingCurrentPageProductQuantitiesAvailable[i % 5] = 0;
              this.productEditingProductQuantitiesAvailableAtMin[i + 5] = this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5];
              this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5] = false;
              this.productEditingProductQuantitiesAvailableAtMax[i + 5] = this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5];
              this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5] = false;

              // Set the product's display value to "none" (hiding the info and buttons)
              this.productEditingProductDisplay[i % 5] = "none";
            }

            i++;
          }

          // Play animation for moving new information in from the left side of the screen
          this.playOutAnimation(this.systemConfigProductEditingPageChangeLeftAnimation, 100, 400);
        }, 400);
      }
    }

    // Runs when the page number is increased in product editing
    increasePageNumber(): void {
      // If the systemConfigProductEditingContentAnimation, systemConfigProductEditingPageChangeLeftAnimation,
      //   and systemConfigProductEditingPageChnageRightAnimation are finished...
      if (this.systemConfigProductEditingContentAnimation.in === true && this.systemConfigProductEditingPageChangeLeftAnimation.out === true &&
          this.systemConfigProductEditingPageChangeRightAnimation.out === true) {
        // If the page number is less than the total number of pages, increment it
        if (this.productEditingNavCurrentPageNumber < this.productEditingNavTotalPageNumbers) {
          this.productEditingNavCurrentPageNumber += 1;
        }

        // If the page number is at the number of pages, mark that it is at the maximum
        if (this.productEditingNavCurrentPageNumber === this.productEditingNavTotalPageNumbers) {
          this.pageChangerAtMax = true;
        }

        // If the page number is greater than 1, mark that it is not at the minimum
        if (this.productEditingNavCurrentPageNumber > 1) {
          this.pageChangerAtMin = false;
        }

        // Play animation for moving old information out to the left side of the screen
        this.playInAnimation(this.systemConfigProductEditingPageChangeRightAnimation, 0, 400);

        // After the animation has finished...
        setTimeout(() => {
          // Save previous page information and load new page information
          let i = (this.productEditingNavCurrentPageNumber - 1) * 5;
          while (i < (this.productEditingNavCurrentPageNumber * 5)) {
            // If the number of products hasn't been exceeded yet...
            if (i < this.productEditingProductIDs.length) {
              // Load new product IDs and names
              this.productEditingCurrentPageProductIDs[i % 5] = this.productEditingProductIDs[i];
              this.productEditingCurrentPageProductNames[i % 5] = this.productEditingProductNames[i];

              // Save old product quantities and atMin/atMax values and load new product quantities and atMin/atMax values
              this.productEditingProductQuantitiesAvailable[i - 5] = this.productEditingCurrentPageProductQuantitiesAvailable[i % 5];
              this.productEditingCurrentPageProductQuantitiesAvailable[i % 5] = this.productEditingProductQuantitiesAvailable[i];
              this.productEditingProductQuantitiesAvailableAtMin[i - 5] = this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5];
              this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5] = this.productEditingProductQuantitiesAvailableAtMin[i];
              this.productEditingProductQuantitiesAvailableAtMax[i - 5] = this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5];
              this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5] = this.productEditingProductQuantitiesAvailableAtMax[i];

              // Set the product's display value to "block" (displaying the info and buttons)
              this.productEditingProductDisplay[i % 5] = "block";
            // Otherwise, if the number of products has been exceeded (may occur on last page)...
            } else {
              // Clear the product IDs and names
              this.productEditingCurrentPageProductIDs[i % 5] = "";
              this.productEditingCurrentPageProductNames[i % 5] = "";

              // Save old product quantities and atMin/atMax values and clear them
              this.productEditingProductQuantitiesAvailable[i - 5] = this.productEditingCurrentPageProductQuantitiesAvailable[i % 5];
              this.productEditingCurrentPageProductQuantitiesAvailable[i % 5] = 0;
              this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5] = this.productEditingProductQuantitiesAvailableAtMin[i];
              this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5] = false;
              this.productEditingProductQuantitiesAvailableAtMax[i - 5] = this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5];
              this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5] = false;

              // Set the product's display value to "none" (hiding the info and buttons)
              this.productEditingProductDisplay[i % 5] = "none";
            }

            i++;
          }

          // Play animation for moving new information in from the right side of the screen
          this.playOutAnimation(this.systemConfigProductEditingPageChangeRightAnimation, 100, 400);
        }, 400);
      }
    }

    // Runs when the "submit" button in product editing is pressed
    submitChanges(): void {
      // If the systemConfigProductEditingContentAnimation, systemConfigProductEditingPageChangeLeftAnimation,
      //   and systemConfigProductEditingPageChnageRightAnimation are finished...
      if (this.systemConfigPasswordCheckScreenShadingAnimation.out === true && this.systemConfigProductEditingPageChangeLeftAnimation.out === true &&
          this.systemConfigProductEditingPageChangeRightAnimation.out === true) {
        // Update all the current product quantities
        this.updateProductEditingProductQuantitiesAvailable();

        // Play animation for product editing content and screen shading
        this.playOutAnimation(this.systemConfigProductEditingContentAnimation, 0, 1000);
        this.playOutAnimation(this.systemConfigScreenShadingAnimation, 0, 2000);

        // After the animation has finished...
        setTimeout(() => {
          // Change to no longer editing products and clear admin status
          this.editingProduct = false;
          this.admin = "none";

          // Decrement the product rotation counters and reset the product rotation counters
          this.productRotationCounterTopRow--;
          this.productRotationCounterBottomRow--;
          this.resetProductRotationCounters();
        }, 2000);
      }
    }

    // Handles button events
    buttonEvent(event: string, name: string, source: string): void {
        // If a button is clicked...
        if (event === "click") {
            // Execute something based on which button is clicked
            switch (name) {
                case "minusButton":
                    this.decreaseQuantityWanted();
                    break;
                case "plusButton":
                    this.increaseQuantityWanted();
                    break;
                case "selectedProductCancelButton":
                    this.cancelProduct();
                    break;
                case "purchaseButton":
                    this.purchaseProduct();
                    break;
                case "selectedProductPurchasePaymentContinueButton":
                    this.selectedProductPurchasePaymentContinueButtonClick();
                    break;
                case "zeroButton":
                    this.hexButtonClick("0");
                    break;
                case "oneButton":
                    this.hexButtonClick("1");
                    break;
                case "twoButton":
                    this.hexButtonClick("2");
                    break;
                case "threeButton":
                    this.hexButtonClick("3");
                    break;
                case "fourButton":
                    this.hexButtonClick("4");
                    break;
                case "fiveButton":
                    this.hexButtonClick("5");
                    break;
                case "sixButton":
                    this.hexButtonClick("6");
                    break;
                case "sevenButton":
                    this.hexButtonClick("7");
                    break;
                case "eightButton":
                    this.hexButtonClick("8");
                    break;
                case "nineButton":
                    this.hexButtonClick("9");
                    break;
                case "aButton":
                    this.hexButtonClick("A");
                    break;
                case "bButton":
                    this.hexButtonClick("B");
                    break;
                case "cButton":
                    this.hexButtonClick("C");
                    break;
                case "dButton":
                    this.hexButtonClick("D");
                    break;
                case "eButton":
                    this.hexButtonClick("E");
                    break;
                case "fButton":
                    this.hexButtonClick("F");
                    break;
                case "deleteButton":
                    this.deleteButtonClick();
                    break;
                case "enterButton":
                    this.enterButtonClick();
                    break;
                case "loginBackButton":
                    this.loginBackButtonClick();
                    break;
                case "pastInfoButton":
                    this.pastInfoButtonClick();
                    break;
                case "pastInfoBackButton":
                    this.pastInfoBackButtonClick();
                    break;
                case "systemConfigPasswordCheckContinueButton":
                    this.systemConfigPasswordCheckContinueButtonClick();
                    break;
                case "exitButton":
                    this.exitButtonClick();
                    break;
                case "productEditingMinusButton1":
                    this.decreaseQuantityAvailable(0);
                    break;
                case "productEditingPlusButton1":
                    this.increaseQuantityAvailable(0);
                    break;
                case "productEditingMinusButton2":
                    this.decreaseQuantityAvailable(1);
                    break;
                case "productEditingPlusButton2":
                    this.increaseQuantityAvailable(1);
                    break;
                case "productEditingMinusButton3":
                    this.decreaseQuantityAvailable(2);
                    break;
                case "productEditingPlusButton3":
                    this.increaseQuantityAvailable(2);
                    break;
                case "productEditingMinusButton4":
                    this.decreaseQuantityAvailable(3);
                    break;
                case "productEditingPlusButton4":
                    this.increaseQuantityAvailable(3);
                    break;
                case "productEditingMinusButton5":
                    this.decreaseQuantityAvailable(4);
                    break;
                case "productEditingPlusButton5":
                    this.increaseQuantityAvailable(4);
                    break;
                case "productEditingCancelButton":
                    this.cancelChanges();
                    break;
                case "pageLeftButton":
                    this.decreasePageNumber();
                    break;
                case "pageRightButton":
                    this.increasePageNumber();
                    break;
                case "submitButton":
                    this.submitChanges();
                    break;
            }
        // Otherwise, when the mouse button is pressed over a button...
        } else if (event === "mousedown") {
            // Update the button's source and mark that it is pressed
            this.buttons[this.findButtonPosition(name)].source = source;
            this.buttons[this.findButtonPosition(name)].pressed = true;
        // Otherwise, when the mouse button is released over a button...
        } else if (event === "mouseup") {
            // Update the button's source and mark that it is not pressed
            this.buttons[this.findButtonPosition(name)].source = source;
            this.buttons[this.findButtonPosition(name)].pressed = false;
        // Otherwise, when the mouse has left a button...
        } else if (event === "mouseleave") {
            // Update the button's source and mark that it is not pressed
            this.buttons[this.findButtonPosition(name)].source = source;
            this.buttons[this.findButtonPosition(name)].pressed = false;
        }
    }

    // Find the button's position in this.buttons
    findButtonPosition(name: string): number {
        let i = 0;
        for (let button of this.buttons) {
            if (button.name === name) {
                return i;
            }
            i++;
        }
        return -1;
    }

    // Convert a decimal character to a hexadecimal character
    decToHex(decimal: number): string {
        switch (decimal) {
            case 0:
                return "0";
            case 1:
                return "1";
            case 2:
                return "2";
            case 3:
                return "3";
            case 4:
                return "4";
            case 5:
                return "5";
            case 6:
                return "6";
            case 7:
                return "7";
            case 8:
                return "8";
            case 9:
                return "9";
            case 10:
                return "A";
            case 11:
                return "B";
            case 12:
                return "C";
            case 13:
                return "D";
            case 14:
                return "E";
            case 15:
                return "F";
        }
    }

    // Convert a hexadecimal character to a decimal character
    hexToDec(hexadecimal: string): number {
        switch (hexadecimal) {
            case "0":
                return 0;
            case "1":
                return 1;
            case "2":
                return 2;
            case "3":
                return 3;
            case "4":
                return 4;
            case "5":
                return 5;
            case "6":
                return 6;
            case "7":
                return 7;
            case "8":
                return 8;
            case "9":
                return 9;
            case "A":
                return 10;
            case "B":
                return 11;
            case "C":
                return 12;
            case "D":
                return 13;
            case "E":
                return 14;
            case "F":
                return 15;
        }
    }

    // Add two hexadecimals (hexA and hexB)
    addHex(hexA: string, hexB: string): string {
        let answer = "";

        // Make both hexadecimals the same length
        if (hexA.length < hexB.length) {
            hexA = this.setLengthOfHex(hexA, hexB.length);
        } else if (hexB.length < hexA.length) {
            hexB = this.setLengthOfHex(hexB, hexA.length);
        }

        // Move from right to left along the hexadecimals, converting the hexadecimals
        //   to decimals, adding the values, noting if there's a carry or not, and
        //   converting the decimals back to hexadecimals.  Also add a "1" to the left
        //   end of the hexadecimal if the addition ends with a carry.
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

    // Subtract hexB from hexA
    subtractHex(hexA: string, hexB: string): string {
        let answer = "";

        // Make both hexadecimals the same length
        if (hexA.length < hexB.length) {
            hexA = this.setLengthOfHex(hexA, hexB.length);
        } else if (hexB.length < hexA.length) {
            hexB = this.setLengthOfHex(hexB, hexA.length);
        }

        // Move from right to left along the hexadecimals, converting the hexadecimals
        //   to decimals.  If the top value (hexA) is greater than or equal to the bottom
        //   value (hexB), simply subtract hexB from hexA.  Otherwise, move to the
        //   left along hexA until a nonzero value is found, decrement it, and change
        //   any zeroes between it and the original value to "F".  Add 16 to the original
        //   value and complete the subtraction.
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

    // Multiply two hexadecimals (hexA and hexB)
    multiplyHex(hexA: string, hexB: string): string {
        let product = "0";

        // Move from right to left along hexB, converting its hexadecimals to decimals.
        //   Add the value of hexA to the product n times, where n is whatever the
        //   decimal value of the current digit in hexB is.  Each time you move to the
        //   next digit in hexB, add a "0" to the end of hexA.
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

    // Mod hexA by hexB
    modHex(hexA: string, hexB: string): string {
        // Check to make sure that hexB isn't 0
        if (this.hexToDec(hexB) === 0) {
            return "-1";
        }

        // While hexA is greater than hexB (meaning that you can still mod hexA by hexB)
        //   make two copies of hexB.  Enter a loop that adds a zero to the end of the first
        //   copy and checks to see if the new value exceeds hexA.  If it does, revert
        //   to the second copy.  Otherwise, copy the first copy over to the second one.
        //   When the first copy does exceed hexA, subtract the second copy from hexA.
        //   Continue this until hexA is less than hexB.
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

    // Randomly generate a hexadecimal value of the passed length
    generateHex(length: number): string {
        let randomHex = "";
        let i = 1;
        while (i <= length) {
            randomHex = randomHex + this.decToHex(Math.floor(Math.random() * 16));
            i++;
        }

        return randomHex;
    }

    // Change the length of the passed hexadecimal to a passed length
    setLengthOfHex(hex: string, length: number): string {
        // If the wanted length is greater than the length of the hexadecimal...
        while (hex.length < length) {
            // Add zeroes to the left end of it
            hex = "0" + hex;
        }

        // If the wanted length is less than the length of the hexadecimal...
        while (hex.length > length) {
            // Remove the leftmost character from the hexadecimal
            hex = hex.substr(1, hex.length - 1);
        }

        return hex;
    }

    // Compare two hexadecimal values
    compareHex(hexA: string, hexB: string): number {
        // Make both hexadecimals the same length
        if (hexA.length < hexB.length) {
            hexA = this.setLengthOfHex(hexA, hexB.length);
        } else if (hexB.length < hexA.length) {
            hexB = this.setLengthOfHex(hexB, hexA.length);
        }

        // Move from left to right along the hexadecimals, converting the hexadecimals
        //   to decimals.  If at any point, the values are different, return a 1 if
        //   hexA has the larger value, or -1 if hexB has the larger value.   If all the
        //   values are the same, return a 0 (indicating that they're equal).
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

    // Load the products and execute nav events on initiation
    ngOnInit() {
      // Load both rows of products
      this.productsTopRow = this.loadProductsTopRow();
      this.productsBottomRow = this.loadProductsBottomRow();

      // Run topLeft and bottomLeft nav events (this causes the automatic product rotations that
      //   occur when the vending machine has been inactive for a certain period of time to
      //   start right away without the need for an initial nav button press or product dragging)
      this.navEvent("click", "topLeft", "", false);
      this.navEvent("click", "bottomLeft", "", false);
    }

    ngAfterViewInit() {

    }
}
