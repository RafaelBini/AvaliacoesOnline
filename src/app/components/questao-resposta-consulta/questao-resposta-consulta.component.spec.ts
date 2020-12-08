import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestaoRespostaConsultaComponent } from './questao-resposta-consulta.component';

describe('QuestaoRespostaConsultaComponent', () => {
  let component: QuestaoRespostaConsultaComponent;
  let fixture: ComponentFixture<QuestaoRespostaConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestaoRespostaConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestaoRespostaConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
