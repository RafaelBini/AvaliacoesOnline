import { EscolherTipoComponent } from './../../dialogs/escolher-tipo/escolher-tipo.component';
import { ComumService } from './../../services/comum.service';
import { Avaliacao } from './../../models/avaliacao';
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
    dtInicio: this.comumService.getStringFromDate(new Date()),
    isInicioIndeterminado: false,
    dtTermino: this.comumService.getStringFromDate(new Date()),
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
        tipo: 5,
        resposta: "",
        alternativas: [],
        valor: 1,
        nivelDificuldade: 2,
        tags: [],
        associacoes: [],
        textoParaPreencher: "",
        opcoesParaPreencher: []
      },
    ],

  }

  public visao = "professor";

  ngOnInit(): void {
    this.comumService.scrollToTop();
  }



  addQuestao() {
    this.avaliacao.questoes.push({
      pergunta: "",
      tipo: 1,
      resposta: "",
      alternativas: [],
      valor: 1,
      nivelDificuldade: 2,
      tags: [],
      associacoes: [],
      textoParaPreencher: "",
      opcoesParaPreencher: []
    });

    this.comumService.scrollToBottom();

  }

  finalizar() {
    this.router.navigate(['/professor']);
    this.dialog.open(AvaliacaoCriadaDialogComponent);
  }

  buscarQuestao() {
    this.dialog.open(BuscarQuestaoComponent, {
      data: this.avaliacao,
      width: '75%'
    });
  }

  abrirTipos(tipoEscolhido) {
    this.dialog.open(EscolherTipoComponent, {
      data: {
        avaliacao: this.avaliacao,
        tipoEscolhido: tipoEscolhido
      },
      width: '75%'
    });
  }

}
