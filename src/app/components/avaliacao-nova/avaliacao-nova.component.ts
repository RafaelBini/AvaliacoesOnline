import { BuscarQuestaoComponent } from './../../dialogs/buscar-questao/buscar-questao.component';
import { InfoQuestaoComponent } from './../../dialogs/info-questao/info-questao.component';
import { AvaliacaoCriadaDialogComponent } from './../../dialogs/avaliacao-criada-dialog/avaliacao-criada-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { moveItemInArray, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-avaliacao-nova',
  templateUrl: './avaliacao-nova.component.html',
  styleUrls: ['./avaliacao-nova.component.css']
})
export class AvaliacaoNovaComponent implements OnInit {

  constructor(public router: Router, public dialog: MatDialog) { }
  public hojeFormatado = new Date().toISOString().substr(0, 10) + "T00:00";
  public isTerminoIndeterminado = false;
  public isInicioIndeterminado = false;

  public disposicoes = [
    {
      nome: "Individual",
      descricao: "Neste modo cada Aluno faz a avaliação de forma individual.",
      icone: "person"
    },
    {
      nome: "Em Grupo (Definido pelo Professor)",
      descricao: "Neste modo a avaliação é feita em grupos definidos pelo Professor.",
      icone: "supervisor_account"
    },
    {
      nome: "Em Grupo (Definido pelos Alunos)",
      descricao: "Neste modo a avaliação é feita em grupos definidos pelos próprios alunos.",
      icone: "group"
    },
    {
      nome: "Em Grupo (Definido Aleatóriamente)",
      descricao: "Neste modo a avaliação é feita em grupos definidos de forma aleatória pelo sistema.",
      icone: "people_outline"
    }
  ];
  public disposicaoSelecionada = 0;

  public correcoes = [
    {
      nome: "Professor",
      descricao: "Este é o método de correção tradicional. O Professor corrige todas as Avaliações dos Alunos.",
      icone: "grading"
    },
    {
      nome: "Automática",
      descricao: "Neste método de correção o sistema corrige as Avaliações de forma automática, permitindo que o Professor revise posteriormente.",
      icone: "rule"
    },
    {
      nome: "Pelos Pares",
      descricao: "Neste método de correção os próprios alunos corrigem as avaliações uns dos outros.",
      icone: "sync_alt"
    },
    {
      nome: "Autoavaliação",
      descricao: "Neste método de correção o Aluno recebe a resposta correta logo depois de finalizar a Avaliação.",
      icone: "sync"
    }
  ];
  public correcaoSelecionada = 0;
  public correcaoParesQtd;

  public pontuacoes = [
    {
      nome: "Pontuação Fixa Por Questão",
      descricao: "Neste modo o Professor determina um valor fixo para cada questão. A nota máxima é a somatória dos valores de todas as questões.",
      icone: "exposure_plus_1"
    },
    {
      nome: "Pontuação Comparativa",
      descricao: "Neste modo o Professor determina um valor fixo para cada questão. A nota máxima é a maior nota dentre todos os alunos. Portanto, a nota de cada Aluno é definida pelo percentual da maior nota.",
      icone: "insert_chart_outlined"
    },
    {
      nome: "Pontuação Por Tentativa",
      descricao: "Neste modo o Professor determina um valor fixo para cada questão. O Aluno pode tentar acertar a questão três vezes. A cada tentativa incorreta o Aluno perde 1/3 do valor total da questão. ",
      icone: "filter_3"
    },
    {
      nome: "Pontuação Por Participação",
      descricao: "Neste modo o Professor não determina um valor para cada questão. Se o Aluno participar respondendo a questão já recebe a nota máxima.",
      icone: "star_rate"
    }
  ];
  public pontuacaoSelecionada = 0;

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

  public questoes = [
    {
      pergunta: "",
      tipo: 1,
      resposta: "",
      alternativas: []
    },
  ];



  ngOnInit(): void {
    console.log(this.hojeFormatado);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  removerAlternativa(questaoIndex, alternativaIndesejadaIndex) {
    this.questoes[questaoIndex].alternativas.splice(alternativaIndesejadaIndex, 1);
  }

  addAlternativa(alternativaIndex, texto) {
    this.questoes[alternativaIndex].alternativas.push({ texto: texto, correta: false });
  }
  onNovaAlterKeyDown(event, alternativaIndex, texto) {
    if (event.key == 'Enter') {
      this.addAlternativa(alternativaIndex, texto);
    }
  }

  addQuestao() {
    this.questoes.push({
      pergunta: "",
      tipo: 1,
      resposta: "",
      alternativas: []
    });
  }

  finalizar() {
    this.router.navigate(['/professor']);
    this.dialog.open(AvaliacaoCriadaDialogComponent);
  }

  selectParesChange(opcaoSelecionada) {
    if (opcaoSelecionada == 'DEFINIR') {
      this.correcaoParesQtd = 2;
    }
    else {
      this.correcaoParesQtd = null;
    }
  }

  openInfoQuestao(questao) {
    this.dialog.open(InfoQuestaoComponent, {
      width: '80%'
    });
  }

  buscarQuestao() {
    this.dialog.open(BuscarQuestaoComponent, {
      width: '75%'
    });
  }

}
