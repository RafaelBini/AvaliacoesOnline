import { ComumService } from './../../services/comum.service';
import { Avaliacao } from './../../models/avaliacao';
import { AvaliacaoProfessorComponent } from './../avaliacao-professor/avaliacao-professor.component';
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

  constructor(public router: Router, public dialog: MatDialog, public comumService: ComumService) { }


  public avaliacao: Avaliacao = {
    titulo: "",
    descricao: "",
    dtInicio: new Date(),
    isInicioIndeterminado: false,
    dtTermino: new Date(),
    isTerminoIndeterminado: false,
    isOrdemAleatoria: false,
    isBloqueadoAlunoAtrasado: false,
    tipoDisposicao: 0,
    tipoCorrecao: 0,
    correcaoParesQtdTipo: "1",
    correcaoParesQtdNumero: 1,
    tipoPontuacao: 0,
    questoes: [
      {
        pergunta: "",
        tipo: 1,
        resposta: "",
        alternativas: [],
        valor: 1,
        nivelDificuldade: 1,
      },
    ],

  }

  public finalizado = false;

  public visao = "professor";

  ngOnInit(): void {

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
    this.avaliacao.questoes[questaoIndex].alternativas.splice(alternativaIndesejadaIndex, 1);
  }

  addAlternativa(alternativaIndex, texto) {
    this.avaliacao.questoes[alternativaIndex].alternativas.push({ texto: texto, correta: false });
  }
  onNovaAlterKeyDown(event, alternativaIndex, texto) {
    if (event.key == 'Enter') {
      this.addAlternativa(alternativaIndex, texto);
    }
  }

  addQuestao() {
    this.avaliacao.questoes.push({
      pergunta: "",
      tipo: 1,
      resposta: "",
      alternativas: [],
      valor: 1,
      nivelDificuldade: 1,
    });
  }

  finalizar() {
    this.router.navigate(['/professor']);
    this.dialog.open(AvaliacaoCriadaDialogComponent);
  }

  selectParesChange(opcaoSelecionada: string) {
    if (!isNaN(+opcaoSelecionada)) {
      this.avaliacao.correcaoParesQtdNumero = Number(opcaoSelecionada);
    }
    else if (opcaoSelecionada == "DEFINIR") {
      this.avaliacao.correcaoParesQtdNumero = 6;
    }
    else if (opcaoSelecionada == "TODOS") {
      this.avaliacao.correcaoParesQtdNumero = null;
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
