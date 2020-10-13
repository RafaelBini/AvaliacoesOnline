import { Subscription } from 'rxjs/internal/Subscription';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import { ProvaService } from 'src/app/services/prova.service';
import { ComumService } from 'src/app/services/comum.service';
import { Questao } from './../../models/questao';
import { Avaliacao } from 'src/app/models/avaliacao';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlNode } from 'src/app/models/url-node';
import { Prova } from 'src/app/models/prova';

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
    public provaService: ProvaService,
    private avaliacaoService: AvaliacaoService
  ) { }

  public visaoTipo = "correcao";
  public userTipo = "aluno"
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

            this.inserirNotasPadrao();
            this.definirCaminho();

            // Recebe o gabarito
            this.provaService.getProvaFromId(this.avaliacao.provaGabarito).then(gabarito => {
              this.gabarito = gabarito;
            });


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

  correcaoAlterada() {
    console.log('FIREBASE UPDATE: atualizei prova');
    this.provaService.updateProva(this.prova);
  }

  finalizarCorrecao() {
    if (this.avaliacao.tipoDisposicao != 0) {
      this.getGrupoNaAvaliacao().provaCorrigida = true;
      this.getGrupoNaAvaliacao().notaTotal = this.provaService.getMinhaNota(this.prova, this.gabarito);
      this.getGrupoNaAvaliacao().valorTotal = this.provaService.getPontuacaoMaxima(this.prova);
    }
    else {
      this.getAlunoNaAvaliacao().provaCorrigida = true;
      this.getAlunoNaAvaliacao().notaTotal = this.provaService.getMinhaNota(this.prova, this.gabarito);
      this.getAlunoNaAvaliacao().valorTotal = this.provaService.getPontuacaoMaxima(this.prova);
    }

    console.log('FIREBASE UPDATE: atualizei avaliação com a prova corrigida');
    this.avaliacaoService.updateAvaliacao(this.avaliacao);
    this.router.navigate([`professor/avaliacao/${this.avaliacao.id}`]);
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
    if (this.avaliacao.tipoCorrecao != 2)
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

}
