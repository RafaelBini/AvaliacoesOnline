import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from './../../services/usuario.service';
import { CredencialService } from 'src/app/services/credencial.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-usuario-perfil-editar',
  templateUrl: './usuario-perfil-editar.component.html',
  styleUrls: ['./usuario-perfil-editar.component.css']
})
export class UsuarioPerfilEditarComponent implements OnInit {
  public alterar = false;

  public usuario: Usuario = {
    id: '',
    nome: '',
    email: ''
  };
  public confirmacaoSenha: string;

  constructor(private snack: MatSnackBar, public credencialService: CredencialService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    var ref = setInterval(() => {
      if (this.credencialService.loggedUser.id != null) {
        this.usuario = { ...this.credencialService.loggedUser };
        this.usuario.senha = '';
        clearInterval(ref);
      }
    }, 100);
  }

  salvar() {

    if (!this.alterar) {
      delete this.usuario.senha;
      this.confirmacaoSenha = null;
    }

    this.credencialService.isNovoUsuarioValido(this.usuario, this.confirmacaoSenha).then(() => {
      this.usuarioService.update(this.usuario).then(() => {
        this.snack.open("Dados salvos", null, {
          duration: 3500,
        });
      }).catch(reason => {
        this.snack.open(reason, null, {
          duration: 3500,
        });
      });
    }).catch(reason => {
      this.snack.open(reason, null, {
        duration: 3500,
      });
    });





  }

}
