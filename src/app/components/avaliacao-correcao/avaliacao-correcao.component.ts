import { Subscription } from 'rxjs/internal/Subscription';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import { ProvaService } from 'src/app/services/prova.service';
import { ComumService } from 'src/app/services/comum.service';
import { Questao } from './../../models/questao';
import { Avaliacao } from 'src/app/models/avaliacao';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlNode } from 'src/app/models/url-node';
import { Prova } from 'src/app/models/prova';
import { CredencialService } from 'src/app/services/credencial.service';
import { Grupo } from 'src/app/models/grupo';
import { Usuario } from 'src/app/models/usuario';
import { Correcao } from 'src/app/models/correcao';

@Component({
  selector: 'app-avaliacao-correcao',
  templateUrl: './avaliacao-correcao.component.html',
  styleUrls: ['./avaliacao-correcao.component.css']
})
export class AvaliacaoCorrecaoComponent implements OnInit, OnDestroy {

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private snack: MatSnackBar,
    public comumService: ComumService,
    public credencialService: CredencialService,
    public provaService: ProvaService,
    private avaliacaoService: AvaliacaoService
  ) { }

  public visaoTipo: string = "correcao";
  public userTipo: string = "aluno";
  public caminho: Array<UrlNode>;

  public avaliacao: Avaliacao = {
    status: 0,
    id: "1",
    titulo: "Avaliacao 01",
    descricao: "",
    dtInicio: "",
    isInicioIndeterminado: false,
    dtInicioCorrecao: "string",
    isInicioCorrecaoIndeterminado: true,
    dtTermino: "string",
    isOrdemAleatoria: false,
    isBloqueadoAlunoAtrasado: false,
    tipoDisposicao: 1,
    tipoCorrecao: 2,
    correcaoParesQtdTipo: "string",
    correcaoParesQtdNumero: 1,
    tipoPontuacao: 1,
    isTerminoIndeterminado: true,

  }

  public prova: Prova = {
    id: '1',
    questoes: [],
  }

  public gabarito: Prova = {
    id: '1',
    questoes: [],
  }

  private provaSubscription: Subscription;

  ngOnInit(): void {
    this.route.url.subscribe((value) => {

      this.userTipo = value[0].path;
      this.visaoTipo = value[2].path;
      var provaId = value[3].path;


      // Começa a ouvir a prova
      if (this.provaSubscription == null) {

        this.provaSubscription = this.provaService.onProvaChange(provaId).subscribe(prova => {

          if (prova == undefined) {
            this.snack.open("Avaliação não encontrada", null, { duration: 4500 });
            this.router.navigate(['']);
            return;
          }


          const provaTipada = prova as Prova;

          console.log("Peguei uma prova pra mim!!", provaTipada.id);


          // Recebe a prova toda
          var provaAtualizada = { ...provaTipada };
          provaAtualizada.id = provaId;

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



        });
      }

      // Certifico-me de ter recebido a prova
      var provaInterval = setInterval(() => {
        if (this.prova.id != '1') {

          // Recebe a avaliação
          this.avaliacaoService.getAvaliacaoFromId(this.prova.avaliacaoId).then(avaliacao => {

            this.avaliacao = avaliacao;

            // Verifica se sou um aluno se passando por professor
            if (this.avaliacao.professorId != this.credencialService.getLoggedUserIdFromCookie() && this.userTipo == 'professor') {
              this.snack.open("Você não é o professor desta avaliação", null, { duration: 5500 });
              this.router.navigate(['']);
              return;
            }
            else if (this.avaliacao.professorId == this.credencialService.getLoggedUserIdFromCookie() && this.userTipo != 'professor') {
              this.snack.open("Você não é aluno desta avaliação", null, { duration: 5500 });
              this.router.navigate(['']);
              return;
            }
            // Verifica se sou um aluno que não foi designado para corrigir esta prova
            this.fuiDesignadoParaEssaProva().catch(() => {

              if ((this.visaoTipo == "correcao" && this.userTipo == "aluno" && this.avaliacao.tipoCorrecao != 3) ||
                (this.visaoTipo == "correcao" && this.userTipo == "aluno" && this.avaliacao.tipoCorrecao == 3 && !this.respondiEssaProva()) ||
                (this.visaoTipo == 'consulta' && this.userTipo == "aluno" && !this.respondiEssaProva())) {

                this.snack.open("Você não foi designado para essa prova", null, { duration: 5500 });
                this.router.navigate(['']);
                return;

              }

            });
            // Verifica se sou aluno tentando corrigir a prova que já foi encerrada
            if (this.userTipo == 'aluno' && this.visaoTipo == 'correcao' && this.avaliacao.status > 2) {
              this.snack.open("Avaliaçao encerrada", null, { duration: 5500 });
              this.router.navigate(['']);
              return;
            }
            else if (this.visaoTipo == 'consulta' && !this.respondiEssaProva()) {
              this.snack.open("Você não pode consultar a prova de  outro aluno", null, { duration: 5500 });
              this.router.navigate(['']);
              return;
            }

            // Recebe o gabarito
            this.provaService.getProvaFromId(this.avaliacao.provaGabarito).then(gabarito => {
              this.gabarito = gabarito;

              this.inserirNotasPadrao();

            });

            this.definirCaminho();


          });



          clearInterval(provaInterval);
        }
      });

    });

  }

  ngOnDestroy() {
    if (this.provaSubscription)
      this.provaSubscription.unsubscribe();
  }

  @HostListener('window:beforeunload')
  beforeUnload() {
    if (this.prova != null) {
      this.meRemoverDasQuestoes();
    }
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

  respondiEssaProva() {
    return this.prova.alunos.filter(a => a.id == this.credencialService.getLoggedUserIdFromCookie()).length > 0;
  }
  fuiDesignadoParaEssaProva() {
    return new Promise((resolve, reject) => {
      var MINHA_PROVA_ID = null;

      if (this.avaliacao.tipoDisposicao != 0)
        MINHA_PROVA_ID = this.getMeuGrupoNaAvaliacao().provaId;
      else
        MINHA_PROVA_ID = this.getEuNaAvaliacao().provaId;

      this.provaService.getProvaFromId(MINHA_PROVA_ID).then(minhaProva => {

        for (let provaCorrigir of minhaProva.provasParaCorrigir) {
          if (provaCorrigir.id == this.prova.id) {
            resolve();
          }
        }

        reject();

      }).catch(reason => {
        reject();
      });
    });

  }

  correcaoAlterada() {
    this.validarNotas().then(() => {
      console.log('FIREBASE UPDATE: atualizei prova');
      this.provaService.updateProva(this.prova);
    }).catch(reason => {
      console.log('FIREBASE UPDATE: atualizei prova');
      this.provaService.updateProva(this.prova);
    });

  }

  finalizarCorrecao() {

    this.validarNotas().then(() => {

      this.getGrupoOuAlunoNaAvaliacao().provaCorrigida = true;
      this.getGrupoOuAlunoNaAvaliacao().notaTotal = this.provaService.getMinhaNota(this.prova, this.gabarito);
      this.getGrupoOuAlunoNaAvaliacao().valorTotal = this.provaService.getPontuacaoMaxima(this.prova);

      if (this.userTipo == 'aluno') {
        var MINHA_PROVA_ID = null;

        MINHA_PROVA_ID = this.getGrupoOuAlunoNaAvaliacao().provaId;

        this.provaService.getProvaFromId(MINHA_PROVA_ID).then(minhaProva => {
          var acheiProva = false;
          for (let provaParaCorrigir of minhaProva.provasParaCorrigir) {
            if (provaParaCorrigir.id == this.prova.id) {
              provaParaCorrigir.corrigida = true;
              provaParaCorrigir.notaTotal = this.provaService.getMinhaNota(this.prova, this.gabarito);
              provaParaCorrigir.valorTotal = this.provaService.getPontuacaoMaxima(this.prova);
              acheiProva = true;
              break;
            }
          }
          if (acheiProva) {
            console.log("FIREBASE UPDATE: Atualizei a minha prova com a correção feita");
            this.provaService.updateProva(minhaProva);
          }
        });
      }


      this.avaliacaoService.updateAvaliacaoByTransacao(avaliacaoParaModificar => {
        this.getGrupoOuAlunoFromAvaliacao(avaliacaoParaModificar).notaTotal = this.getGrupoOuAlunoNaAvaliacao().notaTotal;
        this.getGrupoOuAlunoFromAvaliacao(avaliacaoParaModificar).valorTotal = this.getGrupoOuAlunoNaAvaliacao().valorTotal;
        this.getGrupoOuAlunoFromAvaliacao(avaliacaoParaModificar).provaCorrigida = this.getGrupoOuAlunoNaAvaliacao().provaCorrigida;
        return avaliacaoParaModificar;
      }, this.avaliacao.id);
      console.log("FIREBASE UPDATE: atualizei avaliação com a prova corrigida -> TRANSACAO");

      this.router.navigate([`professor/avaliacao/${this.avaliacao.id}`]);
    }).catch(reason => {
      this.snack.open(reason, null, { duration: 5500 });
    });




  }

  validarNotas(): Promise<void> {
    return new Promise((resolve, reject) => {
      var count = 0;
      var notaMaiorQueValor = null;
      var notaMenorQueZero = null;
      for (let questao of this.prova.questoes) {

        if (this.userTipo == "aluno") {
          const MINHA_CORRECAO = this.getMinhaCorrecao(questao, count);
          if (MINHA_CORRECAO.nota > questao.valor) {
            MINHA_CORRECAO.nota = questao.valor;
            notaMaiorQueValor = count + 1;
            break;
          }
          else if (MINHA_CORRECAO.nota < 0) {
            MINHA_CORRECAO.nota = 0;
            notaMenorQueZero = count + 1;
            break;
          }
        }
        else {
          if (questao.correcaoProfessor.nota > questao.valor) {
            questao.correcaoProfessor.nota = questao.valor;
            notaMaiorQueValor = count + 1;
            break;
          }
          else if (questao.correcaoProfessor.nota < 0) {
            questao.correcaoProfessor.nota = 0;
            notaMenorQueZero = count + 1;
            break;
          }
        }
        count++;
      }

      if (notaMaiorQueValor) {
        reject(`Nota maior que o valor na questão ${notaMaiorQueValor}`);
      }
      else if (notaMenorQueZero) {
        reject(`Nota menor que zero na questão ${notaMenorQueZero}`);
      }

      resolve();

    })
  }

  getMinhaCorrecao(questao: Questao, questaoIndex: number): Correcao {

    var MINHA_PROVA_ID = null;

    if (this.avaliacao.tipoDisposicao != 0)
      MINHA_PROVA_ID = this.getMeuGrupoNaAvaliacao().provaId;
    else
      MINHA_PROVA_ID = this.getEuNaAvaliacao().provaId;

    // Busco minha correcao, e retorno-a
    for (var i = 0; i < questao.correcoes.length; i++) {
      if (questao.correcoes[i].avaliadorProvaId == MINHA_PROVA_ID)
        return questao.correcoes[i];
    }

    // Se não encontrei a minha correção mas tenho uma instância, insiro-me
    if (MINHA_PROVA_ID != null) {
      var questaoGabarito = this.gabarito.questoes[questaoIndex];
      questao.correcoes.push({
        avaliadorProvaId: MINHA_PROVA_ID,
        nota: this.comumService.questaoTipos[questao.tipo].getNota(questao, questaoGabarito),
        observacao: ""
      });
      return questao.correcoes[questao.correcoes.length - 1];
    }

    return null;

  }

  definirCaminho() {
    if (this.userTipo == "professor") {
      this.caminho = [
        { nome: `Professor`, url: `/professor` },
        { nome: `Avaliações`, url: `/professor` },
        { nome: `${this.avaliacao.titulo}`, url: `/professor/avaliacao/${this.avaliacao.id}` },
        { nome: `Correção`, url: `#` },
      ];
    }
    else {
      this.caminho = [
        { nome: `Aluno`, url: `/aluno` },
        { nome: `Avaliações`, url: `/aluno/avaliacoes` },
        { nome: `${this.avaliacao.titulo}`, url: `/aluno/avaliacao/${this.avaliacao.id}` },
        { nome: `Correção`, url: `#` },
      ];
    }
  }

  inserirNotasPadrao() {

    if (this.userTipo != 'professor' && this.visaoTipo == 'correcao')
      return;

    for (var questao of this.prova.questoes) {
      if (questao.correcaoProfessor.nota != null)
        continue;

      var soma = 0;
      const questaoTipo = this.comumService.questaoTipos[questao.tipo];

      // VERIFICA CORREÇÕES DOS ALUNOS
      if (questao.correcoes.length > 0) {
        for (let correcao of questao.correcoes) {
          soma += correcao.nota;
        }
        questao.correcaoProfessor.nota = Math.round((soma / questao.correcoes.length));
      }

      // VERIFICA CORREÇÃO AUTOMÁTICA      
      else if (soma <= 0 && questaoTipo.temCorrecaoAutomatica) {
        soma = questaoTipo.getNota(questao, this.gabarito.questoes[this.prova.questoes.indexOf(questao)]);
        questao.correcaoProfessor.nota = Math.round(soma);
      }

      else if (soma <= 0 && !questaoTipo.temCorrecaoAutomatica) {
        questao.correcaoProfessor.nota = 0;
      }



    }
  }

  getGrupoNaAvaliacao() {
    if (this.avaliacao.id != '1')
      return this.avaliacao.grupos[this.avaliacao.grupos.indexOf(this.avaliacao.grupos.filter(g => g.provaId == this.prova.id)[0])];
    else
      return {
        alunos: []
      }

  }

  getAlunoNaAvaliacao() {
    var count = 0;
    for (let aluno of this.avaliacao.grupos[0].alunos) {
      if (aluno.id == this.prova.alunos[0].id) {
        return this.avaliacao.grupos[0].alunos[count];
      }
      count++;
    }
    return null;
  }

  getGrupoOuAlunoNaAvaliacao() {
    if (this.avaliacao.tipoDisposicao == 0)
      return this.getAlunoNaAvaliacao();
    else
      return this.getGrupoNaAvaliacao();
  }

  getGrupoFromAvaliacao(avaliacao: Avaliacao) {
    if (this.avaliacao.id != '1')
      return avaliacao.grupos[avaliacao.grupos.indexOf(avaliacao.grupos.filter(g => g.provaId == this.prova.id)[0])];
    else
      return {
        alunos: []
      }

  }

  getAlunoFromAvaliacao(avaliacao: Avaliacao) {
    var count = 0;
    for (let aluno of avaliacao.grupos[0].alunos) {
      if (aluno.id == this.prova.alunos[0].id) {
        return avaliacao.grupos[0].alunos[count];
      }
      count++;
    }
    return null;
  }

  getGrupoOuAlunoFromAvaliacao(avaliacao: Avaliacao) {
    if (this.avaliacao.tipoDisposicao == 0)
      return this.getAlunoFromAvaliacao(avaliacao);
    else
      return this.getGrupoFromAvaliacao(avaliacao);
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

}
