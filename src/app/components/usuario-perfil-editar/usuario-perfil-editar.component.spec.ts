import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioPerfilEditarComponent } from './usuario-perfil-editar.component';

describe('UsuarioPerfilEditarComponent', () => {
  let component: UsuarioPerfilEditarComponent;
  let fixture: ComponentFixture<UsuarioPerfilEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioPerfilEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioPerfilEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
