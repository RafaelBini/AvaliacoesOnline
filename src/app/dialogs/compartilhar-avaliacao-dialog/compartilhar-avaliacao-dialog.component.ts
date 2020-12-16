import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Avaliacao } from 'src/app/models/avaliacao';

@Component({
  selector: 'app-compartilhar-avaliacao-dialog',
  templateUrl: './compartilhar-avaliacao-dialog.component.html',
  styleUrls: ['./compartilhar-avaliacao-dialog.component.css']
})
export class CompartilharAvaliacaoDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public avaliacao: Avaliacao,
  ) { }

  ngOnInit(): void {
  }

}
