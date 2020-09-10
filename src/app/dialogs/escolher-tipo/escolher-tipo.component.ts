import { ConfirmarComponent } from './../confirmar/confirmar.component';
import { ComumService } from './../../services/comum.service';
import { Avaliacao } from './../../models/avaliacao';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-escolher-tipo',
  templateUrl: './escolher-tipo.component.html',
  styleUrls: ['./escolher-tipo.component.css']
})
export class EscolherTipoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EscolherTipoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public comumService: ComumService, private dialog: MatDialog) { }
  public codigoPontuacaoSelecionado: number;
  public codigoDisposicaoSelecionado: number;
  public codigoCorrecaoSelecionado: number;

  ngOnInit(): void {
    this.codigoPontuacaoSelecionado = this.data.avaliacao.tipoPontuacao;
    this.codigoDisposicaoSelecionado = this.data.avaliacao.tipoPontuacao;
    this.codigoCorrecaoSelecionado = this.data.avaliacao.tipoPontuacao;
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
    this.codigoCorrecaoSelecionado = codigoCorrecao;
  }

  selecionarDisposicao(codigoDisposicao) {
    this.codigoDisposicaoSelecionado = codigoDisposicao;
  }

  selecionarPontuacao(codigoPontuacao) {
    this.codigoPontuacaoSelecionado = codigoPontuacao;

  }

  adaptarQuestoesParaCorrecaoAutomatica() {
    const CODIGO_QUESTAO_DISSERTATIVA = 1;
    const CODIGO_QUESTAO_ENTREGA = 2;
    const CODIGO_QUESTAO_V_F_COM_JUSTIFICATIVA = 7;

    const CODIGO_QUESTAO_V_F_SEM_JUSTIFICATIVA = 6;
    const CODIGO_QUESTAO_MULTIPLAESCOLHA = 4;

    this.data.avaliacao.questoes.forEach(questao => {
      if (questao.tipo == CODIGO_QUESTAO_DISSERTATIVA || questao.tipo == CODIGO_QUESTAO_ENTREGA)
        questao.tipo = CODIGO_QUESTAO_MULTIPLAESCOLHA;
      else if (questao.tipo == CODIGO_QUESTAO_V_F_COM_JUSTIFICATIVA)
        questao.tipo = CODIGO_QUESTAO_V_F_SEM_JUSTIFICATIVA;
    });
  }

  escolher() {
    if (this.data.tipoEscolhido == 'pontuacao') {
      if (this.comumService.pontuacoes[this.codigoPontuacaoSelecionado].correcaoAutomatica && !this.comumService.podeSerDeCorrecaoAutomatica(this.data.avaliacao)) {

        const ref = this.dialog.open(ConfirmarComponent, {
          data: {
            mensagem: "Você deseja alterar mesmo assim?",
            mensagem2: "Ao mudar para esse tipo de pontuação, algumas questões terão seu tipo alteradas. Ex.: Dissertativas se tornarão multipla escolha."
          }
        });
        ref.afterClosed().subscribe((result) => {

          if (result != true)
            return;

          this.adaptarQuestoesParaCorrecaoAutomatica();

          this.data.avaliacao.tipoPontuacao = this.codigoPontuacaoSelecionado;
        });

      }
      else {
        this.data.avaliacao.tipoPontuacao = this.codigoPontuacaoSelecionado;
      }
    }
    else if (this.data.tipoEscolhido == 'disposicao') {
      this.data.avaliacao.tipoDisposicao = this.codigoDisposicaoSelecionado;
    }
    else if (this.data.tipoEscolhido == 'correcao') {
      if (this.comumService.correcoes[this.codigoCorrecaoSelecionado].correcaoAutomatica && !this.comumService.podeSerDeCorrecaoAutomatica(this.data.avaliacao)) {

        const ref = this.dialog.open(ConfirmarComponent, {
          data: {
            mensagem: "Você deseja alterar mesmo assim?",
            mensagem2: "Ao mudar para esse tipo de correção, algumas questões terão seu tipo alteradas. Ex.: Dissertativas se tornarão multipla escolha."
          }
        });
        ref.afterClosed().subscribe((result) => {

          if (result != true)
            return;

          this.adaptarQuestoesParaCorrecaoAutomatica();

          this.data.avaliacao.tipoCorrecao = this.codigoCorrecaoSelecionado;
        });

      }
      else {
        this.data.avaliacao.tipoCorrecao = this.codigoCorrecaoSelecionado;
      }
    }
  }

}
