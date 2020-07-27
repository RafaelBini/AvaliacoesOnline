import { AvaliacaoCriadaDialogComponent } from './../../dialogs/avaliacao-criada-dialog/avaliacao-criada-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-avaliacao-nova',
  templateUrl: './avaliacao-nova.component.html',
  styleUrls: ['./avaliacao-nova.component.css']
})
export class AvaliacaoNovaComponent implements OnInit {

  constructor(public router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  finalizar() {
    this.router.navigate(['/professor']);
    this.dialog.open(AvaliacaoCriadaDialogComponent);
  }


}
