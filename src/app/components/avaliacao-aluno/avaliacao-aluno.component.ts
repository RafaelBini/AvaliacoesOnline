import { ComumService } from './../../services/comum.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UrlNode } from 'src/app/models/url-node';


@Component({
  selector: 'app-avaliacao-aluno',
  templateUrl: './avaliacao-aluno.component.html',
  styleUrls: ['./avaliacao-aluno.component.css']
})
export class AvaliacaoAlunoComponent implements OnInit {

  constructor(public route: ActivatedRoute, public comumService: ComumService) { }
  public finalizado = false;

  alunosOnline = [
    { nome: "Rafael Bini" },
    { nome: "Matheus Leonardo" },
    { nome: "Douglas Marques" },
    { nome: "Guilherme Cruz" },
  ];

  public avaliacao = {
    titulo: "Titulo da Avaliação",
    descricao: `Descrição da Avaliação Descrição da Avaliação Descrição da Avaliação Descrição da Avaliação
    Descrição da Avaliação`,
    status: 0,
    questoes: [
      {
        pergunta: "Qual é a cor da grama?",
        tipo: 1,
        resposta: "Verde",
        alternativas: [],
        valor: 70
      },
      {
        pergunta: "Qual é a cor da grama?",
        tipo: 4,
        resposta: "",
        alternativas: [
          { texto: "A cor é Vermelha.", correta: false },
          { texto: "A cor é Verde.", correta: true },
          { texto: "A cor é Rosa.", correta: false },
          { texto: "A cor é Azul.", correta: false },
        ],
        valor: 30
      },
    ]
  }

  public caminho: Array<UrlNode> = [
    { nome: `Aluno`, url: `/aluno` },
    { nome: `Avaliações`, url: `/aluno/avaliacoes` },
    { nome: `${this.avaliacao.titulo}`, url: `#` },
  ];

  ngOnInit(): void {

  }

}
