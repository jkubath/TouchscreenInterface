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
import { Buttons as ButtonsSet } from '../../configs/buttons.config';
import { ElectronService } from '../../providers/electron.service';


import { HomeComponent } from './home.component';
import { TranslateModule } from '@ngx-translate/core';
import { AdvertisementBoardComponent } from '../advertisement-board/advertisement-board.component';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [ElectronService, DomSanitizer, {
                provide: DomSanitizer,
                useValue: {
                    sanitize: () => 'safeString',
                    bypassSecurityTrustHtml: () => 'safeString'
                }
            }],
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
    it('should stop product rotation', async () => {
        component.resetProductRotationCounters();
        let top_start = component.topds.currIndex;
        let bottom_start = component.bottomds.currIndex;
        await new Promise(resolve => {
            setTimeout(()=> {
                resolve(true);
            }, 2000);
        });
        expect(component.topds.currIndex).toEqual(top_start);
        expect(component.bottomds.currIndex).toEqual(bottom_start);
    });

    // ensure products rotate when functions called
    it('should rotate products', async () => {
        await new Promise(resolve => {
            setTimeout(()=> {
                resolve(true);
            }, 2000);
        });
        
        /*
        component.productsTopRow = data1 as Product[];
        component.productsBottomRow = JSON.parse(JSON.stringify(data2));
        */
        let top_start = component.topds.currIndex;
        component.rotateProductsBottomRow();
        expect(component.topds.currIndex).not.toEqual(top_start);
        let bottom_start = component.bottomds.currIndex;
        component.rotateProductsTopRow();
        expect(component.bottomds.currIndex).not.toEqual(bottom_start);
    });

    /*
      it('should render title in a h1 tag', async(() => {
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('PAGES.HOME.TITLE');
      }));
      */
});
