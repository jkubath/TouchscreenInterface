import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementBoardComponent } from './advertisement-board.component';

describe('AdvertisementBoardComponent', () => {
  let component: AdvertisementBoardComponent;
  let fixture: ComponentFixture<AdvertisementBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertisementBoardComponent ]
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
});
