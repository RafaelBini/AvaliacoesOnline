import { MatDialog } from '@angular/material/dialog';
import { ComumService } from './../../services/comum.service';
import { Questao } from './../../models/questao';
import { Component, OnInit, Input } from '@angular/core';
import { Avaliacao } from 'src/app/models/avaliacao';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { InfoQuestaoComponent } from 'src/app/dialogs/info-questao/info-questao.component';
import { Associacao } from 'src/app/models/associacao';

@Component({
  selector: 'app-questao',
  templateUrl: './questao.component.html',
  styleUrls: ['./questao.component.css']
})
export class QuestaoComponent implements OnInit {
  @Input() avaliacao: Avaliacao;
  @Input() editavel: boolean;


  constructor(public comumService: ComumService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  // GERAL
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
  tipoQuestaoChanged(questao, novoTipo) {
    questao.tipo = novoTipo;
    if (this.comumService.questaoTipos[novoTipo].nome == "Entrega") {
      this.tipoArquivoChanged(questao, 'Todos');
    }
  }

  // Alternativa
  removerAlternativa(questao, alternativaIndesejadaIndex) {
    questao.alternativas.splice(alternativaIndesejadaIndex, 1);
  }
  addAlternativa(questao, novaAlternativInput) {
    questao.alternativas.push({ texto: novaAlternativInput.value, correta: false, selecionada: false });
    novaAlternativInput.value = "";
  }
  onNovaAlterKeyUp(event, questao, novaAlternativInput) {

    if (event.key == 'Enter' && event.ctrlKey) {
      this.addAlternativa(questao, novaAlternativInput);
    }
  }

  // Associacao
  removerAssociacao(questao, associacaoIndesejadaIndex) {
    questao.associacoes.splice(associacaoIndesejadaIndex, 1);
  }
  addAssociacao(questao, novaAssociacaoInput, novaAssociacaoOpcaoInput) {
    questao.associacoes.push({
      texto: novaAssociacaoInput.value,
      opcaoCorreta: novaAssociacaoOpcaoInput.value,
      opcaoSelecionada: ""
    });
    novaAssociacaoInput.value = "";
    novaAssociacaoOpcaoInput.value = "";
  }
  onNovaAssocKeyUp(event, questao, novaAssociacaoInput, novaAssociacaoOpcaoInput) {
    if (event.key == 'Enter' && event.ctrlKey) {
      this.addAssociacao(questao, novaAssociacaoInput, novaAssociacaoOpcaoInput);
    }
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

  openInfoQuestao(questao) {
    this.dialog.open(InfoQuestaoComponent, {
      width: '80%',
      data: questao
    });
  }

}
