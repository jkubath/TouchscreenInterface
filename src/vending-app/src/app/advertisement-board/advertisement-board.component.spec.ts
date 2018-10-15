import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchBarSlider } from 'electron';
import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';
import { DragScrollComponent, DragScrollModule } from 'ngx-drag-scroll';
import Money from 'dinero.js';
import { DomSanitizer } from '@angular/platform-browser';
import { cd } from 'shelljs';
import { exec } from 'shelljs';
import { ElectronService } from '../providers/electron.service';
import * as data1 from '../../test-docs/top-row';
import * as data2 from '../../test-docs/bottom-row';

import { TranslateModule } from '@ngx-translate/core';
import { AdvertisementBoardComponent } from './advertisement-board.component';

describe('AdvertisementBoard', () => {
    let component: AdvertisementBoardComponent;
    let fixture: ComponentFixture<AdvertisementBoardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [ElectronService, DomSanitizer],
            declarations: [AdvertisementBoardComponent],
            imports: [
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

    /*
      it('should render title in a h1 tag', async(() => {
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('PAGES.HOME.TITLE');
      }));
      */
});
