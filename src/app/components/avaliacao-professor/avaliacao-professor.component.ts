import { Grupo } from './../../models/grupo';
import { UsuarioService } from './../../services/usuario.service';
import { AvaliacaoAlunoComponent } from './../avaliacao-aluno/avaliacao-aluno.component';
import { AvaliacaoService } from './../../services/avaliacao.service';
import { CredencialService } from 'src/app/services/credencial.service';
import { Avaliacao } from './../../models/avaliacao';
import { ComumService } from './../../services/comum.service';
import { UrlNode } from './../../models/url-node';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Usuario } from 'src/app/models/usuario';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-avaliacao-professor',
  templateUrl: './avaliacao-professor.component.html',
  styleUrls: ['./avaliacao-professor.component.css']
})
export class AvaliacaoProfessorComponent implements OnInit, OnDestroy {

  public textoFiltroAlunos = "";
  public alunosFiltrados: Array<Usuario> = [];
  public professor: Usuario = {
    alunos: []
  };
  public avaliacao: Avaliacao = {
    titulo: "",
    descricao: "",
    professorId: 'XXX',
    professorNome: '',
    alunos: [],
    grupos: [
      {
        numero: 1,
        instanciaStatusId: '0',
        alunos: []
      }
    ],
    tipoCorrecao: 0,
    tipoDisposicao: 1,
    tipoPontuacao: 0,
  };
  public caminho: Array<UrlNode> = [
    { nome: `Professor`, url: `/professor` },
    { nome: `Avaliações`, url: `/professor/avaliacoes` },
    { nome: ``, url: `#` },
  ];

  avaliacaoSubscription: Subscription;
  public scrolling = false;

  constructor(public credencialService: CredencialService,
    public comumService: ComumService,
    private avaliacaoService: AvaliacaoService,
    private usuarioService: UsuarioService,
    public router: Router,
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(param => {
      const AVALIACAO_ID = param.id;

      // Se estou logado,
      if (this.credencialService.estouLogado()) {

        // Vou para visão do professor
        this.credencialService.loggedUser.acesso = 'professor';

        // Começa a ouvir mudanças na avaliação
        this.avaliacaoSubscription = this.avaliacaoService.onAvaliacaoChange(AVALIACAO_ID).subscribe(avaliacao => {

          this.avaliacao = avaliacao;


          this.caminho = [
            { nome: `Professor`, url: `/professor` },
            { nome: `Avaliações`, url: `/professor/avaliacoes` },
            { nome: `${this.avaliacao.titulo}`, url: `#` },
          ];

          // Se não tem nenhum grupo criado e é individual, cria um vazio.
          if (this.avaliacao.grupos.length <= 0 && this.avaliacao.tipoDisposicao == 0) {
            this.addGrupo();
          }

          // Recebe os dados do professor
          var intervalRef = setInterval(() => {
            if (this.credencialService.loggedUser.id != null) {
              this.professor = { ...this.credencialService.loggedUser };
              this.adicionarAlunosVisitantes();

              clearInterval(intervalRef);
            }
          });

          // Se não sou o professor dessa avaliacao, entro nela como aluno
          if (this.avaliacao.professorId != this.credencialService.loggedUser.id) {

            this.credencialService.loggedUser.acesso = 'aluno';
            this.router.navigate([`aluno/avaliacao/${AVALIACAO_ID}`]);
            return;

          }

        });

      }

      // Se não estou logado,
      else {
        this.router.navigate([`${AVALIACAO_ID}`]);
      }

    });
  }

  ngOnDestroy() {
    if (this.avaliacaoSubscription)
      this.avaliacaoSubscription.unsubscribe();
  }

  // Parte 1 - Em Preparação

