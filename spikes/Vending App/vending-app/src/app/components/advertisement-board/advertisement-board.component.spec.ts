import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { ElectronService } from '../../providers/electron.service';
import { TranslateModule } from '@ngx-translate/core';
import { AdvertisementBoardComponent } from './advertisement-board.component';

describe('AdvertisementBoard', () => {
    let component: AdvertisementBoardComponent;
    let fixture: ComponentFixture<AdvertisementBoardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [ElectronService],
            declarations: [AdvertisementBoardComponent],
            imports: [
                BrowserModule,
                TranslateModule.forRoot(),
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdvertisementBoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /* << ensure adverts are loaded by default >> ****************
    ***************************************************************/
    it('should load adverts', async () => {
        await setTimeout(async () => { }, 5000);
        expect(component.adverts).not.toEqual(undefined);
        expect(component.adverts.length).not.toEqual(0);
    });


    /* << ensure adverts are loaded when called by default >> ****************
    ***************************************************************/
    it('unit: should load adverts', async () => {
        component.adverts = [];
        let ads = await component.loadAdverts();
        expect(ads).not.toBe(undefined);
    });


    /* << ensure proper detect if url is image >> ****************
    ***************************************************************/
    // ensure all valid image urls return true
    it('unit: "...jpg" should be image', async () => {
        expect(component.isImage('test.jpg')).toEqual(true);
        expect(component.isImage('__.jpg')).toEqual(true);
    });
    it('unit: "...jpeg" should be image', async () => {
        expect(component.isImage('test.jpeg')).toEqual(true);
        expect(component.isImage('__.jpeg')).toEqual(true);
    });
    it('unit: "...svg" should be image', async () => {
        expect(component.isImage('test.svg')).toEqual(true);
        expect(component.isImage('__.svg')).toEqual(true);
    });
    it('unit: "...png" should be image', async () => {
        expect(component.isImage('test.png')).toEqual(true);
        expect(component.isImage('__.png')).toEqual(true);
    });
    it('unit: "...tiff" should be image', async () => {
        expect(component.isImage('test.tiff')).toEqual(true);
        expect(component.isImage('__.tiff')).toEqual(true);
    });
    // ensure invalid image urls return false
    it('unit: urls should not be images', async () => {
        expect(component.isImage('test.jorp')).toEqual(false);
        expect(component.isImage('fish')).toEqual(false);
        expect(component.isImage('sgv.test')).toEqual(false);
        expect(component.isImage('')).toEqual(false);
        expect(component.isImage('test._')).toEqual(false);
        expect(component.isImage('jpeg')).toEqual(false);
        expect(component.isImage('jpg')).toEqual(false);
        expect(component.isImage('png')).toEqual(false);
        expect(component.isImage('svg')).toEqual(false);
        expect(component.isImage('tiff')).toEqual(false); 
    });


    /* << ensure proper detect if url is video >> ****************
    ***************************************************************/
    // ensure all valid video urls return true
    it('unit: "...mp4" should be image', async () => {
        expect(component.isVideo('test.mp4')).toEqual(true);
        expect(component.isVideo('__.mp4')).toEqual(true);
    });
    // ensure invalid video urls return false
    it('unit: urls should not be image', async () => {
        expect(component.isVideo('test.mp3')).toEqual(false);
        expect(component.isVideo('test.jorp')).toEqual(false);
        expect(component.isVideo('fish')).toEqual(false);
        expect(component.isVideo('mp4.test')).toEqual(false);
        expect(component.isVideo('')).toEqual(false);
        expect(component.isVideo('test._')).toEqual(false);
        expect(component.isVideo('mp4')).toEqual(false);
    });


    /* << ensure proper video type retrieval >> ****************
    ***************************************************************/
    // ensure proper retrieval of valid video urls
    it('unit: "...mp4" should return "mp4"', async () => {
        expect(component.getVideoType('test.mp4')).toEqual('mp4');
        expect(component.getVideoType('__.mp4')).toEqual('mp4');
    });
    // ensure invalid video urls return undefined
    it('unit: non-video urls should return "undefined"', async () => {
        expect(component.getVideoType('test.mp3')).toEqual('undefined');
        expect(component.getVideoType('test.jorp')).toEqual('undefined');
        expect(component.getVideoType('fish')).toEqual('undefined');
        expect(component.getVideoType('mp4.test')).toEqual('undefined');
        expect(component.getVideoType('')).toEqual('undefined');
        expect(component.getVideoType('test._')).toEqual('undefined');
        expect(component.getVideoType('mp4')).toEqual('undefined');
    });


    /* << ensure proper image type retrieval >> ****************
    ***************************************************************/
    // ensure proper retrieval of valid image urls
    it('unit: "...jpg" should return "jpg"', async () => {
        expect(component.getImageType('test.jpg')).toEqual('jpg');
        expect(component.getImageType('__.jpg')).toEqual('jpg');
    });
    it('unit: "...jpeg" should return "jpg"', async () => {
        expect(component.getImageType('test.jpeg')).toEqual('jpg');
        expect(component.getImageType('__.jpeg')).toEqual('jpg');
    });
    it('unit: "...svg" should return "svg"', async () => {
        expect(component.getImageType('test.svg')).toEqual('svg');
        expect(component.getImageType('__.svg')).toEqual('svg');
    });
    it('unit: "...png" should return "png"', async () => {
        expect(component.getImageType('test.png')).toEqual('png');
        expect(component.getImageType('__.png')).toEqual('png');
    });
    it('unit: "...tiff" should return "tiff"', async () => {
        expect(component.getImageType('test.tiff')).toEqual('tiff');
        expect(component.getImageType('__.tiff')).toEqual('tiff');
    });
    // ensure invalid image urls return undefined
    it('unit: non-image urls should return "undefined"', async () => {
        expect(component.getImageType('test.jorp')).toEqual('undefined');
        expect(component.getImageType('fish')).toEqual('undefined');
        expect(component.getImageType('sgv.test')).toEqual('undefined');
        expect(component.getImageType('')).toEqual('undefined');
        expect(component.getImageType('test._')).toEqual('undefined');
        expect(component.getImageType('jpeg')).toEqual('undefined');
        expect(component.getImageType('jpg')).toEqual('undefined');
        expect(component.getImageType('png')).toEqual('undefined');
        expect(component.getImageType('svg')).toEqual('undefined');
        expect(component.getImageType('tiff')).toEqual('undefined'); 
    });

});
