import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ordenar-avaliacoes-dialog',
  templateUrl: './ordenar-avaliacoes-dialog.component.html',
  styleUrls: ['./ordenar-avaliacoes-dialog.component.css']
})
export class OrdenarAvaliacoesDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public tipo,
  ) { }



  ngOnInit(): void {

  }

}
