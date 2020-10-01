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
    const ref = this.dialog.open(CadastrarSeComponent, {

    });
    ref.afterClosed().subscribe((usuarioCadastrado) => {
      this.credencialService.fazerLogin(usuarioCadastrado);
      this.router.navigate(['professor']);
    });
  }

  goHome() {

    this.router.navigate(['']);

  }

}
