import { CredencialService } from './../services/credencial.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private credencialService: CredencialService,
    private router: Router,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {

    return new Observable<boolean>(subscriber => {
      if (this.credencialService.estouLogado()) {
        this.credencialService.receberLoggedUser().then(() => {

          if (route.url[0].path == 'professor') {
            this.credencialService.loggedUser.acesso = "professor";
          }
          else if (route.url[0].path == 'aluno') {
            this.credencialService.loggedUser.acesso = "aluno";
          }

          subscriber.next(true);
        });

      }
      else {
        console.log("Redirecionando usuario deslogado")
        this.router.navigate(['login']);
        subscriber.next(false);
      }
    });



  }

}
