import { EscolherTipoComponent } from './../../dialogs/escolher-tipo/escolher-tipo.component';
import { ComumService } from './../../services/comum.service';
import { Avaliacao } from './../../models/avaliacao';
import { BuscarQuestaoComponent } from './../../dialogs/buscar-questao/buscar-questao.component';
import { AvaliacaoCriadaDialogComponent } from './../../dialogs/avaliacao-criada-dialog/avaliacao-criada-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlNode } from 'src/app/models/url-node';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA, SEMICOLON } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-avaliacao-nova',
  templateUrl: './avaliacao-nova.component.html',
  styleUrls: ['./avaliacao-nova.component.css']
})
export class AvaliacaoNovaComponent implements OnInit {

  constructor(public router: Router, public route: ActivatedRoute, public dialog: MatDialog, public comumService: ComumService) { }


  public avaliacao: Avaliacao = {
    status: 0,
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
    tags: [],
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
        opcoesParaPreencher: [],
        tentativas: 0
      },
    ],

  };

  public visao = "professor";

  public caminho: Array<UrlNode> = [
    { nome: `Professor`, url: `/professor` },
    { nome: `Avaliações`, url: `/professor` },
    { nome: `Nova Avaliação`, url: `/professor` },
  ];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];

  ngOnInit(): void {
    this.comumService.scrollToTop();
    this.route.params.subscribe(params => {
      if (params.id) {
        console.log(params.id);
        // TODO: Puxar informações da availiação que será editada no bd
      }
      else {
        console.log("NOVO");
      }
    });
  }


  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.avaliacao.tags.push(value);
      console.log(this.avaliacao.tags);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  removeTag(tema: any): void {
    const index = this.avaliacao.tags.indexOf(tema);

    if (index >= 0) {
      this.avaliacao.tags.splice(index, 1);
    }
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
      opcoesParaPreencher: [],
      tentativas: 0,
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
