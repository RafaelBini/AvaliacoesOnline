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
    id: 'AVAL',
    status: 0,
    titulo: "",
    descricao: "",
    limitarNumIntegrantes: true,
    maxIntegrantes: 3,
    dtInicio: this.comumService.getStringFromDate(new Date()),
    isInicioIndeterminado: false,
    dtInicioCorrecao: this.comumService.getStringFromDate(new Date()),
    isInicioCorrecaoIndeterminado: false,
    dtTermino: this.comumService.getStringFromDate(new Date()),
    isTerminoIndeterminado: false,
    isOrdemAleatoria: false,
    isBloqueadoAlunoAtrasado: false,
    tipoDisposicao: 0,
    tipoCorrecao: 0,
    correcaoParesQtdTipo: "1",
    correcaoParesQtdNumero: 1,
    tipoPontuacao: 0,
    tags: [],
    provas: [],
    provaGabarito: "",
  };

  public provaGabarito: Prova = {
    isGabarito: true,
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
        tentativas: 0
      },
    ],
  };

  private avaliacoesId = [];

  public provaExemplo: Prova;

  public visao = "professor";

  public caminho: Array<UrlNode> = [
    { nome: `Professor`, url: `/professor` },
    { nome: `Avaliações`, url: `/professor` },
    { nome: `Nova Avaliação`, url: `/professor` },
  ];

  idJaExiste = false;
  isEditando = false;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];

  ngOnInit(): void {
    if (!this.credencialService.estouLogado()) {
      this.router.navigate(['']);
      return;
    }

    this.comumService.scrollToTop();
    this.route.params.subscribe(params => {
      if (params.id) {
        this.puxarAvaliacaoParaEditar(params.id);
        this.isEditando = true;
      }
      else {
        this.setIdAleatorio();
        this.receberTodasAvaliacoes();
        this.isEditando = false;
      }
    });
  }

  puxarAvaliacaoParaEditar(avaliacaoId) {
    this.avaliacaoService.getAvaliacaoFromId(avaliacaoId).then(avaliacao => {
      this.avaliacao = avaliacao;
      this.provaService.getProvaFromId(avaliacao.provaGabarito).then(prova => {
        this.provaGabarito = prova;
      })
        .catch(reason => this.comumService.notificarErro("Erro ao tentar receber prova gabarito", reason));
    })
      .catch(reason => this.comumService.notificarErro("Erro ao tentar receber avaliacao", reason))
  }

  receberTodasAvaliacoes() {
    this.avaliacaoService.getAllAvaliacoes().then(ref => {
      for (let doc of ref.docs) {
        this.avaliacoesId.push(doc.id);
      }
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
    });

    this.comumService.scrollToBottom();

  }

  finalizar() {
    // TODO: VALIDAR SE EXISTE UMA AVALIAÇÃO COM ESSE ID
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

  }

  @HostListener('window:keydown', ['$event'])
  onKeyUp(event: KeyboardEvent) {

    if (event.key.toUpperCase() == 'S' && event.ctrlKey) {
      event.preventDefault();
      this.salvar();
    }


  }

  salvar() {
    this.avaliacaoService.updateAvaliacao(this.avaliacao).then(() => {
      this.provaGabarito.id = this.avaliacao.provaGabarito;
      this.provaService.updateProva(this.provaGabarito).then(() => {
        this.snack.open("Avaliação salva!", null, { duration: 3500 });
      }).catch(reason => this.comumService.notificarErro("Não foi possível salvar a avaliação", reason))
    }).catch(reason => this.comumService.notificarErro("Não foi possível salvar a prova", reason));
  }


  buscarQuestao() {
    this.dialog.open(BuscarQuestaoComponent, {
      data: this.avaliacao,
      width: '75%'
    });
  }

  abrirTipos(tipoEscolhido) {
    this.dialog.open(EscolherTipoComponent, {
      data: {
        avaliacao: this.avaliacao,
        prova: this.provaGabarito,
        tipoEscolhido: tipoEscolhido
      },
      width: '75%'
    });
  }

  mudarVisao(tipoVisao) {
    this.provaExemplo = this.avaliacaoService.getAvaliacaoFromGabarito(this.provaGabarito);
    this.visao = tipoVisao;
  }

  validarId() {
    if (this.avaliacoesId.includes(this.avaliacao.id)) {
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

}
