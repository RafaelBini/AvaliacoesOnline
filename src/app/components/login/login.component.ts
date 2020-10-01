import { ComumService } from './../../services/comum.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CadastrarSeComponent } from './../../dialogs/cadastrar-se/cadastrar-se.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { CredencialService } from 'src/app/services/credencial.service';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public id: string = null;
  public usuario: Usuario = {
    email: '',
    senha: '',
  };

  constructor(private dialog: MatDialog, public credencialService: CredencialService, private route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {


    this.route.params.subscribe(param => {
      this.id = param.id;

      if (this.credencialService.estouLogado()) {
        this.direcionar();
      }

    });

  }

  abrirCadastrar() {
    const ref = this.dialog.open(CadastrarSeComponent, {
    });
    ref.afterClosed().subscribe((usuarioCadastrado) => {
      if (usuarioCadastrado) {
        this.usuario = usuarioCadastrado;
        this.fazerLogin();
      }
    });
  }

  fazerLogin() {
    this.credencialService.fazerLogin(this.usuario);

    this.direcionar();

  }

  direcionar() {
    if (this.id) {
      this.router.navigate([`/aluno/avaliacao/${this.id}`]);
    }
    else {
      this.router.navigate(['/professor']);
    }
  }

}
