import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog } from '@angular/material/dialog';
import { ComumService } from './../../services/comum.service';
import { Questao } from './../../models/questao';
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Avaliacao } from 'src/app/models/avaliacao';


@Component({
  selector: 'app-questoes-responder',
  templateUrl: './questoes-responder.component.html',
  styleUrls: ['./questoes-responder.component.css']
})
export class QuestoesResponderComponent implements OnInit {
  @Input() avaliacao: Avaliacao;


  constructor(public comumService: ComumService, private dialog: MatDialog, private snack: MatSnackBar) { }

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
    this.avaliacao.questoes.forEach(questao => {
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


  // ASSOCIACAO
  getAssociacoesOrdenadas(questao: Questao) {
    return questao.associacoes.concat().sort((a, b) => a.texto > b.texto ? 1 : -1);
  }
  onAssociativaChange(questao: Questao) {

    if (this.avaliacao.tipoPontuacao != 2)
      return;
    for (let associacao of questao.associacoes) {
      if (associacao.opcaoSelecionada != associacao.opcaoCorreta && associacao.opcaoSelecionada != null && associacao.opcaoSelecionada != '') {
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
  onMultiplaEscolhaChange(questao: Questao, alternativaIndex: number, isEditavel: boolean) {
    this.desmarcarTudoMenosUma(questao, alternativaIndex, isEditavel);
    this.registrarTentativaMultiplaEscolha(questao);
    //console.log(this.comumService.questaoTipos[questao.tipo].getNota(questao));
  }
  desmarcarTudoMenosUma(questao: Questao, alternativaIndex: number, isEditavel: boolean) {
    if (questao.tipo != 4)
      return;
    for (var i = 0; i < questao.alternativas.length; i++) {
      if (i != alternativaIndex && isEditavel) {
        questao.alternativas[i].correta = false;
      }
      else if (i != alternativaIndex && !isEditavel) {
        questao.alternativas[i].selecionada = false;
      }
    }
  }
  registrarTentativaMultiplaEscolha(questao: Questao) {
    if (this.avaliacao.tipoPontuacao != 2)
      return;
    for (let alternativa of questao.alternativas) {
      if (!alternativa.correta && alternativa.selecionada) {
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
  onVerdadeiroFalsoChange(questao: Questao) {

    if (this.avaliacao.tipoPontuacao != 2)
      return;

    for (let alternativa of questao.alternativas) {
      if ((alternativa.correta != alternativa.selecionada) && alternativa.selecionada != null) {
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
