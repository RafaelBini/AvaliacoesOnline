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
    var strDate = date.toLocaleString();
    return strDate.substr(0, 8) + " " + strDate.substr(11, 5);
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
      descricao: "O aluno faz a avaliação de forma individual.",
      icone: "person"
    },
    {
      codigo: 1,
      nome: "Grupo (Professor Define)",
      descricao: "A avaliação é feita em grupos definidos pelo Professor.",
      icone: "supervisor_account"
    },
    {
      codigo: 2,
      nome: "Grupo (Alunos Definem)",
      descricao: "A avaliação é feita em grupos definidos pelos próprios alunos e pelo professor.",
      icone: "group"
    },
    {
      codigo: 3,
      nome: "Grupo (Aleatoriamente)",
      descricao: "A avaliação é feita em grupos definidos de forma aleatória pelo sistema e pelo professor.",
      icone: "people_outline"
    }
  ];

  public correcoes = [
    {
      codigo: 0,
      nome: "Professor Corrige",
      descricao: "O professor corrige todas as avaliações dos alunos.",
      icone: "grading",
      correcaoAutomatica: false,
    },
    {
      codigo: 1,
      nome: "Correção Automática",
      descricao: "O sistema corrige as avaliações automaticamente, permitindo que o professor revise posteriormente.",
      icone: "rule",
      correcaoAutomatica: true,
    },
    {
      codigo: 2,
      nome: "Alunos Corrigem",
      descricao: "Os alunos corrigem as avaliações uns dos outros.",
      icone: "sync_alt",
      correcaoAutomatica: false,
    },
    {
      codigo: 3,
      nome: "Autoavaliação",
      descricao: "O aluno corrige a sua própria avaliação consultando o gabarito.",
      icone: "sync",
      correcaoAutomatica: false,
    }
  ];

  public pontuacoes = [
    {
      codigo: 0,
      nome: "Fixa Por Questão",
      descricao: "O professor determina um valor fixo para cada questão.",
      icone: "exposure_plus_1",
      correcaoAutomatica: false,
    },
    {
      codigo: 1,
      nome: "Comparativa",
      descricao: "A nota de cada Aluno é definida pelo percentual da maior nota dentre todos os alunos.",
      icone: "insert_chart_outlined",
      correcaoAutomatica: false,
    },
    {
      codigo: 2,
      nome: "Por Tentativa",
      descricao: "O aluno pode validar suas respostas três vezes. A cada tentativa incorreta o Aluno perde 1/3 do valor total da questão. ",
      icone: "filter_3",
      correcaoAutomatica: true,
    },
    {
      codigo: 3,
      nome: "Por Participação",
      descricao: "O aluno recebe a nota máxima ao participar da avaliação.",
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
      isRespondida(questao: Questao) {
        for (let associacao of questao.associacoes) {
          if (associacao.opcaoSelecionada) {

          }
        }
      }
    },
    {
      codigo: 1,
      nome: "Dissertativa",
      temCorrecaoAutomatica: false,
      getNota(questao, questaoGabarito): number {
        return 0;
      },
    },
    {
      codigo: 2,
      nome: "Entrega",
      temCorrecaoAutomatica: false,
      getNota(questao, questaoGabarito): number {
        return 0;
      },
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
      getNota(questao: Questao, questaoGabarito): number {
        var nota = questao.valor;
        // for (let parte of questao.partesPreencher) {
        //   if (parte.tipo == 'select') {
        //     if (questao.opcoesParaPreencher[parte.conteudo].opcaoSelecionada != questao.opcoesParaPreencher[parte.conteudo].texto)

        //   }
        // }
        for (let opcao of questao.opcoesParaPreencher) {
          if (opcao.opcaoSelecionada != opcao.texto && opcao.opcaoSelecionada != null && opcao.opcaoSelecionada != '') {
            nota -= (questao.valor / questao.partesPreencher.filter(p => p.tipo == 'select').length);
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
