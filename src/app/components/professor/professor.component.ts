import { ImportarAlunosComponent } from './../../dialogs/importar-alunos/importar-alunos.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConfirmarComponent } from './../../dialogs/confirmar/confirmar.component';
import { UsuarioService } from './../../services/usuario.service';
import { AvaliacaoListaComponent } from './../avaliacao-lista/avaliacao-lista.component';
import { AvaliacaoService } from './../../services/avaliacao.service';
import { Avaliacao } from './../../models/avaliacao';
import { ComumService } from './../../services/comum.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlunoNovoComponent } from './../aluno-novo/aluno-novo.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UrlNode } from 'src/app/models/url-node';
import { CredencialService } from 'src/app/services/credencial.service';
import { Usuario } from 'src/app/models/usuario';
import { EditarAlunoComponent } from 'src/app/dialogs/editar-aluno/editar-aluno.component';
import { GuidedTour, GuidedTourService, Orientation } from 'ngx-guided-tour';

@Component({
  selector: 'app-professor',
  templateUrl: './professor.component.html',
  styleUrls: ['./professor.component.css']
})
export class ProfessorComponent implements OnInit, OnDestroy {

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

  private verificacaoStatusInterval;
  private avaliacoesSubscription: Subscription;

  @ViewChild(AvaliacaoListaComponent) avaliacaoLista: AvaliacaoListaComponent;

  public TelaProfessorTour: GuidedTour = {
    tourId: 'professor-tour',
    useOrb: false,
    steps: [
      {
        title: 'Seja Bem Vindo!',
        content: `
        Esta é a sua página de Professor. Aqui você pode:
        <br/><br/>
        <li>Criar uma nova avaliação</li>
        <li>Buscar suas avaliações</li>
        <li>Editar suas avaliações</li>
        <br/>
        Vou te mostrar como fazer isso. Clique em <i>Próximo</i>.
        `,
        useHighlightPadding: true,
      },
      {
        title: 'Criar uma avaliação',
        selector: '.btn-add-avaliacao',
        content: 'Ao clicar aqui, você poderá dar início a uma nova avaliação!',
        orientation: Orientation.TopRight,
        useHighlightPadding: true,
      },
      {
        title: 'Buscar uma avaliação',
        selector: '#inputBusca',
        content: 'Use esta barra de pesquisa para encontrar uma avaliação.<br/><br/><i>Dica: Use tags em suas avaliações para encontrá-las mais facilmente</i>',
        orientation: Orientation.Bottom,
        useHighlightPadding: true,
      },
      {
        title: 'Em Preparação',
        selector: '.status-class-0',
        content: 'As avaliações desta aba ainda não foram iniciadas. Neste estado ainda é possível editar as questões da avaliação.<br/>Além disso, você pode aproveitar este estado para organizar os grupos.',
        orientation: Orientation.Top,
        useHighlightPadding: true,
      },
      {
        title: 'Em Avaliação',
        selector: '.status-class-1',
        content: 'As avaliações desta aba já estão disponíveis para os alunos responderem as questões.',
        orientation: Orientation.Top,
        useHighlightPadding: true,
      },
      {
        title: 'Em Correção',
        selector: '.status-class-2',
        content: 'Nesta aba estão as avaliações que ainda precisam ser corrigidas.',
        orientation: Orientation.Top,
        useHighlightPadding: true,
      },
      {
        title: 'Encerrada',
        selector: '.status-class-3',
        content: 'As avaliações desta aba já foram encerradas e contém as notas dos alunos',
        orientation: Orientation.Top,
        useHighlightPadding: true,
      },
      {
        title: 'Gerenciar Alunos',
        selector: '#alunosTabLabel',
        content: 'Nesta aba você pode buscar, cadastrar e adicionar os seus alunos.',
        orientation: Orientation.Bottom,
        useHighlightPadding: true,
      },
      {
        title: 'Meu Perfil',
        selector: '#meuPerfilTabLabel',
        content: 'Use esta aba para alterar suas informações pessoais (como e-mail, foto e senha por exemplo).',
        orientation: Orientation.Bottom,
        useHighlightPadding: true,
      },

    ]
  };


  public AvaliacaoCriadaTour: GuidedTour = {
    tourId: 'avaliacao-criada-tour',
    useOrb: false,
    steps: [
      {
        title: 'Parabéns!',
        selector: '.avalicao-card',
        content: 'Aqui está a sua primeira avaliação! Vou te mostrar algumas dicas.',
        orientation: Orientation.Top,
        useHighlightPadding: true,
      },
      {
        title: 'Entrar na avaliação',
        selector: '.info-box',
        content: 'Este quadro indica o status atual da avaliação. Ao clicar aqui, você irá "entrar" na avaliação. <br/><br/> As opções mais importantes como <b>iniciar avaliação</b> ou <b>corrigir avaliação</b> poderão ser feitas a por aqui.',
        orientation: Orientation.Top,
        useHighlightPadding: true,
      },
      {
        title: 'Mais opções',
        selector: '.avaliacao-options-btn',
        content: `Clicando aqui, você poderá ter acesso a uma série de opções como:
        <br /><br/>
        <li>Ver estatísticas da avaliação</li>
        <li>Editar a avaliação</li>
        <li>Exluir a avaliação</li>
        <li>Arquivar a avaliação</li>
        <li>Imprimir a avaliação</li>
        <li>Exportar a avaliação</li>
        `,
        orientation: Orientation.TopRight,
        useHighlightPadding: true,
      },

    ]
  };

