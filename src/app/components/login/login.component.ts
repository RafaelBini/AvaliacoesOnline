import { ComumService } from './../../services/comum.service';
import { ActivatedRoute } from '@angular/router';
import { CadastrarSeComponent } from './../../dialogs/cadastrar-se/cadastrar-se.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { CredencialService } from 'src/app/services/credencial.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public id: string = null;
  public tipoUsuario: String = "professor";

  constructor(private dialog: MatDialog, public credencialService: CredencialService, private route: ActivatedRoute, public comumService: ComumService) { }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.id = param.id;
    })
  }

  abrirCadastrar() {
    this.dialog.open(CadastrarSeComponent, {
      data: { tipoUsuario: this.tipoUsuario, id: this.id }
    });
  }

  fazerLogin() {
    this.credencialService.fazerLogin();
  }

}
