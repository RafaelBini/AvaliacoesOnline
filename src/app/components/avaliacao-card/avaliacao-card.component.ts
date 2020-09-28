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

  constructor(public comumService: ComumService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.status = this.comumService.statusAvaliacao[this.avaliacao.status];
  }

  deletar(avaliacao) {
    const dialgogRef = this.dialog.open(ConfirmarComponent, {
      data: {
        mensagem: "Você tem certeza de que deseja excluir essa avaliação?",
        mensagem2: "Não será possível recuperar a avaliação após exluir."
      }
    });
    dialgogRef.afterClosed().subscribe(result => {
      if (result == true) {
        console.log("EXCLUIR");
      }
    });
  }

  arquivar(avaliacao) {
    avaliacao.isArquivada = true;
  }

  desarquivar(avaliacao) {
    avaliacao.isArquivada = false;
  }


}
