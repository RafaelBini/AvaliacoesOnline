import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-excluir-avaliacao-dialog',
  templateUrl: './excluir-avaliacao-dialog.component.html',
  styleUrls: ['./excluir-avaliacao-dialog.component.css']
})
export class ExcluirAvaliacaoDialogComponent implements OnInit {

  constructor() { }

  public excluirQuestoes: boolean = true;


  ngOnInit(): void {
  }

}
