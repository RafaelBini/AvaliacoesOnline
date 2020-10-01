import { Usuario } from './../models/usuario';
import { ComumService } from 'src/app/services/comum.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CredencialService {
  private KEY_LOGGED_USER_ID = 'LOGGED_USER_ID';


  constructor(private comumService: ComumService) { }

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

  public fazerLogin(usuario: Usuario) {
    // TODO: Busca no banco de dados o usuário e senha

    // Se encontrou

    // Salva nos cookies o ID do usuario
    localStorage.setItem(this.KEY_LOGGED_USER_ID, 'XXX');

    // Salva info do usuario logado
    this.loggedUser.id = 'XXX';
  }

  public estouLogado(): boolean {
    // Verifica os cookies
    if (localStorage.getItem(this.KEY_LOGGED_USER_ID)) {
      // Verifica as infos
      if (this.loggedUser.id == null) {
        // TODO: Recebe os dados do banco
        this.loggedUser.id = 'XXX';
        // Verifica se encontrou
        if (this.loggedUser.id == null) {
          // Se não encontrou, tira esses cookies falsos
          this.fazerLogout();
          return false;
        }
        return true;
      }
      else {
        return true;
      }
    }

    return false;
  }

}
