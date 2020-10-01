import { Router } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CadastrarSeComponent } from './dialogs/cadastrar-se/cadastrar-se.component';
import { MatDialog } from '@angular/material/dialog';
import { CredencialService } from './services/credencial.service';
import { Component, OnInit } from '@angular/core';
import { ComumService } from './services/comum.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private dialog: MatDialog, public credencialService: CredencialService, private router: Router) { }

  ngOnInit() {

  }

  abrirDialogoCadastro() {
    this.dialog.open(CadastrarSeComponent, {
      data: { tipoUsuario: 'professor' }
    });
  }

  goHome() {
    if (this.credencialService.estouLogado()) {
      if (this.credencialService.loggedUser.acesso.toLowerCase() == "professor")
        this.router.navigate(['professor']);
      else
        this.router.navigate(['aluno']);
    }
    else {
      this.router.navigate(['']);
    }
  }

}
