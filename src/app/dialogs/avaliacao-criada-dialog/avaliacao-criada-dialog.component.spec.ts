import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoCriadaDialogComponent } from './avaliacao-criada-dialog.component';

describe('AvaliacaoCriadaDialogComponent', () => {
  let component: AvaliacaoCriadaDialogComponent;
  let fixture: ComponentFixture<AvaliacaoCriadaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliacaoCriadaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliacaoCriadaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
