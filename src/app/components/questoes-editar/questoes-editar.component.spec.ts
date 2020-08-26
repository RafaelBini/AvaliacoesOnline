import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestoesEditarComponent } from './questoes-editar.component';

describe('QuestoesEditarComponent', () => {
  let component: QuestoesEditarComponent;
  let fixture: ComponentFixture<QuestoesEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestoesEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestoesEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
