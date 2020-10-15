import { Component, OnInit, Input, Output, EventEmitter, ValueSansProvider } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {

  @Input() mensagem: string = 'TEMPO RESTANTE';

  @Input() tipoAcesso: string = 'aluno';

  @Input() dataObjetivo: string = "2020-09-05T13:55:30.000Z";

  @Output() tempoEsgotado = new EventEmitter<void>();

  public tempoRestante: string = "-";
  interval;

  constructor() { }

  ngOnInit(): void {
    this.iniciarTimer();
  }

  iniciarTimer() {
    if (this.interval != null)
      clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.tempoRestante = this.getTempoRestante();
      if (this.tempoRestante == '-') {
        this.tempoEsgotado.emit();
        clearInterval(this.interval);
      }
    }, 1000);
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
      var horaFloor = Math.floor(HORAS);
      var minutos = Math.round(60 * (HORAS - horaFloor)).toString();
      return `${horaFloor} h ${minutos} min`;
    }
    else if (TEMPO_RESTANTE <= 604800000) {
      return `${Math.round(TEMPO_RESTANTE / 86400000)} dia(s)`;
    }
    else if (TEMPO_RESTANTE <= 2592000000) {
      return `${Math.round(TEMPO_RESTANTE / 604800000)} semana(s)`;
    }
    else {
      return `${Math.round(TEMPO_RESTANTE / 2592000000)} mese(s)`;
    }
  }

}
