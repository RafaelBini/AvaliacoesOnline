import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatisticasAvaliacaoComponent } from './estatisticas-avaliacao.component';

describe('EstatisticasAvaliacaoComponent', () => {
  let component: EstatisticasAvaliacaoComponent;
  let fixture: ComponentFixture<EstatisticasAvaliacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstatisticasAvaliacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstatisticasAvaliacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
