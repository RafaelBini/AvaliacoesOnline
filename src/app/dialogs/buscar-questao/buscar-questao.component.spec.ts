import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarQuestaoComponent } from './buscar-questao.component';

describe('BuscarQuestaoComponent', () => {
  let component: BuscarQuestaoComponent;
  let fixture: ComponentFixture<BuscarQuestaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarQuestaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarQuestaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
