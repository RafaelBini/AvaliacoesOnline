import { CountdownComponent } from './../countdown/countdown.component';
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
import { Grupo } from 'src/app/models/grupo';


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


  public avaliacao: Avaliacao = {
    titulo: "",
    descricao: "",
    status: 0,
    professorId: '',
    professorNome: '',
    limitarNumIntegrantes: true,
    maxIntegrantes: 3,
    correcaoParesQtdNumero: 3,
    correcaoParesQtdTipo: 'DEFINIR',
    tipoDisposicao: 2,
    tipoCorrecao: 2,
    tipoPontuacao: 0,
    grupos: [],
  }

  public gabarito: Prova = {
    questoes: [],
  }

  public prova: Prova = {
    id: '1',
    avaliacaoId: "1",
    status: 0,
    questoes: [],
    alunos: [],
    provasParaCorrigir: [

    ]
  }

  public caminho: Array<UrlNode> = [
    { nome: `Aluno`, url: `/aluno` },
    { nome: `Avaliações`, url: `/aluno/avaliacoes` },
    { nome: `${this.avaliacao.titulo}`, url: `#` },
  ];

  private avaliacaoSubscription: Subscription;
  private provaSubscription: Subscription;

  @ViewChild(CountdownComponent) countDown: CountdownComponent;

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
          if (this.avaliacao.professorId == this.credencialService.getLoggedUserIdFromCookie()) {
            this.credencialService.loggedUser.acesso = 'professor';
            this.router.navigate([`professor/avaliacao/${AVALIACAO_ID}`]);
            return;
          }

          this.meAtualizarNaAvaliacao();

          if (this.avaliacao.status == 1) {

            if (this.gabarito.questoes.length <= 0) {
              this.receberGabarito();
            }

            var EU_NA_AVALIACAO = this.getEuNaAvaliacao();

            // INDIVIDUAL
            if (this.avaliacao.tipoDisposicao == 0) {

              // Se estou sem prova para fazer, pego uma prova
              if (EU_NA_AVALIACAO.provaId == null) {

                // Certifica-se de ter o gabarito,
                var recebeGabaritoInterval = setInterval(() => {
                  if (this.gabarito.questoes.length > 0) {

                    const PROVA_EM_BRANCO = this.provaService.getProvaFromGabarito(this.gabarito);
                    PROVA_EM_BRANCO.alunos = [];
                    PROVA_EM_BRANCO.alunos.push(EU_NA_AVALIACAO);

                    // Insere uma nova prova
                    this.provaService.insertProva(PROVA_EM_BRANCO).then(novaProva => {
                      this.prova = novaProva;
                      EU_NA_AVALIACAO.provaId = this.prova.id;
                      EU_NA_AVALIACAO.statusId = 2;
                      this.avaliacaoService.updateAvaliacao(this.avaliacao);

                    }).catch(reason => this.snack.open('Falha ao receber a prova', null, { duration: 3500 }));

                    clearInterval(recebeGabaritoInterval);
                  }
                });

              }

              // Se já estou atribuido a uma prova, recebo a prova
              else {
                this.provaService.getProvaFromId(EU_NA_AVALIACAO.provaId).then(prova => {
                  this.prova = prova;
                });
              }

            }

            // EM GRUPO
            else {

              var MEU_GRUPO_NA_AVALIACAO = this.getMeuGrupoNaAvaliacao();

              // Se meu grupo não tem prova atribuida,
              if (MEU_GRUPO_NA_AVALIACAO.provaId == null) {

                // Certifica-se de ter o gabarito,
                var recebeGabaritoInterval = setInterval(() => {
                  if (this.gabarito.questoes.length > 0) {

                    const PROVA_EM_BRANCO = this.provaService.getProvaFromGabarito(this.gabarito);
                    PROVA_EM_BRANCO.alunos = [];
                    PROVA_EM_BRANCO.alunos.push(EU_NA_AVALIACAO);

                    // Insere uma nova prova
                    this.provaService.insertProva(PROVA_EM_BRANCO).then(novaProva => {
                      this.prova = novaProva;
                      MEU_GRUPO_NA_AVALIACAO.provaId = this.prova.id;
                      EU_NA_AVALIACAO.statusId = 2;
                      this.getEuNaProva().statusId = 2;
                      this.avaliacaoService.updateAvaliacao(this.avaliacao);

                    }).catch(reason => this.comumService.notificarErro('Falha ao receber a prova', reason));

                    clearInterval(recebeGabaritoInterval);
                  }
                });

              }

              // Se meu grupo já tem prova atribuida, recebe-a
              else {

                if (this.provaSubscription == null) {

                  this.provaSubscription = this.provaService.onProvaChange(MEU_GRUPO_NA_AVALIACAO.provaId).subscribe(prova => {
                    this.prova = prova;
                    this.prova.id = MEU_GRUPO_NA_AVALIACAO.provaId;

                    // Se eu não estou na prova, eu entro                  
                    if (this.getEuNaProva() == null) {
                      EU_NA_AVALIACAO.statusId = 2;
                      this.prova.alunos.push(EU_NA_AVALIACAO);
                      this.provaService.updateProva(this.prova);
                      this.avaliacaoService.updateAvaliacao(this.avaliacao);
                    }
                    else if (this.getEuNaProva().statusId != 2) {
                      this.getEuNaProva().statusId = 2;
                      this.provaService.updateProva(this.prova);
                    }
                    else if (EU_NA_AVALIACAO.statusId != 2) {
                      EU_NA_AVALIACAO.statusId = 2;
                      this.avaliacaoService.updateAvaliacao(this.avaliacao);
                    }


                  });

                }


              }

            }

          }
          else if (this.avaliacao.status == 2) {
            if (this.avaliacao.tipoCorrecao == 3)
              this.receberProvasCorrigir();
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
    if (this.provaSubscription)
      this.provaSubscription.unsubscribe();
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
  meAtualizarNaAvaliacao() {
    // Passa por cada aluno na avaliação para verificar se eu já estou na avaliação
    var estouNaAvaliacao = false;
    for (let grupo of this.avaliacao.grupos) {
      for (let aluno of grupo.alunos) {
        if (aluno.id == this.credencialService.getLoggedUserIdFromCookie()) {
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
  }
  atualizarStatusConformeTempo() {
    setTimeout(() => {
      var agora = new Date();

      if (agora < new Date(this.avaliacao.dtInicio) || (this.avaliacao.status == 0 && this.avaliacao.isInicioIndeterminado)) {
        this.avaliacao.status = 0;
      }
      else if (agora < new Date(this.avaliacao.dtInicioCorrecao) || (this.avaliacao.status == 1 && this.avaliacao.isInicioCorrecaoIndeterminado)) {
        this.avaliacao.status = 1;
      }
      else if (agora < new Date(this.avaliacao.dtTermino) || (this.avaliacao.status == 2 && this.avaliacao.isTerminoIndeterminado)) {
        this.avaliacao.status = 2;
      }
      else {
        this.avaliacao.status = 3;
      }

      this.countDown.iniciarTimer();

      this.avaliacaoService.updateAvaliacao(this.avaliacao);
    }, 3000);

  }

  // EM PREPARAÇÃO
  addGrupo() {
    const novoLength = this.avaliacao.grupos.push({ numero: this.avaliacao.grupos.length + 1, provaId: null, alunos: [] });
    this.entrarNoGrupo(this.avaliacao.grupos[novoLength - 1]);
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
    if (grupo.alunos.length >= this.avaliacao.maxIntegrantes && this.avaliacao.limitarNumIntegrantes && this.avaliacao.tipoDisposicao != 0) {
      this.snack.open("Este grupo já está cheio", null, {
        duration: 3000
      });
      return;
    }

    // Passa por cada grupo da avaliação
    for (let g of this.avaliacao.grupos) {
      for (let aluno of g.alunos) {
        // Se estou nesse grupo, me retiro
        if (aluno.id == this.credencialService.getLoggedUserIdFromCookie()) {
          g.alunos = g.alunos.filter(a => a.id != this.credencialService.getLoggedUserIdFromCookie());
        }
      }

    }

    // Insere no grupo
    me.online = true;
    grupo.alunos.push(me);
    this.deletarGruposVazios();
    this.redefinirIdentificacaoDosGrupos();

    // Salva no bd
    this.avaliacaoService.updateAvaliacao(this.avaliacao);
  }
  temGrupoVazio() {
    return this.avaliacao.grupos.filter(g => g.alunos.length <= 0).length > 0;
  }
  entrarEmGrupoAleatorio() {
    if (this.avaliacao.tipoDisposicao == 0) {
      this.entrarNoGrupo(this.avaliacao.grupos[0]);
      return;
    }

    // Passa por cada grupo
    var foiAlocado = false;
    for (let grupo of this.avaliacao.grupos) {
      if (grupo.alunos.length < this.avaliacao.maxIntegrantes && this.avaliacao.limitarNumIntegrantes) {
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
  deletarGruposVazios() {
    this.avaliacao.grupos = this.avaliacao.grupos.filter(g => g.alunos.length > 0);
  }
  redefinirIdentificacaoDosGrupos() {
    var count = 1;
    for (let grupo of this.avaliacao.grupos) {
      grupo.numero = count++;
    }
  }

  // DURANTE AVALIAÇÃO
  sinalizarFinalizacao() {

    this.getEuNaProva().statusId = 3;
    this.getEuNaAvaliacao().statusId = 3;

    this.provaService.updateProva(this.prova);
    this.avaliacaoService.updateAvaliacao(this.avaliacao);
  }
  receberGabarito() {
    this.provaService.getProvaFromId(this.avaliacao.provaGabarito).then(gabarito => {
      this.gabarito = gabarito;
    });
  }
  getEuNaAvaliacao(): Usuario {
    for (let grupo of this.avaliacao.grupos) {
      var count = 0;
      for (let aluno of grupo.alunos) {
        if (aluno.id == this.credencialService.getLoggedUserIdFromCookie())
          return this.avaliacao.grupos[this.avaliacao.grupos.indexOf(grupo)].alunos[count];
        count++;
      }
    }
    return null;
  }
  getEuNaProva(): Usuario {
    const EU = this.credencialService.loggedUser;
    const MEU_INDEX_PROVA = this.prova.alunos.indexOf(this.prova.alunos.filter(a => a.email == EU.email)[0]);
    return this.prova.alunos[MEU_INDEX_PROVA];
  }
  getMeuGrupoNaAvaliacao(): Grupo {
    for (let grupo of this.avaliacao.grupos) {
      for (let aluno of grupo.alunos) {
        if (aluno.id == this.credencialService.getLoggedUserIdFromCookie())
          return this.avaliacao.grupos[this.avaliacao.grupos.indexOf(grupo)];
      }
    }
    return {
      alunos: []
    }
  }
  getFinalizado() {
    if (this.avaliacao.grupos.length > 0) {
      if (this.getEuNaAvaliacao())
        return this.getEuNaAvaliacao().statusId >= 3;
    }

    return false;
  }
  respostaAlterada() {
    this.provaService.updateProva(this.prova);
  }


  // EM CORREÇÃO
  receberProvasCorrigir() {
    if (this.avaliacao.tipoCorrecao != 2 || this.prova.provasParaCorrigir.length > 0)
      return;

    if (this.avaliacao.correcaoParesQtdTipo == 'TODOS') {
      for (let grupo of this.avaliacao.grupos) {
        this.prova.provasParaCorrigir.push({
          id: grupo.provaId.toString(),
          corrigida: false
        });
      }
    }
    else {
      while (this.prova.provasParaCorrigir.length < this.avaliacao.correcaoParesQtdNumero) {
        for (let grupo of this.avaliacao.grupos) {
          if (Math.random() > 0.7 && this.prova.id != grupo.provaId) {
            this.prova.provasParaCorrigir.push({
              id: grupo.provaId,
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
