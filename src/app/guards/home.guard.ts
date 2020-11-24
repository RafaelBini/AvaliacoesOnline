import { CredencialService } from './../services/credencial.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {

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
          if (this.credencialService.loggedUser.acesso.toLowerCase() == "professor")
            this.router.navigate(['professor']);
          else
            this.router.navigate(['aluno']);
          subscriber.next(false);
        });

      }
      else {
        subscriber.next(true);
      }
    });



  }

}
