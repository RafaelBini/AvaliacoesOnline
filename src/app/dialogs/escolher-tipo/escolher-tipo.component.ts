import { ComumService } from './../../services/comum.service';
import { Avaliacao } from './../../models/avaliacao';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-escolher-tipo',
  templateUrl: './escolher-tipo.component.html',
  styleUrls: ['./escolher-tipo.component.css']
})
export class EscolherTipoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EscolherTipoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public comumService: ComumService) { }


  ngOnInit(): void {

  }


  selectParesChange(opcaoSelecionada: string) {
    if (!isNaN(+opcaoSelecionada)) {
      this.data.avaliacao.correcaoParesQtdNumero = Number(opcaoSelecionada);
    }
    else if (opcaoSelecionada == "DEFINIR") {
      this.data.avaliacao.correcaoParesQtdNumero = 6;
    }
    else if (opcaoSelecionada == "TODOS") {
      this.data.avaliacao.correcaoParesQtdNumero = null;
    }
  }
}
