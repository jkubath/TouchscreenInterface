import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { FsService } from 'ngx-fs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public productDirectoryPath: string;
    public products: Product[];

    constructor(private fsService: FsService, private http: HttpClient) {
        this.productDirectoryPath = './src/products';
        console.log(fsService.fs);
        this.loadProduct().then( (result, reject) => {
            this.products = result;
            console.log(this.products);
        }).catch(error => {
            console.log(error);
        });
    }

    ngOnInit() {}

    /*Loads all products form products directory and returns as array*/
    loadProduct(): Promise<Product[]> {
        return new Promise( (resolve, reject) => {
            let products = new Array<Product>();

            //get array of all contents in products directory
            this.fsService.fs.readdir(this.productDirectoryPath, (err, contents) => {
                if(err) {
                    console.log(err);
                    //reject (new Response<any>(err, false));
                }

                for(let content of contents) {
                    let path = `${this.productDirectoryPath}/${content}`;

                    //get stats about the file or directory
                    this.fsService.fs.lstat(path, (err, stats) => {
                        if(err) {
                            console.log(err);
                            reject(err);
                        }

                        //if it is a directory and contains a file named 'data.json' then...
                        if(stats.isDirectory()) {
                            this.fsService.fs.readdir(path, (err, files) => {
                                if(err) {
                                    console.log(err);
                                    reject(err);
                                }
                                if(files.includes('data.json')) {

                                    //read the file contents in as a Product object and push to array
                                    this.fsService.fs.readFile(`${path}/data.json`, "utf8", (err, value) => {
                                        if(err) {
                                            console.log(err);
                                            reject(err);
                                        }
                                        products.push(JSON.parse(value) as Product);

                                    });
                                }
                                else {
                                    console.log(err);
                                    reject('');
                                }
                            });
                        }
                    });
                }
            });

            //resolve promise with array of products
            resolve(products);
        });
    }



}
