import { Usuario } from './../models/usuario';
import { Prova } from './../models/prova';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Avaliacao } from '../models/avaliacao';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {

  constructor(private db: AngularFirestore) { }



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

  onAvaliacaoChange(avaliacaoId: string) {
    return this.db.collection('avaliacoes').doc(avaliacaoId).valueChanges();
  }

  getAllAvaliacoes() {
    return new Promise<Array<Avaliacao>>((resolve, reject) => {
      this.db.collection('avaliacoes').get().toPromise().then(ref => {
        var avaliacoes: Array<Avaliacao> = [];
        for (let doc of ref.docs) {
          avaliacoes.push(doc.data());
        }
        resolve(avaliacoes);
      }).catch(reason => reject(reason));
    });
  }

  getAvaliacoesFromAluno(alunoId: string) {
    return new Promise<Array<Avaliacao>>((resolve, reject) => {
      this.db.collection('avaliacoes').get().toPromise().then(ref => {
        var avaliacoes: Array<Avaliacao> = [];
        for (let doc of ref.docs) {
          const avaliacao = doc.data() as Avaliacao;
          if (avaliacao.grupos.filter(grupo => grupo.alunos.filter(a => a.id == alunoId).length > 0).length > 0)
            avaliacoes.push(avaliacao);
        }
        resolve(avaliacoes);
      }).catch(reason => reject(reason));
    });
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
