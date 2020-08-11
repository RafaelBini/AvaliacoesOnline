import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscolherTipoComponent } from './escolher-tipo.component';

describe('EscolherTipoComponent', () => {
  let component: EscolherTipoComponent;
  let fixture: ComponentFixture<EscolherTipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscolherTipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscolherTipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
