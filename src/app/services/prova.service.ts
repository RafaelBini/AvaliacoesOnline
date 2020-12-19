import { ClipboardModule } from '@angular/cdk/clipboard';
import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import { CredencialService } from 'src/app/services/credencial.service';
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
    private credencialService: CredencialService,
    private avaliacaoService: AvaliacaoService,
    private fileService: FileService,
  ) { }

  insertProvaGabarito(prova: Prova) {
    return new Promise<void>((resolve, reject) => {

      this.db.collection('provas').add(prova).then(docRef => {
        this.db.collection('avaliacoes').doc(prova.avaliacaoId).update({
          provaGabarito: docRef.id,
        }).then(() => {
          this.db.collection('provas').doc(docRef.id).update({
            id: docRef.id,
          }).then(() => {
            resolve();
          })

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

  insertProvaByTransacao(prova: Prova, meuIndex: number) {
    prova.isGabarito = false;

    var avaliacaoDocRef = this.db.collection("avaliacoes").doc(prova.avaliacaoId).ref;
    var novaProvaDocRef = this.db.collection("provas").doc(this.db.createId()).ref;

    return this.db.firestore.runTransaction(transaction => {

      return transaction.get(avaliacaoDocRef).then(doc => {

        if (!doc.exists) {
          throw "Document does not exist!";
        }

        var avaliacao = doc.data() as Avaliacao;

        // INDIVIDUAL (SEM PROVA ATRIBUIDA)
        if (avaliacao.tipoDisposicao == 0 && (avaliacao.grupos[0].alunos[meuIndex].provaId == null || avaliacao.grupos[0].alunos[meuIndex].provaId == '')) {
          // INSERE A NOVA PROVA NO FIRE
          prova.id = novaProvaDocRef.id;
          transaction.set(novaProvaDocRef, prova);
          avaliacao.grupos[0].alunos[meuIndex].provaId = novaProvaDocRef.id;
          transaction.update(avaliacaoDocRef, avaliacao);
        }

        // EM GRUPO (SEM PROVA ATRIBUIDA)
        else if (avaliacao.tipoDisposicao != 0 && (avaliacao.grupos[meuIndex].provaId == null || avaliacao.grupos[meuIndex].provaId == '')) {
          // INSERE A NOVA PROVA NO FIRE
          prova.id = novaProvaDocRef.id;
          transaction.set(novaProvaDocRef, prova);
          avaliacao.grupos[meuIndex].provaId = novaProvaDocRef.id;
          transaction.update(avaliacaoDocRef, avaliacao);
        }

      })

    });
  }

  setRascunhoProvaGabarito(prova: Prova) {
    return this.db.collection('provas').doc(this.credencialService.getLoggedUserIdFromCookie()).set(prova);
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

  corrigirProvas(avaliacao: Avaliacao) {
    var corrigiPeloMenosUmaProva = false;

    this.getProvaFromId(avaliacao.provaGabarito).then(gabarito => {

      var indexAlterados: Array<number> = [];


      for (let [i, grupoOuAluno] of this.avaliacaoService.getGruposOuAlunosFromAvaliacao(avaliacao).entries()) {
        if (!grupoOuAluno.provaCorrigida) {
          if (grupoOuAluno.provaId != undefined) {
            this.getProvaFromId(grupoOuAluno.provaId).then(prova => {
              grupoOuAluno.notaTotal = this.getMinhaNota(prova, gabarito);
            }).catch(reason => {
              console.log("erro ao tentar corrigir prova");
            });
          }
          else {
            grupoOuAluno.notaTotal = 0;
          }
          grupoOuAluno.valorTotal = this.getPontuacaoMaxima(gabarito);
          grupoOuAluno.provaCorrigida = true;
          corrigiPeloMenosUmaProva = true;
          indexAlterados.push(i);
        }
      }


      if (corrigiPeloMenosUmaProva) {
        this.avaliacaoService.updateAvaliacaoByTransacao(avaliacaoParaAlterar => {
          for (let indexAlterado of indexAlterados) {
            if (avaliacao.tipoDisposicao == 0) {
              this.avaliacaoService.getGruposOuAlunosFromAvaliacao(avaliacaoParaAlterar)[indexAlterado].notaTotal = this.avaliacaoService.getGruposOuAlunosFromAvaliacao(avaliacao)[indexAlterado].notaTotal;
              this.avaliacaoService.getGruposOuAlunosFromAvaliacao(avaliacaoParaAlterar)[indexAlterado].valorTotal = this.avaliacaoService.getGruposOuAlunosFromAvaliacao(avaliacao)[indexAlterado].valorTotal;
              this.avaliacaoService.getGruposOuAlunosFromAvaliacao(avaliacaoParaAlterar)[indexAlterado].provaCorrigida = this.avaliacaoService.getGruposOuAlunosFromAvaliacao(avaliacao)[indexAlterado].provaCorrigida;
            }
          }
          return avaliacaoParaAlterar;
        }, avaliacao.id);
        console.log("Corrigi provas automaticamente -> TRANSACAO")
      }

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

  getProvaFromGabarito(gabarito: Prova, randomizarOrdemQuestoes: boolean): Prova {

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

    prova.isGabarito = false;
    prova.alunos = [];
    prova.provasParaCorrigir = [];

    const NUM_QUESTOES = prova.questoes.length;
    if (randomizarOrdemQuestoes) {
      for (var t = 0; t < NUM_QUESTOES - 1; t++) {
        const RANDOM_INDEX_A = Math.floor((Math.random() * 10) % NUM_QUESTOES);
        const RANDOM_INDEX_B = Math.floor((Math.random() * 10) % NUM_QUESTOES);
        // Troca as posições na array
        [prova.questoes[RANDOM_INDEX_A], prova.questoes[RANDOM_INDEX_B]] = [prova.questoes[RANDOM_INDEX_B], prova.questoes[RANDOM_INDEX_A]];
      }
    }

    return prova;
  }

  onProvasFromAvaliacaoChange(avaliacaoId: string) {

    return this.db.collection<Prova>('provas', ref => ref.where('avaliacaoId', '==', avaliacaoId)).valueChanges();
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

  getAllProvasGabarito() {
    return new Promise<Array<Prova>>((resolve, reject) => {
      this.db.collection('provas', ref => ref.where('isGabarito', '==', true)).get().toPromise().then(ref => {
        var provas: Array<Prova> = [];
        for (let doc of ref.docs) {
          var prova = doc.data();
          prova.id = doc.id;
          provas.push(prova);
        }
        resolve(provas);
      }).catch(reason => reject(reason));
    });
  }

  getQuestoesFromProfessor(professorId: string) {


    return new Promise<Questao[]>((resolve, reject) => {

      var questoes: Questao[] = [];

      // Recebe TODAS as avaliações
      this.avaliacaoService.getAllAvaliacoes().then(avaliacoes => {


        // Recebe TODAS as provas gabaritos
        this.getAllProvasGabarito().then(provas => {

          for (let prova of provas) {

            var avaliacao = prova.avaliacaoExcluida || avaliacoes.filter(a => a.id == prova.avaliacaoId)[0] || { titulo: 'Avaliação Excluída', professorId: 'Desconhecido', professorNome: 'Desconhecido' };

            for (let questao of prova.questoes) {

              // Se (a questão é pública ou eu sou o dono da questão) e não foi adicionada nenhuma questão semelhante,
              if (
                (questao.isPublica
                  ||
                  avaliacao.professorId == this.credencialService.getLoggedUserIdFromCookie()
                )
                && questoes.filter(q => this.getQuestaoHash(q) == this.getQuestaoHash(questao)).length <= 0
              ) {

                questoes.push({
                  ...questao,
                  avaliacao
                });

              }

            }

          }

          resolve(questoes);

        })

      });


    });


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

  deletarProvaSemExcuirArquivos(provaId: string) {
    return this.db.collection('provas').doc(provaId).delete();
  }

  getGabaritoDefault(): Prova {
    return {
      id: '1',
      isGabarito: true,
      professorId: '',
      questoes: [],
    };
  }

  getQuestaoDefault(): Questao {
    return {
      pergunta: "",
      index: 0,
      tipo: 4,
      resposta: "",
      alternativas: [
        { texto: '', selecionada: false }
      ],
      valor: 10,
      nivelDificuldade: 2,
      tags: [],
      associacoes: [
        { texto: '', opcaoSelecionada: '' }
      ],
      textoParaPreencher: "",
      opcoesParaPreencher: [
        { opcaoSelecionada: '', ativa: true }
      ],
      tentativas: 0,
      extensoes: [],
      correcoes: [],
      correcaoProfessor: {
        nota: null,
        observacao: ""
      },
      anexos: [],
      imagens: [],
      arquivosEntregues: [],
      imagensEntregues: [],
      isEditando: true,
    }
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
        nota += questaoTipo.getNota(questao, gabarito.questoes[questao.index]);
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
