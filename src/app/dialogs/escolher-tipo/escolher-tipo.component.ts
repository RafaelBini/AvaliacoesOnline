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

  selecionarCorrecao(codigoCorrecao) {
    this.data.avaliacao.tipoCorrecao = codigoCorrecao;
    const CODIGO_CORRECAO_AUTOMATICA = 1;
    const CODIGO_QUESTAO_DISSERTATIVA = 1;
    const CODIGO_QUESTAO_ENTREGA = 2;
    const CODIGO_QUESTAO_V_F_COM_JUSTIFICATIVA = 7;

    const CODIGO_QUESTAO_V_F_SEM_JUSTIFICATIVA = 6;
    const CODIGO_QUESTAO_MULTIPLAESCOLHA = 4;


    if (codigoCorrecao == CODIGO_CORRECAO_AUTOMATICA)
      this.data.avaliacao.questoes.forEach(questao => {
        if (questao.tipo == CODIGO_QUESTAO_DISSERTATIVA || questao.tipo == CODIGO_QUESTAO_ENTREGA)
          questao.tipo = CODIGO_QUESTAO_MULTIPLAESCOLHA;
        else if (questao.tipo == CODIGO_QUESTAO_V_F_COM_JUSTIFICATIVA)
          questao.tipo = CODIGO_QUESTAO_V_F_SEM_JUSTIFICATIVA;
      });

  }

  selecionarDisposicao(codigoDisposicao) {
    this.data.avaliacao.tipoDisposicao = codigoDisposicao;
  }

  selecionarPontuacao(codigoPontuacao) {
    this.data.avaliacao.tipoPontuacao = codigoPontuacao;
  }
}
