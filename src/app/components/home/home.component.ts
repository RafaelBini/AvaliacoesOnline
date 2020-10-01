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
  novoUsuario: Usuario;
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
    this.credencialService.cadastrar(this.novoUsuario);
    this.snack.open("Cadastrado com sucesso!", null, {
      duration: 3500,
    })
    this.credencialService.fazerLogin(this.novoUsuario);
    this.router.navigate(['professor/avaliacao/nova']);
  }

}
