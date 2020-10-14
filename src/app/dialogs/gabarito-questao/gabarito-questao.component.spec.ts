import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GabaritoQuestaoComponent } from './gabarito-questao.component';

describe('GabaritoQuestaoComponent', () => {
  let component: GabaritoQuestaoComponent;
  let fixture: ComponentFixture<GabaritoQuestaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GabaritoQuestaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GabaritoQuestaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
