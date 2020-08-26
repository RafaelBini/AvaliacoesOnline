import { Injectable } from '@angular/core';
import { animationFrameScheduler } from 'rxjs';

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
      codigo: 0,
      nome: "Individual",
      descricao: "Neste modo cada Aluno faz a avaliação de forma individual.",
      icone: "person"
    },
    {
      codigo: 1,
      nome: "Grupo (Professor Define)",
      descricao: "Neste modo a avaliação é feita em grupos definidos pelo Professor.",
      icone: "supervisor_account"
    },
    {
      codigo: 2,
      nome: "Grupo (Alunos Definem)",
      descricao: "Neste modo a avaliação é feita em grupos definidos pelos próprios alunos.",
      icone: "group"
    },
    {
      codigo: 3,
      nome: "Grupo (Aleatóriamente)",
      descricao: "Neste modo a avaliação é feita em grupos definidos de forma aleatória pelo sistema.",
      icone: "people_outline"
    }
  ];

  public correcoes = [
    {
      codigo: 0,
      nome: "Professor Corrige",
      descricao: "Este é o método de correção tradicional. O Professor corrige todas as Avaliações dos Alunos.",
      icone: "grading"
    },
    {
      codigo: 1,
      nome: "Correção Automática",
      descricao: "Neste método de correção o sistema corrige as Avaliações de forma automática, permitindo que o Professor revise posteriormente.",
      icone: "rule"
    },
    {
      codigo: 2,
      nome: "Alunos Corrigem",
      descricao: "Neste método de correção os próprios alunos corrigem as avaliações uns dos outros.",
      icone: "sync_alt"
    },
    {
      codigo: 3,
      nome: "Autoavaliação",
      descricao: "Neste método de correção o Aluno recebe a resposta correta logo depois de finalizar a Avaliação.",
      icone: "sync"
    }
  ];

  public pontuacoes = [
    {
      codigo: 0,
      nome: "Fixa Por Questão",
      descricao: "Neste modo o Professor determina um valor fixo para cada questão. A nota máxima é a somatória dos valores de todas as questões.",
      icone: "exposure_plus_1"
    },
    {
      codigo: 1,
      nome: "Comparativa",
      descricao: "Neste modo o Professor determina um valor fixo para cada questão. A nota máxima é a maior nota dentre todos os alunos. Portanto, a nota de cada Aluno é definida pelo percentual da maior nota.",
      icone: "insert_chart_outlined"
    },
    {
      codigo: 2,
      nome: "Por Tentativa",
      descricao: "Neste modo o Professor determina um valor fixo para cada questão. O Aluno pode tentar acertar a questão três vezes. A cada tentativa incorreta o Aluno perde 1/3 do valor total da questão. ",
      icone: "filter_3"
    },
    {
      codigo: 3,
      nome: "Por Participação",
      descricao: "Neste modo o Professor não determina um valor para cada questão. Se o Aluno participar respondendo a questão já recebe a nota máxima.",
      icone: "star_rate"
    }
  ];

  public questaoTipos = [
    {
      codigo: 0,
      nome: "Associativa",
      temCorrecaoAutomatica: true,
    },
    {
      codigo: 1,
      nome: "Dissertativa",
      temCorrecaoAutomatica: false,
    },
    {
      codigo: 2,
      nome: "Entrega",
      temCorrecaoAutomatica: false,
    },
    {
      codigo: 3,
      nome: "Multipla Escolha - Multipla Resposta",
      temCorrecaoAutomatica: true,
    },
    {
      codigo: 4,
      nome: "Multipla Escolha - Unica Resposta",
      temCorrecaoAutomatica: true,
    },
    {
      codigo: 5,
      nome: "Preenchimento",
      temCorrecaoAutomatica: true,
    },
    {
      codigo: 6,
      nome: "Veradadeiro ou Falso",
      temCorrecaoAutomatica: true,
    },
    {
      codigo: 7,
      nome: "Veradadeiro ou Falso - Justificativa",
      temCorrecaoAutomatica: false,
    },
  ];

  public niveisDificuldade = [
    "Muito Fácil",
    "Fácil",
    "Médio",
    "Difícil",
    "Muito Difícil",
  ];

  public arquivosPossiveis = [
    {
      categoria: 'Compactado', extensoes: [
        '.zip', '.rar', '.tar', '.gz', '.arj', '.cab'
      ]
    },
    {
      categoria: 'Imagem', extensoes: [
        '.jpg', '.jpeg', '.png', '.svg'
      ]
    },
    {
      categoria: 'Texto', extensoes: [
        '.pdf', '.docx', '.doc', '.txt'
      ]
    },
    {
      categoria: 'Video', extensoes: [
        '.avi', '.mp4', '.mov', '.wmv'
      ]
    },
  ]


  normalizar(valor: string): string {
    if (valor != null)
      return valor.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return "";
  }

  scrollToBottom() {
    setTimeout(() => {
      window.scroll({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 20);
  }

  scrollToTop() {
    setTimeout(() => {
      window.scroll({
        top: 0
      });
    }, 1);
  }

}
