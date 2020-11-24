import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CredencialService } from 'src/app/services/credencial.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  novoUsuario: Usuario = {
    nome: '',
    email: '',
    senha: '',
  };
  confirmarcaoSenha: string;
  constructor(public credencialService: CredencialService, private router: Router,
    private snack: MatSnackBar) { }

  ngOnInit(): void {

  }

  primeiraAvaliacao() {
    this.credencialService.isNovoUsuarioValido(this.novoUsuario, this.confirmarcaoSenha).then(() => {
      this.credencialService.cadastrar(this.novoUsuario).then(() => {
        this.novoUsuario.id = this.novoUsuario.email;
        this.snack.open("Cadastrado com sucesso!", null, {
          duration: 3500,
        })
        this.credencialService.fazerLogin(this.novoUsuario).then(usuarioLogado => {
          this.router.navigate(['professor/avaliacao/nova']);
        })
          .catch(reason => {
            this.snack.open(reason, null, {
              duration: 3500,
            })
          });;

      });
    }).catch(reason => {
      this.snack.open(reason, null, {
        duration: 3500,
      })
    });


  }

}
