import { MatSnackBar } from '@angular/material/snack-bar';
import { ComumService } from 'src/app/services/comum.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-avaliacao-criada-dialog',
  templateUrl: './avaliacao-criada-dialog.component.html',
  styleUrls: ['./avaliacao-criada-dialog.component.css']
})
export class AvaliacaoCriadaDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public avaliacaoId: string,
    public comumService: ComumService, private snack: MatSnackBar) { }

  ngOnInit(): void {

  }

  getLink() {
    return `http://${this.comumService.getHostName()}/${this.avaliacaoId}`;
  }

  notificarCopy() {
    this.snack.open("Link copiado!", null, { duration: 3500 })
  }

}
