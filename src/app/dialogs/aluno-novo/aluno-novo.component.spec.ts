import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoNovoComponent } from './aluno-novo.component';

describe('AlunoNovoComponent', () => {
  let component: AlunoNovoComponent;
  let fixture: ComponentFixture<AlunoNovoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlunoNovoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlunoNovoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
