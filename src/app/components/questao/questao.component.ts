import { MatDialog } from '@angular/material/dialog';
import { ComumService } from './../../services/comum.service';
import { Questao } from './../../models/questao';
import { Component, OnInit, Input } from '@angular/core';
import { Avaliacao } from 'src/app/models/avaliacao';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { InfoQuestaoComponent } from 'src/app/dialogs/info-questao/info-questao.component';

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

  addAlternativa(questaoIndex, novaAlternativInput) {
    this.avaliacao.questoes[questaoIndex].alternativas.push({ texto: novaAlternativInput.value, correta: false, selecionada: false });
    novaAlternativInput.value = "";
  }
  onNovaAlterKeyUp(event, questaoIndex, novaAlternativInput) {

    if (event.key == 'Enter' && event.ctrlKey) {
      this.addAlternativa(questaoIndex, novaAlternativInput);
    }
  }

  openInfoQuestao(questao) {
    this.dialog.open(InfoQuestaoComponent, {
      width: '80%',
      data: questao
    });
  }

}
