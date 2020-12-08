import { Component, Input, OnInit } from '@angular/core';
import { Questao } from 'src/app/models/questao';

@Component({
  selector: 'app-questao-resposta-consulta',
  templateUrl: './questao-resposta-consulta.component.html',
  styleUrls: ['./questao-resposta-consulta.component.css']
})
export class QuestaoRespostaConsultaComponent implements OnInit {

  @Input() questao: Questao;

  constructor() { }

  ngOnInit(): void {
  }

  getOpcoesPreencherAtivas(questao: Questao) {
    return questao.opcoesParaPreencher.concat().filter(opcao => opcao.ativa).sort((a, b) => a.opcaoSelecionada > b.opcaoSelecionada ? 1 : -1);
  }

}
