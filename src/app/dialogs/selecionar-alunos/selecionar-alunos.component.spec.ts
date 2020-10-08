import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecionarAlunosComponent } from './selecionar-alunos.component';

describe('SelecionarAlunosComponent', () => {
  let component: SelecionarAlunosComponent;
  let fixture: ComponentFixture<SelecionarAlunosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecionarAlunosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecionarAlunosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
