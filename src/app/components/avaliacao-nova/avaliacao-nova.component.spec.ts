import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoNovaComponent } from './avaliacao-nova.component';

describe('AvaliacaoNovaComponent', () => {
  let component: AvaliacaoNovaComponent;
  let fixture: ComponentFixture<AvaliacaoNovaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliacaoNovaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliacaoNovaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
