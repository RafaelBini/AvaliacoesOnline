import { TimeService } from './services/time.service';
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

  private url: string;

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private usuarioService: UsuarioService,
    public credencialService: CredencialService,
    private timeService: TimeService,
    private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {

  }

  mudarPara(tipoAcesso: 'aluno' | 'professor') {
    this.credencialService.loggedUser.acesso = tipoAcesso;
    this.usuarioService.update(this.credencialService.loggedUser);
  }

  fazerLogout() {
    this.router.navigate(['login']);
    this.credencialService.fazerLogout();
  }


  abrirDialogoCadastro() {
    const ref = this.dialog.open(CadastrarSeComponent, {

    });
    ref.afterClosed().subscribe((usuarioCadastrado: Usuario) => {

      if (usuarioCadastrado == undefined || usuarioCadastrado == null || usuarioCadastrado == '')
        return;

      console.log(usuarioCadastrado)

      this.credencialService.fazerLogin(usuarioCadastrado).then((usuarioLogado: Usuario) => {

        if (this.url == '/login')
          this.router.navigate(['/professor']);
        else
          window.location.href = window.location.href;

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
