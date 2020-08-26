import { EscolherTipoComponent } from './../../dialogs/escolher-tipo/escolher-tipo.component';
import { ComumService } from './../../services/comum.service';
import { Avaliacao } from './../../models/avaliacao';
import { BuscarQuestaoComponent } from './../../dialogs/buscar-questao/buscar-questao.component';
import { AvaliacaoCriadaDialogComponent } from './../../dialogs/avaliacao-criada-dialog/avaliacao-criada-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlNode } from 'src/app/models/url-node';


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
    dtInicioCorrecao: this.comumService.getStringFromDate(new Date()),
    isInicioCorrecaoIndeterminado: false,
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
        tipo: 1,
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

  };

  public visao = "professor";

  public caminho: Array<UrlNode> = [
    { nome: `Professor`, url: `/professor` },
    { nome: `Avaliações`, url: `/professor` },
    { nome: `Nova Avaliação`, url: `/professor` },
  ];

  ngOnInit(): void {
    this.comumService.scrollToTop();
  }


  estaEmFoco(objetoDom): boolean {
    return objetoDom == document.activeElement;
  }
  ajustarAltura(event) {
    var paddingTop = parseFloat(event.target.style.paddingTop.replace("px", ""));
    var paddingBottom = parseFloat(event.target.style.paddingBottom.replace("px", ""));
    event.target.style.height = ""; event.target.style.height = (event.target.scrollHeight - (paddingTop + paddingBottom)) + "px";
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
