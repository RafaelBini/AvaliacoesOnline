import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcluirAvaliacaoDialogComponent } from './excluir-avaliacao-dialog.component';

describe('ExcluirAvaliacaoDialogComponent', () => {
  let component: ExcluirAvaliacaoDialogComponent;
  let fixture: ComponentFixture<ExcluirAvaliacaoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcluirAvaliacaoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcluirAvaliacaoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
