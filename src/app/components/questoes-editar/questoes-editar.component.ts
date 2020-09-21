
import { MatDialog } from '@angular/material/dialog';
import { ComumService } from './../../services/comum.service';
import { Questao } from './../../models/questao';
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Avaliacao } from 'src/app/models/avaliacao';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { InfoQuestaoComponent } from 'src/app/dialogs/info-questao/info-questao.component';



@Component({
  selector: 'app-questoes-editar',
  templateUrl: './questoes-editar.component.html',
  styleUrls: ['./questoes-editar.component.css']
})
export class QuestoesEditarComponent implements OnInit {
  @Input() avaliacao: Avaliacao;

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
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    console.log(this.avaliacao);
  }
  tipoQuestaoChanged(questao, novoTipo) {
    questao.tipo = novoTipo;
    if (this.comumService.questaoTipos[novoTipo].nome == "Entrega") {
      this.tipoArquivoChanged(questao, 'Todos');
    }
  }
  openInfoQuestao(questao) {
    this.dialog.open(InfoQuestaoComponent, {
      width: '80%',
      data: questao
    });
  }
  getPontuacaoMaxima() {
    var pontuacaoMaxima = 0;
    this.avaliacao.questoes.forEach(questao => {
      pontuacaoMaxima += questao.valor;
    });
    return pontuacaoMaxima;
  }
  getQuestaoTiposAdequados() {

    if (this.comumService.precisaDeCorrecaoAutomatica(this.avaliacao)) {
      return this.comumService.questaoTipos.concat().filter(tipo => tipo.temCorrecaoAutomatica);
    }

    return this.comumService.questaoTipos;

  }

  // Alternativa
  removerAlternativa(questao, alternativaIndesejadaIndex) {
    questao.alternativas.splice(alternativaIndesejadaIndex, 1);
  }
  addAlternativa(questao, novaAlternativInput) {
    questao.alternativas.push({ texto: novaAlternativInput.value, selecionada: false });
    novaAlternativInput.value = "";
  }
  onNovaAlterKeyUp(event, questao, novaAlternativInput) {

    if (event.key == 'Enter' && event.ctrlKey) {
      this.addAlternativa(questao, novaAlternativInput);
    }
  }
  desmarcarTudoMenosUma(questao: Questao, alternativaIndex: number, isEditavel: boolean) {
    if (questao.tipo != 4)
      return;
    for (var i = 0; i < questao.alternativas.length; i++) {
      if (i != alternativaIndex) {
        questao.alternativas[i].selecionada = false;
      }
    }
  }

  // Associacao
  removerAssociacao(questao, associacaoIndesejadaIndex) {
    questao.associacoes.splice(associacaoIndesejadaIndex, 1);
  }
  addAssociacao(questao, novaAssociacaoInput, novaAssociacaoOpcaoInput) {
    questao.associacoes.push({
      texto: novaAssociacaoInput.value,
      opcaoSelecionada: novaAssociacaoOpcaoInput.value,
    });
    novaAssociacaoInput.value = "";
    novaAssociacaoOpcaoInput.value = "";
  }
  onNovaAssocKeyUp(event, questao, novaAssociacaoInput, novaAssociacaoOpcaoInput) {
    if (event.key == 'Enter' && event.ctrlKey) {
      this.addAssociacao(questao, novaAssociacaoInput, novaAssociacaoOpcaoInput);
    }
  }
  getAssociacoesOrdenadas(questao: Questao) {
    return questao.associacoes.concat().sort((a, b) => a.texto > b.texto ? 1 : -1);
  }

  // Envio de Arquivo
  tipoArquivoChanged(questao, tipo) {
    if (tipo == 'Todos') {
      questao.extensoes = [];
      this.comumService.arquivosPossiveis.forEach(arquivo => {
        arquivo.extensoes.forEach(extensao => {
          questao.extensoes.push(extensao)
        });
      });
    }
    else {
      questao.extensoes = this.comumService.arquivosPossiveis[tipo].extensoes;
    }
  }

  // PREENCHIMENTO / COMPLETAR
  inserirOpcaoPreeencherSelecionado(questao: Questao, novaOpcaoPreencherInput, editorElement) {
    novaOpcaoPreencherInput.value = questao.textoParaPreencher.substring(editorElement.selectionStart, editorElement.selectionEnd);
    this.addOpcaoPreencher(questao, novaOpcaoPreencherInput, editorElement);
  }
  removerOpcaoPreencher(questao: Questao, opcaoPreencherIndesejadaIndex) {
    questao.opcoesParaPreencher[opcaoPreencherIndesejadaIndex].ativa = false;
    questao.partesPreencher = this.getPreenchimentoPartes(questao);
  }
  addOpcaoPreencher(questao: Questao, novaOpcaoPreencherInput, editorElement) {
    questao.opcoesParaPreencher.push({ texto: novaOpcaoPreencherInput.value, opcaoSelecionada: "", ativa: true });
    novaOpcaoPreencherInput.value = "";
    questao.textoParaPreencher =
      questao.textoParaPreencher.substring(0, editorElement.selectionStart)
      + `(${questao.opcoesParaPreencher.length})` +
      questao.textoParaPreencher.substring(editorElement.selectionEnd, questao.textoParaPreencher.length);

    questao.partesPreencher = this.getPreenchimentoPartes(questao);
  }
  onNovaOpcaoPreencherKeyUp(event, questao, novaOpcaoPreencherInput, editorElement) {
    if (event.key == 'Enter' && event.ctrlKey) {
      this.addOpcaoPreencher(questao, novaOpcaoPreencherInput, editorElement);
    }
  }
  onEditorPreencherKeyUp(questao) {
    questao.partesPreencher = this.getPreenchimentoPartes(questao);
  }
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
