import { ComumService } from 'src/app/services/comum.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CredencialService {

  constructor(private comumService: ComumService) { }

  public loggedUser = {
    id: null,
    nome: 'Rafael Bini',
    acesso: 'Professor',
    email: 'rfabini1996@gmail.com',
    online: true,
    instanciaStatusId: null,
  }

  public fazerLogout() {
    this.loggedUser.id = null;
  }

  public fazerLogin() {
    this.loggedUser.id = "01";
  }

  public estouLogado(): boolean {
    return this.loggedUser.id != null;
  }

}
