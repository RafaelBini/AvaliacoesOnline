import { Questao } from './../models/questao';
import { Prova } from './../models/prova';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Avaliacao } from '../models/avaliacao';
import * as firebase from 'firebase';
import { Md5 } from 'ts-md5/dist/md5';

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

  insertProva(prova: Prova) {
    prova.isGabarito = false;
    return new Promise<Prova>((resolve, reject) => {

      this.db.collection('provas').add(prova).then(docRef => {
        prova.id = docRef.id;
        resolve(prova);
      }).catch(reason => reject(reason));

    });
  }

  onProvaChange(provaId: string) {
    return this.db.collection('provas').doc(provaId).valueChanges();
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
        var prova = docRef.data() as Prova;
        prova.id = docRef.id;
        resolve(prova);
        return;
      }).catch(reason => {
        reject(reason);
        return;
      });
    });
  }

  geProvasFromProfessor(professorId: string): Promise<Array<Prova>> {
    return new Promise<Array<Prova>>((resolve, reject) => {
      this.db.collection('provas', ref => ref.where('professorId', '==', professorId)).get().toPromise().then((ref) => {
        if (ref.docs.length <= 0) {
          reject(`Prova com professor id ${professorId} não Existe`);
          return;
        }

        var provas: Array<Prova> = [];
        for (let doc of ref.docs) {
          const prova: Prova = doc.data() as Prova;
          prova.id = doc.id;
          provas.push(prova);
        }
        resolve(provas);
        return;
      }).catch(reason => {
        reject(reason);
        return;
      });
    });
  }

  getProvaFromGabarito(gabarito: Prova): Prova {

    var prova: Prova = JSON.parse(JSON.stringify(gabarito)) as Prova;

    for (let questao of prova.questoes) {
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
      else if ([3, 4].includes(questao.tipo)) {
        for (let alternativa of questao.alternativas) {
          alternativa.justificativa = "";
          alternativa.selecionada = false;
        }
      }
      else if ([6, 7].includes(questao.tipo)) {
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
    return prova;
  }

  getProvasFromAvaliacao(avaliacaoId: string): Promise<Array<Prova>> {
    return new Promise((resolve, reject) => {
      this.db.collection('provas', ref => ref.where('avaliacaoId', '==', avaliacaoId)).get().toPromise().then(ref => {
        var provas = [];
        for (let doc of ref.docs) {
          var prova = doc.data() as Prova;
          prova.id = doc.id;
          provas.push(prova);
        }
        resolve(provas);
      }).catch(reason => reject(reason));
    });
  }

  getQuestaoHash(questao: Questao): string {

    var bigString = `${questao.pergunta}${questao.tipo}`;

    for (let alternativa of questao.alternativas) {
      bigString += alternativa.texto
    }

    for (let associacao of questao.associacoes) {
      bigString += associacao.texto;
    }

    bigString += questao.textoParaPreencher;

    for (let extensao of questao.extensoes) {
      bigString += extensao;
    }

    return bigString;


  }

  deletarProva(provaId: string) {
    return this.db.collection('provas').doc(provaId).delete();
  }
}
