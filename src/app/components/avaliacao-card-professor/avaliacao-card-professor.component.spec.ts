import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoCardProfessorComponent } from './avaliacao-card-professor.component';

describe('AvaliacaoCardProfessorComponent', () => {
  let component: AvaliacaoCardProfessorComponent;
  let fixture: ComponentFixture<AvaliacaoCardProfessorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliacaoCardProfessorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliacaoCardProfessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
