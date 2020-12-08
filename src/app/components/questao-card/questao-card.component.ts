import { Avaliacao } from './../../models/avaliacao';
import { Questao } from './../../models/questao';
import { ComumService } from './../../services/comum.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-questao-card',
  templateUrl: './questao-card.component.html',
  styleUrls: ['./questao-card.component.css']
})
export class QuestaoCardComponent implements OnInit {

  @Input() questao: Questao;
  @Input() avaliacaoDaQuestao: Avaliacao;
  // @Output() questaoAdicionada = new EventEmitter<void>();

  constructor(
    public comumService: ComumService,
  ) { }

  ngOnInit(): void {
  }

  // adicionarNaAvaliacao() {
  //   this.questaoAdicionada.emit();
  // }

}
