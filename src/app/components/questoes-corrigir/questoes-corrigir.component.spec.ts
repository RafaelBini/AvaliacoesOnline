import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestoesCorrigirComponent } from './questoes-corrigir.component';

describe('QuestoesCorrigirComponent', () => {
  let component: QuestoesCorrigirComponent;
  let fixture: ComponentFixture<QuestoesCorrigirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestoesCorrigirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestoesCorrigirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
