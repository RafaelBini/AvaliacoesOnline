import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Avaliacao } from 'src/app/models/avaliacao';
import { ComumService } from 'src/app/services/comum.service';

@Component({
  selector: 'app-compartilhar-avaliacao',
  templateUrl: './compartilhar-avaliacao.component.html',
  styleUrls: ['./compartilhar-avaliacao.component.css']
})
export class CompartilharAvaliacaoComponent implements OnInit {

  @Input() avaliacao: Avaliacao;
  private COPY_TEXT = "Copiar o link"
  public copyBtnText = this.COPY_TEXT;


  constructor(
    public comumService: ComumService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
  }


  getLink() {
    return `http://${this.comumService.getHostName()}/${this.avaliacao.id}`;
  }

  getShareWhatsapp() {
    return `https://wa.me/?text=${encodeURI(`${this.avaliacao.professorNome} está convidando você para participar da avaliação *${this.avaliacao.titulo}* online.\n\nEntrar na avaliação:\n${this.getLink()}`)
      }`;
  }

  notificarCopy() {
    this.snack.open("Link copiado!", null, { duration: 3500 });
    this.copyBtnText = "Copiado!";
    setTimeout(() => {
      this.copyBtnText = this.COPY_TEXT;
    }, 3650)
  }


}
