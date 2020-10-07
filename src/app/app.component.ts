import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from './services/usuario.service';
import { Router, ActivatedRoute, NavigationEnd, RouterEvent } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CadastrarSeComponent } from './dialogs/cadastrar-se/cadastrar-se.component';
import { MatDialog } from '@angular/material/dialog';
import { CredencialService } from './services/credencial.service';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ComumService } from './services/comum.service';
import { Usuario } from './models/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private dialog: MatDialog, private snack: MatSnackBar, private usuarioService: UsuarioService, public credencialService: CredencialService, private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd || e instanceof RouterEvent) {
        if (e.url.includes('professor')) {
          this.credencialService.loggedUser.acesso = "professor";
        }
        else if (e.url.includes('aluno')) {
          this.credencialService.loggedUser.acesso = "aluno";
        }
      }
    });
  }

  ngOnInit() {

    // Recebe os dados do usuario no banco
    if (this.credencialService.estouLogado()) {
      this.usuarioService.get(localStorage.getItem(this.credencialService.KEY_LOGGED_USER_ID))
        .then(usuario => {
          usuario.acesso = this.credencialService.loggedUser.acesso;
          this.credencialService.loggedUser = usuario;
        }).catch(() => {
          this.credencialService.fazerLogout();
          return false;
        });
    }



  }

  fazerLogout() {
    this.router.navigate(['login']);
    this.credencialService.fazerLogout();
  }


  abrirDialogoCadastro() {
    const ref = this.dialog.open(CadastrarSeComponent, {

    });
    ref.afterClosed().subscribe((usuarioCadastrado) => {

      this.credencialService.fazerLogin(usuarioCadastrado).then((usuarioLogado: Usuario) => {

        this.router.navigate(['professor']);

      })
        .catch(reason => {
          this.snack.open(reason, null, {
            duration: 3500,
          })
        });



    });
  }

  goHome() {

    this.router.navigate(['']);

  }

}
