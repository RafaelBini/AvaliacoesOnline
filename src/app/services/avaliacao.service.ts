import { ComumService } from './comum.service';
import { Usuario } from './../models/usuario';
import { Prova } from './../models/prova';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Avaliacao } from '../models/avaliacao';
import { Observable } from 'rxjs/internal/Observable';

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

  getStatusConformeTempo(avaliacao: Avaliacao) {

    var agora = new Date();


    if (agora > new Date(avaliacao.dtTermino) && !avaliacao.isTerminoIndeterminado && avaliacao.status < 3) {
      avaliacao.status = 3;
    }
    else if (agora > new Date(avaliacao.dtInicioCorrecao) && !avaliacao.isInicioCorrecaoIndeterminado && avaliacao.status < 2) {
      avaliacao.status = 2;
    }
    else if (agora > new Date(avaliacao.dtInicio) && !avaliacao.isInicioIndeterminado && avaliacao.status < 1) {
      avaliacao.status = 1;
    }

    return avaliacao.status;

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

  onAvaliacoesFromProfessorChange(professorId: string) {
    return this.db.collection('avaliacoes', ref => ref.where('professorId', '==', professorId)).valueChanges();
  }

  onAllAvaliacoesChange() {
    return this.db.collection('avaliacoes').valueChanges();
  }

  updateAvaliacaoByTransacao(modificar:(avaliacaoParaModificar: Avaliacao)=> Avaliacao, docId) {

    var docRef = this.db.collection("avaliacoes").doc(docId).ref;

    return this.db.firestore.runTransaction(transaction => {

      return transaction.get(docRef).then(doc => {

        if (!doc.exists) {
          throw "Document does not exist!";
        }

        var avaliacaoAtualizada = doc.data() as Avaliacao;        

        transaction.update(docRef, modificar(avaliacaoAtualizada));

      });
    });
  }


}