  public TelaAlunosTour: GuidedTour = {
    tourId: 'tela-alunos-tour',
    useOrb: false,
    steps: [
      {
        title: 'Meus Alunos',
        content: 'Nesta aba você pode gerenciar os seus alunos!<br /><br /><b>Lembre-se:</b> Você <b>não</b> precisa adicionar os alunos para que eles participem das avaliações. Eles são adiconados automáticamente quando acessam o link da avaliação.',
      },
      {
        title: 'Adicionar um aluno',
        selector: '.btn-add-aluno',
        content: 'Por aqui você pode adicionar um aluno (tanto criar uma conta nova para ele como encontrá-lo no sistema).',
        orientation: Orientation.TopRight,
        useHighlightPadding: true,
      },
      {
        title: 'Importar Vários Alunos',
        selector: '.btn-importar-alunos',
        content: 'Clicando aqui você pode importar vários alunos de uma só vez! Basta seleiconar o layout do arquivo CSV.',
        orientation: Orientation.TopRight,
        useHighlightPadding: true,
      },
      {
        title: 'Buscar Alunos',
        selector: '.barra-pesquisa',
        content: 'Use esta barra de pesquisa para encontrar seus alunos.',
        orientation: Orientation.Bottom,
        highlightPadding: 5,
      },
    ]
  };

  constructor(private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    public credencialService: CredencialService,
    public comumService: ComumService,
    private avaliacaoService: AvaliacaoService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private guidedTourService: GuidedTourService,
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

            if (!this.credencialService.loggedUser.tutorialMostradoTelaAlunos) {
              this.guidedTourService.startTour(this.TelaAlunosTour);
              this.credencialService.loggedUser.tutorialMostradoTelaAlunos = true;
              this.usuarioService.update(this.credencialService.loggedUser);
            }


          });
        }

      }
    });

    // AVALIAÇÕES
    if (this.avaliacoesSubscription == null) {
      this.avaliacoesSubscription = this.avaliacaoService.onAvaliacoesFromProfessorChange(this.credencialService.getLoggedUserIdFromCookie()).subscribe(avaliacoes => {

        this.avaliacaoLista.avaliacoes = avaliacoes;
        this.avaliacaoLista.atualizarAvaliacoesFiltradas();
      });
    }

    // Atualiza o status das avaliações conforme o tempo
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
            console.log("Alterei o status da avaliação conforme o tempo -> TRANSACAO");

            return;
          }

        }
      }, 5500);
    }

    // Tutoriais
    setTimeout(() => {
      var altereiStatus = false;


      if (!this.credencialService.loggedUser.tutorialMostradoTelaProfessor) {
        this.guidedTourService.startTour(this.TelaProfessorTour);
        this.credencialService.loggedUser.tutorialMostradoTelaProfessor = true;
        altereiStatus = true;
      }
      else if (this.avaliacaoLista.avaliacoes.length > 0 && !this.credencialService.loggedUser.tutorialMostradoAvaliacaoCriada) {

        var interv = setInterval(() => {
          if (document.querySelectorAll('.mat-dialog-container').length <= 0 && this.avaliacaoLista.avaliacoes.length > 0) {
            this.guidedTourService.startTour(this.AvaliacaoCriadaTour);
            clearInterval(interv);
          }
        });

        this.credencialService.loggedUser.tutorialMostradoAvaliacaoCriada = true;
        altereiStatus = true;
      }

      if (altereiStatus) {
        this.usuarioService.update(this.credencialService.loggedUser);
      }

    }, 1500);


  }

  ngOnDestroy() {
    if (this.avaliacoesSubscription != null)
      this.avaliacoesSubscription.unsubscribe();
    clearInterval(this.verificacaoStatusInterval);
  }

  // Geral
  refazerTutorial() {
    if (this.selectedTab == 1) {
      this.guidedTourService.startTour(this.TelaAlunosTour);
    }
    else {
      this.guidedTourService.startTour(this.TelaProfessorTour);
    }
  }

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
        titulo: "Remover alunos"
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
      width: '50%',
    });
    diagRef.afterClosed().subscribe(aluno => {
      if (aluno) {
        const alunoTipado: Usuario = aluno;
        for (let aluno of this.credencialService.loggedUser.alunos) {
          if (this.alunosSelecionados.includes(aluno.email)) {
            if (aluno.tags == undefined)
              aluno.tags = [];
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
      width: '50%',
    });
    diagRef.afterClosed().subscribe(() => {
      this.credencialService.loggedUser.alunos = this.alunos;
      this.alunosFiltrados = this.alunos;
      this.usuarioService.update(this.credencialService.loggedUser);
    });

  }
  abrirImportarAlunos() {
    var diagRef = this.dialog.open(ImportarAlunosComponent, {
      width: '75%',
      height: '88%',
    });
    diagRef.afterClosed().subscribe(result => {

    });
  }



}
