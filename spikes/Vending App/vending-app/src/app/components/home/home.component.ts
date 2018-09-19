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

    // Navigation Buttons Source/Enabled
    public navButtonSource: NavButtonSource = {topLeft: "assets/img/Button-On-Left.png", topRight: "assets/img/Button-On-Right.png", bottomLeft: "assets/img/Button-On-Left.png", bottomRight: "assets/img/Button-On-Right.png"};
    public navButtonEnabled: NavButtonEnabled = {topLeft: true, topRight: true, bottomLeft: true, bottomRight: true};

    // Navigation Button Password
    public navPasswordSequence: string[] = ["topLeft", "topRight", "bottomLeft", "bottomRight", "topLeft", "topRight", "bottomLeft", "bottomRight"];
    public navPasswordPosition = 0;

    // Snap Enabled
    public snapDisabled = "false";   // Note: This is a string due to the type being required by ngx-drag-scroll

    // Animations
    // Product Selecting
    public productSelectingScreenShadingAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public productSelectingScreenLightingAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public selectedProductImageAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public selectedProductInformationAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    // System Configuration
    public systemConfigScreenShadingAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public systemConfigLoginAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public systemConfigPasswordCheckScreenShadingAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public systemConfigPasswordCheckContentAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public systemConfigPastInfoScreenShadingAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};
    public systemConfigPastInfoContentAnimation: Animation = {out: true, transitionIn: false, in: false, transitionOut: false};

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
    public buttons: Button[] = [{name: "minusButton", source: "assets/img/Minus-Button.png", pressed: false},
                                {name: "plusButton", source: "assets/img/Plus-Button.png", pressed: false},
                                {name: "cancelButton", source: "assets/img/Button-175.png", pressed: false},
                                {name: "purchaseButton", source: "assets/img/Button-225.png", pressed: false},
                                {name: "zeroButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "oneButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "twoButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "threeButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "fourButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "fiveButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "sixButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "sevenButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "eightButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "nineButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "aButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "bButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "cButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "dButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "eButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "fButton", source: "assets/img/Button-60.png", pressed: false},
                                {name: "deleteButton", source: "assets/img/Button-312.png", pressed: false},
                                {name: "enterButton", source: "assets/img/Button-312.png", pressed: false},
                                {name: "loginBackButton", source: "assets/img/Button-175.png", pressed: false},
                                {name: "pastInfoButton", source: "assets/img/Button-225.png", pressed: false},
                                {name: "pastInfoBackButton", source: "assets/img/Button-175.png", pressed: false},
                                {name: "continueButton", source: "assets/img/Button-225.png", pressed: false}];

    // Information Entry
    public userID: Login = {valid: false, entering: false, chars: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""], length: 0, string: ""};
    public password: Login = {valid: true, entering: false, chars: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""], length: 0, string: ""};

    public userIDAndPasswordChars: string[] = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
    public checkingPassword = false;
    public viewingPastInfo = false;
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

    // Handle events of the navigation buttons
    navEvent(event: string, location: string, imageSource: string, reachesBound: boolean): void {
      if (event === "password") {
        if (this.navPasswordSequence[this.navPasswordPosition] === location) {
          this.navPasswordPosition++;
          if (this.navPasswordPosition === this.navPasswordSequence.length) {
            this.enterUserIDAndPassword();

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
      } else if (event === "reachesBound") {
        this.navButtonEnabled[location] = !reachesBound;
      } else {
        this.navButtonSource[location] = imageSource;
      }
    }

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


    // Runs when the user presses the correct combination of nav buttons
    enterUserIDAndPassword(): void {
        this.userID.entering = true;

        // Screen Shading Animation
        this.playInAnimation(this.systemConfigScreenShadingAnimation, 0, 1000);

        // User ID and Password Entry Animations
        this.playInAnimation(this.systemConfigLoginAnimation, 750, 750);
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
        if (this.userID.entering === true && this.userID.length < this.userID.chars.length) {
          this.userID.chars[this.userID.length] = character;
          this.userIDAndPasswordChars[this.userID.length] = "*";
          this.userID.length++;
        } else if (this.password.entering === true && this.password.length < this.password.chars.length) {
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
        if (this.userID.entering === true && this.userID.length > 0) {
          this.userID.length--;
          this.userID.chars[this.userID.length] = "";
          this.userIDAndPasswordChars[this.userID.length] = "";
        } else if (this.password.entering === true && this.password.length > 0) {
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
        if (this.userID.entering === true) {
          this.userID.entering = false;
          this.password.entering = true;

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
            this.pastInfoPasswordCheck = "C2510CD533EFE3099AD6"
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
          while(i < this.userID.length) {
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
        } else if (this.password.entering === true) {
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
              if (this.password.string[j] != this.passwordProduct[j]) {
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
            this.displayPasswordCheck();

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

    displayPasswordCheck(): void {
      this.checkingPassword = true;

      // Screen Shading Animation
      this.playInAnimation(this.systemConfigPasswordCheckScreenShadingAnimation, 0, 1000);

      // Password Check Info Animation
      this.playInAnimation(this.systemConfigPasswordCheckContentAnimation, 0, 1500);
    }

    // Goes back to the previous page
    loginBackButtonClick(): void {
      if (this.systemConfigLoginAnimation.in === true) {
        if (this.password.entering === true) {
          this.password.entering = false;
          this.password.valid = true;
          this.userID.entering = true;
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
        } else if (this.userID.entering === true) {

          // User ID and Password Entry Animations
          this.playOutAnimation(this.systemConfigLoginAnimation, 0, 1000);

          // Screen Shading Animation
          this.playOutAnimation(this.systemConfigScreenShadingAnimation, 0, 2000);

          setTimeout(() => {
            let i = 0;
            while (i < this.userIDAndPasswordChars.length) {
              this.userID.entering = false;

              this.userIDAndPasswordChars[i] = "";
              i++;
            }

            i = 0;
            while (i < this.userID.length) {
              this.userID.chars[i] = "";
              i++;
            }
            this.userID.length = 0;
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
        // User ID and Password Entry Animations
        this.playOutAnimation(this.systemConfigLoginAnimation, 0, 1000);

        // Password Check Info Animation
        this.playOutAnimation(this.systemConfigPasswordCheckContentAnimation, 0, 1500);

        // Screen Shading Animation
        this.playOutAnimation(this.systemConfigPasswordCheckScreenShadingAnimation, 0, 2000);

        setTimeout(() => {
          this.checkingPassword = false;
        }, 2000);
      }
    }

    buttonEvent(event: string, name: string, source: string): void {
      if (event === "click") {
        switch (name) {
          case "minusButton": {
            this.decreaseQuantityWanted();
            break;
          }
          case "plusButton": {
            this.increaseQuantityWanted();
            break;
          }
          case "cancelButton": {
            this.cancelProduct();
            break;
          }
          case "purchaseButton": {
            this.purchaseProduct();
            break;
          }
          case "zeroButton": {
            this.hexButtonClick("0");
            break;
          }
          case "oneButton": {
            this.hexButtonClick("1");
            break;
          }
          case "twoButton": {
            this.hexButtonClick("2");
            break;
          }
          case "threeButton": {
            this.hexButtonClick("3");
            break;
          }
          case "fourButton": {
            this.hexButtonClick("4");
            break;
          }
          case "fiveButton": {
            this.hexButtonClick("5");
            break;
          }
          case "sixButton": {
            this.hexButtonClick("6");
            break;
          }
          case "sevenButton": {
            this.hexButtonClick("7");
            break;
          }
          case "eightButton": {
            this.hexButtonClick("8");
            break;
          }
          case "nineButton": {
            this.hexButtonClick("9");
            break;
          }
          case "aButton": {
            this.hexButtonClick("A");
            break;
          }
          case "bButton": {
            this.hexButtonClick("B");
            break;
          }
          case "cButton": {
            this.hexButtonClick("C");
            break;
          }
          case "dButton": {
            this.hexButtonClick("D");
            break;
          }
          case "eButton": {
            this.hexButtonClick("E");
            break;
          }
          case "fButton": {
            this.hexButtonClick("F");
            break;
          }
          case "deleteButton": {
            this.deleteButtonClick();
            break;
          }
          case "enterButton": {
            this.enterButtonClick();
            break;
          }
          case "loginBackButton": {
            this.loginBackButtonClick();
            break;
          }
          case "pastInfoButton": {
            this.pastInfoButtonClick();
            break;
          }
          case "pastInfoBackButton": {
            this.pastInfoBackButtonClick();
            break;
          }
          case "continueButton": {
            this.continueButtonClick();
            break;
          }
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
