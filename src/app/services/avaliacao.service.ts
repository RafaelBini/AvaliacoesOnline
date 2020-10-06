import { Prova } from './../models/prova';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Avaliacao } from '../models/avaliacao';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {

  constructor(private db: AngularFirestore) { }

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

  getAvaliacaoFromId(avaliacaoId: string): Promise<Avaliacao> {
    return new Promise<Avaliacao>((resolve, reject) => {
      this.db.collection('avaliacoes').doc(avaliacaoId).get().toPromise().then((docRef) => {
        if (!docRef.exists) {
          reject(`Avaliacao com id ${avaliacaoId} Não Existe`);
          return;
        }
        resolve(docRef.data() as Avaliacao);
        return;
      }).catch(reason => {
        reject(reason);
        return;
      });
    })
  }

  getAllAvaliacoes() {
    return this.db.collection('avaliacoes').get().toPromise();
  }

  getAvaliacoesFromProfessor(professorId: string): Promise<Array<Avaliacao>> {
    return new Promise((resolve, reject) => {
      this.db.collection('avaliacoes', ref => ref.where('professorId', '==', professorId)).get().toPromise()
        .then(ref => {
          var avaliacoes: Array<Avaliacao> = [];
          for (let doc of ref.docs) {
            avaliacoes.push(doc.data());
          }
          resolve(avaliacoes);
        })
        .catch(reason => {
          reject(reason);
        });
    });
  }

  getAvaliacoesFromAluno(AlunoId): Promise<Array<Avaliacao>> {
    return new Promise((resolve, reject) => {
      this.db.collection('avaliacoes', ref => ref.where('alunos', 'array-contains', AlunoId)).get().toPromise()
        .then(ref => {
          var avaliacoes: Array<Avaliacao> = [];
          for (let doc of ref.docs) {
            avaliacoes.push(doc.data());
          }
          resolve(avaliacoes);
        })
        .catch(reason => {
          reject(reason);
        });
    });
  }

  insertNovaAvaliacao(avaliacao: Avaliacao) {
    return this.db.collection('avaliacoes').doc(avaliacao.id).set(avaliacao);
  }

  updateAvaliacao(avaliacao: Avaliacao) {
    return this.db.collection('avaliacoes').doc(avaliacao.id).update(avaliacao);
  }

  arquivarAvaliacao(avaliacaoId) {
    this.db.collection('avaliacoes').doc(avaliacaoId).update({
      isArquivada: true
    });
  }

  desarquivarAvaliacao(avaliacaoId) {
    this.db.collection('avaliacoes').doc(avaliacaoId).update({
      isArquivada: false
    });
  }

  deletarAvaliacao(avaliacaoId) {
    return this.db.collection('avaliacoes').doc(avaliacaoId).delete();
  }

}
