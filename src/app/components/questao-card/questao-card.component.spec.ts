import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestaoCardComponent } from './questao-card.component';

describe('QuestaoCardComponent', () => {
  let component: QuestaoCardComponent;
  let fixture: ComponentFixture<QuestaoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestaoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestaoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
