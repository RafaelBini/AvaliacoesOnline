import { UrlNode } from './../../models/url-node';
import { ComumService } from './../../services/comum.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-barra-navegacao',
  templateUrl: './barra-navegacao.component.html',
  styleUrls: ['./barra-navegacao.component.css']
})
export class BarraNavegacaoComponent implements OnInit {

  @Input() caminho: Array<UrlNode>;

  constructor(
    public comumService: ComumService,
    public router: Router,
  ) { }

  ngOnInit(): void {

  }


}
