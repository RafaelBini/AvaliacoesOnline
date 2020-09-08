import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoCardAvaliacaoAlunoComponent } from './aluno-card-avaliacao-aluno.component';

describe('AlunoCardAvaliacaoAlunoComponent', () => {
  let component: AlunoCardAvaliacaoAlunoComponent;
  let fixture: ComponentFixture<AlunoCardAvaliacaoAlunoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlunoCardAvaliacaoAlunoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlunoCardAvaliacaoAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
