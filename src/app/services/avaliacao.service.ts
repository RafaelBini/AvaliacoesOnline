import { CredencialService } from 'src/app/services/credencial.service';
import { ComumService } from './comum.service';
import { Usuario } from './../models/usuario';
import { Prova } from './../models/prova';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Avaliacao } from '../models/avaliacao';
import { Observable } from 'rxjs/internal/Observable';
import { GroupedObservable } from 'rxjs';
import { TimeService } from './time.service';
import * as firebase from 'firebase/app';
import { Grupo } from '../models/grupo';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {

  constructor(private db: AngularFirestore,
    private credencialService: CredencialService,
    private comumService: ComumService,
    private timeService: TimeService,
  ) { }



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

  setRascunhoAvaliacao(avaliacao: Avaliacao) {
    return this.db.collection('avaliacoes').doc(this.credencialService.getLoggedUserIdFromCookie()).set(avaliacao);
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

    var agora = this.timeService.getCurrentDateTime();


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
    avaliacao.dtCriacao = this.timeService.getCurrentDateTime().toISOString();
    return this.db.collection('avaliacoes').doc(avaliacao.id).set(avaliacao);
  }

  updateAvaliacao(avaliacao: Avaliacao) {
    this.setAlunosIds(avaliacao);
    return this.db.collection('avaliacoes').doc(avaliacao.id).update(avaliacao);
  }

  arquivarAvaliacao(avaliacaoId) {
    this.db.collection('avaliacoes').doc(avaliacaoId).update({
      usuariosIdQueArquivaram: firebase.firestore.FieldValue.arrayUnion(this.credencialService.getLoggedUserIdFromCookie())
    });
  }

  isArquivada(avaliacao: Avaliacao) {
    if (!avaliacao.usuariosIdQueArquivaram)
      return false;
    return avaliacao.usuariosIdQueArquivaram.includes(this.credencialService.getLoggedUserIdFromCookie());
  }

  desarquivarAvaliacao(avaliacaoId) {
    this.db.collection('avaliacoes').doc(avaliacaoId).update({
      usuariosIdQueArquivaram: firebase.firestore.FieldValue.arrayRemove(this.credencialService.getLoggedUserIdFromCookie())
    });
  }

  setAlunosIds(avaliacao: Avaliacao) {
    var alunosIds = [];
    for (let grupo of avaliacao.grupos) {
      for (let aluno of grupo.alunos) {
        alunosIds.push(aluno.id);
      }
    }
    avaliacao.alunosIds = alunosIds;
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

  updateAvaliacaoByTransacao(modificar: (avaliacaoParaModificar: Avaliacao) => Avaliacao, docId) {

    var docRef = this.db.collection("avaliacoes").doc(docId).ref;

    return this.db.firestore.runTransaction(transaction => {

      return transaction.get(docRef).then(doc => {

        if (!doc.exists) {
          throw "Document does not exist!";
        }

        var avaliacaoAtualizada = doc.data() as Avaliacao;
        avaliacaoAtualizada = modificar(avaliacaoAtualizada);
        this.setAlunosIds(avaliacaoAtualizada);
        transaction.update(docRef, avaliacaoAtualizada);

      });
    });
  }

  getAvaliacaoDefault(): Avaliacao {
    return {
      id: '1',
      status: 0,
      titulo: "",
      descricao: "",
      limitarNumIntegrantes: true,
      maxIntegrantes: 3,
      dtInicio: this.comumService.getStringFromDate(this.timeService.getCurrentDateTime()),
      isInicioIndeterminado: true,
      dtInicioCorrecao: this.comumService.getStringFromDate(this.timeService.getCurrentDateTime(), 1),
      isInicioCorrecaoIndeterminado: true,
      dtTermino: this.comumService.getStringFromDate(this.timeService.getCurrentDateTime(), 2),
      isTerminoIndeterminado: true,
      isOrdemAleatoria: false,
      isBloqueadoAlunoAtrasado: false,
      tipoDisposicao: 0,
      tipoCorrecao: 0,
      correcaoParesQtdTipo: "1",
      correcaoParesQtdNumero: 1,
      tipoPontuacao: 0,
      duracaoIndividual: 1,
      duracaoIndividualUnidade: 'horas',
      duracaoIndividualMs: (1000 * 60 * 60),
      isDuracaoIndividualIndeterminada: true,
      tags: [],
      usuariosIdQueArquivaram: [],
      alunosIds: [],
      grupos: [
        {
          numero: 1,
          alunos: [],
          provaId: null,

        }
      ],
      provas: [],
      provaGabarito: "",

    }
  }

  getGruposOuAlunosFromAvaliacao(avaliacao: Avaliacao): Array<Usuario> | Array<Grupo> {
    if (avaliacao.tipoDisposicao == 0)
      return avaliacao.grupos[0].alunos;
    else
      return avaliacao.grupos;
  }


}
