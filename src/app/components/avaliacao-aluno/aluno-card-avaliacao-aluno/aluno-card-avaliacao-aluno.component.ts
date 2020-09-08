import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-aluno-card-avaliacao-aluno',
  templateUrl: './aluno-card-avaliacao-aluno.component.html',
  styleUrls: ['./aluno-card-avaliacao-aluno.component.css']
})
export class AlunoCardAvaliacaoAlunoComponent implements OnInit {
  @Input() aluno;
  constructor() { }

  ngOnInit(): void {
  }

}
