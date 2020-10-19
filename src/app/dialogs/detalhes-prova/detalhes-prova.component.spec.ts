import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesProvaComponent } from './detalhes-prova.component';

describe('DetalhesProvaComponent', () => {
  let component: DetalhesProvaComponent;
  let fixture: ComponentFixture<DetalhesProvaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalhesProvaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalhesProvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
