import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoAlunoCabecalhoComponent } from './avaliacao-aluno-cabecalho.component';

describe('AvaliacaoAlunoCabecalhoComponent', () => {
  let component: AvaliacaoAlunoCabecalhoComponent;
  let fixture: ComponentFixture<AvaliacaoAlunoCabecalhoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliacaoAlunoCabecalhoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliacaoAlunoCabecalhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
