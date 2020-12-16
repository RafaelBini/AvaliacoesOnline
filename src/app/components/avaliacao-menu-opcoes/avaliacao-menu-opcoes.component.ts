import { ExcluirAvaliacaoDialogComponent } from './../../dialogs/excluir-avaliacao-dialog/excluir-avaliacao-dialog.component';
import { CompartilharAvaliacaoDialogComponent } from './../../dialogs/compartilhar-avaliacao-dialog/compartilhar-avaliacao-dialog.component';
import { AvaliacaoCriadaDialogComponent } from './../../dialogs/avaliacao-criada-dialog/avaliacao-criada-dialog.component';
import { Avaliacao } from './../../models/avaliacao';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmarComponent } from 'src/app/dialogs/confirmar/confirmar.component';
import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import { ComumService } from 'src/app/services/comum.service';
import { ProvaService } from 'src/app/services/prova.service';
import { ExportarComponent } from 'src/app/dialogs/exportar/exportar.component';
import { EstatisticasAvaliacaoComponent } from 'src/app/dialogs/estatisticas-avaliacao/estatisticas-avaliacao.component';

@Component({
  selector: 'app-avaliacao-menu-opcoes',
  templateUrl: './avaliacao-menu-opcoes.component.html',
  styleUrls: ['./avaliacao-menu-opcoes.component.css']
})
export class AvaliacaoMenuOpcoesComponent implements OnInit {

  @Input() public avaliacao: Avaliacao;
  @Input() public tipoAcesso: 'professor' | 'aluno';
  @Input() public icone: string;

  constructor(
    public comumService: ComumService,
    public avaliacaoService: AvaliacaoService,
    private provaService: ProvaService,
    public dialog: MatDialog,
    private snack: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }


  deletar(avaliacao: Avaliacao) {
    const dialgogRef = this.dialog.open(ExcluirAvaliacaoDialogComponent);
    dialgogRef.afterClosed().subscribe(result => {
      if (result.excluirAvaliacao == true) {
        this.avaliacaoService.deletarAvaliacao(avaliacao.id).then(() => {

          if (result.excluirQuestoes == true) {

            this.provaService.getProvasFromAvaliacao(avaliacao.id).then(provas => {

              for (let prova of provas) {
                this.provaService.deletarProva(prova);
              }

              this.snack.open("Avaliação e questões excluidas com sucesso.", null, { duration: 3500 });

            });

          }
          else {
            this.provaService.getProvasFromAvaliacao(avaliacao.id).then(provas => {

              for (let prova of provas) {
                if (prova.isGabarito == false)
                  this.provaService.deletarProva(prova);
                else {
                  prova.avaliacaoExcluida = this.avaliacao;
                  this.provaService.updateProva(prova);
                }
              }

              this.snack.open("Avaliação excluida com sucesso.", null, { duration: 3500 });


            });
          }


        });
      }
    });
  }

  arquivar(avaliacao) {
    this.avaliacaoService.arquivarAvaliacao(avaliacao.id);
  }

  desarquivar(avaliacao) {

    this.avaliacaoService.desarquivarAvaliacao(avaliacao.id);
  }

  abirExport(avaliacao: Avaliacao) {
    this.dialog.open(ExportarComponent, {
      width: '80%',
      data: avaliacao,
    });
  }

  abrirEstatisticas(avaliacao: Avaliacao) {
    this.dialog.open(EstatisticasAvaliacaoComponent, {
      width: '85%',
      height: '90%',
      data: avaliacao,
    });
  }

  abrirConvidarAlunos() {
    this.dialog.open(CompartilharAvaliacaoDialogComponent, {
      data: this.avaliacao
    })
  }

}
