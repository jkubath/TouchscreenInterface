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
    public viewingPastInfo = false;
    public checkingPassword = false;
    public editingProduct = false;

    // Hexadecimal Calculations
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
      while (i < this.productsTopRow.length) {
        this.productEditingProductIDs[productNum] = this.productsTopRow[i].id;
        this.productEditingProductNames[productNum] = this.productsTopRow[i].name;
        let fileContent = fs.readFileSync(`./src/product-data/${this.productEditingProductIDs[productNum]}.json`, "utf8");
        let jsonContent = JSON.parse(fileContent.toString());
        this.productEditingProductQuantitiesAvailable[productNum] = jsonContent.quantity;

        if (this.productEditingProductQuantitiesAvailable[productNum] === 0) {
          this.productEditingProductQuantitiesAvailableAtMin[productNum] = true;
        } else {
          this.productEditingProductQuantitiesAvailableAtMin[productNum] = false;
        }

        if (this.productEditingProductQuantitiesAvailable[productNum] === 100) {
          this.productEditingProductQuantitiesAvailableAtMax[productNum] = true;
        } else {
          this.productEditingProductQuantitiesAvailableAtMax[productNum] = false;
        }

        productNum++;
        i++;
      }

      i = 0;

      // Loop through the bottom row, reading in the product IDs, names, and quantities, and setting the atMax/atMin values depending on the quantity
      while (i < this.productsBottomRow.length) {
        this.productEditingProductIDs[productNum] = this.productsBottomRow[i].id;
        this.productEditingProductNames[productNum] = this.productsBottomRow[i].name;

        let fileContent = fs.readFileSync(`./src/product-data/${this.productEditingProductIDs[productNum]}.json`, "utf8");
        let jsonContent = JSON.parse(fileContent.toString());
        this.productEditingProductQuantitiesAvailable[productNum] = jsonContent.quantity;

        if (this.productEditingProductQuantitiesAvailable[productNum] === 0) {
          this.productEditingProductQuantitiesAvailableAtMin[productNum] = true;
        } else {
          this.productEditingProductQuantitiesAvailableAtMin[productNum] = false;
        }

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
        this.productEditingCurrentPageProductIDs[i] = this.productEditingProductIDs[i];
        this.productEditingCurrentPageProductNames[i] = this.productEditingProductNames[i];
        this.productEditingCurrentPageProductQuantitiesAvailable[i] = this.productEditingProductQuantitiesAvailable[i];
        this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i] = this.productEditingProductQuantitiesAvailableAtMin[i];
        this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i] = this.productEditingProductQuantitiesAvailableAtMax[i];
        this.productEditingProductDisplay[i] = "block";
        i++;
      }

      // If there are fewer than 5 products, set the unused spaces in the arrays to ""/0/false/"none"
      while (i < 5) {
        this.productEditingCurrentPageProductIDs[i] = "";
        this.productEditingCurrentPageProductNames[i] = "";
        this.productEditingCurrentPageProductQuantitiesAvailable[i] = 0;
        this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i] = false;
        this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i] = false;
        this.productEditingProductDisplay[i] = "none";
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
        if (event === "password") {
            if (this.navPasswordSequence[this.navPasswordPosition] === location) {
                this.navPasswordPosition++;
                if (this.navPasswordPosition === this.navPasswordSequence.length) {
                  this.enteringUserID = true;

                  this.productRotationCounterTopRow++;
                  this.productRotationCounterBottomRow++;

                  // Screen Shading Animation
                  this.playInAnimation(this.systemConfigScreenShadingAnimation, 0, 1000);

                  // System Config Login Animation
                  this.playInAnimation(this.systemConfigLoginAnimation, 750, 750);

                  this.navPasswordPosition = 0;
                } else {
                    let previousPasswordPosition = this.navPasswordPosition - 1;
                    setTimeout(() => {
                        if (this.navPasswordPosition === previousPasswordPosition + 1) {
                            this.navPasswordPosition = 0;
                        }
                    }, 5000);
                }
            } else {
                this.navPasswordPosition = 0;
            }
        } else if (event === "click") {
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
        } else if (event === "reachesBound") {
            this.navButtonEnabled[location] = !reachesBound;
        } else if (event === "mousedown") {
            this.productRotationCounterTopRow++;
            this.productRotationCounterBottomRow++;
        } else if (event === "mouseup") {
            this.productRotationCounterTopRow--;
            this.productRotationCounterBottomRow--;
            this.resetProductRotationCounters();
        } else {
            this.navButtonSource[location] = imageSource;
        }
    }

    resetProductRotationCounters(): void {
      this.productRotationCounterTopRow++;
      this.productRotationCounterBottomRow++;

      setTimeout(() => {
        this.productRotationCounterTopRow--;
        if (this.productRotationCounterTopRow === 0) {
          this.rotateProductsTopRow();
        }
      }, 10000);

      setTimeout(() => {
        this.productRotationCounterBottomRow--;
        if (this.productRotationCounterBottomRow === 0) {
          this.rotateProductsBottomRow();
        }
      }, 12500);
    }

    rotateProductsTopRow(): void {
      if (this.navButtonEnabled["topLeft"] === false) {
        this.productRotationDirectionTopRow = "right";
      } else if (this.navButtonEnabled["topRight"] === false) {
        this.productRotationDirectionTopRow = "left";
      }

      if (this.productRotationDirectionTopRow === "right") {
        this.topds.moveRight();
      } else if (this.productRotationDirectionTopRow === "left") {
        this.topds.moveLeft();
      }

      setTimeout(() => {
        if (this.productRotationCounterTopRow === 0) {
          this.rotateProductsTopRow();
        }
      }, 5000);
    }

    rotateProductsBottomRow(): void {
      if (this.navButtonEnabled["bottomLeft"] === false) {
        this.productRotationDirectionBottomRow = "right";
      } else if (this.navButtonEnabled["bottomRight"] === false) {
        this.productRotationDirectionBottomRow = "left";
      }

      if (this.productRotationDirectionBottomRow === "right") {
        this.bottomds.moveRight();
      } else if (this.productRotationDirectionBottomRow === "left") {
        this.bottomds.moveLeft();
      }

      setTimeout(() => {
        if (this.productRotationCounterBottomRow === 0) {
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

    // Sets values and plays animations when a product is selected
    selectProduct(product: Product): void {
        this.snapDisabled = "true";
        this.selectedProduct = product;
        this.productRotationCounterTopRow++;
        this.productRotationCounterBottomRow++;

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
        this.playInAnimation(this.productSelectingScreenShadingAnimation, 0, 1000);

        // Screen Lighting Animation
        this.playInAnimation(this.productSelectingScreenLightingAnimation, 375, 875);

        // Selected Product Image Animation
        this.playInAnimation(this.selectedProductImageAnimation, 1000, 1000);

        // Selected Product Information Animation
        this.playInAnimation(this.selectedProductInformationAnimation, 1250, 1250);
    }

    // Decrements selectedProductQuantityWanted if it's greater than 1 and enables/disables
    //   the decrement button
    decreaseQuantityWanted(): void {
        if (this.selectedProductInformationAnimation.in === true) {
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
    }

    // Increments selectedProductQuantityWanted if it's less than the max and enables/disables
    //   the increment button
    increaseQuantityWanted(): void {
        if (this.selectedProductInformationAnimation.in === true) {
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
    }

    // Plays animations when the cancel button is pressed for a product
    cancelProduct(): void {
        if (this.selectedProductInformationAnimation.in === true) {
            // Selected Product Information Animation
            this.playOutAnimation(this.selectedProductInformationAnimation, 0, 750);

            // Selected Product Image Animation
            this.playOutAnimation(this.selectedProductImageAnimation, 0, 1000);

            // Screen Lighting Animation
            this.playOutAnimation(this.productSelectingScreenLightingAnimation, 0, 1750);

            // Screen Shading Animation
            this.playOutAnimation(this.productSelectingScreenShadingAnimation, 0, 2000);

            // Indicate that there is no longer a selected product
            setTimeout(() => {
                this.selectedProduct = null;

                this.productRotationCounterTopRow--;
                this.productRotationCounterBottomRow--;
                this.resetProductRotationCounters();
            }, 2000);
        }
    }

    // When you purchase a product, do the following:
    //   - Update the max quantity available for the selected product
    //   - Decide whether the current quantity is at the min, max, or neither
    purchaseProduct(): void {
        if (this.selectedProductInformationAnimation.in === true) {
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
    }

    // Adds the passed character to the userID or password entry
    hexButtonClick(character: string): void {
        if (this.systemConfigLoginAnimation.in === true) {
            if (this.enteringUserID === true && this.userID.length < this.userID.chars.length) {
                this.userID.chars[this.userID.length] = character;
                this.userIDAndPasswordChars[this.userID.length] = "*";
                this.userID.length++;
            } else if (this.enteringPassword === true && this.password.length < this.password.chars.length) {
                this.password.valid = true;
                this.password.chars[this.password.length] = character;
                if (this.password.length >= 15) {
                    this.userIDAndPasswordChars[this.password.length + 3] = character;
                } else if (this.password.length >= 10) {
                    this.userIDAndPasswordChars[this.password.length + 2] = character;
                } else if (this.password.length >= 5) {
                    this.userIDAndPasswordChars[this.password.length + 1] = character;
                } else {
                    this.userIDAndPasswordChars[this.password.length] = character;
                }
                this.password.length++;
            }
        }
    }

    // Removes a character from the User ID or Password entr
    deleteButtonClick(): void {
        if (this.systemConfigLoginAnimation.in === true) {
            if (this.enteringUserID === true && this.userID.length > 0) {
                this.userID.length--;
                this.userID.chars[this.userID.length] = "";
                this.userIDAndPasswordChars[this.userID.length] = "";
            } else if (this.enteringPassword === true && this.password.length > 0) {
                this.password.valid = true;
                this.password.length--;
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

    // Submits the user ID or password
    enterButtonClick(): void {
        if (this.systemConfigLoginAnimation.in === true) {
            if (this.enteringUserID === true) {
                this.enteringUserID = false;
                this.enteringPassword = true;

                let i = 0;
                while (i < this.userIDAndPasswordChars.length) {
                    this.userIDAndPasswordChars[i] = "";
                    i++;
                }

                this.userID.string = "";
                i = 0;
                while (i < this.userID.length) {
                    this.userID.string = this.userID.string + this.userID.chars[i];
                    i++;
                }

                try {
                    let exists = fs.statSync(`./src/user-data/${this.userID.string}.json`);
                    this.userID.valid = true;
                } catch (error) {
                    this.userID.valid = false;
                }

                if (this.userID.valid === true) {
                    let fileContent = fs.readFileSync(`./src/user-data/${this.userID.string}.json`, "utf8");
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
                    this.pastInfoPasswordCheck = "C2510CD533EFE3099AD6";
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

                this.pastInfoPasswordSum = this.pastInfoPasswordSum.substr(0, 5) + "-" + this.pastInfoPasswordSum.substr(5, 5) + "-" +
                    this.pastInfoPasswordSum.substr(10, 5) + "-" + this.pastInfoPasswordSum.substr(15);
                this.pastInfoPasswordCheck = this.pastInfoPasswordCheck.substr(0, 5) + "-" + this.pastInfoPasswordCheck.substr(5, 5) + "-" +
                    this.pastInfoPasswordCheck.substr(10, 5) + "-" + this.pastInfoPasswordCheck.substr(15);

                i = 0;
                while (i < this.userID.length) {
                    this.userID.chars[i] = "";
                    i++;
                }
                this.userID.length = 0;

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
                this.password.string = "";

                let i = 0;
                while (i < this.password.length) {
                    this.password.string = this.password.string + this.password.chars[i];
                    i++;
                }

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

                if (passwordCorrect === true && this.userID.valid === true) {
                    this.pastInfoPasswordSum = this.passwordSum.substr(0, 5) + this.passwordSum.substr(6, 5) + this.passwordSum.substr(12, 5) + this.passwordSum.substr(18);
                    this.passwordCheck = this.setLengthOfHex(this.modHex(this.multiplyHex(this.multiplyHex(this.multiplyHex(this.modHex(this.passwordA, this.passwordB), this.modHex(this.passwordB, this.passwordA)), this.modHex(this.passwordC, this.passwordA)), this.modHex(this.passwordC, this.passwordB)), "100000000000000000000"), 20);
                    this.pastInfoPasswordCheck = this.passwordCheck;
                    this.passwordCheck = this.passwordCheck.substr(0, 5) + "-" + this.passwordCheck.substr(5, 5) + "-" + this.passwordCheck.substr(10, 5) + "-" + this.passwordCheck.substr(15);
                    this.enteringPassword = false;
                    this.checkingPassword = true;

                    // Screen Shading Animation
                    this.playInAnimation(this.systemConfigPasswordCheckScreenShadingAnimation, 0, 1000);

                    // Password Check Content Animation
                    this.playInAnimation(this.systemConfigPasswordCheckContentAnimation, 500, 1500);

                    let fileContent = fs.readFileSync(`./src/user-data/${this.userID.string}.json`, "utf8");
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
                    this.userID.valid = false;
                    this.passwordA = "";
                    this.passwordB = "";
                    this.passwordC = "";
                    fs.writeFileSync(`./src/user-data/${this.userID.string}.json`, JSON.stringify(jsonContent, null, 2));
                    this.userID.string = "";
                    this.password.string = "";

                    i = 0;
                    while (i < this.userIDAndPasswordChars.length) {
                        this.userIDAndPasswordChars[i] = "";
                        i++;
                    }

                    i = 0;
                    while (i < this.password.length) {
                        this.password.chars[i] = "";
                        i++;
                    }
                    this.password.length = 0;
                } else {
                    this.password.valid = false;
                }
            }
        }
    }

    // Goes back to the previous page
    loginBackButtonClick(): void {
        if (this.systemConfigLoginAnimation.in === true) {
            if (this.enteringPassword === true) {
                this.enteringPassword = false;
                this.password.valid = true;
                this.enteringUserID = true;
                this.userID.valid = false;
                this.passwordA = "";
                this.passwordB = "";
                this.passwordC = "";
                this.userID.string = "";

                let i = 0;
                while (i < this.userIDAndPasswordChars.length) {
                    this.userIDAndPasswordChars[i] = "";
                    i++;
                }

                i = 0;
                while (i < this.password.length) {
                    this.password.chars[i] = "";
                    i++;
                }
                this.password.length = 0;
            } else if (this.enteringUserID === true) {

                // User ID and Password Entry Animations
                this.playOutAnimation(this.systemConfigLoginAnimation, 0, 1000);

                // Screen Shading Animation
                this.playOutAnimation(this.systemConfigScreenShadingAnimation, 0, 2000);

                setTimeout(() => {
                    let i = 0;
                    while (i < this.userIDAndPasswordChars.length) {
                        this.enteringUserID = false;

                        this.userIDAndPasswordChars[i] = "";
                        i++;
                    }

                    i = 0;
                    while (i < this.userID.length) {
                        this.userID.chars[i] = "";
                        i++;
                    }
                    this.userID.length = 0;

                    this.productRotationCounterTopRow--;
                    this.productRotationCounterBottomRow--;
                    this.resetProductRotationCounters();
                }, 2000);
            }
        }
    }

    pastInfoButtonClick(): void {
        if (this.systemConfigLoginAnimation.in === true) {
            this.viewingPastInfo = true;

            // Screen Shading Animation
            this.playInAnimation(this.systemConfigPastInfoScreenShadingAnimation, 0, 1000);

            // Past Info Animation
            this.playInAnimation(this.systemConfigPastInfoContentAnimation, 750, 750);

            // cd('~/ScreenManager/src/setup/end');
            // exec('make run', {async:true});
        }
    }

    pastInfoBackButtonClick(): void {
        if (this.systemConfigPastInfoContentAnimation.in === true) {

            // Past Info Animation
            this.playOutAnimation(this.systemConfigPastInfoContentAnimation, 0, 1000);

            // Screen Shading Animation
            this.playOutAnimation(this.systemConfigPastInfoScreenShadingAnimation, 0, 2000);

            setTimeout(() => {
                this.viewingPastInfo = false;
            }, 2000);
        }
    }

    continueButtonClick(): void {
        if (this.systemConfigPasswordCheckContentAnimation.in === true) {
            this.editingProduct = true;
            this.getProductEditingProductQuantitiesAvailable();

            // System Config Login Animation
            this.playOutAnimation(this.systemConfigLoginAnimation, 0, 1000);

            // Password Check Content Animation
            this.playOutAnimation(this.systemConfigPasswordCheckContentAnimation, 0, 1500);

            // Password Check Screen Shading Animation
            this.playOutAnimation(this.systemConfigPasswordCheckScreenShadingAnimation, 0, 2000);

            // System Config Product Editing Animation
            this.playInAnimation(this.systemConfigProductEditingContentAnimation, 1000, 1000);

            setTimeout(() => {
                this.checkingPassword = false;
            }, 2000);
        }
    }

    decreaseQuantityAvailable(productPosition: number): void {
      if (this.systemConfigPasswordCheckScreenShadingAnimation.out === true) {
        if (this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] > 0) {
          this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] -= 1;
        }

        if (this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] === 0) {
          this.productEditingCurrentPageProductQuantitiesAvailableAtMin[productPosition] = true;
        }

        if (this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] < 100) {
          this.productEditingCurrentPageProductQuantitiesAvailableAtMax[productPosition] = false;
        }

        let i = (this.productEditingNavCurrentPageNumber - 1) * 5;
        while (i < (this.productEditingNavCurrentPageNumber * 5) && i < this.productEditingProductIDs.length) {
          this.productEditingProductQuantitiesAvailable[i] = this.productEditingCurrentPageProductQuantitiesAvailable[i % 5];
          this.productEditingProductQuantitiesAvailableAtMin[i] = this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5];
          this.productEditingProductQuantitiesAvailableAtMax[i] = this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5];
          i++;
        }
      }
    }

    increaseQuantityAvailable(productPosition: number): void {
      if (this.systemConfigPasswordCheckScreenShadingAnimation.out === true) {
        if (this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] < 100) {
          this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] += 1;
        }

        if (this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] === 100) {
          this.productEditingCurrentPageProductQuantitiesAvailableAtMax[productPosition] = true;
        }

        if (this.productEditingCurrentPageProductQuantitiesAvailable[productPosition] > 0) {
          this.productEditingCurrentPageProductQuantitiesAvailableAtMin[productPosition] = false;
        }

        let i = (this.productEditingNavCurrentPageNumber - 1) * 5;
        while (i < (this.productEditingNavCurrentPageNumber * 5) && i < this.productEditingProductIDs.length) {
          this.productEditingProductQuantitiesAvailable[i] = this.productEditingCurrentPageProductQuantitiesAvailable[i % 5];
          this.productEditingProductQuantitiesAvailableAtMin[i] = this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5];
          this.productEditingProductQuantitiesAvailableAtMax[i] = this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5];
          i++;
        }
      }
    }

    cancelChanges(): void {
      if (this.systemConfigPasswordCheckScreenShadingAnimation.out === true && this.systemConfigProductEditingPageChangeLeftAnimation.out === true &&
          this.systemConfigProductEditingPageChangeRightAnimation.out === true) {
        this.editingProduct = false;

        // System Config Product Editing Animation
        this.playOutAnimation(this.systemConfigProductEditingContentAnimation, 0, 1000);

        // Screen Shading Animation
        this.playOutAnimation(this.systemConfigScreenShadingAnimation, 0, 2000);

        this.productRotationCounterTopRow++;
        this.productRotationCounterBottomRow++;
      }
    }

    decreasePageNumber(): void {
      if (this.systemConfigPasswordCheckScreenShadingAnimation.out === true && this.systemConfigProductEditingPageChangeLeftAnimation.out === true &&
          this.systemConfigProductEditingPageChangeRightAnimation.out === true) {
        if (this.productEditingNavCurrentPageNumber > 1) {
          this.productEditingNavCurrentPageNumber -= 1;
        }

        if (this.productEditingNavCurrentPageNumber === 1) {
          this.pageChangerAtMin = true;
        }

        if (this.productEditingNavCurrentPageNumber < this.productEditingNavTotalPageNumbers) {
          this.pageChangerAtMax = false;
        }

        this.playInAnimation(this.systemConfigProductEditingPageChangeLeftAnimation, 0, 400);

        setTimeout(() => {
          let i = (this.productEditingNavCurrentPageNumber - 1) * 5;
          while (i < (this.productEditingNavCurrentPageNumber * 5) && i < this.productEditingProductIDs.length) {
            this.productEditingCurrentPageProductIDs[i % 5] = this.productEditingProductIDs[i];
            this.productEditingCurrentPageProductNames[i % 5] = this.productEditingProductNames[i];
            this.productEditingProductQuantitiesAvailable[i + 5] = this.productEditingCurrentPageProductQuantitiesAvailable[i % 5];
            this.productEditingCurrentPageProductQuantitiesAvailable[i % 5] = this.productEditingProductQuantitiesAvailable[i];
            this.productEditingProductQuantitiesAvailableAtMin[i + 5] = this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5];
            this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5] = this.productEditingProductQuantitiesAvailableAtMin[i];
            this.productEditingProductQuantitiesAvailableAtMax[i + 5] = this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5];
            this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5] = this.productEditingProductQuantitiesAvailableAtMax[i];
            this.productEditingProductDisplay[i % 5] = "block";
            i++;
          }

          while (i < (this.productEditingNavCurrentPageNumber * 5)) {
            this.productEditingCurrentPageProductIDs[i % 5] = "";
            this.productEditingCurrentPageProductNames[i % 5] = "";
            this.productEditingProductQuantitiesAvailable[i + 5] = this.productEditingCurrentPageProductQuantitiesAvailable[i % 5];
            this.productEditingCurrentPageProductQuantitiesAvailable[i % 5] = 0;
            this.productEditingProductQuantitiesAvailableAtMin[i + 5] = this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5];
            this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5] = false;
            this.productEditingProductQuantitiesAvailableAtMax[i + 5] = this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5];
            this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5] = false;
            this.productEditingProductDisplay[i % 5] = "none";
            i++;
          }

          this.playOutAnimation(this.systemConfigProductEditingPageChangeLeftAnimation, 100, 400);
        }, 400);
      }
    }

    increasePageNumber(): void {
      if (this.systemConfigPasswordCheckScreenShadingAnimation.out === true && this.systemConfigProductEditingPageChangeLeftAnimation.out === true &&
          this.systemConfigProductEditingPageChangeRightAnimation.out === true) {
        if (this.productEditingNavCurrentPageNumber < this.productEditingNavTotalPageNumbers) {
          this.productEditingNavCurrentPageNumber += 1;
        }

        if (this.productEditingNavCurrentPageNumber === this.productEditingNavTotalPageNumbers) {
          this.pageChangerAtMax = true;
        }

        if (this.productEditingNavCurrentPageNumber > 1) {
          this.pageChangerAtMin = false;
        }

        this.playInAnimation(this.systemConfigProductEditingPageChangeRightAnimation, 0, 400);

        setTimeout(() => {
          let i = (this.productEditingNavCurrentPageNumber - 1) * 5;
          while (i < (this.productEditingNavCurrentPageNumber * 5) && i < this.productEditingProductIDs.length) {
            this.productEditingCurrentPageProductIDs[i % 5] = this.productEditingProductIDs[i];
            this.productEditingCurrentPageProductNames[i % 5] = this.productEditingProductNames[i];
            this.productEditingProductQuantitiesAvailable[i - 5] = this.productEditingCurrentPageProductQuantitiesAvailable[i % 5];
            this.productEditingCurrentPageProductQuantitiesAvailable[i % 5] = this.productEditingProductQuantitiesAvailable[i];
            this.productEditingProductQuantitiesAvailableAtMin[i - 5] = this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5];
            this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5] = this.productEditingProductQuantitiesAvailableAtMin[i];
            this.productEditingProductQuantitiesAvailableAtMax[i - 5] = this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5];
            this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5] = this.productEditingProductQuantitiesAvailableAtMax[i];
            this.productEditingProductDisplay[i % 5] = "block";
            i++;
          }

          while (i < (this.productEditingNavCurrentPageNumber * 5)) {
            this.productEditingCurrentPageProductIDs[i % 5] = "";
            this.productEditingCurrentPageProductNames[i % 5] = "";
            this.productEditingProductQuantitiesAvailable[i - 5] = this.productEditingCurrentPageProductQuantitiesAvailable[i % 5];
            this.productEditingCurrentPageProductQuantitiesAvailable[i % 5] = 0;
            this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5] = this.productEditingProductQuantitiesAvailableAtMin[i];
            this.productEditingCurrentPageProductQuantitiesAvailableAtMin[i % 5] = false;
            this.productEditingProductQuantitiesAvailableAtMax[i - 5] = this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5];
            this.productEditingCurrentPageProductQuantitiesAvailableAtMax[i % 5] = false;
            this.productEditingProductDisplay[i % 5] = "none";
            i++;
          }

          this.playOutAnimation(this.systemConfigProductEditingPageChangeRightAnimation, 100, 400);
        }, 400);
      }
    }

    submitChanges(): void {
      if (this.systemConfigPasswordCheckScreenShadingAnimation.out === true && this.systemConfigProductEditingPageChangeLeftAnimation.out === true &&
          this.systemConfigProductEditingPageChangeRightAnimation.out === true) {
        this.editingProduct = false;

        this.updateProductEditingProductQuantitiesAvailable();

        // System Config Product Editing Animation
        this.playOutAnimation(this.systemConfigProductEditingContentAnimation, 0, 1000);

        // Screen Shading Animation
        this.playOutAnimation(this.systemConfigScreenShadingAnimation, 0, 2000);

        this.productRotationCounterTopRow--;
        this.productRotationCounterBottomRow--;
        this.resetProductRotationCounters();
      }
    }

    buttonEvent(event: string, name: string, source: string): void {
        if (event === "click") {
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
                case "continueButton":
                    this.continueButtonClick();
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
        } else if (event === "mousedown") {
            this.buttons[this.findButtonPosition(name)].source = source;
            this.buttons[this.findButtonPosition(name)].pressed = true;
        } else if (event === "mouseup") {
            this.buttons[this.findButtonPosition(name)].source = source;
            this.buttons[this.findButtonPosition(name)].pressed = false;
        } else if (event === "mouseleave") {
            this.buttons[this.findButtonPosition(name)].source = source;
            this.buttons[this.findButtonPosition(name)].pressed = false;
        }
    }

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
      this.productsTopRow = this.loadProductsTopRow();
      this.productsBottomRow = this.loadProductsBottomRow();
      this.navEvent("click", "topLeft", "", false);
      this.navEvent("click", "bottomLeft", "", false);
    }

    ngAfterViewInit() {

    }
}
