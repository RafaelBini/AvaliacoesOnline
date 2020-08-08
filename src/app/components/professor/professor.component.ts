import { AlunoNovoComponent } from './../aluno-novo/aluno-novo.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-professor',
  templateUrl: './professor.component.html',
  styleUrls: ['./professor.component.css']
})
export class ProfessorComponent implements OnInit {
  public alterar = false;

  public alunos = [
    { nome: "godo@gmail.com", email: "Godofredo", matricula: "grr20178700" },
    { nome: "rub@gmail.com", email: "Ruberlinda", matricula: "grr20181110" },
    { nome: "cdnleon@outlook.com", email: "Leon Martins", matricula: "grr20194580" },
    { nome: "nil@gmail.com", email: "Nilce Moretto", matricula: "grr20171234" },
    { nome: "fredb12@hotmail.com", email: "Fred Desimpedidos", matricula: "grr20184658" },
    { nome: "marilia@gmail.com", email: "Marília Galvão", matricula: "grr20167755" },
    { nome: "bueno@gmail.com", email: "Galvão Bueno", matricula: "grr20184848" },
    { nome: "alanzoka@hotmail.com", email: "Alan Ferreira", matricula: "grr20178452" },
    { nome: "balga@outlook.com", email: "Mari Balga", matricula: "grr20196658" },
    { nome: "clone@gmail.com", email: "Henrique Grosse", matricula: "grr20184610" },
  ]

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addAluno() {
    this.dialog.open(AlunoNovoComponent, {

    });
  }



}
