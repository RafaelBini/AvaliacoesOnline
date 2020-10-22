import { ComumService } from './../../services/comum.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cronometro',
  templateUrl: './cronometro.component.html',
  styleUrls: ['./cronometro.component.css']
})
export class CronometroComponent implements OnInit {

  @Input() tipoAcesso: string = 'aluno';

  @Input() dataInicio: string = "2020-09-05T13:55:30.000Z";

  public tempoDecorrido: string = "indeterminado";

  private interval;

  constructor(
    private comumService: ComumService,
  ) { }

  ngOnInit(): void {
    this.iniciarTimer();
  }

  iniciarTimer() {

    if (this.interval != null)
      clearInterval(this.interval);

    this.interval = setInterval(() => {
      this.tempoDecorrido = this.getTempoDecorrido();
    }, 1000);

  }

  pararCronometro() {
    console.log("parando cronometro");
    if (this.interval)
      clearInterval(this.interval);
    this.tempoDecorrido = 'indeterminado';
  }

  getTempoDecorrido() {
    if (this.dataInicio == null) {
      return 'indeterminado';
    }
    const DATA_INICIO = new Date(this.dataInicio);
    const AGORA = new Date();

    const TEMPO_DECORRIDO = AGORA.getTime() - DATA_INICIO.getTime();

    return this.comumService.getPeriodoAmigavel(TEMPO_DECORRIDO);
  }

}
