import { Component, OnInit, ViewChild } from '@angular/core';
import { promisify } from 'util';
import { DomSanitizer } from '@angular/platform-browser';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { ElectronService } from '../../providers/electron.service';

@Component({
    selector: 'app-advertisement-board',
    templateUrl: './advertisement-board.component.html',
    styleUrls: ['./advertisement-board.component.scss']
})
export class AdvertisementBoardComponent implements OnInit {

    currentAdvert: any;
    adverts: any[];
    displayTime: number;


    constructor(private sanitizer: DomSanitizer, private electron: ElectronService) {

        this.displayTime = 7;

        // load array of all adverts
        this.loadAdverts().then((ads) => {
            this.adverts = ads;
            this.currentAdvert = ads[0];
        });

        // update currentAdvert to next in adverts array every 7 seconds
        interval(this.displayTime*1000).subscribe(x => {
            // if ad is a video, stop the old video, update to the new ad and reload video
            if (this.isVideo(this.currentAdvert.path)) {
                let elem: any = document.getElementById("video-player");
                elem.pause();
                this.currentAdvert = this.adverts[(this.adverts.indexOf(this.currentAdvert) + 1) % this.adverts.length];
                elem.load();

            // if ad is image, just switch to next ad in array
            } else {
                this.currentAdvert = this.adverts[(this.adverts.indexOf(this.currentAdvert) + 1) % this.adverts.length];
            }
        });

    }

    isImage(content: string): boolean {
        if ((/\.(jpg|jpeg)$/i).test(content)) {
            return true;
        } else if ((/\.(png)$/i).test(content)) {
            return true;
        } else if ((/\.(svg)$/i).test(content)) {
            return true;
        } else if ((/\.(tiff)$/i).test(content)) {
            return true;
        } else {
            return false;
        }
    }

    isVideo(content: string): boolean {
        if ((/\.(mp4)$/i).test(content)) {
            return true;
        }
        return false;
    }

    getImageType(content: string): string {
        if ((/\.(jpg|jpeg)$/i).test(content)) {
            return 'jpg';
        } else if ((/\.(png)$/i).test(content)) {
            return 'png';
        } else if ((/\.(svg)$/i).test(content)) {
            return 'svg';
        } else if ((/\.(tiff)$/i).test(content)) {
            return 'tiff';
        } else {
            return 'undefined';
        }
    }

    getVideoType(content: string): string {
        if ((/\.(mp4)$/i).test(content)) {
            return 'mp4';
        }
        return 'undefined';
    }


    // Load the advertisements
    async loadAdverts(): Promise<string[]> {

        let adverts = [];

        // get list of all files in adverts directory
        const contents = this.electron.fileSystem.readdirSync('./adverts');

        // load all adverts
        for (let content of contents) {

            let type: string;
            let dataUrlType: string;
            let dataUrlFlags: string;

            // read file in as buffer
            let bitmap = this.electron.fileSystem.readFileSync(`./adverts/${content}`);

            // determine file type so that data url can specify it
            if (this.isVideo(content)) {
                dataUrlType = 'data:video';
                type = this.getVideoType(content);
            } else if (this.isImage(content)) {
                dataUrlType = 'data:image';
                dataUrlFlags = '';
                type = this.getImageType(content);
            }
            if (type === 'undefined') {
                console.log('UNSUPORTED ADVERTISEMENT FORMAT!\n');
            }

            // if the file was a supported image type, then add data url to array
            if (type !== 'undefined') {
                // sanitize data url and specifify base 64 encoding
                adverts.push({
                    source: this.sanitizer.bypassSecurityTrustResourceUrl(`${dataUrlType}/${type};base64, ${bitmap.toString('BASE64')}`),
                    path: content
                });
            }
        }

        // return shuffled array (shuffle is used to prevent clumping of all image ads and video ads)
        return adverts.sort(() => Math.random()-0.5);

    }


    ngOnInit() {
    }

}
