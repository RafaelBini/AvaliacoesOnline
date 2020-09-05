import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {

  @Input() mensagem: string = 'TEMPO RESTANTE';

  @Input() dataObjetivo: string = "2020-09-05T13:55:30.000Z";

  public tempoRestante: string = "-";

  constructor() { }

  ngOnInit(): void {

    var interval = setInterval(() => {
      this.tempoRestante = this.getTempoRestante();
      if (this.tempoRestante == '-') {
        clearInterval(interval);
      }
    }, 4000)
  }

  getTempoRestante(): string {
    const DATA_OBJETIVO = new Date(this.dataObjetivo);
    const AGORA = new Date();

    const TEMPO_RESTANTE = DATA_OBJETIVO.getTime() - AGORA.getTime();

    if (TEMPO_RESTANTE <= 1000) {
      return "-";
    }
    else if (TEMPO_RESTANTE <= 60000) {
      return `${Math.round(TEMPO_RESTANTE / 1000)} seg`;
    }
    else if (TEMPO_RESTANTE <= 3600000) {
      return `${Math.round(TEMPO_RESTANTE / 60000)} min`;
    }
    else if (TEMPO_RESTANTE <= 86400000) {
      const HORAS = TEMPO_RESTANTE / 3600000;
      return `${Math.round(HORAS)} h ${Math.round(60 * (HORAS - Math.round(HORAS)))} min`;
    }
    else if (TEMPO_RESTANTE <= 604800000) {
      return `${Math.round(TEMPO_RESTANTE / 86400000)} dias`;
    }
    else if (TEMPO_RESTANTE <= 2592000000) {
      return `${Math.round(TEMPO_RESTANTE / 604800000)} semanas`;
    }
    else {
      return `${Math.round(TEMPO_RESTANTE / 2592000000)} meses`;
    }
  }

}
