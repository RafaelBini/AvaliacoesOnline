import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportarComponent } from './exportar.component';

describe('ExportarComponent', () => {
  let component: ExportarComponent;
  let fixture: ComponentFixture<ExportarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
