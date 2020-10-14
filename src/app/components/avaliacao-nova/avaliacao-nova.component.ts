import { SelecionarAlunosComponent } from './../../dialogs/selecionar-alunos/selecionar-alunos.component';
import { CredencialService } from './../../services/credencial.service';
import { ProvaService } from './../../services/prova.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvaliacaoService } from './../../services/avaliacao.service';
import { EscolherTipoComponent } from './../../dialogs/escolher-tipo/escolher-tipo.component';
import { ComumService } from './../../services/comum.service';
import { Avaliacao } from './../../models/avaliacao';
import { BuscarQuestaoComponent } from './../../dialogs/buscar-questao/buscar-questao.component';
import { AvaliacaoCriadaDialogComponent } from './../../dialogs/avaliacao-criada-dialog/avaliacao-criada-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlNode } from 'src/app/models/url-node';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA, SEMICOLON } from '@angular/cdk/keycodes';
import { Prova } from 'src/app/models/prova';
import { Usuario } from 'src/app/models/usuario';


@Component({
  selector: 'app-avaliacao-nova',
  templateUrl: './avaliacao-nova.component.html',
  styleUrls: ['./avaliacao-nova.component.css']
})
export class AvaliacaoNovaComponent implements OnInit {

  constructor(public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    public comumService: ComumService,
    public credencialService: CredencialService,
    public avaliacaoService: AvaliacaoService,
    public provaService: ProvaService) { }


  public avaliacao: Avaliacao = {
    id: '',
    status: 0,
    titulo: "",
    descricao: "",
    limitarNumIntegrantes: true,
    maxIntegrantes: 3,
    dtInicio: this.comumService.getStringFromDate(new Date()),
    isInicioIndeterminado: true,
    dtInicioCorrecao: this.comumService.getStringFromDate(new Date()),
    isInicioCorrecaoIndeterminado: true,
    dtTermino: this.comumService.getStringFromDate(new Date()),
    isTerminoIndeterminado: true,
    isOrdemAleatoria: false,
    isBloqueadoAlunoAtrasado: false,
    tipoDisposicao: 0,
    tipoCorrecao: 0,
    correcaoParesQtdTipo: "1",
    correcaoParesQtdNumero: 1,
    tipoPontuacao: 0,
    tags: [],
    grupos: [],
    provas: [],
    provaGabarito: "",

  };

  public provaGabarito: Prova = {
    isGabarito: true,
    professorId: '',
    questoes: [
      {
        pergunta: "",
        tipo: 4,
        resposta: "",
        alternativas: [],
        valor: 10,
        nivelDificuldade: 2,
        tags: [],
        associacoes: [],
        textoParaPreencher: "",
        opcoesParaPreencher: [],
        tentativas: 0,
        extensoes: [],
        correcoes: [],
        correcaoProfessor: {
          nota: null,
          observacao: ""
        },
      },
    ],
  };

  private avaliacoesId: Array<string> = [];
  private minhasAvaliacoes: Array<Avaliacao> = [];

  public provaExemplo: Prova;

  public visao = "professor";

  public caminho: Array<UrlNode> = [
    { nome: `Professor`, url: `/professor` },
    { nome: `Avaliações`, url: `/professor` },
    { nome: `Nova Avaliação`, url: `/professor` },
  ];

  idJaExiste = false;
  isEditando = false;

