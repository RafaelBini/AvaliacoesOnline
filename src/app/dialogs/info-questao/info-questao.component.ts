import { Questao } from './../../models/questao';
import { Component, OnInit, Inject } from '@angular/core';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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


  constructor(public dialogRef: MatDialogRef<InfoQuestaoComponent>,
    @Inject(MAT_DIALOG_DATA) public questao: Questao) { }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.questao.tags.push(value);
      console.log(this.questao.tags);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tema: any): void {
    const index = this.questao.tags.indexOf(tema);

    if (index >= 0) {
      this.questao.tags.splice(index, 1);
    }
  }



}
