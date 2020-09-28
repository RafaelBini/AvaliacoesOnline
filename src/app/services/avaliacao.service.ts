import { Injectable } from '@angular/core';
import { Avaliacao } from '../models/avaliacao';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {

  constructor() { }

  getAvaliacaoFromGabarito(gabarito: Avaliacao): Avaliacao {

    var avaliacao = JSON.parse(JSON.stringify(gabarito));

    for (let questao of avaliacao.questoes) {
      if (questao.tipo == 0) {
        for (let associacao of questao.associacoes) {
          associacao.opcaoSelecionada = "";
        }
      }
      else if (questao.tipo == 1) {
        questao.resposta = "";
      }
      else if (questao.tipo == 2) {
        // TODO: Zerar caminho da entrega
      }
      else if ([3, 4].includes(Number.parseInt(questao.tipo))) {
        for (let alternativa of questao.alternativas) {
          alternativa.justificativa = "";
          alternativa.selecionada = false;
        }
      }
      else if ([6, 7].includes(Number.parseInt(questao.tipo))) {
        for (let alternativa of questao.alternativas) {
          alternativa.justificativa = "";
          alternativa.selecionada = null;
        }
      }
      else if (questao.tipo == 5) {
        for (let opcao of questao.opcoesParaPreencher) {
          opcao.opcaoSelecionada = "";
        }
      }
    }
    return avaliacao;
  }


}
