import { Component, OnInit } from '@angular/core';
import * as fs from 'fs';
import { promisify } from 'util';
import { DomSanitizer } from '@angular/platform-browser';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-advertisement-board',
    templateUrl: './advertisement-board.component.html',
    styleUrls: ['./advertisement-board.component.scss']
})
export class AdvertisementBoardComponent implements OnInit {

    currentAdvert: string;
    adverts: string[];


    constructor(private sanitizer: DomSanitizer) {

        // load array of all adverts
        this.loadAdverts().then((ads) => {
            this.adverts = ads;
            this.currentAdvert = ads[0];
        });

        // update currentAdvert to next in adverts array every 7 seconds
        interval(7000).subscribe(x => {
            this.currentAdvert = this.adverts[(this.adverts.indexOf(this.currentAdvert)+1) % this.adverts.length];
            console.log(this.currentAdvert);
        });

    }


    // Load the advertisements
    async loadAdverts(): Promise<string[]> {

        let adverts = [];

        // get list of all files in adverts directory
        const readdir = promisify(fs.readdir);
        const contents = await readdir('./src/adverts');

        // load all adverts
        for (let content of contents) {

            let imageType: string;

            // read file in as buffer
            let bitmap = fs.readFileSync(`./src/adverts/${content}`);

            // determine file type so that data url can specify it
            if ((/\.(jpg|jpeg)$/i).test(content)) {
                imageType = 'jpeg';
            } else if ((/\.(png)$/i).test(content)) {
                imageType = 'png';
            } else if ((/\.(svg)$/i).test(content)) {
                imageType = 'svg';
            } else if ((/\.(tiff)$/i).test(content)) {
                imageType = 'tiff';
            } else {
                console.log('UNSUPORTED ADVERTISEMENT IMAGE FORMAT!\n');
            }

            // if the file was a supported image type, then add data url to array
            if (imageType) {
                // sanitize data url and specifify base 64 encoding
                adverts.push(this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/${imageType};base64, ${bitmap.toString('BASE64')}`));
            }
        }

        return adverts;
        
    }


    ngOnInit() {
    }

}
