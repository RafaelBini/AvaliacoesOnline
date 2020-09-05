import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-aluno-card-avaliacao-professor',
  templateUrl: './aluno-card-avaliacao-professor.component.html',
  styleUrls: ['./aluno-card-avaliacao-professor.component.css']
})
export class AlunoCardAvaliacaoProfessorComponent implements OnInit {

  @Input() aluno;
  constructor() { }

  ngOnInit(): void {
  }

}
