import { EstatisticasAvaliacaoComponent } from './../../dialogs/estatisticas-avaliacao/estatisticas-avaliacao.component';
import { ExportarComponent } from './../../dialogs/exportar/exportar.component';
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
    public avaliacaoService: AvaliacaoService,
    private provaService: ProvaService,
    public dialog: MatDialog,
    private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.status = this.comumService.statusAvaliacao[this.avaliacao.status];
  }


  getLink(avaliacao) {
    return `http://${this.comumService.getHostName()}/${avaliacao.id}`;
  }
  notificarCopy() {
    this.snack.open("Link copiado!", null, { duration: 3500 })
  }

  desarquivar(avaliacao) {

    this.avaliacaoService.desarquivarAvaliacao(avaliacao.id);
  }



}
