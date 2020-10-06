import { Prova } from './../models/prova';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Avaliacao } from '../models/avaliacao';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ProvaService {

  constructor(private db: AngularFirestore) { }

  insertProvaGabarito(prova: Prova) {
    return new Promise((resolve, reject) => {

      this.db.collection('provas').add(prova).then(docRef => {
        this.db.collection('avaliacoes').doc(prova.avaliacaoId).update({
          provaGabarito: docRef.id,
        }).then(() => {
          resolve();
        }).catch(reason => reject(reason));
      }).catch(reason => reject(reason));

    });
  }

  updateProva(prova: Prova) {
    return this.db.collection('provas').doc(prova.id).update(prova);
  }

  getProvaFromId(provaId: string): Promise<Prova> {
    return new Promise<Prova>((resolve, reject) => {
      this.db.collection('provas').doc(provaId).get().toPromise().then((docRef) => {
        if (!docRef.exists) {
          reject(`Prova com id ${provaId} não Existe`);
          return;
        }
        resolve(docRef.data() as Prova);
        return;
      }).catch(reason => {
        reject(reason);
        return;
      });
    });
  }

  deletarProva(provaId: string) {
    return this.db.collection('provas').doc(provaId).delete();
  }
}
