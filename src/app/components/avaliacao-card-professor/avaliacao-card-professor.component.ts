import { ComumService } from './../../services/comum.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-avaliacao-card-professor',
  templateUrl: './avaliacao-card-professor.component.html',
  styleUrls: ['./avaliacao-card-professor.component.css']
})
export class AvaliacaoCardProfessorComponent implements OnInit {

  @Input()
  public avaliacao;
  public status;

  constructor(public comumService: ComumService) { }

  ngOnInit(): void {
    this.status = this.comumService.statusAvaliacao[this.avaliacao.status];
  }

}
