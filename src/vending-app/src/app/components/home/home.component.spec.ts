import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Product } from '../../models/product.model';
import { Animation } from '../../models/animation.model';
import { NavButtonSource } from '../../models/navButtonSource.model';
import { NavButtonEnabled } from '../../models/navButtonEnabled.model';
import { Button } from '../../models/button.model';
import { Login } from '../../models/login.model';
import { promisify } from 'util';
import { TouchBarSlider } from 'electron';
import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';
import { DragScrollComponent, DragScrollModule } from 'ngx-drag-scroll';
import Money from 'dinero.js';
import { DomSanitizer } from '@angular/platform-browser';
import { cd } from 'shelljs';
import { exec } from 'shelljs';
import { Buttons as ButtonsSet } from '../../configs/buttons.config';
import { ElectronService } from '../../providers/electron.service';
// import * as data1 from '../../../test-docs/top-row';
// import * as data2 from '../../../test-docs/bottom-row';


import { HomeComponent } from './home.component';
import { TranslateModule } from '@ngx-translate/core';
import { AdvertisementBoardComponent } from '../../advertisement-board/advertisement-board.component';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [ElectronService, DomSanitizer],
            declarations: [HomeComponent, AdvertisementBoardComponent],
            imports: [
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

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ensure products wont rotate for at least ten seconds after resetProductRotationCounters is called
    it('should stop product rotation', () => {
        // this.rotateProductsTopRow = data1;
        // this.rotateProductsBottomRow = data2;
        this.resetProductRotationCounters();
        let top_start = this.topds.currIndex;
        let bottom_start = this.bottomds.currIndex;
        setTimeout(() => {
            expect(this.topds.currIndex).toEqual(top_start);
            expect(this.bottomds.currIndex).toEqual(bottom_start);
        }, 10000);
    });

    // ensure products rotate when functions called
    it('should rotate products', () => {
        // this.rotateProductsTopRow = data1;
        // this.rotateProductsBottomRow = data2;
        let top_start = this.topds.currIndex;
        this.rotateProductsBottomRow();
        expect(this.topds.currIndex).not.toEqual(top_start);
        let bottom_start = this.bottomds.currIndex;
        this.rotateProductsTopRow();
        expect(this.bottomds.currIndex).not.toEqual(bottom_start);
    });

    /*
      it('should render title in a h1 tag', async(() => {
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('PAGES.HOME.TITLE');
      }));
      */
});
