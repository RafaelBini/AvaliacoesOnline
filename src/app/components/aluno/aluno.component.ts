import { CredencialService } from './../../services/credencial.service';
import { ComumService } from './../../services/comum.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlNode } from 'src/app/models/url-node';
import { Avaliacao } from 'src/app/models/avaliacao';
import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import { AvaliacaoListaComponent } from '../avaliacao-lista/avaliacao-lista.component';

@Component({
  selector: 'app-aluno',
  templateUrl: './aluno.component.html',
  styleUrls: ['./aluno.component.css']
})
export class AlunoComponent implements OnInit {
  public alterar = false;
  public mostrarArquivadas = false;
  public selectedTab = 0;
  public avaliacoes: Array<Avaliacao> = [];

  public tabs = [
    { id: "avaliacoes", nome: "Avaliação" },
    { id: "perfil", nome: "Meu Perfil" }
  ]

  public caminho: Array<UrlNode> = [
    { nome: `Aluno`, url: `/aluno` },
    { nome: this.tabs[0].nome, url: "#" }
  ];

  @ViewChild(AvaliacaoListaComponent) avaliacaoLista: AvaliacaoListaComponent;

  constructor(public comumService: ComumService,
    public credencialService: CredencialService,
    private avaliacaoService: AvaliacaoService,
    public route: ActivatedRoute,
    private router: Router) { }

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
    });

    this.avaliacaoService.getAvaliacoesFromAluno(this.credencialService.getLoggedUserIdFromCookie()).then(avaliacoes => {
      this.avaliacaoLista.avaliacoes = avaliacoes;
      this.avaliacaoLista.atualizarAvaliacoesFiltradas();
    })
      .catch(reason => {
        this.comumService.notificarErro("Falha ao buscar avaliações", reason);
      });

  }

  tabAlterada(index) {

    this.router.navigate([`/aluno/${this.tabs[index].id}`]);
    this.caminho[1] = { nome: this.tabs[index].nome, url: `#` };
  }


}
