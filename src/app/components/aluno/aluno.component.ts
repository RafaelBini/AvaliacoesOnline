import { CredencialService } from './../../services/credencial.service';
import { ComumService } from './../../services/comum.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlNode } from 'src/app/models/url-node';
import { Avaliacao } from 'src/app/models/avaliacao';

@Component({
  selector: 'app-aluno',
  templateUrl: './aluno.component.html',
  styleUrls: ['./aluno.component.css']
})
export class AlunoComponent implements OnInit {
  public alterar = false;
  public mostrarArquivadas = false;
  public selectedTab = 0;
  public avaliacoesFiltradas: Array<Avaliacao>;
  public avaliacoes: Array<Avaliacao> = [
    {
      id: "0000001",
      titulo: "DS553 - Engenharia de Software",
      descricao: "Avaliacao de teste",
      status: 2,
      dtInicio: '31/07/2020 18:00',
      dtTermino: '01/08/2020 18:00',
      tags: [
        'Avaliação 01',
        'Tarde'
      ],

    },
    {
      id: "0000002",
      titulo: "DS553 - Engenharia de Software",
      descricao: "Uma avaliação para Teste",
      status: 3,
      dtInicio: '31/07/2020 18:00',
      dtTermino: '01/08/2020 18:00',
      tags: [
        'Avaliação 02',
        'Tarde'
      ]
    },
    {
      id: "0000003",
      titulo: "DS330 - Bancos de Dados I",
      descricao: "Uma avaliação para Teste",
      status: 0,
      dtInicio: '31/07/2020 18:00',
      dtTermino: '01/08/2020 18:00',
      tags: [
        'Avaliação 01',
        'Noite'
      ]
    },
    {
      id: "0000004",
      titulo: "DS330 - Bancos de Dados II",
      descricao: "Uma avaliação para Teste",
      status: 0,
      dtInicio: '31/07/2020 18:00',
      dtTermino: '01/08/2020 18:00',
      tags: [
        'Avaliação 02',
        'Noite'
      ]
    },
    {
      id: "0000005",
      titulo: "DS330 - Bancos de Dados II",
      descricao: "Uma avaliação para Teste",
      status: 1,
      dtInicio: '31/07/2020 18:00',
      dtTermino: '01/08/2020 18:00',
      tags: [
        'Avaliação 02',
        'Tarde'
      ]
    },
  ];

  public tabs = [
    { id: "avaliacoes", nome: "Avaliação" },
    { id: "perfil", nome: "Meu Perfil" }
  ]

  public caminho: Array<UrlNode> = [
    { nome: `Aluno`, url: `/aluno` },
    { nome: this.tabs[0].nome, url: "#" }
  ];

  constructor(public comumService: ComumService, public credencialService: CredencialService, public route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    if (!this.credencialService.estouLogado()) {
      this.router.navigate(['']);
      return;
    }

    this.route.params.subscribe(params => {
      if (params.tab) {
        const index = this.tabs.indexOf(this.tabs.filter(tab => tab.id == params.tab)[0]);
        this.selectedTab = index;
        this.caminho[1] = { nome: this.tabs[index].nome, url: `#` };
      }
      this.avaliacoesFiltradas = this.avaliacoes;

    });

  }

  tabAlterada(index) {

    this.router.navigate([`/aluno/${this.tabs[index].id}`]);
    this.caminho[1] = { nome: this.tabs[index].nome, url: `#` };
  }

  getTodasAvaliacoes() {
    return this.avaliacoesFiltradas.concat().filter(avaliacao => (!avaliacao.isArquivada || this.mostrarArquivadas));
  }

}
