import { Avaliacao } from './../../models/avaliacao';
import { ComumService } from './../../services/comum.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlunoNovoComponent } from './../aluno-novo/aluno-novo.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { UrlNode } from 'src/app/models/url-node';
import { CredencialService } from 'src/app/services/credencial.service';


@Component({
  selector: 'app-professor',
  templateUrl: './professor.component.html',
  styleUrls: ['./professor.component.css']
})
export class ProfessorComponent implements OnInit {

  public selectedTab = 0;

  public alunosSelecionados = [];
  public alunosFiltrados = [];
  public alunos = [
    { email: "godo@gmail.com", nome: "Godofredo", matricula: "grr20178700", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "rub@gmail.com", nome: "Ruberlinda", matricula: "grr20181110", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "cdnleon@outlook.com", nome: "Leon Martins", matricula: "grr20194580", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "nil@gmail.com", nome: "Nilce Moretto", matricula: "grr20171234", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "fredb12@hotmail.com", nome: "Fred Desimpedidos", matricula: "grr20184658", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "marilia@gmail.com", nome: "Marília Galvão", matricula: "grr20167755", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "bueno@gmail.com", nome: "Galvão Bueno", matricula: "grr20184848", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "alanzoka@hotmail.com", nome: "Alan Ferreira", matricula: "grr20178452", tags: ['Web II', 'Interação Humano Computador'] },
    { email: "balga@outlook.com", nome: "Mari Balga", matricula: "grr20196658", tags: ['LPOO II', 'DAC'] },
    { email: "clone@gmail.com", nome: "Henrique Grosse", matricula: "grr20184610", tags: ['Empreendedorismo e Inovação', 'Gestão Empresarial'] },
  ];


  public avaliacoes: Array<any> = [
    {
      id: "0000001",
      titulo: "DS250 - Interação Humano Computador",
      descricao: "Uma avaliação para Teste",
      status: 0,
      dtInicio: '31/07/2020 18:00',
      dtTermino: '01/08/2020 18:00',
      tags: [
        'Avaliação 01',
        'Tarde'
      ],

    },
    {
      id: "0000002",
      titulo: "DS250 - Interação Humano Computador",
      descricao: "Uma avaliação para Teste",
      status: 1,
      dtInicio: '31/07/2020 18:00',
      dtTermino: '01/08/2020 18:00',
      tags: [
        'Avaliação 02',
        'Tarde'
      ]
    },
    {
      id: "0000003",
      titulo: "DS250 - Interação Humano Computador",
      descricao: "Uma avaliação para Teste",
      status: 2,
      dtInicio: '31/07/2020 18:00',
      dtTermino: '01/08/2020 18:00',
      tags: [
        'Avaliação 01',
        'Noite'
      ]
    },
    {
      id: "0000004",
      titulo: "DS250 - Interação Humano Computador",
      descricao: "Uma avaliação para Teste",
      status: 3,
      dtInicio: '31/07/2020 18:00',
      dtTermino: '01/08/2020 18:00',
      tags: [
        'Avaliação 02',
        'Noite'
      ]
    },
    {
      id: "0000005",
      titulo: "DS130 - Web II",
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

  constructor(private dialog: MatDialog, public credencialService: CredencialService, private route: ActivatedRoute, private router: Router, public comumService: ComumService) { }

  ngOnInit(): void {
    this.credencialService.loggedUser.acesso = "Professor";
    this.route.params.subscribe(params => {
      if (params.tab) {
        const index = this.tabs.indexOf(this.tabs.filter(tab => tab.id == params.tab)[0]);
        this.selectedTab = index;
        this.caminho[1] = { nome: this.tabs[index].nome, url: `#` };
      }
    });
    this.alunosFiltrados = this.alunos;
  }

  // Geral
  tabAlterada(index) {
    this.router.navigate([`/professor/${this.tabs[index].id}`]);
    this.caminho[1] = { nome: this.tabs[index].nome, url: `#` };
  }



  // Alunos
  addAluno() {
    this.dialog.open(AlunoNovoComponent, {

    });
  }
  onBuscaAlunoKeyUp(texto: string) {
    this.alunosFiltrados = this.alunos.filter(aluno => {

      texto = this.comumService.normalizar(texto);
      var nome = this.comumService.normalizar(aluno.nome);
      var email = this.comumService.normalizar(aluno.email);

      if (nome.includes(texto))
        return true;

      if (email.includes(texto))
        return true;

      for (let parteTexto of texto.split(" ")) {
        if (nome.includes(parteTexto))
          return true;
      }

      if (aluno.tags != null) {
        for (let tag of aluno.tags) {
          if (this.comumService.normalizar(tag).includes(texto))
            return true;
        }
      }
      return false;
    });

  }
  selecionarTodos() {
    if (this.alunosFiltrados.length == this.alunosSelecionados.length) {
      this.alunosSelecionados = [];
    }
    else {
      this.alunosSelecionados = [];
      this.alunosFiltrados.forEach(aluno => {
        this.alunosSelecionados.push(aluno.email);
      })
    }

  }
  removerAlunosSelecionados() {

  }



}
