import { TimeService } from './../../services/time.service';
import { CredencialService } from './../../services/credencial.service';
import { Prova } from 'src/app/models/prova';
import { Associacao } from './../../models/associacao';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ComumService } from './../../services/comum.service';
import { Questao } from './../../models/questao';
import { Component, OnInit, Input, ElementRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Avaliacao } from 'src/app/models/avaliacao';
import { Usuario } from 'src/app/models/usuario';


@Component({
  selector: 'app-questoes-responder',
  templateUrl: './questoes-responder.component.html',
  styleUrls: ['./questoes-responder.component.css']
})
export class QuestoesResponderComponent implements OnInit {
  @Input() avaliacao: Avaliacao;
  @Input() gabarito: Prova;
  @Input() prova: Prova;

  @Output() respostaAlterada = new EventEmitter<void>();

  constructor(
    public comumService: ComumService,
    public credencialService: CredencialService,
    private timeService: TimeService,
    private dialog: MatDialog,
    private snack: MatSnackBar) { }

  ngOnInit(): void {
  }


  // GERAL
  estaEmFoco(objetoDom): boolean {
    return objetoDom == document.activeElement;
  }
  ajustarAltura(event) {
    var paddingTop = parseFloat(event.target.style.paddingTop.replace("px", ""));
    var paddingBottom = parseFloat(event.target.style.paddingBottom.replace("px", ""));
    event.target.style.height = ""; event.target.style.height = (event.target.scrollHeight - (paddingTop + paddingBottom)) + "px";
  }
  getPontuacaoMaxima() {
    var pontuacaoMaxima = 0;
    this.prova.questoes.forEach(questao => {
      pontuacaoMaxima += questao.valor;
    });
    return pontuacaoMaxima;
  }
  estaNoContextoCerto(questao) {
    const PRECISA_CORRECAO_AUTOMATICA = this.comumService.precisaDeCorrecaoAutomatica(this.avaliacao);

    if (!PRECISA_CORRECAO_AUTOMATICA) {
      return true;
    }

    const QUESTAO_EH_DE_CORRECAO_AUTOMATICA = this.comumService.questaoTipos[questao.tipo].temCorrecaoAutomatica;

    if (QUESTAO_EH_DE_CORRECAO_AUTOMATICA && PRECISA_CORRECAO_AUTOMATICA) {
      return true;
    }

    return false;

  }
  sinalizarRespostaAlterada(questao: Questao) {
    questao.ultimaModificacao = new Date().getTime();
    this.respostaAlterada.emit();
  }
  identificarQuestao(index: Number, questao: Questao) {
    return index;
  }

  // ASSOCIACAO
  getAssociacoesOrdenadas(questaoIndex: number) {
    return this.gabarito.questoes[questaoIndex].associacoes.concat().sort((a, b) => a.texto > b.texto ? 1 : -1);
  }
  onAssociativaChange(questao: Questao, questaoIndex: number) {

    this.sinalizarRespostaAlterada(questao);

    if (this.avaliacao.tipoPontuacao != 2)
      return;

    for (let [i, associacao] of questao.associacoes.entries()) {
      if (associacao.opcaoSelecionada != this.gabarito.questoes[questaoIndex].associacoes[i].opcaoSelecionada && associacao.opcaoSelecionada != null && associacao.opcaoSelecionada != '') {
        if (questao.tentativas < 3) {
          questao.tentativas++;
          this.snack.open(`Resposta incorreta... Você perdeu ${Math.round(questao.valor / 3)} pontos no valor da questão`, null, {
            duration: 4000
          });
        } else {
          this.snack.open(`Resposta incorreta!`, null, {
            duration: 4000
          });
        }
        setTimeout(() => {
          associacao.opcaoSelecionada = null;
        }, 1200);
        return;
      }
    }


  }


  // ALTERNATIVAS
  onMultiplaEscolhaChange(questao: Questao, alternativaIndex: number, isEditavel: boolean, questaoIndex: number) {
    this.desmarcarTudoMenosUma(questao, alternativaIndex, isEditavel);
    this.registrarTentativaMultiplaEscolha(questao, questaoIndex);
    this.sinalizarRespostaAlterada(questao);
    //console.log(this.comumService.questaoTipos[questao.tipo].getNota(questao));
  }
  desmarcarTudoMenosUma(questao: Questao, alternativaIndex: number, isEditavel: boolean) {
    if (questao.tipo != 4)
      return;
    for (var i = 0; i < questao.alternativas.length; i++) {
      if (i != alternativaIndex) {
        questao.alternativas[i].selecionada = false;
      }
    }
  }
  registrarTentativaMultiplaEscolha(questao: Questao, questaoIndex: number) {
    if (this.avaliacao.tipoPontuacao != 2)
      return;
    for (let [i, alternativa] of questao.alternativas.entries()) {
      if (!this.gabarito.questoes[questaoIndex].alternativas[i].selecionada && alternativa.selecionada) {
        if (questao.tentativas < 3) {
          questao.tentativas++;
          this.snack.open(`Resposta incorreta... Você perdeu ${Math.round(questao.valor / 3)} pontos no valor da questão`, null, {
            duration: 4000
          });
        } else {
          this.snack.open(`Resposta incorreta!`, null, {
            duration: 4000
          });
        }
        setTimeout(() => {
          alternativa.selecionada = false;
        }, 1200);
        return;
      }
    }
  }

