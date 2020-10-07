import { Usuario } from './../models/usuario';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private db: AngularFirestore) { }

  insert(usuario: Usuario) {
    usuario.alunos = [];
    return this.db.collection('usuarios').doc(usuario.email).set(usuario);
  }


  getAll(): Promise<Array<Usuario>> {
    return new Promise((resolve, reject) => {
      this.db.collection('usuarios').get().toPromise().then(ref => {
        var usuarios: Array<Usuario> = [];
        for (let doc of ref.docs) {
          usuarios.push(doc.data() as Usuario);
        }
        resolve(usuarios);
      }).catch(reason => reject(reason));

    });

  }

  async exists(usuario: Usuario) {

    const docRef = await this.db.collection('usuarios').doc(usuario.email).get().toPromise();
    return docRef.exists;

  }

  podeLogar(usuario: Usuario) {
    return new Promise((resolve, reject) => {
      this.db.collection('usuarios').doc(usuario.email).get().toPromise().then(docRef => {

        if (!docRef.exists) {
          reject('Usuario ou senha incorreta.');
          return;
        }


        if (docRef.data().senha == usuario.senha) {
          var usuarioLogado: Usuario = docRef.data();
          usuarioLogado.id = docRef.id;
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
    return this.db.collection('usuarios').doc(usuario.email).update(usuario);
  }

}
