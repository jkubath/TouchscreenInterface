import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DragScrollModule } from 'ngx-drag-scroll';
import { BrowserModule } from '@angular/platform-browser';
import { ElectronService } from '../../providers/electron.service';
import { HomeComponent } from './home.component';
import { TranslateModule } from '@ngx-translate/core';
import { AdvertisementBoardComponent } from '../advertisement-board/advertisement-board.component';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [ElectronService],
            declarations: [HomeComponent, AdvertisementBoardComponent],
            imports: [
                BrowserModule,
                TranslateModule.forRoot(),
                DragScrollModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // esnure component is created
    it('should create', () => {
        expect(component).toBeTruthy();
    });


    /* << ensure products are loaded by default >> ****************
    ***************************************************************/
    // ensure top products loaded properly
    it('should load top row products', () => {
        expect(component.productsTopRow.length).toBeGreaterThan(0);
    });
    // ensure bottom products loaded properly
    it('should load bottom row products', () => {
        expect(component.productsBottomRow.length).toBeGreaterThan(0);
    });


    /* << ensure products can be loaded on call >> ****************
    ***************************************************************/
    // ensure top row products loaded properly
    it('unit: should load top row products', () => {
        component.productsTopRow = [];
        component.productsTopRow = component.loadProductsTopRow('.');
        expect(component.productsTopRow.length).toBeGreaterThan(0);
    });
    // ensure bottom row products loaded properly
    it('unit: should load bottom row products', () => {
        component.productsBottomRow = [];
        component.productsBottomRow = component.loadProductsBottomRow('.');
        expect(component.productsBottomRow.length).toBeGreaterThan(0);
    });


    /* << ensure products rotate when functions called >> **************
    *******************************************************************/
    it('unit: should rotate Top products', async () => {
        let top_start = component.topds.currIndex;
        component.rotateProductsTopRow();
        expect(component.topds.currIndex).not.toEqual(top_start);
        top_start = component.topds.currIndex;
        component.rotateProductsTopRow();
        expect(component.topds.currIndex).not.toEqual(top_start);
        top_start = component.topds.currIndex;
        component.rotateProductsTopRow();
        expect(component.topds.currIndex).not.toEqual(top_start);
        top_start = component.topds.currIndex;
        component.rotateProductsTopRow();
        expect(component.topds.currIndex).not.toEqual(top_start);
    });
    it('unit: should rotate Top products', async () => {
        let bottom_start = component.bottomds.currIndex;
        component.rotateProductsBottomRow();
        expect(component.bottomds.currIndex).not.toEqual(bottom_start);
        bottom_start = component.bottomds.currIndex;
        component.rotateProductsBottomRow();
        expect(component.bottomds.currIndex).not.toEqual(bottom_start);
        bottom_start = component.bottomds.currIndex;
        component.rotateProductsBottomRow();
        expect(component.bottomds.currIndex).not.toEqual(bottom_start);
        bottom_start = component.bottomds.currIndex;
        component.rotateProductsBottomRow();
        expect(component.bottomds.currIndex).not.toEqual(bottom_start);
    });


    /* << ensure loading of image data urls >> ************
    *******************************************************/
    it('unit should load image data url "revival_ad.jpg"', () => {
        let url = './adverts/revival_ad.jpg';
        let data = null;
        data = component.loadImageSafeResourceURL(url);
        expect(data).not.toEqual(null);
    });
    it('unit should load image data url "nikea_ad.jpg"', () => {
        let url = './adverts/nikea_ad.jpg';
        let data = null;
        data = component.loadImageSafeResourceURL(url);
        expect(data).not.toEqual(null);
    });
    it('unit should load image data url "armond_ad.jpg"', () => {
        let url = './adverts/armond_ad.jpg';
        let data = null;
        data = component.loadImageSafeResourceURL(url);
        expect(data).not.toEqual(null);
    });
    it('unit should load image data url "hamwater_ad.jpg"', () => {
        let url = './adverts/hamwater_ad.jpg';
        let data = null;
        data = component.loadImageSafeResourceURL(url);
        expect(data).not.toEqual(null);
    });
    it('unit should load image data url "havidol_ad.jpg"', () => {
        let url = './adverts/havidol_ad.jpg';
        let data = null;
        data = component.loadImageSafeResourceURL(url);
        expect(data).not.toEqual(null);
    });


    /* << ensure compareHex function works properly >> ***********
    *************************************************************/
    it('unit: should find both equal with hex compare', () => {
        expect(component.compareHex('AACDE', 'AACDE')).toEqual(0);
        expect(component.compareHex('AACDE', 'aacde')).toEqual(0);
        expect(component.compareHex('tacos', 'tacos')).toEqual(0);
        expect(component.compareHex('12345', '12345')).toEqual(0);
    });
    it('unit: should find both equal with hex compare (bad input)', () => {
        expect(component.compareHex('""""', '""""')).toEqual(0);
        expect(component.compareHex('!@#$%^&', '!@#$%^&')).toEqual(0);
        expect(component.compareHex('!@#$%^&', '""""')).toEqual(0);
        expect(component.compareHex('""""', '!@#$%^&')).toEqual(0);
    });
    it('unit: should find both unequal with hex compare', () => {
        expect(component.compareHex('AACDE', 'EDCAA')).not.toEqual(0);
        expect(component.compareHex('AACDE', 'aacdf')).not.toEqual(0);
    });
    it('unit: should find first larger with hex compare', () => {
        expect(component.compareHex('FFFF', 'AAAA')).toEqual(1);
        expect(component.compareHex('399', '398')).toEqual(1);
    });
    it('unit: should find first larger with hex compare (bad input)', () => {
        expect(component.compareHex('399', '?')).toEqual(1);
        expect(component.compareHex('0', 'FFFSL4@')).toEqual(1);
    });
    it('unit: should find first smaller with hex compare', () => {
        expect(component.compareHex('AAAA', 'FFFF')).toEqual(-1);
        expect(component.compareHex('398', '399')).toEqual(-1);
    });
    it('unit: should find first smaller with hex compare (bad input)', () => {
        expect(component.compareHex('?', '399')).toEqual(-1);
        expect(component.compareHex('FFFSL4@', '0')).toEqual(-1);
    });

    // ensure hex math works properly
    it('unit: should add hexes', () => {
        expect(component.addHex('AAAA', '1111')).toEqual('BBBB');
        expect(component.addHex('BBBB', '1111')).toEqual('CCCC');
        expect(component.addHex('8AB', 'B78')).toEqual('1423');
        expect(component.addHex('CCAB', '1234')).toEqual('DEDF');
        expect(component.addHex('FFFF', 'AAAA')).toEqual('1AAA9');
        expect(component.addHex('5555', 'ABCD')).toEqual('10122');
    });
    it('unit: should add hexes (bad input converted to zeros)', () => {
        expect(component.addHex('AAAA', 'ZZZZ')).toEqual('AAAA');
        expect(component.addHex('!B!B', 'B!B!')).toEqual('BBBB');
    });
    it('unit: should subtract hexes', () => {
        expect(component.subtractHex('BBBB', '1111')).toEqual('AAAA');
        expect(component.subtractHex('CCCC', '1111')).toEqual('BBBB');
        expect(component.subtractHex('1423', 'B78')).toEqual('08AB');
        expect(component.subtractHex('DEDF', '1234')).toEqual('CCAB');
        expect(component.subtractHex('10AA9', 'AAAA')).toEqual('05FFF');
        expect(component.subtractHex('10122', 'ABCD')).toEqual('05555');
    });
    it('unit: should subtract hexes (bad input converted to zeros)', () => {
        expect(component.subtractHex('AAAA', 'ZZZZ')).toEqual('AAAA');
        expect(component.subtractHex('FFFF', '!@#1')).toEqual('FFFE');
    });
    it('unit: should multiply hexes', () => {
        expect(component.multiplyHex('BBBB', '1')).toEqual('BBBB');
        expect(component.multiplyHex('1111', '2')).toEqual('2222');
        expect(component.multiplyHex('ABCD', 'A')).toEqual('6B602');
        expect(component.multiplyHex('FFFF', '0')).toEqual('0');
        expect(component.multiplyHex('2', '2')).toEqual('4');
        expect(component.multiplyHex('1012', 'ABCD')).toEqual('AC8E46A');
    });
    it('unit: should multiply hexes (bad input converted to zeros)', () => {
        expect(component.multiplyHex('AAAA', 'ZZZZ')).toEqual('0');
        expect(component.multiplyHex('!', 'A')).toEqual('0');
        expect(component.multiplyHex('1', 'Z')).toEqual('0');
        expect(component.multiplyHex('AACZ', 'AAA')).toEqual('71CE380');
        expect(component.multiplyHex('C', '!@#$')).toEqual('0');
        expect(component.multiplyHex('AAAA', 'ZZZZ')).toEqual('0');
    });


    /* << ensure hex and dec conversions >>***************
    *****************************************************/
    // ensure hex to dec conversions work properly
    it('unit: convert hex to dec "0" should equal 0', () => {
        expect(component.hexToDec('0')).toEqual(0);
    });
    it('unit: convert hex to dec "1" should equal 1', () => {
        expect(component.hexToDec('1')).toEqual(1);
    });
    it('unit: convert hex to dec "2" should equal 2', () => {
        expect(component.hexToDec('2')).toEqual(2);
    });
    it('unit: convert hex to dec "3" should equal 3', () => {
        expect(component.hexToDec('3')).toEqual(3);
    });
    it('unit: convert hex to dec "4" should equal 4', () => {
        expect(component.hexToDec('4')).toEqual(4);
    });
    it('unit: convert hex to dec "5" should equal 5', () => {
        expect(component.hexToDec('5')).toEqual(5);
    });
    it('unit: convert hex to dec "6" should equal 6', () => {
        expect(component.hexToDec('6')).toEqual(6);
    });
    it('unit: convert hex to dec "7" should equal 7', () => {
        expect(component.hexToDec('7')).toEqual(7);
    });
    it('unit: convert hex to dec "8" should equal 8', () => {
        expect(component.hexToDec('8')).toEqual(8);
    });
    it('unit: convert hex to dec "9" should equal 9', () => {
        expect(component.hexToDec('9')).toEqual(9);
    });
    it('unit: convert hex to dec "A" should equal 10', () => {
        expect(component.hexToDec('A')).toEqual(10);
    });
    it('unit: convert hex to dec "B" should equal 11', () => {
        expect(component.hexToDec('B')).toEqual(11);
    });
    it('unit: convert hex to dec "C" should equal 12', () => {
        expect(component.hexToDec('C')).toEqual(12);
    });
    it('unit: convert hex to dec "D" should equal 13', () => {
        expect(component.hexToDec('D')).toEqual(13);
    });
    it('unit: convert hex to dec "E" should equal 14', () => {
        expect(component.hexToDec('E')).toEqual(14);
    });
    it('unit: convert hex to dec "F" should equal 15', () => {
        expect(component.hexToDec('F')).toEqual(15);
    });
    // ensure invalid hex values return zero when converted to decimal
    it('unit: convert hex to dec, invalid input return 0', () => {
        expect(component.hexToDec('G')).toEqual(0);
        expect(component.hexToDec('Q')).toEqual(0);
        expect(component.hexToDec('Z')).toEqual(0);
        expect(component.hexToDec('@')).toEqual(0);
        expect(component.hexToDec('*')).toEqual(0);
        expect(component.hexToDec('=')).toEqual(0);
        expect(component.hexToDec('!')).toEqual(0);
        expect(component.hexToDec('&')).toEqual(0);
    });
    // ensure hex to dec conversions work properly 
    it('unit: convert dec to hex 0 should equal "0"', () => {
        expect(component.decToHex(0)).toEqual('0');
    });
    it('unit: convert dec to hex 1 should equal "1"', () => {
        expect(component.decToHex(1)).toEqual('1');
    });
    it('unit: convert dec to hex 2 should equal "2"', () => {
        expect(component.decToHex(2)).toEqual('2');
    });
    it('unit: convert dec to hex 3 should equal "3"', () => {
        expect(component.decToHex(3)).toEqual('3');
    });
    it('unit: convert dec to hex 4 should equal "4"', () => {
        expect(component.decToHex(4)).toEqual('4');
    });
    it('unit: convert dec to hex 5 should equal "5"', () => {
        expect(component.decToHex(5)).toEqual('5');
    });
    it('unit: convert dec to hex 6 should equal "6"', () => {
        expect(component.decToHex(6)).toEqual('6');
    });
    it('unit: convert dec to hex 7 should equal "7"', () => {
        expect(component.decToHex(7)).toEqual('7');
    });
    it('unit: convert dec to hex 8 should equal "8"', () => {
        expect(component.decToHex(8)).toEqual('8');
    });
    it('unit: convert dec to hex 9 should equal "9"', () => {
        expect(component.decToHex(9)).toEqual('9');
    });
    it('unit: convert dec to hex 10 should equal "10"', () => {
        expect(component.decToHex(10)).toEqual('A');
    });
    it('unit: convert dec to hex 11 should equal "11"', () => {
        expect(component.decToHex(11)).toEqual('B');
    });
    it('unit: convert dec to hex 12 should equal "12"', () => {
        expect(component.decToHex(12)).toEqual('C');
    });
    it('unit: convert dec to hex 13 should equal "13"', () => {
        expect(component.decToHex(13)).toEqual('D');
    });
    it('unit: convert dec to hex 14 should equal "14"', () => {
        expect(component.decToHex(14)).toEqual('E');
    });
    it('unit: convert dec to hex 15 should equal "15"', () => {
        expect(component.decToHex(15)).toEqual('F');
    });
    // ensure invlid decimal values get converted to '0'
    it('unit: convert dec to hex, invalid input return \'0\'', () => {
        expect(component.decToHex(16)).toEqual('0');
        expect(component.decToHex(17)).toEqual('0');
        expect(component.decToHex(18)).toEqual('0');
        expect(component.decToHex(100)).toEqual('0');
        expect(component.decToHex(-1)).toEqual('0');
        expect(component.decToHex(-10)).toEqual('0');
        expect(component.decToHex(-50)).toEqual('0');
        expect(component.decToHex(-100)).toEqual('0');
    });
});
