import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-avaliacao-correcao',
  templateUrl: './avaliacao-correcao.component.html',
  styleUrls: ['./avaliacao-correcao.component.css']
})
export class AvaliacaoCorrecaoComponent implements OnInit {

  constructor(public route: ActivatedRoute) { }
  public tipo = "professor";

  ngOnInit(): void {
    this.route.url.subscribe((value) => {
      this.tipo = value[0].path;
    })

  }

}
