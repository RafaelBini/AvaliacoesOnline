import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from './usuario.service';
import { Usuario } from './../models/usuario';
import { ComumService } from 'src/app/services/comum.service';
import { Injectable } from '@angular/core';

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
    return this.usuarioService.insert(usuario);

  }

  isNovoUsuarioValido(usuario: Usuario, confirmacaoSenha) {
    return new Promise(async (resolve, reject) => {
      if (usuario.nome == '' || usuario.email == '' || usuario.senha == '') {
        reject('Preencha todos os campos.');
      }
      else if (!usuario.email.includes('@')) {
        reject("Email inválido.");
      }
      else if (usuario.senha != confirmacaoSenha) {
        reject("Senha diferente da confirmação.");
      }
      else if (this.loggedUser.email != usuario.email) {
        if (await this.usuarioService.exists(usuario)) {
          reject('Email já cadastrado.')
        }
      }

      resolve();
    });

  }

}
