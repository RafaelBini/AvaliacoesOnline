import { MatSnackBar } from '@angular/material/snack-bar';
import { Questao } from './../models/questao';
import { Injectable } from '@angular/core';
import { animationFrameScheduler } from 'rxjs';
import { Avaliacao } from '../models/avaliacao';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ComumService {

  constructor(private snack: MatSnackBar) { }

  getStringFromDate(date: Date) {
    return date.toISOString().substr(0, 10) + "T00:00";
  }

  getStrDateFormatada(strDate: string) {
    const date = new Date(strDate);
    return date.toLocaleString();
  }

  public statusAvaliacao = [
    {
      id: 0,
      nome: "Em Preparação",
      descricao: "A avaliação ainda não iniciou. Nesta fase os grupos podem estar sendo definidos.",
      acaoProfessor: "Configurar grupos / Iniciar Avaliação",
      acaoAluno: "Aguardar inicio da Avaliação",
      cor: "var(--em-preparacao)",
      prioridade: 1,
      mensagemCountdown: "INCIANDO EM",
    },
    {
      id: 1,
      nome: "Durante Avaliação",
      acaoProfessor: "Acompanhar os alunos",
      acaoAluno: "Responder Questões",
      cor: "var(--em-avaliacao)",
      prioridade: 2,
      mensagemCountdown: "ENCERRANDO EM",
    },
    {
      id: 2,
      nome: "Em Correção",
      acaoProfessor: "Corrigir / Revisar Avaliações",
      acaoAluno: "Aguardar/Realizar Correções",
      cor: "var(--em-correcao)",
      prioridade: 3,
      mensagemCountdown: "FINALIZANDO EM",
    },
    {
      id: 3,
      nome: "Encerrada",
      acaoProfessor: "Consultar / Alterar notas dos alunos",
      acaoAluno: "Consultar Avaliação",
      cor: "var(--encerrada)",
      prioridade: 0,
    }
  ];

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
      icone: "grading",
      correcaoAutomatica: false,
    },
    {
      codigo: 1,
      nome: "Correção Automática",
      descricao: "Neste método de correção o sistema corrige as Avaliações de forma automática, permitindo que o Professor revise posteriormente.",
      icone: "rule",
      correcaoAutomatica: true,
    },
    {
      codigo: 2,
      nome: "Alunos Corrigem",
      descricao: "Neste método de correção os próprios alunos corrigem as avaliações uns dos outros.",
      icone: "sync_alt",
      correcaoAutomatica: false,
    },
    {
      codigo: 3,
      nome: "Autoavaliação",
      descricao: "Neste método de correção o Aluno recebe a resposta correta logo depois de finalizar a Avaliação.",
      icone: "sync",
      correcaoAutomatica: false,
    }
  ];

  public pontuacoes = [
    {
      codigo: 0,
      nome: "Fixa Por Questão",
      descricao: "Neste modo o Professor determina um valor fixo para cada questão. A nota máxima é a somatória dos valores de todas as questões.",
      icone: "exposure_plus_1",
      correcaoAutomatica: false,
    },
    {
      codigo: 1,
      nome: "Comparativa",
      descricao: "Neste modo o Professor determina um valor fixo para cada questão. A nota máxima é a maior nota dentre todos os alunos. Portanto, a nota de cada Aluno é definida pelo percentual da maior nota.",
      icone: "insert_chart_outlined",
      correcaoAutomatica: false,
    },
    {
      codigo: 2,
      nome: "Por Tentativa",
      descricao: "Neste modo o Professor determina um valor fixo para cada questão. O Aluno pode tentar acertar a questão três vezes. A cada tentativa incorreta o Aluno perde 1/3 do valor total da questão. ",
      icone: "filter_3",
      correcaoAutomatica: true,
    },
    {
      codigo: 3,
      nome: "Por Participação",
      descricao: "Neste modo o Professor não determina um valor para cada questão. Se o Aluno participar respondendo a questão já recebe a nota máxima.",
      icone: "star_rate",
      correcaoAutomatica: false,
    }
  ];

  public questaoTipos = [
    {
      codigo: 0,
      nome: "Associativa",
      temCorrecaoAutomatica: true,
      getNota(questao, questaoGabarito): number {
        var nota = questao.valor;
        for (let [i, associacao] of questao.associacoes.entries()) {
          if (questaoGabarito.associacoes[i].opcaoSelecionada != associacao.opcaoSelecionada) {
            nota -= (questao.valor / questao.associacoes.length);
          }
        }
        return nota - ComumService.getDescontoTentativas(questao);
      },
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
      getNota(questao, questaoGabarito): number {
        for (let [i, alternativa] of questao.alternativas.entries()) {
          if (alternativa.selecionada == null)
            alternativa.selecionada = false;
          if (questaoGabarito.alternativas[i].selecionada != alternativa.selecionada) {
            return 0;
          }
        }
        return questao.valor - ComumService.getDescontoTentativas(questao);
      },
    },
    {
      codigo: 4,
      nome: "Multipla Escolha - Unica Resposta",
      temCorrecaoAutomatica: true,
      getNota(questao, questaoGabarito): number {
        for (let [i, alternativa] of questao.alternativas.entries()) {
          if (alternativa.selecionada == null)
            alternativa.selecionada = false;
          if (questaoGabarito.alternativas[i].selecionada != alternativa.selecionada) {
            return 0;
          }
        }
        return questao.valor - ComumService.getDescontoTentativas(questao);
      },
    },
    {
      codigo: 5,
      nome: "Preenchimento",
      temCorrecaoAutomatica: true,
      getNota(questao, questaoGabarito): number {
        var nota = questao.valor;
        for (let opcao of questao.opcoesParaPreencher) {
          if (opcao.texto != opcao.opcaoSelecionada) {
            nota -= (questao.valor / questao.opcoesParaPreencher.length);
          }
        }
        return nota - ComumService.getDescontoTentativas(questao);
      },
    },
    {
      codigo: 6,
      nome: "Veradadeiro ou Falso",
      temCorrecaoAutomatica: true,
      getNota(questao, questaoGabarito): number {
        var nota = questao.valor;
        for (let [i, alternativa] of questao.alternativas.entries()) {
          if (questaoGabarito.alternativas[i].selecionada != alternativa.selecionada) {
            nota -= (questao.valor / questao.alternativas.length);
          }
        }
        return nota - ComumService.getDescontoTentativas(questao);
      },
    },
    {
      codigo: 7,
      nome: "Veradadeiro ou Falso - Justificativa",
      temCorrecaoAutomatica: false,
      getNota(questao: Questao, questaoGabarito): number {
        var nota = questao.valor;
        for (let [i, alternativa] of questao.alternativas.entries()) {
          if (questaoGabarito.alternativas[i].selecionada != alternativa.selecionada) {
            nota -= (questao.valor / questao.alternativas.length);
          }
        }
        return nota;
      },
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

  public static getDescontoTentativas(questao: Questao): number {
    if (questao.tentativas == null)
      questao.tentativas = 0;
    return (questao.tentativas * (questao.valor / 3))
  }

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

  getRounded(numero: number) {
    return Math.round(numero);
  }

  precisaDeCorrecaoAutomatica(avaliacao): boolean {
    return this.pontuacoes[avaliacao.tipoPontuacao].correcaoAutomatica || this.correcoes[avaliacao.tipoCorrecao].correcaoAutomatica;
  }

  podeSerDeCorrecaoAutomatica(prova): boolean {
    for (let questao of prova.questoes) {
      if (!this.questaoTipos[questao.tipo].temCorrecaoAutomatica) {
        return false;
      }
    }
    return true;
  }

  getHostName() {
    return window.location.host;
  }

  notificarErro(msgUsuario: string, errorObj: any) {
    this.snack.open(msgUsuario, null, { duration: 3500 });
    console.log(errorObj);
  }

}
