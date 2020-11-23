import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-layout-maker',
  templateUrl: './layout-maker.component.html',
  styleUrls: ['./layout-maker.component.css']
})
export class LayoutMakerComponent implements OnInit {


  @Input() colunasOpcoes: string[];
  @Input() colunasSelecionadas: string[];
  @Output() colunasAlteradas = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {

  }

  onChange(event) {
    this.colunasAlteradas.emit({
      colunas: this.colunasSelecionadas
    });
  }

  changeColumnPosition(actualIndex, delta) {
    var temp = this.colunasOpcoes[actualIndex + delta];
    this.colunasOpcoes[actualIndex + delta] = this.colunasOpcoes[actualIndex];
    this.colunasOpcoes[actualIndex] = temp;
    var colunasOrdenadas = [];
    for (let colunaOpcao of this.colunasOpcoes) {
      if (this.colunasSelecionadas.includes(colunaOpcao))
        colunasOrdenadas.push(colunaOpcao);
    }
    this.colunasSelecionadas = colunasOrdenadas;
    this.onChange(null);
  }



}
