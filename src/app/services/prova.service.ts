import { FileService } from './file.service';
import { Correcao } from './../models/correcao';
import { ComumService } from './comum.service';
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

  constructor(
    private db: AngularFirestore,
    private comumService: ComumService,
    private fileService: FileService,
  ) { }

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
    console.log(`pegando a prova ${provaId}...`)
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
      else if (questao.tipo == 3 || questao.tipo == 4) {
        for (let alternativa of questao.alternativas) {
          alternativa.justificativa = "";
          alternativa.selecionada = false;
        }
      }
      else if (questao.tipo == 6 || questao.tipo == 7) {
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

  deletarProva(prova: Prova) {

    // Deleta todos os arquivos da prova
    for (let questao of prova.questoes) {

      if (prova.isGabarito) {
        for (let arquivo of questao.imagens) {
          this.fileService.delete(arquivo.caminhoArquivo);
        }
        for (let arquivo of questao.anexos) {
          this.fileService.delete(arquivo.caminhoArquivo);
        }
      }

      for (let arquivo of questao.arquivosEntregues) {
        this.fileService.delete(arquivo.caminhoArquivo);
      }

    }

    return this.db.collection('provas').doc(prova.id).delete();


  }

  getMinhaNota(prova: Prova, gabarito: Prova) {
    var nota = 0;
    for (let [i, questao] of prova.questoes.entries()) {
      const questaoTipo = this.comumService.questaoTipos[questao.tipo];
      if (questao.correcaoProfessor.nota != null) {
        nota += questao.correcaoProfessor.nota;
      }
      else if (questao.correcoes.length > 0) {
        var media = 0;
        for (let correcao of questao.correcoes) {
          media += correcao.nota;
        }
        media = media / questao.correcoes.length;
        nota += Math.round(media);
      }
      else if (questaoTipo.temCorrecaoAutomatica) {
        nota += questaoTipo.getNota(questao, gabarito.questoes[i]);
      }

    }
    return Math.round(nota);
  }
  getPontuacaoMaxima(prova: Prova) {
    var pontuacaoMaxima = 0;
    prova.questoes.forEach(questao => {
      pontuacaoMaxima += questao.valor;
    });
    return Math.round(pontuacaoMaxima);
  }
  getMaiorNota(avaliacao: Avaliacao) {
    var maiorNota = 0;
    if (avaliacao.tipoDisposicao != 0) {
      for (let grupo of avaliacao.grupos) {
        if (grupo.notaTotal > maiorNota) {
          maiorNota = grupo.notaTotal;
        }
      }
    }
    else {
      for (let aluno of avaliacao.grupos[0].alunos) {
        if (aluno.notaTotal > maiorNota) {
          maiorNota = aluno.notaTotal;
        }
      }
    }
    return maiorNota;

  }
  isProvaRespondida(prova: Prova): boolean {
    for (let [qi, questao] of prova.questoes.entries()) {

    }
    return true;
  }
}
