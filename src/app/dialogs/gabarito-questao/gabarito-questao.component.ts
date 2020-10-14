import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Prova } from 'src/app/models/prova';
import { Questao } from 'src/app/models/questao';

@Component({
  selector: 'app-gabarito-questao',
  templateUrl: './gabarito-questao.component.html',
  styleUrls: ['./gabarito-questao.component.css']
})
export class GabaritoQuestaoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public questao: Questao) { }



  ngOnInit(): void {

  }

  getOpcoesPreencherAtivas(questao: Questao) {
    return questao.opcoesParaPreencher.concat().filter(opcao => opcao.ativa).sort((a, b) => a.texto > b.texto ? 1 : -1);
  }

}
