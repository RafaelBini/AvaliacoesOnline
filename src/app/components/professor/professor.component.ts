import { ConfirmarComponent } from './../../dialogs/confirmar/confirmar.component';
import { UsuarioService } from './../../services/usuario.service';
import { AvaliacaoListaComponent } from './../avaliacao-lista/avaliacao-lista.component';
import { AvaliacaoService } from './../../services/avaliacao.service';
import { Avaliacao } from './../../models/avaliacao';
import { ComumService } from './../../services/comum.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlunoNovoComponent } from './../aluno-novo/aluno-novo.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UrlNode } from 'src/app/models/url-node';
import { CredencialService } from 'src/app/services/credencial.service';
import { Usuario } from 'src/app/models/usuario';
import { EditarAlunoComponent } from 'src/app/dialogs/editar-aluno/editar-aluno.component';


@Component({
  selector: 'app-professor',
  templateUrl: './professor.component.html',
  styleUrls: ['./professor.component.css']
})
export class ProfessorComponent implements OnInit {

  public selectedTab = 0;

  public alunosSelecionados = [];
  public alunosFiltrados = [];
  public alunos: Array<Usuario> = [];


  public avaliacoes: Array<Avaliacao> = []

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

  @ViewChild(AvaliacaoListaComponent) avaliacaoLista: AvaliacaoListaComponent;

  constructor(private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    public credencialService: CredencialService,
    public comumService: ComumService,
    private avaliacaoService: AvaliacaoService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

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

        if (params.tab == "alunos") {
          var intervalRef = setInterval(() => {
            if (this.credencialService.loggedUser.id != null) {
              this.alunos = this.credencialService.loggedUser.alunos;
              this.alunosFiltrados = this.alunos;
              clearInterval(intervalRef);
            }
          });
        }

      }
    });

    // AVALIAÇÕES
    this.avaliacaoService.getAvaliacoesFromProfessor(this.credencialService.getLoggedUserIdFromCookie()).then(avaliacoes => {
      this.avaliacaoLista.avaliacoes = avaliacoes;
      this.avaliacaoLista.atualizarAvaliacoesFiltradas();
    })
      .catch(reason => {
        this.comumService.notificarErro("Falha ao buscar avaliações", reason);
      });




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

    var diagRef = this.dialog.open(ConfirmarComponent, {
      data: {
        mensagem: `Tem certeza de que deseja remover ${this.alunosSelecionados.length > 1 ? 'os' : 'o'} ${this.alunosSelecionados.length} ${this.alunosSelecionados.length > 1 ? 'alunos selecionados' : 'aluno selecionado'}?`,
        mensagem2: "Remover alunos"
      }
    });
    diagRef.afterClosed().subscribe((result) => {
      if (result == true) {
        for (let alunoEmail of this.alunosSelecionados) {
          this.credencialService.loggedUser.alunos = this.credencialService.loggedUser.alunos.filter(u => u.email != alunoEmail);
        }
        this.alunos = this.credencialService.loggedUser.alunos;
        this.alunosFiltrados = this.alunos;
        this.usuarioService.update(this.credencialService.loggedUser);
      }
    });




  }
  adicionarTagsAosSelecionados() {
    if (this.alunosSelecionados.length <= 1)
      return;
    var diagRef = this.dialog.open(EditarAlunoComponent, {
      width: '80%',
    });
    diagRef.afterClosed().subscribe(aluno => {
      if (aluno) {
        const alunoTipado: Usuario = aluno;
        for (let aluno of this.credencialService.loggedUser.alunos) {
          if (this.alunosSelecionados.includes(aluno.email)) {
            for (let tag of alunoTipado.tags) {
              aluno.tags.push(tag);
            }
          }
        }
        this.alunos = this.credencialService.loggedUser.alunos;
        this.alunosFiltrados = this.alunos;
        this.usuarioService.update(this.credencialService.loggedUser);

      }
    });
  }
  editarAluno() {
    if (this.alunosSelecionados.length > 1)
      return;
    var diagRef = this.dialog.open(EditarAlunoComponent, {
      data: this.alunos.filter(a => a.email == this.alunosSelecionados[0])[0],
      width: '80%',
    });
    diagRef.afterClosed().subscribe(() => {
      this.credencialService.loggedUser.alunos = this.alunos;
      this.alunosFiltrados = this.alunos;
      this.usuarioService.update(this.credencialService.loggedUser);
    });

  }



}
