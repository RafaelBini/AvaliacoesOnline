import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoNovaComponent } from './avaliacao-nova.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';


describe('AvaliacaoNovaComponent', () => {
  let component: AvaliacaoNovaComponent;
  let fixture: ComponentFixture<AvaliacaoNovaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: {} }
      ],
      imports: [
        RouterTestingModule,
      ],
      declarations: [AvaliacaoNovaComponent]
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
