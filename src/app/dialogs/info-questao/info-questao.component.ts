import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-info-questao',
  templateUrl: './info-questao.component.html',
  styleUrls: ['./info-questao.component.css']
})
export class InfoQuestaoComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];
  temas: any[] = [
    { nome: 'Botânica' },
    { nome: 'Cores' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.temas.push({ nome: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tema: any): void {
    const index = this.temas.indexOf(tema);

    if (index >= 0) {
      this.temas.splice(index, 1);
    }
  }



}
