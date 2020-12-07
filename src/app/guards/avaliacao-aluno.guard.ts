import { MatSnackBar } from '@angular/material/snack-bar';
import { AvaliacaoService } from '../services/avaliacao.service';
import { CredencialService } from '../services/credencial.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoAlunoGuard implements CanActivate {

  constructor(
    private credencialService: CredencialService,
    private avaliacaoService: AvaliacaoService,
    private snack: MatSnackBar,
    private router: Router,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {

    return new Observable<boolean>(subscriber => {
      if (this.credencialService.estouLogado()) {

        this.credencialService.receberLoggedUser().then(() => {

          this.avaliacaoService.getAvaliacaoFromId(route.params.id).then(avaliacao => {

            if (avaliacao.professorId == this.credencialService.getLoggedUserIdFromCookie()) {
              this.router.navigate([`professor/avaliacao/${route.params.id}`]);
              subscriber.next(false);
            }
            else {
              this.credencialService.loggedUser.acesso = "aluno";
              subscriber.next(true);
            }


          })
            .catch(reason => {
              console.log(reason);
              this.snack.open(reason, null, { duration: 3500 });
              this.router.navigate(['']);
              subscriber.next(false);
            });



        });

      }
      else {
        this.router.navigate([`${route.params.id}`]);
        subscriber.next(false);
      }

    });



  }

}
