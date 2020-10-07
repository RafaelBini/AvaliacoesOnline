import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import { Prova } from 'src/app/models/prova';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Avaliacao } from 'src/app/models/avaliacao';
import { ComumService } from './../../services/comum.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UrlNode } from 'src/app/models/url-node';
import { CredencialService } from 'src/app/services/credencial.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { ProvaService } from 'src/app/services/prova.service';
import { AvaliacaoAlunoCabecalhoComponent } from './avaliacao-aluno-cabecalho/avaliacao-aluno-cabecalho.component';
import { Usuario } from 'src/app/models/usuario';


@Component({
  selector: 'app-avaliacao-aluno',
  templateUrl: './avaliacao-aluno.component.html',
  styleUrls: ['./avaliacao-aluno.component.css']
})
export class AvaliacaoAlunoComponent implements OnInit, OnDestroy {

  constructor(public router: Router,
    public route: ActivatedRoute,
    public credencialService: CredencialService,
    public comumService: ComumService,
    private avaliacaoService: AvaliacaoService,
    private provaService: ProvaService,
    private snack: MatSnackBar) { }
  public finalizado = false;

  public avaliacao: Avaliacao = {
    titulo: "Titulo da Avaliação",
    descricao: `Descrição da Avaliação Descrição da Avaliação Descrição da Avaliação Descrição da Avaliação
    Descrição da Avaliação`,
    status: 0,
    professorId: 'XXX',
    professorNome: 'Rafael Bini',
    limitarNumIntegrantes: true,
    maxIntegrantes: 3,
    correcaoParesQtdNumero: 3,
    correcaoParesQtdTipo: 'DEFINIR',
    tipoDisposicao: 2,
    tipoCorrecao: 2,
    tipoPontuacao: 0,
    alunos: [
      { nome: "Camila Bini", email: 'Junqueira@gmail.com', online: true, },
      { nome: "Matheus Leonardo", email: 'Junqueira3@gmail.com', online: true, },
      { nome: "Douglas Marques", email: 'Junqueira2@gmail.com', online: true, },
      { nome: "Guilherme Cruz", email: 'Junqueira4@gmail.com', online: true, },
    ],
    grupos: [
      {
        numero: 1,
        instanciaId: '1',
        alunos: [
          { nome: "Douglas Marques", email: 'Junqueira2@gmail.com', online: true, },
          { nome: "Guilherme Cruz", email: 'Junqueira4@gmail.com', online: true, },
          { nome: "Junqueira Bini", email: 'Junqueirasx@gmail.com', online: true, },
        ]
      },
      {
        numero: 2,
        instanciaId: '2',
        alunos: [
          { nome: "Camila Bini", email: 'Junqueira@gmail.com', online: true, },
          { nome: "Matheus Leonardo", email: 'Junqueira3@gmail.com', online: true, },
        ]
      },
    ],
  }

  public gabarito: Prova = {
    questoes: [],
  }

