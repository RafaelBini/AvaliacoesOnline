import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoQuestaoComponent } from './info-questao.component';

describe('InfoQuestaoComponent', () => {
  let component: InfoQuestaoComponent;
  let fixture: ComponentFixture<InfoQuestaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoQuestaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoQuestaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
