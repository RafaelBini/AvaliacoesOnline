import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { ENTER, COMMA, SEMICOLON } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-aluno-novo',
  templateUrl: './aluno-novo.component.html',
  styleUrls: ['./aluno-novo.component.css']
})
export class AlunoNovoComponent implements OnInit {
  public aluno: Usuario = {
    nome: "",
    email: "",
    senha: "",
    tipo: "",
    tags: []
  };
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];

  constructor() { }

  ngOnInit(): void {
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

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