  // DISSERTATIVA
  isLocked(questao: Questao) {
    if (questao.usuarioUltimaModificacao == null) {
      return false;
    }
    return (questao.usuarioUltimaModificacao.id != this.credencialService.getLoggedUserIdFromCookie());
  }
  onDissertativaFocus(questao: Questao) {
    var usuario: Usuario = {
      id: this.credencialService.getLoggedUserIdFromCookie(),
      nome: this.credencialService.loggedUser.nome,
    }
    questao.usuarioUltimaModificacao = usuario;
    this.respostaAlterada.emit();
  }
  onDissertativaBlur(questao: Questao) {
    questao.usuarioUltimaModificacao = null;
    this.respostaAlterada.emit();
  }

  // PREENCHER
  getOpcoesPreencherAtivas(questao: Questao) {
    return questao.opcoesParaPreencher.concat().filter(opcao => opcao.ativa).sort((a, b) => a.texto > b.texto ? 1 : -1);
  }
  getPreenchimentoPartes(questao: Questao) {
    var texto = questao.textoParaPreencher;
    var textoSplitado = [];
    var partes = [];
    const SEPARADOR_RANDOMICO = `*#${Math.random()}#*`;
    const IDENTIFICADOR_RANDOMICO = `*#${Math.random()}#*`;
    for (var i = 0; i < questao.opcoesParaPreencher.length; i++) {
      if (questao.opcoesParaPreencher[i].ativa)
        texto = texto.replace(`(${i + 1})`, `${SEPARADOR_RANDOMICO + IDENTIFICADOR_RANDOMICO + (i + 1) + SEPARADOR_RANDOMICO}`);
    }

    textoSplitado = texto.split(SEPARADOR_RANDOMICO);

    textoSplitado.forEach(parte => {
      if (parte.includes(IDENTIFICADOR_RANDOMICO)) {
        partes.push({
          conteudo: parseInt(parte.replace(IDENTIFICADOR_RANDOMICO, "")) - 1,
          tipo: "select"
        });
        console.log(partes);
      }
      else {
        partes.push({
          conteudo: parte,
          tipo: "texto"
        });
      }
    });

    return partes;

  }
  onPreenchimentoChange(questao: Questao) {

    this.sinalizarRespostaAlterada(questao);

    if (this.avaliacao.tipoPontuacao != 2)
      return;

    for (let opcao of questao.opcoesParaPreencher) {
      if (opcao.opcaoSelecionada != opcao.texto && opcao.opcaoSelecionada != null && opcao.opcaoSelecionada != '') {
        if (questao.tentativas < 3) {
          questao.tentativas++;
          this.snack.open(`Resposta incorreta... Você perdeu ${Math.round(questao.valor / 3)} pontos no valor da questão`, null, {
            duration: 4000
          });
        } else {
          this.snack.open(`Resposta incorreta!`, null, {
            duration: 4000
          });
        }
        setTimeout(() => {
          opcao.opcaoSelecionada = null;
        }, 1200);
        return;
      }
    }


  }

  // VERDADEIRO OU FALSO
  onVerdadeiroFalsoChange(questao: Questao, questaoIndex: number) {

    this.sinalizarRespostaAlterada(questao);

    if (this.avaliacao.tipoPontuacao != 2)
      return;

    for (let [i, alternativa] of questao.alternativas.entries()) {
      if ((this.gabarito.questoes[questaoIndex].alternativas[i].selecionada != alternativa.selecionada) && alternativa.selecionada != null) {
        if (questao.tentativas < 3) {
          questao.tentativas++;
          this.snack.open(`Resposta incorreta... Você perdeu ${Math.round(questao.valor / 3)} pontos no valor da questão`, null, {
            duration: 4000
          });
        } else {
          this.snack.open(`Resposta incorreta!`, null, {
            duration: 4000
          });
        }
        setTimeout(() => {
          alternativa.selecionada = null;
        }, 1200);
        return;
      }
    }
  }



}
