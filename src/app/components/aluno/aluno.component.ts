import { Subscription } from 'rxjs/internal/Subscription';
import { CredencialService } from './../../services/credencial.service';
import { ComumService } from './../../services/comum.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
export class AlunoComponent implements OnInit, OnDestroy {
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

  private avaliacoesSubscription: Subscription;
  private verificacaoStatusInterval;

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

    // Começa a ouvir TODAS AVALIAÇÕES
    if (this.avaliacoesSubscription == null) {
      this.avaliacoesSubscription = this.avaliacaoService.onAllAvaliacoesChange().subscribe(avaliacoes => {

        const MEU_ID = this.credencialService.getLoggedUserIdFromCookie();

        var minhasAvaliacoes: Array<Avaliacao> = [];
        for (let avaliacao of avaliacoes as Avaliacao[]) {
          if (avaliacao.grupos.filter(grupo => grupo.alunos.filter(a => a.id == MEU_ID).length > 0).length > 0)
            minhasAvaliacoes.push(avaliacao);
        }

        this.avaliacaoLista.avaliacoes = minhasAvaliacoes;
        this.avaliacaoLista.atualizarAvaliacoesFiltradas();
      });
    }

    // Começa a verificar status
    if (this.verificacaoStatusInterval == null) {
      this.verificacaoStatusInterval = setInterval(() => {
        for (let avaliacao of this.avaliacaoLista.avaliacoes) {

          var statusAnterior = avaliacao.status;
          avaliacao.status = this.avaliacaoService.getStatusConformeTempo(avaliacao);

          if (statusAnterior != avaliacao.status) {
            this.avaliacaoService.updateAvaliacaoByTransacao(avaliacaoParaModificar => {
              avaliacaoParaModificar.status = avaliacao.status;
              return avaliacaoParaModificar;
            }, avaliacao.id);

            console.log("Alterei o status da avaliacao! TRANSACAO");

            return;
          }

        }
      }, 5500);
    }

  }

  ngOnDestroy() {
    this.avaliacoesSubscription.unsubscribe();
    clearInterval(this.verificacaoStatusInterval);
  }

  tabAlterada(index) {

    this.router.navigate([`/aluno/${this.tabs[index].id}`]);
    this.caminho[1] = { nome: this.tabs[index].nome, url: `#` };
  }


}
