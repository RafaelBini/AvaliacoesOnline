import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoMenuOpcoesComponent } from './avaliacao-menu-opcoes.component';

describe('AvaliacaoMenuOpcoesComponent', () => {
  let component: AvaliacaoMenuOpcoesComponent;
  let fixture: ComponentFixture<AvaliacaoMenuOpcoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliacaoMenuOpcoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliacaoMenuOpcoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
