import { Questao } from './../../models/questao';
import { Avaliacao } from 'src/app/models/avaliacao';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UrlNode } from 'src/app/models/url-node';

@Component({
  selector: 'app-avaliacao-correcao',
  templateUrl: './avaliacao-correcao.component.html',
  styleUrls: ['./avaliacao-correcao.component.css']
})
export class AvaliacaoCorrecaoComponent implements OnInit {

  constructor(public route: ActivatedRoute) { }

  public visaoTipo = "correcao";
  public userTipo = "aluno"
  public caminho: Array<UrlNode>;

  public avaliacao: Avaliacao = {
    id: "01",
    titulo: "Avaliacao 01",
    descricao: "",
    dtInicio: "",
    isInicioIndeterminado: false,
    dtInicioCorrecao: "string",
    isInicioCorrecaoIndeterminado: true,
    dtTermino: "string",
    isOrdemAleatoria: false,
    isBloqueadoAlunoAtrasado: false,
    tipoDisposicao: 1,
    tipoCorrecao: 2,
    correcaoParesQtdTipo: "string",
    correcaoParesQtdNumero: 1,
    tipoPontuacao: 1,
    isTerminoIndeterminado: true,
    questoes: [
      {
        valor: 4,
        pergunta: "Qual é a cor da grama?",
        tipo: 1,
        nivelDificuldade: 1,
        extensoes: [".pdf"],
        respostaAluno: "A cor da grama é laranja.",
        correcaoProfessor: {
          nota: null,
          observacao: null,
        },
        correcoes: [
          {
            nota: 1,
            observacao: "Na verdade a cor da grama é verde"
          },
          {
            nota: 3,
            observacao: "A cor da grama é laranja escuro..."
          },
          {
            nota: 0,
            observacao: "É verde!!"
          }
        ]
      },
      {
        valor: 3,
        pergunta: "Associe as cores",
        tipo: 0,
        nivelDificuldade: 1,
        respostaAluno: "A cor da grama é laranja.",
        correcaoProfessor: {
          nota: null,
          observacao: null,
        },
        correcoes: [
          {
            nota: 1,
            observacao: "Na verdade a cor do céu é azul e a cor do sol é amarelo"
          }
        ],
        associacoes: [
          {
            texto: "Cor do sol",
            opcaoCorreta: "Amarelo", opcaoSelecionada: "Azul"
          },
          { texto: "Cor da grama", opcaoCorreta: "Verde", opcaoSelecionada: "Verde" },
          { texto: "Cor do céu", opcaoCorreta: "Azul", opcaoSelecionada: "Amarelo" }
        ]
      },

      {
        valor: 5,
        pergunta: "Quanto é 2 + 2?",
        tags: ["matemática", "soma", "cálculo", "números"],
        tipo: 3,
        nivelDificuldade: 1,
        alternativas: [
          { texto: "1", correta: false, selecionada: false },
          { texto: "2", correta: false, selecionada: false },
          { texto: "3", correta: false, selecionada: false },
          { texto: "4", correta: true, selecionada: true },
        ],
        correcaoProfessor: {
          nota: null,
          observacao: null,
        },
        correcoes: [],
      },
      {
        valor: 5,
        pergunta: "Complete a frase abaixo:",
        tags: ["astronomia", "cores", "química"],
        tipo: 5,
        nivelDificuldade: 4,
        opcoesParaPreencher: [
          { texto: "grama", opcaoSelecionada: "verde", ativa: true },
          { texto: "verde", opcaoSelecionada: "grama", ativa: true }
        ],
        textoParaPreencher: "A (1) geralemnte é da cor (2).",
        partesPreencher: [
          { conteudo: "A ", tipo: "texto" },
          { conteudo: 0, tipo: "select" },
          { conteudo: " geralmente é da cor ", tipo: "texto" },
          { conteudo: 1, tipo: "select" },
          { conteudo: ".", tipo: "texto" },
        ],
        correcaoProfessor: {
          nota: null,
          observacao: null,
        },
        correcoes: [],

      },

    ]

  }



  ngOnInit(): void {


    this.route.url.subscribe((value) => {
      this.userTipo = value[0].path;
      this.visaoTipo = value[2].path;
    });

    this.inserirNotasPadrao();

    this.definirCaminho();

  }

  definirCaminho() {
    if (this.userTipo == "professor") {
      this.caminho = [
        { nome: `Professor`, url: `/professor` },
        { nome: `Avaliações`, url: `/professor` },
        { nome: `${this.avaliacao.titulo}`, url: `/professor/avaliacao/${this.avaliacao.id}` },
        { nome: `Correção`, url: `#` },
      ];
    }
    else {
      this.caminho = [
        { nome: `Aluno`, url: `/aluno` },
        { nome: `Avaliações`, url: `/aluno/avaliacoes` },
        { nome: `${this.avaliacao.titulo}`, url: `/aluno/avaliacao/${this.avaliacao.id}` },
        { nome: `Correção`, url: `#` },
      ];
    }
  }

  inserirNotasPadrao() {
    if (this.avaliacao.tipoCorrecao != 2)
      return;

    for (var questao of this.avaliacao.questoes) {
      if (questao.correcaoProfessor.nota != null)
        continue;

      var soma = 0;
      for (let correcao of questao.correcoes) {
        soma += correcao.nota;
      }
      questao.correcaoProfessor.nota = Math.round((soma / questao.correcoes.length));
    }
  }

}
