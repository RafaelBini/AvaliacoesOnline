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
    { email: "godo@gmail.com", nome: "Godofredo", matricula: "grr20178700" },
    { email: "rub@gmail.com", nome: "Ruberlinda", matricula: "grr20181110" },
    { email: "cdnleon@outlook.com", nome: "Leon Martins", matricula: "grr20194580" },
    { email: "nil@gmail.com", nome: "Nilce Moretto", matricula: "grr20171234" },
    { email: "fredb12@hotmail.com", nome: "Fred Desimpedidos", matricula: "grr20184658" },
    { email: "marilia@gmail.com", nome: "Marília Galvão", matricula: "grr20167755" },
    { email: "bueno@gmail.com", nome: "Galvão Bueno", matricula: "grr20184848" },
    { email: "alanzoka@hotmail.com", nome: "Alan Ferreira", matricula: "grr20178452" },
    { email: "balga@outlook.com", nome: "Mari Balga", matricula: "grr20196658" },
    { email: "clone@gmail.com", nome: "Henrique Grosse", matricula: "grr20184610" },
  ]

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addAluno() {
    this.dialog.open(AlunoNovoComponent, {

    });
  }



}
