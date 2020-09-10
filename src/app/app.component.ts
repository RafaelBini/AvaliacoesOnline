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

  constructor(private dialog: MatDialog, public credencialService: CredencialService) { }

  ngOnInit() {

  }

  abrirDialogoCadastro() {
    this.dialog.open(CadastrarSeComponent, {
      data: { tipoUsuario: 'professor' }
    });
  }


}