  public prova: Prova = {
    id: '1',
    avaliacaoId: "1",
    status: 0,
    questoes: [
      {
        pergunta: "Qual é a cor da grama?",
        tipo: 4,
        resposta: "",
        alternativas: [
          { texto: "A cor é Vermelha.", selecionada: false },
          { texto: "A cor é Verde.", selecionada: false },
          { texto: "A cor é Rosa.", selecionada: false },
          { texto: "A cor é Azul.", selecionada: false },
        ],
        valor: 30,
        tentativas: 0,
      },
      {
        pergunta: "Qual(is) deste(s) tem quatro patas?",
        tipo: 3,
        resposta: "",
        alternativas: [
          { texto: "Cachorro.", selecionada: false },
          { texto: "Pássaro.", selecionada: false },
          { texto: "Gato.", selecionada: false },
          { texto: "Centopéia.", selecionada: false },
        ],
        valor: 10,
        tentativas: 0,
      },
      {
        valor: 5,
        pergunta: "Complete a frase abaixo:",
        tags: ["astronomia", "cores", "química"],
        tipo: 5,
        nivelDificuldade: 4,
        opcoesParaPreencher: [
          { texto: "grama", opcaoSelecionada: null, ativa: true },
          { texto: "verde", opcaoSelecionada: null, ativa: true }
        ],
        textoParaPreencher: "A (1) geralemnte é da cor (2).",
        partesPreencher: [
          { conteudo: "A ", tipo: "texto" },
          { conteudo: 0, tipo: "select" },
          { conteudo: " geralmente é da cor ", tipo: "texto" },
          { conteudo: 1, tipo: "select" },
          { conteudo: ".", tipo: "texto" },
        ],
        correcaoProfessor: {
          nota: null,
          observacao: null,
        },
        correcoes: [],
        tentativas: 0,
      },

    ],
    alunos: [
      { nome: "Douglas Marques", email: 'Junqueira2@gmail.com', online: true, statusId: 1, },
      { nome: "Guilherme Cruz", email: 'Junqueira4@gmail.com', online: true, statusId: 1, },
      { nome: "Rafael Bini", email: 'rfabini1996@gmail.com', online: true, statusId: 1, },
    ],
    provasParaCorrigir: [

    ]
  }

  public caminho: Array<UrlNode> = [
    { nome: `Aluno`, url: `/aluno` },
    { nome: `Avaliações`, url: `/aluno/avaliacoes` },
    { nome: `${this.avaliacao.titulo}`, url: `#` },
  ];

  private avaliacaoSubscription: Subscription;

