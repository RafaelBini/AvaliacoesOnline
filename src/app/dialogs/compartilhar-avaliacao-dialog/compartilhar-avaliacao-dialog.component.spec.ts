import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartilharAvaliacaoDialogComponent } from './compartilhar-avaliacao-dialog.component';

describe('CompartilharAvaliacaoDialogComponent', () => {
  let component: CompartilharAvaliacaoDialogComponent;
  let fixture: ComponentFixture<CompartilharAvaliacaoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompartilharAvaliacaoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompartilharAvaliacaoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
