import { TimeService } from 'src/app/services/time.service';
import { Usuario } from './../models/usuario';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private db: AngularFirestore,
    private timeService: TimeService,
  ) { }

  insert(usuario: Usuario): Promise<Usuario> {
    usuario.alunos = [];
    usuario.dtCriacao = this.timeService.getCurrentDateTime().toISOString();
    return new Promise<Usuario>((resolve, reject) => {
      this.db.collection('usuarios').add(usuario).then(docRef => {
        usuario.id = docRef.id;
        resolve(usuario);
      })
        .catch(reason => {
          reject(reason);
        });
    });

  }

  getAll(): Promise<Array<Usuario>> {
    return new Promise((resolve, reject) => {
      this.db.collection('usuarios').get().toPromise().then(ref => {
        var usuarios: Array<Usuario> = [];
        for (let doc of ref.docs) {
          var usuario: Usuario = doc.data() as Usuario;
          usuario.id = doc.id;
          delete usuario.senha;
          usuarios.push(usuario);
        }
        resolve(usuarios);
      }).catch(reason => reject(reason));

    });

  }

  getProfessoresFrom(usuarioId: string): Promise<Array<Usuario>> {
    return new Promise((resolve, reject) => {
      this.db.collection('usuarios', ref => ref.where('alunosIds', 'array-contains', usuarioId)).get().toPromise().then(ref => {
        var usuarios: Array<Usuario> = [];
        for (let doc of ref.docs) {
          var usuario: Usuario = doc.data() as Usuario;
          usuario.id = doc.id;
          usuarios.push(usuario);
        }
        resolve(usuarios);
      }).catch(reason => reject(reason));

    });

  }

  async exists(usuario: Usuario) {

    const ref = await this.db.collection('usuarios', ref => ref.where('email', '==', usuario.email.toLowerCase())).get().toPromise();
    return ref.docs.length > 0;

  }

  podeLogar(usuario: Usuario) {
    return new Promise((resolve, reject) => {
      this.db.collection('usuarios', ref => ref.where('email', '==', usuario.email.toLowerCase())).get().toPromise().then(ref => {

        if (ref.docs.length <= 0) {
          reject('Usuario ou senha incorreta.');
          return;
        }


        if (ref.docs[0].data().senha == Md5.hashStr(usuario.senha).toString()) {
          var usuarioLogado: Usuario = ref.docs[0].data();
          usuarioLogado.id = ref.docs[0].id;
          resolve(usuarioLogado);
          return;
        }

        reject('Usuario ou senha incorreta.');
        return;


      });
    });

  }

  get(USUARIO_ID: string): Promise<Usuario> {
    return new Promise<Usuario>((resolve, reject) => {
      this.db.collection('usuarios').doc(USUARIO_ID).get().toPromise().then(docRef => {
        if (docRef.exists) {
          var usuario: Usuario = docRef.data();
          usuario.id = docRef.id;
          resolve(usuario);
        }
        reject('Usuario não encontrado');
      }).catch(reason => {
        reject(reason);
      });
    });
  }

  update(usuario: Usuario) {
    this.setAlunosIds(usuario);
    return this.db.collection('usuarios').doc(usuario.id).update(usuario);
  }

  setAlunosIds(usuario: Usuario) {
    if (usuario.alunos == null)
      return;

    var alunosIds = [];
    for (let aluno of usuario.alunos) {
      alunosIds.push(aluno.id);
    }
    usuario.alunosIds = alunosIds;
  }

}
