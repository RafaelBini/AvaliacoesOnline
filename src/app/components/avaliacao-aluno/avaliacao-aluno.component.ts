import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-avaliacao-aluno',
  templateUrl: './avaliacao-aluno.component.html',
  styleUrls: ['./avaliacao-aluno.component.css']
})
export class AvaliacaoAlunoComponent implements OnInit {

  constructor() { }
  public finalizado = false;

  public questoes = [
    {
      pergunta: "Qual é a cor da grama?",
      tipo: 1,
      resposta: "Verde",
      alternativas: [],
      valor: 70
    },
    {
      pergunta: "Qual é a cor da grama?",
      tipo: 3,
      resposta: "",
      alternativas: [
        { texto: "A cor é Vermelha.", correta: false },
        { texto: "A cor é Verde.", correta: true },
        { texto: "A cor é Rosa.", correta: false },
        { texto: "A cor é Azul.", correta: false },
      ],
      valor: 30
    },
  ];


  ngOnInit(): void {
  }

}
