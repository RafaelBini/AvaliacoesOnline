import { ComumService } from './../../services/comum.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlunoNovoComponent } from './../aluno-novo/aluno-novo.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { UrlNode } from 'src/app/models/url-node';
import { Avaliacao } from 'src/app/models/avaliacao';


@Component({
  selector: 'app-professor',
  templateUrl: './professor.component.html',
  styleUrls: ['./professor.component.css']
})
export class ProfessorComponent implements OnInit {
  public alterar = false;
  public selectedTab = 0;
  public agruparAvaliacoes = true;
  public selectedStatusTab = 0;

  public alunos = [
    { email: "godo@gmail.com", nome: "Godofredo", matricula: "grr20178700" },
    { email: "rub@gmail.com", nome: "Ruberlinda", matricula: "grr20181110" },
    { email: "cdnleon@outlook.com", nome: "Leon Martins", matricula: "grr20194580" },
    { email: "nil@gmail.com", nome: "Nilce Moretto", matricula: "grr20171234" },
    { email: "fredb12@hotmail.com", nome: "Fred Desimpedidos", matricula: "grr20184658" },
    { email: "marilia@gmail.com", nome: "Marília Galvão", matricula: "grr20167755" },
    { email: "bueno@gmail.com", nome: "Galvão Bueno", matricula: "grr20184848" },
    { email: "alanzoka@hotmail.com", nome: "Alan Ferreira", matricula: "grr20178452" },
    { email: "balga@outlook.com", nome: "Mari Balga", matricula: "grr20196658" },
    { email: "clone@gmail.com", nome: "Henrique Grosse", matricula: "grr20184610" },
  ];

  public avaliacoesFiltradas;
  public avaliacoes: Array<any> = [
    {
      id: "0000001",
      titulo: "Avaliação 01",
      descricao: "Uma avaliação para Teste",
      status: 0,
      dtInicio: '31/07/2020 18:00',
      dtTermino: '01/08/2020 18:00',
      tags: [
        'IHC',
        'Interação Humano Computador'
      ]
    },
    {
      id: "0000002",
      titulo: "Avaliação 02",
      descricao: "Uma avaliação para Teste",
      status: 1,
      dtInicio: '31/07/2020 18:00',
      dtTermino: '01/08/2020 18:00',
      tags: [
        'Web II'
      ]
    },
    {
      id: "0000003",
      titulo: "Avaliação 03",
      descricao: "Uma avaliação para Teste",
      status: 2,
      dtInicio: '31/07/2020 18:00',
      dtTermino: '01/08/2020 18:00',
    },
    {
      id: "0000004",
      titulo: "Avaliação 04",
      descricao: "Uma avaliação para Teste",
      status: 3,
      dtInicio: '31/07/2020 18:00',
      dtTermino: '01/08/2020 18:00',
    },
    {
      id: "0000005",
      titulo: "Avaliação 05",
      descricao: "Uma avaliação para Teste",
      status: 3,
      dtInicio: '31/07/2020 18:00',
      dtTermino: '01/08/2020 18:00',
    },
  ]

  private tabs = [
    { id: "avaliacoes", nome: "Avaliações" },
    { id: "alunos", nome: "Alunos" },
    { id: "perfil", nome: "Meu Perfil" },
    { id: "dashboard", nome: "Dashboard" }
  ]

  public caminho: Array<UrlNode> = [
    { nome: `Professor`, url: `/professor` },
    { nome: this.tabs[0].nome, url: `#` },
  ];

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router, public comumService: ComumService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.tab) {
        const index = this.tabs.indexOf(this.tabs.filter(tab => tab.id == params.tab)[0]);
        this.selectedTab = index;
        this.caminho[1] = { nome: this.tabs[index].nome, url: `#` };
      }
    });
    this.avaliacoesFiltradas = this.avaliacoes;
    this.selecionarStatusTabAdequada();
  }

  getStatusPorPrioridade() {
    return this.comumService.statusAvaliacao.concat().sort((a, b) => b.prioridade - a.prioridade);
  }

  getAvaliacoesNoStatus(status) {
    return this.avaliacoesFiltradas.concat().filter(avaliacao => avaliacao.status == status);
  }

  selecionarStatusTabAdequada() {
    for (let status of this.comumService.statusAvaliacao) {
      if (this.avaliacoesFiltradas.concat().filter(ava => ava.status == status.id).length > 0) {
        this.selectedStatusTab = status.id;
        return;
      }
    }
  }

  onBuscaKeyUp(texto: string) {
    this.avaliacoesFiltradas = this.avaliacoes.filter(avaliacao => {

      texto = this.comumService.normalizar(texto);
      var titulo = this.comumService.normalizar(avaliacao.titulo);
      var descricao = this.comumService.normalizar(avaliacao.descricao);

      if (titulo.includes(texto))
        return true;

      if (descricao.includes(texto))
        return true;

      for (let parteTitulo of titulo.split(" ")) {
        if (parteTitulo.includes(texto))
          return true;
      }

      if (avaliacao.tags != null) {
        for (let tag of avaliacao.tags) {
          if (this.comumService.normalizar(tag).includes(texto))
            return true;
        }
      }


      return false;

    });
    this.selecionarStatusTabAdequada();
  }

  tabAlterada(index) {
    this.router.navigate([`/professor/${this.tabs[index].id}`]);
    this.caminho[1] = { nome: this.tabs[index].nome, url: `#` };
  }

  addAluno() {
    this.dialog.open(AlunoNovoComponent, {

    });
  }



}
