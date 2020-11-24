import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from './usuario.service';
import { Usuario } from './../models/usuario';
import { ComumService } from 'src/app/services/comum.service';
import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class CredencialService {
  public KEY_LOGGED_USER_ID = 'LOGGED_USER_ID';


  constructor(private usuarioService: UsuarioService, private snack: MatSnackBar) { }

  public loggedUser: Usuario = {
    id: null,
    nome: 'Rafael Bini',
    email: 'rfabini1996@gmail.com',
    online: true,
    acesso: 'Professor',
  }

  public fazerLogout() {
    // Remove dos cookies os ID do usuario
    localStorage.removeItem(this.KEY_LOGGED_USER_ID);

    // Remove a info do usuario que estava logado
    this.loggedUser.id = null;
  }

  public fazerLogin(usuario: Usuario): Promise<Usuario> {

    // Busca no banco de dados o usuário e senha
    return new Promise((resolve, reject) => {
      this.usuarioService.podeLogar(usuario).then((usuarioLogado: Usuario) => {

        // Salva nos cookies o ID do usuario
        localStorage.setItem(this.KEY_LOGGED_USER_ID, usuarioLogado.id);

        // Salva info do usuario logado
        this.loggedUser = usuarioLogado;

        resolve(usuario);
      }).catch(reason => {
        reject(reason);
      });
    });

  }

  public estouLogado(): boolean {
    // Verifica os cookies
    if (localStorage.getItem(this.KEY_LOGGED_USER_ID)) {
      return true;
    }
    return false;
  }

  public getLoggedUserIdFromCookie(): string {
    return localStorage.getItem(this.KEY_LOGGED_USER_ID);
  }

  public cadastrar(usuario: Usuario) {

    var usuarioInserir = { ...usuario };
    usuarioInserir.email = usuario.email.toLowerCase();
    usuarioInserir.nome = this.getProperCase(usuario.nome);
    usuarioInserir.senha = Md5.hashStr(usuario.senha).toString();
    return this.usuarioService.insert(usuarioInserir);

  }

  getProperCase(texto: string): string {
    const PALAVRAS_EXCESSAO = ['de', 'da', 'das', 'dos', 'do'];

    var partes = texto.toLowerCase().split(' ');
    var nomeProper = "";

    for (let [i, parte] of partes.entries()) {
      if (!PALAVRAS_EXCESSAO.includes(parte))
        nomeProper += parte.substr(0, 1).toUpperCase() + parte.substr(1, parte.length).toLowerCase();
      else
        nomeProper += parte.toLowerCase();

      if (i < partes.length)
        nomeProper += ' ';
    }

    return nomeProper;
  }

  isNovoUsuarioValido(usuario: Usuario, confirmacaoSenha) {
    return new Promise(async (resolve, reject) => {
      if (this.getProblemaFromNovoUsuario(usuario, confirmacaoSenha) != null) {
        reject(this.getProblemaFromNovoUsuario(usuario, confirmacaoSenha));
      }
      else if (this.loggedUser.email != usuario.email) {
        if (await this.usuarioService.exists(usuario)) {
          reject('Email já cadastrado.')
        }
      }

      resolve();
    });

  }

  getProblemaFromNovoUsuario(usuario, confirmacaoSenha): string {
    if (usuario.nome == '') {
      return 'Preencha o campo nome.';
    }
    else if (usuario.email == '') {
      return 'Preencha o campo email.';
    }
    else if (usuario.senha == '') {
      return 'Preencha o campo senha.';
    }
    else if (!usuario.email.includes('@')) {
      return ("Email inválido.");
    }
    else if (usuario.senha != confirmacaoSenha) {
      return ("Senha diferente da confirmação.");
    }
    return null;
  }

  receberLoggedUser() {
    return new Promise((resolve, reject) => {
      if (this.estouLogado()) {
        this.usuarioService.get(localStorage.getItem(this.KEY_LOGGED_USER_ID))
          .then(usuario => {
            usuario.acesso = this.loggedUser.acesso;
            this.loggedUser = usuario;
            resolve();
          }).catch(error => {
            this.fazerLogout();
            reject(error);
            return false;
          });
      }
    })

  }

  isLoginValido(usuario: Usuario) {
    return new Promise((resolve, reject) => {
      if (usuario.email == '' || usuario.senha == '') {
        reject('Preencha todos os campos.');
      }
      else if (!usuario.email.includes('@')) {
        reject("Email inválido.");
      }

      resolve();
    })
  }

}
