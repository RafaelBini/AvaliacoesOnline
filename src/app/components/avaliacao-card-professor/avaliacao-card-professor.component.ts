import { MatDialog } from '@angular/material/dialog';
import { ComumService } from './../../services/comum.service';
import { Component, OnInit, Input } from '@angular/core';
import { ConfirmarComponent } from 'src/app/dialogs/confirmar/confirmar.component';

@Component({
  selector: 'app-avaliacao-card-professor',
  templateUrl: './avaliacao-card-professor.component.html',
  styleUrls: ['./avaliacao-card-professor.component.css']
})
export class AvaliacaoCardProfessorComponent implements OnInit {

  @Input()
  public avaliacao;
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

}