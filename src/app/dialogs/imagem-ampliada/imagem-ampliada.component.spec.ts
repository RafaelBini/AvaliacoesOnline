import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagemAmpliadaComponent } from './imagem-ampliada.component';

describe('ImagemAmpliadaComponent', () => {
  let component: ImagemAmpliadaComponent;
  let fixture: ComponentFixture<ImagemAmpliadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagemAmpliadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagemAmpliadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
