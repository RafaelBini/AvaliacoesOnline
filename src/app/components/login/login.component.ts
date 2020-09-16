import { ComumService } from './../../services/comum.service';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private dialog: MatDialog, public credencialService: CredencialService, private route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.id = param.id;
    })
  }

  abrirCadastrar() {
    this.dialog.open(CadastrarSeComponent, {
    });
  }

  fazerLogin() {
    this.credencialService.fazerLogin();

    if (this.id) {
      this.router.navigate([`/aluno/avaliacao/${this.id}`]);
    }
    else {
      this.router.navigate(['/professor']);
    }


  }



}
