import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoProfessorComponent } from './avaliacao-professor.component';

describe('AvaliacaoProfessorComponent', () => {
  let component: AvaliacaoProfessorComponent;
  let fixture: ComponentFixture<AvaliacaoProfessorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliacaoProfessorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliacaoProfessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
