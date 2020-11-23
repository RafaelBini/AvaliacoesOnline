import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutMakerComponent } from './layout-maker.component';

describe('LayoutMakerComponent', () => {
  let component: LayoutMakerComponent;
  let fixture: ComponentFixture<LayoutMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
