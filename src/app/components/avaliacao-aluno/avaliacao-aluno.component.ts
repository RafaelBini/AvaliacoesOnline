import { MatDialog } from '@angular/material/dialog';
import { Questao } from './../../models/questao';
import { CredencialService } from './../../services/credencial.service';
import { CountdownComponent } from './../countdown/countdown.component';
import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import { Prova } from 'src/app/models/prova';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Avaliacao } from 'src/app/models/avaliacao';
import { ComumService } from './../../services/comum.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { UrlNode } from 'src/app/models/url-node';
import { Subscription } from 'rxjs/internal/Subscription';
import { ProvaService } from 'src/app/services/prova.service';
import { AvaliacaoAlunoCabecalhoComponent } from './avaliacao-aluno-cabecalho/avaliacao-aluno-cabecalho.component';
import { Usuario } from 'src/app/models/usuario';
import { Grupo } from 'src/app/models/grupo';
import { DetalhesProvaComponent } from 'src/app/dialogs/detalhes-prova/detalhes-prova.component';
import { CronometroComponent } from '../cronometro/cronometro.component';


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
    public provaService: ProvaService,
    private snack: MatSnackBar,
    private dialog: MatDialog,) { }


  public avaliacao: Avaliacao = {
    id: "1",
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

  private meuGrupoTemProva: boolean = false;
  private estouIndoInserirProva = false;

  @ViewChild(CountdownComponent) countDown: CountdownComponent;
  @ViewChild(CronometroComponent) cronometro: CronometroComponent;

  ngOnInit(): void {

    this.route.params.subscribe(param => {
      const AVALIACAO_ID = param.id;

      // Se estou logado,
      if (this.credencialService.estouLogado()) {

        this.credencialService.loggedUser.acesso = 'aluno';

        // Começa a ouvir mudanças na avaliação
        this.avaliacaoSubscription = this.avaliacaoService.onAvaliacaoChange(AVALIACAO_ID).subscribe(avaliacao => {

          if (avaliacao == undefined) {
            this.snack.open('Essa avaliação não existe', null, { duration: 4500 });
            this.router.navigate(['']);
            this.avaliacaoSubscription.unsubscribe();
            return;
          }

          console.log("Houveram mudanças na avaliação, atualizando...");

          var avaliacaoAnterior = { ...this.avaliacao };
          this.avaliacao = avaliacao;

          // Verifica se a prova foi removida de mim
          if (this.avaliacao.tipoDisposicao != 0 && this.getMeuGrupoFromAvaliacao(avaliacaoAnterior) != null) {
            if (this.getMeuGrupoFromAvaliacao(avaliacaoAnterior).provaId != null && this.getMeuGrupoNaAvaliacao().provaId == null) {
              this.getMeuGrupoNaAvaliacao().provaId = this.getMeuGrupoFromAvaliacao(avaliacaoAnterior).provaId;
              this.updateAvaliacao("tiraram a prova do meu grupo, mas já coloquei de volta!");
              return;
            }
          }
          else if (this.avaliacao.tipoDisposicao == 0 && this.getEuFromAvaliacao(avaliacaoAnterior) != null) {
            if (this.getEuFromAvaliacao(avaliacaoAnterior).provaId != null && this.getEuNaAvaliacao().provaId == null) {

              this.getEuNaAvaliacao().provaId = this.getEuFromAvaliacao(avaliacaoAnterior).provaId;
              this.updateAvaliacao("tiraram a prova de mim, mas já coloquei de volta!");
              return;
            }

          }

          // Atualiza o caminho
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

          // Me atualizar na avaliação. Se isso realmente ocorreu, encerro a inicialização aqui porque seremos chamados novamente
          if (this.meAtualizarNaAvaliacao())
            return;


          if (this.avaliacao.status >= 1) {
            // Se não tem gabarito ainda
            if (this.gabarito.questoes.length <= 0) {
              // Recebe o gabarito
              this.provaService.getProvaFromId(this.avaliacao.provaGabarito).then(gabarito => {
                this.gabarito = gabarito;
                this.receberProva();
              });
            }
            else {
              this.receberProva();
            }
          }

          var temProvaInterval = setInterval(() => {

            if (this.prova.id != '1') {

              if (this.avaliacao.status == 2) {

                if (this.avaliacao.tipoCorrecao == 2 && this.avaliacao.tipoDisposicao != 0) {
                  this.receberProvasCorrigirEmGrupo();
                }
                else if (this.avaliacao.tipoCorrecao == 2 && this.avaliacao.tipoDisposicao == 0) {
                  this.receberProvasCorrigirIndividual();
                }
                else if (this.avaliacao.tipoPontuacao == 3) {

                  this.avaliacao.status = 3;
                  this.avaliacaoService.updateAvaliacaoByTransacao(avaliacaoParaModificar => {
                    avaliacaoParaModificar.status = this.avaliacao.status;
                    return avaliacaoParaModificar;
                  }, this.avaliacao.id);
                  console.log("Passei direto para próxima por não precisar de correção! TRANSACAO");

                }

              }
              else if (this.avaliacao.status == 3) {

                this.cronometro.pararCronometro();

                // Coloca minha nota
                const MINHA_NOTA = this.provaService.getMinhaNota(this.prova, this.gabarito);
                const NOTA_MAXIMA = this.provaService.getPontuacaoMaxima(this.prova);


                if (this.getGrupoOuEuNaAvaliacao().notaTotal != MINHA_NOTA || this.getGrupoOuEuNaAvaliacao().valorTotal != NOTA_MAXIMA) {

                  this.getGrupoOuEuNaAvaliacao().notaTotal = MINHA_NOTA;
                  this.getGrupoOuEuNaAvaliacao().valorTotal = NOTA_MAXIMA;
                  this.getGrupoOuEuNaAvaliacao().provaCorrigida = true;

                  this.avaliacaoService.updateAvaliacaoByTransacao(avaliacaoParaModificar => {
                    avaliacaoParaModificar.grupos[this.getIndexMeuGrupoNaAvaliacao()].alunos[this.getIndexEuNaAvaliacao()].notaTotal = this.getGrupoOuEuNaAvaliacao().notaTotal;
                    avaliacaoParaModificar.grupos[this.getIndexMeuGrupoNaAvaliacao()].alunos[this.getIndexEuNaAvaliacao()].valorTotal = this.getGrupoOuEuNaAvaliacao().valorTotal;
                    avaliacaoParaModificar.grupos[this.getIndexMeuGrupoNaAvaliacao()].alunos[this.getIndexEuNaAvaliacao()].provaCorrigida = this.getGrupoOuEuNaAvaliacao().provaCorrigida;
                    return avaliacaoParaModificar;
                  }, this.avaliacao.id);
                  console.log("Inseri minha nota -> TRANSACAO");

                }

              }
              clearInterval(temProvaInterval);
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
    if (this.provaSubscription)
      this.provaSubscription.unsubscribe();
  }

  @HostListener('window:beforeunload')
  beforeUnload() {
    if (this.prova != null) {
      this.meRemoverDasQuestoes();
    }

  }

  // GERAL
  updateAvaliacao(motivo: string) {
    console.log(`FIREBASE UPDATE: ${motivo}`);
    this.avaliacaoService.updateAvaliacao(this.avaliacao);
  }
  getDataObjetivo() {

    // Em preparação
    if (this.avaliacao.status == 0) {
      if (this.avaliacao.isInicioIndeterminado)
        return null;
      else
        return this.avaliacao.dtInicio;
    }

    // Durante avaliação
    else if (this.avaliacao.status == 1) {

      // Individual (com duração individual)
      if (this.avaliacao.tipoDisposicao == 0 && !this.avaliacao.isDuracaoIndividualIndeterminada) {


        var terminoDuracaoIndividual = new Date(new Date(this.getEuNaAvaliacao().dtStatus[2]).getTime() + this.avaliacao.duracaoIndividualMs).toISOString();


        // Sem fim na avaliação
        if (this.avaliacao.isInicioCorrecaoIndeterminado) {
          return terminoDuracaoIndividual;
        }

        // Com fim na avaliação
        else {
          if (new Date(terminoDuracaoIndividual) > new Date(this.avaliacao.dtInicioCorrecao) || this.getEuNaAvaliacao().statusId > 2) {
            return this.avaliacao.dtInicioCorrecao;
          }
          else {
            return terminoDuracaoIndividual;
          }
        }

      }

      // Em grupo ou individual (sem duracao indivudual)
      else {
        // Sem fim na avaliacao
        if (this.avaliacao.isInicioCorrecaoIndeterminado)
          return null;
        // Com fim na avaliaçao
        else
          return this.avaliacao.dtInicioCorrecao;
      }



    }

    // Durante correção
    else if (this.avaliacao.status == 2) {
      if (this.avaliacao.isTerminoIndeterminado)
        return null;
      else
        return this.avaliacao.dtTermino;
    }

    // Encerrada
    else {
      return null;
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
    var mudeiAlgo = false;

    for (let [grupoIndex, grupo] of this.avaliacao.grupos.entries()) {
      for (let aluno of grupo.alunos) {
        if (aluno.id == this.credencialService.getLoggedUserIdFromCookie()) {

          if (aluno.online == false) {

            // VALIDAR ATRASADOS
            if (this.avaliacao.status > 1) {
              this.snack.open("Avaliação encerrada: Você não participou desta avaliação.", null, { duration: 5500 });
              this.router.navigate(['']);
              return true;
            }
            else if (this.avaliacao.status > 0 && this.avaliacao.isBloqueadoAlunoAtrasado) {
              this.snack.open("Avaliação já iniciada: Você não pode entrar atrasado.", null, { duration: 5500 });
              this.router.navigate(['']);
              return true;
            }

            aluno.online = true;
            mudeiAlgo = true;
          }

          // SE ESTOU REALIZANDO A AVALIAÇÃO MAS MEU STATUS ESTÁ DESATUALIZADO,
          if (this.avaliacao.status == 1 && (aluno.statusId == 0 || aluno.statusId == null)) {
            aluno.statusId = 2;
            aluno.dtStatus = this.comumService.insertInArray(aluno.dtStatus, 2, new Date().toISOString());
            mudeiAlgo = true;
          }

          estouNaAvaliacao = true;
          break;
        }
      }
      if (estouNaAvaliacao && mudeiAlgo) {

        this.avaliacaoService.updateAvaliacaoByTransacao(avaliacaoParaModificar => {
          this.getEuFromAvaliacao(avaliacaoParaModificar).statusId = this.getEuNaAvaliacao().statusId;
          this.getEuFromAvaliacao(avaliacaoParaModificar).dtStatus = this.getEuNaAvaliacao().dtStatus;
          this.getEuFromAvaliacao(avaliacaoParaModificar).online = true;
          return avaliacaoParaModificar;
        }, this.avaliacao.id)
          .then(() => {
            console.log('FIREBASE UPDATE: Atualizei eu avaliação por TRANSACTION');
          });

        break;
      }
    }
    if (!estouNaAvaliacao) {

      // VALIDAR ATRASADOS
      if (this.avaliacao.status > 1) {
        this.snack.open("Avaliação encerrada: Você não participou desta avaliação.", null, { duration: 5500 });
        this.router.navigate(['']);
        return true;
      }
      else if (this.avaliacao.status > 0 && this.avaliacao.isBloqueadoAlunoAtrasado) {
        this.snack.open("Avaliação já iniciada: Você não pode entrar atrasado.", null, { duration: 5500 });
        this.router.navigate(['']);
        return true;
      }

      this.entrarEmGrupoAleatorio();
    }
    return !estouNaAvaliacao || (estouNaAvaliacao && mudeiAlgo);
  }
  atualizarStatusConformeTempo() {
    setTimeout(() => {

      var statusAntes = this.avaliacao.status;
      var altereiStatusIndividual = false;

      this.avaliacao.status = this.avaliacaoService.getStatusConformeTempo(this.avaliacao);

      if (this.avaliacao.tipoDisposicao == 0 && !this.avaliacao.isDuracaoIndividualIndeterminada) {

        var duracaoIndividual = new Date(this.getEuNaAvaliacao().dtStatus[2]).getTime() + this.avaliacao.duracaoIndividualMs;
        var agoraMs = new Date().getTime();
        if (duracaoIndividual < agoraMs && (this.getEuNaAvaliacao().dtStatus[3] == '' || this.getEuNaAvaliacao().dtStatus[3] == null)) {
          altereiStatusIndividual = true;
          this.getEuNaAvaliacao().dtStatus[3] = new Date().toISOString();
          this.getEuNaAvaliacao().statusId = 3;
        }
      }

      if (statusAntes != this.avaliacao.status || altereiStatusIndividual) {
        this.avaliacaoService.updateAvaliacaoByTransacao(avaliacaoParaModificar => {
          avaliacaoParaModificar.status = this.avaliacao.status;
          return avaliacaoParaModificar;
        }, this.avaliacao.id);
        console.log("Atualizei o status da avaliacao conforme o tempo!! TRANSACAO");
      }

      this.countDown.iniciarTimer();

    }, 3000);

  }

  // EM PREPARAÇÃO
  addGrupo() {
    const novoLength = this.avaliacao.grupos.push({
      numero: this.avaliacao.grupos.length + 1,
      provaId: null,
      alunos: []
    });
    this.entrarNoGrupo(this.avaliacao.grupos[novoLength - 1]);
    setTimeout(() => {
      window.scroll({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 200);
  }
  entrarNoGrupo(grupo) {
    var me: Usuario = {
      id: this.credencialService.loggedUser.id,
      nome: this.credencialService.loggedUser.nome,
      email: this.credencialService.loggedUser.email,
      img: this.credencialService.loggedUser.img || null,
      online: true,
      statusId: 0,
      dtStatus: ['', '', '', '', '', ''],
    };
    me.dtStatus = this.comumService.insertInArray(me.dtStatus, 0, new Date().toISOString());

    // Atualiza o status
    if (this.avaliacao.status == 1 && (me.statusId < 2 || me.statusId == null)) {
      me.statusId = 2;
      me.dtStatus = this.comumService.insertInArray(me.dtStatus, 2, new Date().toISOString());
    }

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
    grupo.alunos.push(me);
    this.deletarGruposVazios();
    this.redefinirIdentificacaoDosGrupos();

    // Salva no bd   
    this.updateAvaliacao("Entrei em um grupo!!")
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
    this.getEuNaAvaliacao().statusId = 3;
    this.getEuNaAvaliacao().dtStatus = this.comumService.insertInArray(this.getEuNaAvaliacao().dtStatus, 3, new Date().toISOString());

    this.avaliacaoService.updateAvaliacaoByTransacao(avaliacaoParaModificar => {
      avaliacaoParaModificar.grupos[this.getIndexMeuGrupoNaAvaliacao()].alunos[this.getIndexEuNaAvaliacao()].statusId = this.getEuNaAvaliacao().statusId;
      avaliacaoParaModificar.grupos[this.getIndexMeuGrupoNaAvaliacao()].alunos[this.getIndexEuNaAvaliacao()].dtStatus = this.getEuNaAvaliacao().dtStatus;
      return avaliacaoParaModificar;
    }, this.avaliacao.id);

    console.log("Sinalizei a finalização! TRANSACAO");

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
  getIndexEuNaAvaliacao() {
    for (let grupo of this.avaliacao.grupos) {
      var count = 0;
      for (let aluno of grupo.alunos) {
        if (aluno.id == this.credencialService.getLoggedUserIdFromCookie())
          return count;
        count++;
      }
    }
    return null;
  }
  getEuFromAvaliacao(avaliacao: Avaliacao) {
    for (let grupo of avaliacao.grupos) {
      var count = 0;
      for (let aluno of grupo.alunos) {
        if (aluno.id == this.credencialService.getLoggedUserIdFromCookie())
          return avaliacao.grupos[avaliacao.grupos.indexOf(grupo)].alunos[count];
        count++;
      }
    }
    return null;
  }
  getEuNaProva(): Usuario {
    const EU = this.credencialService.loggedUser;
    const MEU_INDEX_PROVA = this.prova.alunos.indexOf(this.prova.alunos.filter(a => a.id == EU.id)[0]);
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
  getIndexMeuGrupoNaAvaliacao() {
    for (let grupo of this.avaliacao.grupos) {
      for (let aluno of grupo.alunos) {
        if (aluno.id == this.credencialService.getLoggedUserIdFromCookie())
          return this.avaliacao.grupos.indexOf(grupo);
      }
    }
  }
  getMeuGrupoFromAvaliacao(avaliacao: Avaliacao): Grupo {
    for (let grupo of avaliacao.grupos) {
      for (let aluno of grupo.alunos) {
        if (aluno.id == this.credencialService.getLoggedUserIdFromCookie())
          return avaliacao.grupos[avaliacao.grupos.indexOf(grupo)];
      }
    }
    return {
      alunos: []
    }
  }
  getGrupoOuEuNaAvaliacao(): Grupo | Usuario {
    if (this.avaliacao.tipoDisposicao == 0)
      return this.getEuNaAvaliacao();
    else
      return this.getMeuGrupoNaAvaliacao();
  }
  getFinalizado() {
    if (this.avaliacao.grupos.length > 0) {
      if (this.getEuNaAvaliacao())
        return this.getEuNaAvaliacao().statusId >= 3;
    }

    return false;
  }
  estouBloqueado() {

    if (this.avaliacao.grupos.length > 0) {
      if (this.getEuNaAvaliacao())
        return this.getEuNaAvaliacao().statusId == 1;
    }

    return false;
  }
  respostaAlterada() {
    this.provaService.updateProva(this.prova);
  }
  inserirNovaProva() {
    // Certifica-se de ter o gabarito
    if (this.gabarito.questoes.length <= 0) {
      console.log("Não tenho o gabarito!! Não vou tentar inserir prova")
      return;
    }

    if (this.estouIndoInserirProva) {
      console.log("Já estou indo atrás de inserir uma prova, não precio fazer nada");
      return;
    }
    this.estouIndoInserirProva = true;
    console.log("AVISO: estou indo inserir prova!!");

    const PROVA_EM_BRANCO = this.provaService.getProvaFromGabarito(this.gabarito);
    PROVA_EM_BRANCO.alunos.push(this.getEuNaAvaliacao());

    // Insere uma nova prova
    this.provaService.insertProvaByTransacao(PROVA_EM_BRANCO, this.getIndexMeuGrupoNaAvaliacao()).then(() => {
      console.log('Inseri um prova para o grupo -- TRANSAÇÃO MODE');
    })
      .catch(reason => {
        console.log("Tentei, mas não consegui inserir prova -- TRANSACAO MODE");
        console.log(reason);
      });

  }
  meRemoverDasQuestoes() {
    var estavaEmQuestao = false;
    for (let q of this.prova.questoes) {
      if (q.usuarioUltimaModificacao == null)
        continue;
      else if (q.usuarioUltimaModificacao.id == this.credencialService.getLoggedUserIdFromCookie()) {
        q.usuarioUltimaModificacao = null;
        estavaEmQuestao = true;
      }
    }
    if (estavaEmQuestao) {
      this.provaService.updateProva(this.prova);
    }
  }
  receberProva() {

    if ((this.prova.id != '1' && this.provaSubscription != null) || (this.avaliacao.tipoDisposicao == 0 && this.prova.id != '1')) {
      console.log("Já tenho a prova, não vou continuar");
      return;
    }

    var EU_NA_AVALIACAO = this.getEuNaAvaliacao();

    // INDIVIDUAL
    if (this.avaliacao.tipoDisposicao == 0) {

      // Se estou sem prova para fazer,
      if (this.getEuNaAvaliacao().provaId == null) {

        // VALIDAR ATRASADOS
        if (this.avaliacao.status > 1) {
          return;
        }
        else if (this.avaliacao.status == 1 && !this.getEuNaAvaliacao().online && this.avaliacao.isBloqueadoAlunoAtrasado) {
          this.snack.open("Avaliação já iniciada: Você não pode entrar atrasado.", null, { duration: 5500 });
          this.router.navigate(['']);
          return;
        }

        if (this.gabarito.questoes.length > 0) {

          const PROVA_EM_BRANCO = this.provaService.getProvaFromGabarito(this.gabarito);
          PROVA_EM_BRANCO.alunos = [];
          PROVA_EM_BRANCO.provasParaCorrigir = [];
          PROVA_EM_BRANCO.alunos.push(this.getEuNaAvaliacao());

          if (this.estouIndoInserirProva) {
            console.log("Já estou indo atrás de inserir uma prova, não precio fazer nada");
            return;
          }
          this.estouIndoInserirProva = true;
          console.log("AVISO: estou indo inserir prova!!");

          // Insere uma nova prova
          this.provaService.insertProva(PROVA_EM_BRANCO).then(novaProva => {
            this.prova = novaProva;
            this.getEuNaAvaliacao().provaId = this.prova.id;
            this.getEuNaAvaliacao().statusId = 2;
            this.getEuNaAvaliacao().dtStatus = this.comumService.insertInArray(this.getEuNaAvaliacao().dtStatus, 2, new Date().toISOString());
            this.updateAvaliacao("Inseri uma nova prova!")

          }).catch(reason => this.snack.open('Falha ao receber a prova', null, { duration: 3500 }));


        }


      }

      // Se já estou atribuido a uma prova, recebo a prova
      else {
        console.log("Já tenho uma prova atribuida à mim!")
        this.provaService.getProvaFromId(EU_NA_AVALIACAO.provaId).then(prova => {
          this.prova = prova;
          console.log("Recebi a prova")
        });
      }

    }
    // EM GRUPO
    else {


      // Se meu grupo não tem prova atribuida,              
      if (this.getMeuGrupoNaAvaliacao().provaId == null) {

        // VALIDAR ATRASADOS
        if (this.avaliacao.status > 1) {
          return;
        }
        else if (this.avaliacao.status == 1 && !this.getEuNaAvaliacao().online && this.avaliacao.isBloqueadoAlunoAtrasado) {
          this.snack.open("Avaliação já iniciada: Você não pode entrar atrasado.", null, { duration: 5500 });
          this.router.navigate(['']);
          return;
        }

        // Insiro a prova
        this.inserirNovaProva();


      }

      // Se meu grupo já tem prova atribuida, recebe-a
      else {
        console.log("Que beleza! meu grupo já tem uma prova atribuida, vou pegar!");
        this.meuGrupoTemProva = true;



        if (this.provaSubscription == null) {

          this.provaSubscription = this.provaService.onProvaChange(this.getMeuGrupoNaAvaliacao().provaId).subscribe(prova => {

            const provaTipada = prova as Prova;

            console.log("Prova alterada", provaTipada.id);


            // Recebe a prova toda
            var provaAtualizada = { ...provaTipada };
            provaAtualizada.id = this.getMeuGrupoNaAvaliacao().provaId;

            // Atualiza as questões
            var tenhoAlgoMaisAtualizado = false;
            if (this.prova.questoes.length > 0) {
              for (var i = 0; i < provaAtualizada.questoes.length; i++) {
                if (provaAtualizada.questoes[i].ultimaModificacao < this.prova.questoes[i].ultimaModificacao) {
                  tenhoAlgoMaisAtualizado = true;
                  provaAtualizada.questoes[i] = this.prova.questoes[i];
                }
              }
            }

            this.prova = provaAtualizada;

            // Se eu não estou na prova, eu entro
            if (this.getEuNaProva() == null) {

              EU_NA_AVALIACAO.statusId = 2;
              EU_NA_AVALIACAO.dtStatus = this.comumService.insertInArray(EU_NA_AVALIACAO.dtStatus, 2, new Date().toISOString());
              this.prova.alunos.push(EU_NA_AVALIACAO);
              this.provaService.updateProva(this.prova);

              this.updateAvaliacao("Eita, não to na prova!, vou me add com status novo");
            }
            else if (tenhoAlgoMaisAtualizado) {
              console.log("Mandei atualizar de novo!", this.prova.questoes[0])
              this.provaService.updateProva(this.prova);
            }


          });

        }


      }

    }
  }
  abrirDetalhes(aluno: Usuario) {
    this.dialog.open(DetalhesProvaComponent, {
      data: aluno
    });
  }


  // EM CORREÇÃO
  receberProvasCorrigirEmGrupo() {
    if (this.avaliacao.tipoCorrecao != 2 || this.prova.provasParaCorrigir.length > 0 || this.avaliacao.tipoDisposicao == 0)
      return;

    const Q = this.getNumberFromString(this.avaliacao.id);
    var NUM = this.avaliacao.correcaoParesQtdNumero | 1;

    if ((this.avaliacao.correcaoParesQtdTipo == 'TODOS') || (NUM > this.avaliacao.grupos.length - 1)) {
      NUM = this.avaliacao.grupos.length - 1;
    }

    const MINHA_POSICAO = this.getIndexMeuGrupoNaAvaliacao();

    var selecionados: Array<Prova> = [];
    var rounds = 0;

    for (let i = (MINHA_POSICAO + Q); selecionados.length < NUM; i++) {
      var a = i % this.avaliacao.grupos.length;

      if (a != MINHA_POSICAO && this.avaliacao.grupos[a].provaId != null && (selecionados.filter(s => s.id == this.avaliacao.grupos[a].provaId).length <= 0)) {
        selecionados.push({
          id: this.avaliacao.grupos[a].provaId,
          corrigida: false,
        });
      }
      else if (a == MINHA_POSICAO) {
        rounds++;
        if (rounds > 1)
          break;
      }
    }

    this.prova.provasParaCorrigir = selecionados;

    this.provaService.updateProva(this.prova);

    console.log("Recebi provas para corrigir");
  }
  receberProvasCorrigirIndividual() {
    if (this.avaliacao.tipoCorrecao != 2 || this.prova.provasParaCorrigir.length > 0 || this.avaliacao.tipoDisposicao != 0)
      return;

    const Q = this.getNumberFromString(this.avaliacao.id);
    var NUM = this.avaliacao.correcaoParesQtdNumero | 1;

    if ((this.avaliacao.correcaoParesQtdTipo == 'TODOS') || (NUM > this.avaliacao.grupos[0].alunos.length - 1)) {
      NUM = this.avaliacao.grupos[0].alunos.length - 1;
    }

    const MINHA_POSICAO = this.getIndexEuNaAvaliacao();

    var selecionados: Array<Prova> = [];
    var rounds = 0;

    for (let i = (MINHA_POSICAO + Q); selecionados.length < NUM; i++) {
      var a = i % this.avaliacao.grupos[0].alunos.length;

      if (a != MINHA_POSICAO && this.avaliacao.grupos[0].alunos[a].provaId != null && (selecionados.filter(s => s.id == this.avaliacao.grupos[0].alunos[a].provaId).length <= 0)) {
        selecionados.push({
          id: this.avaliacao.grupos[0].alunos[a].provaId,
          corrigida: false,
        });
      }
      else if (a == MINHA_POSICAO) {
        rounds++;
        if (rounds > 1)
          break;
      }

    }

    this.prova.provasParaCorrigir = selecionados;

    this.provaService.updateProva(this.prova);

    console.log("Recebi provas para corrigir");
  }
  getNumberFromString(texto: string): number {
    return texto.charCodeAt(0);
  }

  // ENCERRADA

}
