import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArquivoAnexoComponent } from './arquivo-anexo.component';

describe('ArquivoAnexoComponent', () => {
  let component: ArquivoAnexoComponent;
  let fixture: ComponentFixture<ArquivoAnexoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArquivoAnexoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArquivoAnexoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
