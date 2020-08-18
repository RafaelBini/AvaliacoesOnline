import { ActivatedRoute, Router } from '@angular/router';
import { AlunoNovoComponent } from './../aluno-novo/aluno-novo.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { UrlNode } from 'src/app/models/url-node';


@Component({
  selector: 'app-professor',
  templateUrl: './professor.component.html',
  styleUrls: ['./professor.component.css']
})
export class ProfessorComponent implements OnInit {
  public alterar = false;
  public selectedTab = 0;

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

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.tab) {
        const index = this.tabs.indexOf(this.tabs.filter(tab => tab.id == params.tab)[0]);
        this.selectedTab = index;
        this.caminho[1] = { nome: this.tabs[index].nome, url: `#` };
      }
    });
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
