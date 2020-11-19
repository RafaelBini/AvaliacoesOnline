import { Avaliacao } from './../../models/avaliacao';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComumService } from 'src/app/services/comum.service';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-exportar',
  templateUrl: './exportar.component.html',
  styleUrls: ['./exportar.component.css']
})
export class ExportarComponent implements OnInit {

  constructor(
    private comumService: ComumService,
    @Inject(MAT_DIALOG_DATA) public avaliacao: Avaliacao,
  ) { }

  ngOnInit(): void {
  }

  baixarCSV() {
    var notas = [
      ["Nome", "ID EXTERNO", "Nota", "Valor"],
    ];

    for (let grupo of this.avaliacao.grupos) {
      var nota = grupo.notaTotal;
      var valor = grupo.valorTotal;

      for (let aluno of grupo.alunos) {
        if (this.avaliacao.tipoDisposicao == 0) {
          nota = aluno.notaTotal;
          valor = aluno.valorTotal;
        }

        if (aluno.tagIdExterno)
          notas[0][1] = aluno.tagIdExterno;

        notas.push([
          aluno.nome || "",
          aluno.idExterno || "",
          (nota || 0).toString(),
          (valor || 0).toString(),
        ]);

      }


    }

    this.comumService.downloadCSV(notas, this.avaliacao.titulo);
  }

}
