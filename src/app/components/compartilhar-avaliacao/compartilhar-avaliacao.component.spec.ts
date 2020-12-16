import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartilharAvaliacaoComponent } from './compartilhar-avaliacao.component';

describe('CompartilharAvaliacaoComponent', () => {
  let component: CompartilharAvaliacaoComponent;
  let fixture: ComponentFixture<CompartilharAvaliacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompartilharAvaliacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompartilharAvaliacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
