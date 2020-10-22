import { ComumService } from './../../services/comum.service';
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

  public tempoRestante: string = "indeterminado";
  interval;

  constructor(
    private comumService: ComumService
  ) { }

  ngOnInit(): void {
    this.iniciarTimer();
  }

  iniciarTimer() {
    if (this.interval != null)
      clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.tempoRestante = this.getTempoRestante();
      if (this.tempoRestante == 'indeterminado') {
        this.tempoEsgotado.emit();
        clearInterval(this.interval);
      }
    }, 1000);
  }

  getTempoRestante(): string {
    if (this.dataObjetivo == null)
      return 'indeterminado';

    const DATA_OBJETIVO = new Date(this.dataObjetivo);
    const AGORA = new Date();

    const TEMPO_RESTANTE = DATA_OBJETIVO.getTime() - AGORA.getTime();

    return this.comumService.getPeriodoAmigavel(TEMPO_RESTANTE);
  }

}
