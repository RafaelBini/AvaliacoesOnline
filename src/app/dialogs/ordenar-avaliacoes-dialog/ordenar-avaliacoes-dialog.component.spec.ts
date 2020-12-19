import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenarAvaliacoesDialogComponent } from './ordenar-avaliacoes-dialog.component';

describe('OrdenarAvaliacoesDialogComponent', () => {
  let component: OrdenarAvaliacoesDialogComponent;
  let fixture: ComponentFixture<OrdenarAvaliacoesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenarAvaliacoesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenarAvaliacoesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
