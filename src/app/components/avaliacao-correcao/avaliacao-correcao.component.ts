import { Avaliacao } from 'src/app/models/avaliacao';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UrlNode } from 'src/app/models/url-node';

@Component({
  selector: 'app-avaliacao-correcao',
  templateUrl: './avaliacao-correcao.component.html',
  styleUrls: ['./avaliacao-correcao.component.css']
})
export class AvaliacaoCorrecaoComponent implements OnInit {

  constructor(public route: ActivatedRoute) { }
  public tipo = "professor";

  public avaliacao = {
    id: "01",
    titulo: "Avaliacao 01"
  }

  public caminho: Array<UrlNode> = [
    { nome: `Professor`, url: `/professor` },
    { nome: `Avaliações`, url: `/professor` },
    { nome: `${this.avaliacao.titulo}`, url: `/professor/avaliacao/${this.avaliacao.id}` },
    { nome: `${this.avaliacao.titulo}`, url: `#` },
  ];

  ngOnInit(): void {
    this.route.url.subscribe((value) => {
      this.tipo = value[0].path;
    })

  }

}