  idEmEdicao: string;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];

  ngOnInit(): void {
    if (!this.credencialService.estouLogado()) {
      this.router.navigate(['']);
      return;
    }

    this.comumService.scrollToTop();
    this.route.params.subscribe(params => {

      // DUPLICANDO 
      if (params.id && params.tipo == 'duplicar') {
        this.puxarAvaliacaoParaEditar(params.id).then(() => {
          if (this.avaliacao.professorId != this.credencialService.getLoggedUserIdFromCookie()) {
            this.snack.open('Sem permissao para duplicar', null, { duration: 4500 });
            this.router.navigate(['']);
            return;
          }
          this.provaGabarito.professorId = this.credencialService.getLoggedUserIdFromCookie();
          this.receberTodasAvaliacoes().then(() => {
            this.setIdDuplicado(params.id);
            this.avaliacao.status = 0;
            this.avaliacao.grupos = [];
          });
        });
        this.isEditando = false;
      }

      // EDITANDO
      else if (params.id) {
        this.idEmEdicao = params.id;
        this.puxarAvaliacaoParaEditar(params.id).then(() => {
          if (this.avaliacao.status != 0) {
            this.snack.open('Essa avaliação não pode mais ser editada', null, { duration: 4500 });
            this.router.navigate(['']);
            return;
          }
          else if (this.avaliacao.professorId != this.credencialService.getLoggedUserIdFromCookie()) {
            this.snack.open('Sem permissao para duplicar', null, { duration: 4500 });
            this.router.navigate(['']);
            return;
          }
          this.provaGabarito.professorId = this.credencialService.getLoggedUserIdFromCookie();
          this.receberTodasAvaliacoes();
        }).catch(() => {
          this.snack.open('Avaliação não encontrada', null, { duration: 4500 });
          this.router.navigate(['']);
          return;
        });

        this.isEditando = true;
      }

      // CRIANDO NOVA
      else {
        this.setIdAleatorio();
        this.receberTodasAvaliacoes();
        this.provaGabarito.professorId = this.credencialService.getLoggedUserIdFromCookie();
        this.isEditando = false;
      }
    });
  }

  puxarAvaliacaoParaEditar(avaliacaoId) {
    return new Promise((resolve, reject) => {
      this.avaliacaoService.getAvaliacaoFromId(avaliacaoId).then(avaliacao => {
        this.avaliacao = avaliacao;
        this.provaService.getProvaFromId(avaliacao.provaGabarito).then(prova => {
          this.provaGabarito = prova;
          resolve();
        })
          .catch(reason => {
            this.comumService.notificarErro("Erro ao tentar receber prova gabarito", reason);
            reject(reason);
            return;
          });
      })
        .catch(reason => {
          this.comumService.notificarErro("Erro ao tentar receber avaliacao", reason);
          reject(reason);
          return;
        });
    });

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


  receberTodasAvaliacoes() {
    return new Promise((resolve, reject) => {
      this.avaliacaoService.getAllAvaliacoes().then(avaliacoes => {
        for (let avaliacao of avaliacoes) {
          this.avaliacoesId.push(avaliacao.id);
          if (avaliacao.professorId == this.credencialService.getLoggedUserIdFromCookie())
            this.minhasAvaliacoes.push(avaliacao);
        }
        resolve();
      }).catch(reason => reject(reason));
    });

  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.avaliacao.tags.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  removeTag(tema: any): void {
    const index = this.avaliacao.tags.indexOf(tema);

    if (index >= 0) {
      this.avaliacao.tags.splice(index, 1);
    }
  }

  estaEmFoco(objetoDom): boolean {
    return objetoDom == document.activeElement;
  }
  ajustarAltura(event) {
    var paddingTop = parseFloat(event.target.style.paddingTop.replace("px", ""));
    var paddingBottom = parseFloat(event.target.style.paddingBottom.replace("px", ""));
    event.target.style.height = ""; event.target.style.height = (event.target.scrollHeight - (paddingTop + paddingBottom)) + "px";
  }
  addQuestao() {
    this.provaGabarito.questoes.push({
      pergunta: "",
      tipo: 4,
      resposta: "",
      alternativas: [],
      valor: 10,
      nivelDificuldade: 2,
      tags: [],
      associacoes: [],
      textoParaPreencher: "",
      opcoesParaPreencher: [],
      tentativas: 0,
      extensoes: [],
      correcoes: [],
      correcaoProfessor: {
        nota: null,
        observacao: ""
      },
    });

    this.comumService.scrollToBottom();

  }

  limitarIndeterminados() {
    if (this.avaliacao.isInicioIndeterminado) {
      this.avaliacao.isInicioCorrecaoIndeterminado = true;
    }
    if (this.avaliacao.isInicioCorrecaoIndeterminado) {
      this.avaliacao.isTerminoIndeterminado = true;
    }
  }

  // FINAL
  finalizar() {
    if (this.idJaExiste) {
      this.snack.open(`Já existe uma avaliação com o ID ${this.avaliacao.id}`, null, { duration: 3500 });
      return;
    }
    this.validarDatas().then(() => {
      this.avaliacao.professorId = this.credencialService.loggedUser.id;
      this.avaliacao.professorNome = this.credencialService.loggedUser.nome;

      this.avaliacaoService.insertNovaAvaliacao(this.avaliacao).then(() => {
        this.provaGabarito.avaliacaoId = this.avaliacao.id;
        this.provaService.insertProvaGabarito(this.provaGabarito).then(() => {
          this.router.navigate(['/professor']);
          this.dialog.open(AvaliacaoCriadaDialogComponent, {
            data: this.avaliacao.id
          });
        }).catch(reason => {
          this.comumService.notificarErro("Não foi possível adicionar a prova", reason);
        });
      }).catch(reason => {
        this.comumService.notificarErro("Não foi possível adicionar a avaliação", reason);
      });
    }).catch(reason => {
      this.snack.open(reason, null, { duration: 3500 });
    })


  }
  @HostListener('window:keydown', ['$event'])
  onKeyUp(event: KeyboardEvent) {

    if (event.key.toUpperCase() == 'S' && event.ctrlKey) {
      event.preventDefault();
      this.salvar();
    }


  }
  salvar() {
    if (!this.isEditando)
      return;
    if (this.idJaExiste) {
      this.snack.open(`Já existe uma avaliação com o ID ${this.avaliacao.id}`, null, { duration: 3500 });
      return;
    }
    this.validarDatas().then(() => {
      this.avaliacaoService.updateAvaliacao(this.avaliacao).then(() => {
        this.provaGabarito.id = this.avaliacao.provaGabarito;
        this.provaService.updateProva(this.provaGabarito).then(() => {
          this.snack.open("Avaliação salva!", null, { duration: 3500 });
        }).catch(reason => this.comumService.notificarErro("Não foi possível salvar a avaliação", reason))
      }).catch(reason => this.comumService.notificarErro("Não foi possível salvar a prova", reason));
    }).catch(reason => {
      this.snack.open(reason, null, { duration: 3500 });
    });

  }


  // DIALOGS
  buscarQuestao() {
    this.dialog.open(BuscarQuestaoComponent, {
      data: {
        prova: this.provaGabarito,
        minhasAvaliacoes: this.minhasAvaliacoes,
      },
      width: '75%'
    });
  }
  abrirTipos(tipoEscolhido) {
    const DIAG_REF = this.dialog.open(EscolherTipoComponent, {
      data: {
        avaliacao: this.avaliacao,
        prova: this.provaGabarito,
        tipoEscolhido: tipoEscolhido
      },
      width: '75%'
    });
    DIAG_REF.afterClosed().subscribe(() => {
      if (tipoEscolhido == 'disposicao')
        this.redistribuirAlunosNosGrupos();
    });
  }
  mudarVisao(tipoVisao) {
    this.provaExemplo = this.provaService.getProvaFromGabarito(this.provaGabarito);
    this.visao = tipoVisao;
  }
  abirSelecionarAunos() {
    var diagRef = this.dialog.open(SelecionarAlunosComponent, {
      data: this.avaliacao,
      width: '85%',
      height: '95%',
    });
    diagRef.afterClosed().subscribe(() => {
      this.redistribuirAlunosNosGrupos();
    });
  }
  redistribuirAlunosNosGrupos() {
    var todosAlunos = this.getAlunosFromTodosGrupos();

    if (todosAlunos.length <= 0)
      return;

    if (this.avaliacao.tipoDisposicao == 0) {
      this.avaliacao.grupos = this.avaliacao.grupos.filter(g => g.numero == 1);
      this.avaliacao.grupos[0].alunos = todosAlunos;
      return;
    }
    else {
      if (!this.avaliacao.limitarNumIntegrantes) {
        this.avaliacao.maxIntegrantes = 3;
      }
      const QTD_GRUPOS_NECESSARIOS = (todosAlunos.length / this.avaliacao.maxIntegrantes);
      const MAX_EQUILIBRADO = todosAlunos.length / QTD_GRUPOS_NECESSARIOS;
      this.avaliacao.grupos = [];
      for (var g = 0; g < QTD_GRUPOS_NECESSARIOS; g++) {
        this.addGrupo();
        while (this.avaliacao.grupos[g].alunos.length < MAX_EQUILIBRADO && todosAlunos.length > 0) {
          const INDEX_SORTEADO = Math.floor(Math.random() * todosAlunos.length);
          const ALUNO_SORTEADO = todosAlunos[INDEX_SORTEADO]
          this.avaliacao.grupos[g].alunos.push(ALUNO_SORTEADO);
          todosAlunos.splice(INDEX_SORTEADO, 1);
        }
      }
    }
  }
  addGrupo() {
    this.avaliacao.grupos.push({ numero: this.avaliacao.grupos.length + 1, provaId: null, alunos: [] });
  }

  // DATAS DA AVALIAÇÃO
  validarDatas() {
    return new Promise<void>((resolve, reject) => {
      const dtInicio = new Date(this.avaliacao.dtInicio);
      const dtInicioCorrecao = new Date(this.avaliacao.dtInicioCorrecao);
      const dtTermino = new Date(this.avaliacao.descricao);

      if ((dtTermino <= dtInicioCorrecao || dtTermino <= dtInicio) && !this.avaliacao.isInicioCorrecaoIndeterminado && !this.avaliacao.isInicioIndeterminado && !this.avaliacao.isTerminoIndeterminado) {
        reject('O término da avaliação não pode ser antes que o início');
        return;
      }
      else if (dtInicioCorrecao <= dtInicio && !this.avaliacao.isInicioCorrecaoIndeterminado && !this.avaliacao.isInicioIndeterminado) {
        reject('O início da correção não pode ser antes do início da avaliaçao');
        return;
      }
      else if (dtInicio < new Date() && !this.avaliacao.isInicioIndeterminado) {
        reject('O início da avaliação não pode ser colocado no passado.');
        return;
      }

      resolve();

    });
  }
  getNowStr() {
    return this.comumService.getStringFromDate(new Date());
  }

  // ID DA AVALIAÇÃO
  validarId() {
    if (this.idEmEdicao == this.avaliacao.id) {
      this.idJaExiste = false;
    }
    else if (this.avaliacoesId.includes(this.avaliacao.id)) {
      this.idJaExiste = true;
    }
    else {
      this.idJaExiste = false;
    }
  }
  corrigirId() {
    setTimeout(() => {
      this.avaliacao.id = this.avaliacao.id.replace(" ", "");
      this.validarId();
    });
  }
  corrigirIdVazio() {
    if (this.avaliacao.id == "") {
      this.setIdAleatorio();
    }
  }
  setIdAleatorio() {
    this.avaliacao.id = this.getIdAleatorio(4);
  }
  getIdAleatorio(maxDigitos: number): string {
    const CARACTERES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Z', 'Y', 'W'];
    var idAleatorio = '';
    while (idAleatorio.length < maxDigitos) {
      for (let caractere of CARACTERES) {
        if (Math.random() > 0.85) {
          idAleatorio += caractere;
          if (idAleatorio.length >= maxDigitos) {
            if (!this.avaliacoesId.includes(idAleatorio)) {
              return idAleatorio;
            }
            else {
              idAleatorio = "";
            }
          }
        }
      }
    }
    return idAleatorio;
  }
  setIdDuplicado(base: string) {
    this.avaliacao.id = this.getIdDuplicado(base);
  }
  getIdDuplicado(base: string) {
    var count = 2;
    while (this.avaliacoesId.includes(`${base}_${count}`)) {
      count++;
    }
    return `${base}_${count}`;
  }

}