  ngOnInit(): void {

    this.route.params.subscribe(param => {
      const AVALIACAO_ID = param.id;

      // Se estou logado,
      if (this.credencialService.estouLogado()) {

        this.credencialService.loggedUser.acesso = 'aluno';

        // Começa a ouvir mudanças na avaliação
        this.avaliacaoSubscription = this.avaliacaoService.onAvaliacaoChange(AVALIACAO_ID).subscribe(avaliacao => {

          this.avaliacao = avaliacao;

          this.caminho = [
            { nome: `Aluno`, url: `/aluno` },
            { nome: `Avaliações`, url: `/aluno/avaliacoes` },
            { nome: `${this.avaliacao.titulo}`, url: `#` },
          ];

          // Se sou o professor dessa avaliacao, Vou para visão do professor
          if (this.avaliacao.professorId == this.credencialService.loggedUser.id) {
            this.credencialService.loggedUser.acesso = 'professor';
            this.router.navigate([`professor/avaliacao/${AVALIACAO_ID}`]);
            return;
          }

          // Recebe meus dados
          var intervalRef = setInterval(() => {
            if (this.credencialService.loggedUser.id != null) {

              // Passa por cada aluno na avaliação
              var estouNaAvaliacao = false;
              for (let grupo of this.avaliacao.grupos) {
                for (let aluno of grupo.alunos) {
                  if (aluno.id == this.credencialService.loggedUser.id) {
                    aluno.online = true;
                    estouNaAvaliacao = true;
                    break;
                  }
                }
                if (estouNaAvaliacao) {
                  this.avaliacaoService.updateAvaliacao(this.avaliacao);
                  break;
                }
              }
              if (!estouNaAvaliacao) {
                this.entrarEmGrupoAleatorio();
                this.avaliacaoService.updateAvaliacao(this.avaliacao);
              }

              this.receberProvasCorrigir();

              clearInterval(intervalRef);
            }
          });



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

  // GERAL
  getDataObjetivo() {
    if (this.avaliacao.status == 0) {
      if (this.avaliacao.isInicioIndeterminado)
        return '2020-09-05T13:55:30.000Z';
      else
        return this.avaliacao.dtInicio;
    }
    else if (this.avaliacao.status == 1) {
      if (this.avaliacao.isInicioCorrecaoIndeterminado)
        return '2020-09-05T13:55:30.000Z';
      else
        return this.avaliacao.dtInicioCorrecao;
    }
    else if (this.avaliacao.status == 2) {
      if (this.avaliacao.isTerminoIndeterminado)
        return '2020-09-05T13:55:30.000Z';
      else
        return this.avaliacao.dtTermino;
    }
    else {
      return '2020-09-05T13:55:30.000Z';
    }

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

  // EM PREPARAÇÃO
  addGrupo() {
    this.avaliacao.grupos.push({ numero: this.avaliacao.grupos.length + 1, instanciaId: `${(this.avaliacao.grupos.length + 1)}`, alunos: [] });
    setTimeout(() => {
      window.scroll({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 200);
  }
  entrarNoGrupo(grupo) {
    const me = this.credencialService.loggedUser;

    // Se o grupo já tem o máximo de integrantes
    if (grupo.alunos.length >= this.avaliacao.maxIntegrantes) {
      this.snack.open("Este grupo já está cheio", null, {
        duration: 3000
      });
      return;
    }

    // Passa por cada grupo da avaliação
    this.avaliacao.grupos.forEach(g => {
      // Se estou nesse grupo, me retiro
      if (g.alunos.includes(me)) {
        g.alunos = g.alunos.filter(a => a.email != me.email);
      }
    });

    // Insere no grupo
    grupo.alunos.push(me);
  }
  temGrupoVazio() {
    for (let g of this.avaliacao.grupos) {
      if (g.alunos.length <= 0)
        return true;
    };
    return false;
  }
  entrarEmGrupoAleatorio() {
    // Passa por cada grupo
    var foiAlocado = false;
    for (let grupo of this.avaliacao.grupos) {
      if (grupo.alunos.length < this.avaliacao.maxIntegrantes) {
        this.entrarNoGrupo(grupo);
        foiAlocado = true;
      }
    }

    // Se não consegui nenhum grupo,
    if (!foiAlocado) {
      // Cria um novo grupo
      this.addGrupo();

      // Entra nele
      this.entrarNoGrupo(this.avaliacao.grupos[this.avaliacao.grupos.length - 1]);
    }
  }

  // DURANTE AVALIAÇÃO
  sinalizarFinalizacao() {
    this.finalizado = true;
    const EU = this.credencialService.loggedUser;
    const MEU_INDEX_INSTANCIA = this.prova.alunos.indexOf(this.prova.alunos.filter(a => a.email == EU.email)[0]);
    this.prova.alunos[MEU_INDEX_INSTANCIA].statusId = 3;
    console.log(this.getMinhaNota());
  }

  // EM CORREÇÃO
  receberProvasCorrigir() {
    if (this.avaliacao.tipoCorrecao != 2 || this.prova.provasParaCorrigir.length > 0)
      return;

    if (this.avaliacao.correcaoParesQtdTipo == 'TODOS') {
      for (let grupo of this.avaliacao.grupos) {
        this.prova.provasParaCorrigir.push({
          id: grupo.instanciaId.toString(),
          corrigida: false
        });
      }
    }
    else {
      while (this.prova.provasParaCorrigir.length < this.avaliacao.correcaoParesQtdNumero) {
        for (let grupo of this.avaliacao.grupos) {
          if (Math.random() > 0.7 && this.prova.id != grupo.instanciaId) {
            this.prova.provasParaCorrigir.push({
              id: grupo.instanciaId,
              corrigida: false
            });
            if (this.prova.provasParaCorrigir.length < this.avaliacao.correcaoParesQtdNumero)
              return;
          }
        }
      }
    }
  }

  // ENCERRADA
  getMinhaNota() {
    var nota = 0;
    for (let [i, questao] of this.prova.questoes.entries()) {
      const questaoTipo = this.comumService.questaoTipos[questao.tipo];
      if (questaoTipo.temCorrecaoAutomatica)
        nota += questaoTipo.getNota(questao, this.gabarito.questoes[i]);
    }
    return nota;
  }
}
