import { MatSnackBar } from '@angular/material/snack-bar';
import { ProvaService } from './../../services/prova.service';
import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import { Avaliacao } from 'src/app/models/avaliacao';
import { MatDialog } from '@angular/material/dialog';
import { ComumService } from '../../services/comum.service';
import { Component, OnInit, Input } from '@angular/core';
import { ConfirmarComponent } from 'src/app/dialogs/confirmar/confirmar.component';

@Component({
  selector: 'app-avaliacao-card',
  templateUrl: './avaliacao-card.component.html',
  styleUrls: ['./avaliacao-card.component.css']
})
export class AvaliacaoCardComponent implements OnInit {

  @Input() public avaliacao: Avaliacao;
  @Input() public tipoAcesso;
  public status;

  constructor(public comumService: ComumService,
    private avaliacaoService: AvaliacaoService,
    private provaService: ProvaService,
    public dialog: MatDialog,
    private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.status = this.comumService.statusAvaliacao[this.avaliacao.status];
  }

  deletar(avaliacao: Avaliacao) {
    const dialgogRef = this.dialog.open(ConfirmarComponent, {
      data: {
        titulo: "Excluir avaliação",
        mensagem: "Você tem certeza de que deseja excluir essa avaliação?",
        mensagem2: "Não será possível recuperar a avaliação após exluir."
      }
    });
    dialgogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.avaliacaoService.deletarAvaliacao(avaliacao.id).then(() => {
          this.snack.open("Avaliação excluida com sucesso.", null, { duration: 3500 });
          avaliacao.isArquivada = true;
          const dialgogRef2 = this.dialog.open(ConfirmarComponent, {
            data: {
              titulo: "Excluir questões",
              mensagem: "Você deseja excluir as questões dessa avaliação?",
              mensagem2: "Não será possível usar as questões dessa avaliação em outras avaliações após excluir."
            }
          });
          dialgogRef2.afterClosed().subscribe(result => {

            if (result == true) {

              this.provaService.getProvasFromAvaliacao(avaliacao.id).then(provas => {

                for (let prova of provas) {
                  this.provaService.deletarProva(prova);
                }

                this.snack.open("Questões excluidas com sucesso.", null, { duration: 3500 });
              });

            }
            else {
              this.provaService.getProvasFromAvaliacao(avaliacao.id).then(provas => {

                for (let prova of provas) {
                  if (prova.isGabarito == false)
                    this.provaService.deletarProva(prova);
                }

                this.snack.open("Questões excluidas com sucesso.", null, { duration: 3500 });
              });
            }

          });
        });
      }
    });
  }

  arquivar(avaliacao) {
    avaliacao.isArquivada = true;
    this.avaliacaoService.arquivarAvaliacao(avaliacao.id);
  }

  desarquivar(avaliacao) {
    avaliacao.isArquivada = false;
    this.avaliacaoService.desarquivarAvaliacao(avaliacao.id);
  }

  getLink(avaliacao) {
    return `http://${this.comumService.getHostName()}/${avaliacao.id}`;
  }
  notificarCopy() {
    this.snack.open("Link copiado!", null, { duration: 3500 })
  }

}
