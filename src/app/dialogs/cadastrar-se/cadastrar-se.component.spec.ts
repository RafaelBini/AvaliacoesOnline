import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarSeComponent } from './cadastrar-se.component';

describe('CadastrarSeComponent', () => {
  let component: CadastrarSeComponent;
  let fixture: ComponentFixture<CadastrarSeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastrarSeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastrarSeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