  addGrupo() {
    this.avaliacao.grupos.push({ numero: this.avaliacao.grupos.length + 1, instanciaStatusId: '0', alunos: [] });
    //this.avaliacaoService.updateAvaliacao(this.avaliacao);
  }
  drop(event: CdkDragDrop<string[]>, paraOnde: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      const vindoDeOutroGrupo = event.previousContainer.id != "cdk-drop-list-0";
      const vaiDeixarVazio = event.previousContainer.data.length <= 1;

      if (paraOnde == 'grupo' && !vindoDeOutroGrupo) {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          this.professor.alunos.indexOf(this.professor.alunos.filter(aluno => aluno.email == this.alunosFiltrados[event.previousIndex].email)[0]),
          event.currentIndex);
      }
      else if (paraOnde == 'novo-grupo') {
        if (vaiDeixarVazio && vindoDeOutroGrupo)
          return;
        this.addGrupo();
        transferArrayItem(event.previousContainer.data,
          this.avaliacao.grupos[this.avaliacao.grupos.length - 1].alunos as Array<String>,
          event.previousIndex,
          0);
      }
      else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
    }
    this.removerGruposVazios();
    this.onBuscaAlunoKeyUp();
    this.avaliacaoService.updateAvaliacao(this.avaliacao);
  }
  onBuscaAlunoKeyUp() {
    var texto = this.textoFiltroAlunos;

    this.professor.alunos = this.getAlunosSemGrupo();

    this.professor.alunos.sort((a, b) => {
      if (a.online && !b.online) {
        return -1;
      }
      else if (!a.online && b.online) {
        return 1;
      }
      else {
        if (a.nome > b.nome) {
          return 1;
        }
        else {
          return -1;
        }
      }
    });

    this.alunosFiltrados = this.professor.alunos.filter(aluno => {

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
  adicionarAlunosVisitantes() {

    var adicioneiAluno = false;
    for (let alunoOnline of this.getAlunosFromTodosGrupos()) {

      var tenhoAluno = false;
      for (let aluno of this.credencialService.loggedUser.alunos) {
        if (alunoOnline.id == aluno.id) {
          tenhoAluno = true;
        }
      }
      if (!tenhoAluno) {
        this.credencialService.loggedUser.alunos.push(alunoOnline);
        adicioneiAluno = true;
      }
    }

    if (adicioneiAluno) {
      this.usuarioService.update(this.credencialService.loggedUser);
    }

    this.onBuscaAlunoKeyUp();

  }
  scrollDown(element: HTMLElement) {
    this.scrolling = true;
    const interval = setInterval(() => {
      if (this.scrolling == false || element.scrollTop == element.scrollHeight) {
        clearInterval(interval);
      }
      else {
        element.scroll({
          top: (element.scrollTop + 7),
          left: 0,
        });
      }
    })
  }
  scrollUp(element) {

    this.scrolling = true;
    const interval = setInterval(() => {
      if (this.scrolling == false || element.scrollTop == 0) {
        clearInterval(interval);
      }
      else {
        element.scroll({
          top: (element.scrollTop - 7),
          left: 0,
        });
      }
    })
  }
  getAlunosSemGrupo() {
    var alunosSemDuplicados: Array<Usuario> = [];
    var alunosEmGrupos = this.getAlunosFromTodosGrupos();
    for (let aluno of this.professor.alunos) {
      var estaEmGrupo = false;
      for (let alunoEmGrupo of alunosEmGrupos) {
        if (aluno.id == alunoEmGrupo.id) {
          estaEmGrupo = true;
          break;
        }
      }
      if (!estaEmGrupo) {
        alunosSemDuplicados.push(aluno);
      }
    }
    return alunosSemDuplicados;
  }
  getAlunosFromTodosGrupos(): Array<Usuario> {
    var alunos: Array<Usuario> = [];
    for (let grupo of this.avaliacao.grupos) {
      for (let aluno of grupo.alunos) {
        alunos.push(aluno);
      }
    }
    return alunos;
  }
  excluirGrupo(grupo: Grupo) {
    // Remover grupo da array
    this.avaliacao.grupos = this.avaliacao.grupos.filter(g => g.numero != grupo.numero);
    this.redefinirIdentificacaoDosGrupos();

    // Salvar no banco de dados
    this.avaliacaoService.updateAvaliacao(this.avaliacao);
  }
  redefinirIdentificacaoDosGrupos() {
    var count = 1;
    for (let grupo of this.avaliacao.grupos) {
      grupo.numero = count++;
    }
  }
  removerGruposVazios() {
    if (this.avaliacao.tipoDisposicao == 0)
      return;
    for (let grupo of this.avaliacao.grupos) {
      if (grupo.alunos.length <= 0) {
        this.excluirGrupo(grupo);
      }
    }
  }


}
