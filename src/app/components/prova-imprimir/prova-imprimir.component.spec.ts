import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvaImprimirComponent } from './prova-imprimir.component';

describe('ProvaImprimirComponent', () => {
  let component: ProvaImprimirComponent;
  let fixture: ComponentFixture<ProvaImprimirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvaImprimirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvaImprimirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
