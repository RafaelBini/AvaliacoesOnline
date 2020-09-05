import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoCardAvaliacaoProfessorComponent } from './aluno-card-avaliacao-professor.component';

describe('AlunoCardAvaliacaoProfessorComponent', () => {
  let component: AlunoCardAvaliacaoProfessorComponent;
  let fixture: ComponentFixture<AlunoCardAvaliacaoProfessorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlunoCardAvaliacaoProfessorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlunoCardAvaliacaoProfessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
