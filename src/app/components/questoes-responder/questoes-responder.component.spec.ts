import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestoesResponderComponent } from './questoes-responder.component';

describe('QuestoesResponderComponent', () => {
  let component: QuestoesResponderComponent;
  let fixture: ComponentFixture<QuestoesResponderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestoesResponderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestoesResponderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
