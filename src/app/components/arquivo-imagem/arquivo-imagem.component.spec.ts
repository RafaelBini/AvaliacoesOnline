import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArquivoImagemComponent } from './arquivo-imagem.component';

describe('ArquivoImagemComponent', () => {
  let component: ArquivoImagemComponent;
  let fixture: ComponentFixture<ArquivoImagemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArquivoImagemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArquivoImagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
