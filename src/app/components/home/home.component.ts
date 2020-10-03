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
    if (this.credencialService.estouLogado()) {
      if (this.credencialService.loggedUser.acesso.toLowerCase() == "professor")
        this.router.navigate(['professor']);
      else
        this.router.navigate(['aluno']);
    }

  }

  primeiraAvaliacao() {
    this.credencialService.isNovoUsuarioValido(this.novoUsuario, this.confirmarcaoSenha).then(() => {
      this.credencialService.cadastrar(this.novoUsuario).then((docRef) => {
        this.novoUsuario.id = docRef.id;
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
