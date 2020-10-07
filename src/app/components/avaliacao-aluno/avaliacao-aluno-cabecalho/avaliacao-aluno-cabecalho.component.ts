import { ComumService } from 'src/app/services/comum.service';
import { Component, Input, OnInit } from '@angular/core';
import { Avaliacao } from 'src/app/models/avaliacao';

@Component({
  selector: 'app-avaliacao-aluno-cabecalho',
  templateUrl: './avaliacao-aluno-cabecalho.component.html',
  styleUrls: ['./avaliacao-aluno-cabecalho.component.css']
})
export class AvaliacaoAlunoCabecalhoComponent implements OnInit {
  @Input() avaliacao: Avaliacao;
  constructor(public comumService: ComumService) { }

  ngOnInit(): void {
  }

}
