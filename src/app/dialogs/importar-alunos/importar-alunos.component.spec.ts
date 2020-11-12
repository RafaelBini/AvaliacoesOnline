import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarAlunosComponent } from './importar-alunos.component';

describe('ImportarAlunosComponent', () => {
  let component: ImportarAlunosComponent;
  let fixture: ComponentFixture<ImportarAlunosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportarAlunosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportarAlunosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
