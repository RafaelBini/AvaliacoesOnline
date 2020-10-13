import { MatDialog } from '@angular/material/dialog';
import { ComumService } from './../../services/comum.service';
import { Questao } from './../../models/questao';
import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { Avaliacao } from 'src/app/models/avaliacao';
import { Prova } from 'src/app/models/prova';


@Component({
  selector: 'app-questoes-corrigir',
  templateUrl: './questoes-corrigir.component.html',
  styleUrls: ['./questoes-corrigir.component.css']
})
export class QuestoesCorrigirComponent implements OnInit {
  @Input() avaliacao: Avaliacao;
  @Input() prova: Prova;
  @Input() gabarito: Prova;
  @Input() userTipo: string;
  @Input() visaoTipo: string;


  @Output() correcaoAlterada = new EventEmitter<void>();

  constructor(public comumService: ComumService, private dialog: MatDialog, private elementRef: ElementRef) { }


  ngOnInit(): void {
  }


  // GERAL
  estaEmFoco(objetoDom): boolean {
    return objetoDom == document.activeElement;
  }
  ajustarAltura(event) {
    var paddingTop = parseFloat(event.target.style.paddingTop.replace("px", ""));
    var paddingBottom = parseFloat(event.target.style.paddingBottom.replace("px", ""));
    event.target.style.height = ""; event.target.style.height = (event.target.scrollHeight - (paddingTop + paddingBottom)) + "px";
  }
  getPontuacaoMaxima() {
    var pontuacaoMaxima = 0;
    this.prova.questoes.forEach(questao => {
      pontuacaoMaxima += questao.valor;
    });
    return pontuacaoMaxima;
  }
  sinalizarCorrecaoAlterada(questao: Questao) {
    questao.ultimaModificacao = new Date().getTime();
    this.correcaoAlterada.emit();
  }
  identificarQuestao(index: Number, questao: Questao) {
    return index;
  }
  inserirNotaMaxima(questao: Questao) {
    questao.correcaoProfessor.nota = questao.valor;
    this.sinalizarCorrecaoAlterada(questao);
  }

  // ASSOCIACAO
  getAssociacoesOrdenadas(questao: Questao) {
    return questao.associacoes.concat().sort((a, b) => a.texto > b.texto ? 1 : -1);
  }


  // ALTERNATIVAS
  desmarcarTudoMenosUma(questao: Questao, alternativaIndex: number, isEditavel: boolean) {
    if (questao.tipo != 4)
      return;
    for (var i = 0; i < questao.alternativas.length; i++) {
      if (i != alternativaIndex) {
        questao.alternativas[i].selecionada = false;
      }
    }
  }

  // PREENCHER
  getOpcoesPreencherAtivas(questao: Questao) {
    return questao.opcoesParaPreencher.concat().filter(opcao => opcao.ativa).sort((a, b) => a.texto > b.texto ? 1 : -1);
  }
  getPreenchimentoPartes(questao: Questao) {
    var texto = questao.textoParaPreencher;
    var textoSplitado = [];
    var partes = [];
    const SEPARADOR_RANDOMICO = `*#${Math.random()}#*`;
    const IDENTIFICADOR_RANDOMICO = `*#${Math.random()}#*`;
    for (var i = 0; i < questao.opcoesParaPreencher.length; i++) {
      if (questao.opcoesParaPreencher[i].ativa)
        texto = texto.replace(`(${i + 1})`, `${SEPARADOR_RANDOMICO + IDENTIFICADOR_RANDOMICO + (i + 1) + SEPARADOR_RANDOMICO}`);
    }

    textoSplitado = texto.split(SEPARADOR_RANDOMICO);

    textoSplitado.forEach(parte => {
      if (parte.includes(IDENTIFICADOR_RANDOMICO)) {
        partes.push({
          conteudo: parseInt(parte.replace(IDENTIFICADOR_RANDOMICO, "")) - 1,
          tipo: "select"
        });
        console.log(partes);
      }
      else {
        partes.push({
          conteudo: parte,
          tipo: "texto"
        });
      }
    });

    return partes;

  }


}
