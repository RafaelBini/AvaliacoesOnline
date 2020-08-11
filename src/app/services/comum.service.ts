import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComumService {

  constructor() { }

  getStringFromDate(date: Date) {
    return date.toISOString().substr(0, 10) + "T00:00";
  }

  public disposicoes = [
    {
      nome: "Individual",
      descricao: "Neste modo cada Aluno faz a avaliação de forma individual.",
      icone: "person"
    },
    {
      nome: "Grupo (Professor Define)",
      descricao: "Neste modo a avaliação é feita em grupos definidos pelo Professor.",
      icone: "supervisor_account"
    },
    {
      nome: "Grupo (Alunos Definem)",
      descricao: "Neste modo a avaliação é feita em grupos definidos pelos próprios alunos.",
      icone: "group"
    },
    {
      nome: "Grupo (Aleatóriamente)",
      descricao: "Neste modo a avaliação é feita em grupos definidos de forma aleatória pelo sistema.",
      icone: "people_outline"
    }
  ];

  public correcoes = [
    {
      nome: "Professor Corrige",
      descricao: "Este é o método de correção tradicional. O Professor corrige todas as Avaliações dos Alunos.",
      icone: "grading"
    },
    {
      nome: "Correção Automática",
      descricao: "Neste método de correção o sistema corrige as Avaliações de forma automática, permitindo que o Professor revise posteriormente.",
      icone: "rule"
    },
    {
      nome: "Alunos Corrigem",
      descricao: "Neste método de correção os próprios alunos corrigem as avaliações uns dos outros.",
      icone: "sync_alt"
    },
    {
      nome: "Autoavaliação",
      descricao: "Neste método de correção o Aluno recebe a resposta correta logo depois de finalizar a Avaliação.",
      icone: "sync"
    }
  ];

  public pontuacoes = [
    {
      nome: "Fixa Por Questão",
      descricao: "Neste modo o Professor determina um valor fixo para cada questão. A nota máxima é a somatória dos valores de todas as questões.",
      icone: "exposure_plus_1"
    },
    {
      nome: "Comparativa",
      descricao: "Neste modo o Professor determina um valor fixo para cada questão. A nota máxima é a maior nota dentre todos os alunos. Portanto, a nota de cada Aluno é definida pelo percentual da maior nota.",
      icone: "insert_chart_outlined"
    },
    {
      nome: "Por Tentativa",
      descricao: "Neste modo o Professor determina um valor fixo para cada questão. O Aluno pode tentar acertar a questão três vezes. A cada tentativa incorreta o Aluno perde 1/3 do valor total da questão. ",
      icone: "filter_3"
    },
    {
      nome: "Por Participação",
      descricao: "Neste modo o Professor não determina um valor para cada questão. Se o Aluno participar respondendo a questão já recebe a nota máxima.",
      icone: "star_rate"
    }
  ];

  public questaoTipos = [
    {
      nome: "Associativa"
    },
    {
      nome: "Disertativa"
    },
    {
      nome: "Entrega"
    },
    {
      nome: "Multipla Escolha - Multipla Resposta"
    },
    {
      nome: "Multipla Escolha - Unica Resposta"
    },
    {
      nome: "Preenchimento"
    },
    {
      nome: "Veradadeiro ou Falso"
    },
    {
      nome: "Veradadeiro ou Falso - Justificativa"
    },
  ];

}
