import { Usuario } from './../../models/usuario';
import { Component, Inject, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ENTER, COMMA, SEMICOLON } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-editar-aluno',
  templateUrl: './editar-aluno.component.html',
  styleUrls: ['./editar-aluno.component.css']
})
export class EditarAlunoComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];
  public aluno: Usuario = {
    tags: []
  }
  public editando = true;

  constructor(@Inject(MAT_DIALOG_DATA) public alunoRecebido: Usuario) { }

  ngOnInit(): void {
    if (this.alunoRecebido != null) {
      this.aluno = this.alunoRecebido;
      this.editando = true;
    }
    else {
      this.editando = false;
    }
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (this.aluno.tags == undefined)
      this.aluno.tags = [];

    if ((value || '').trim()) {
      this.aluno.tags.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  removeTag(tema: any): void {
    const index = this.aluno.tags.indexOf(tema);

    if (index >= 0) {
      this.aluno.tags.splice(index, 1);
    }
  }

}
