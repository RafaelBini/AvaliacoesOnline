import { ProvaService } from './../../services/prova.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Avaliacao } from './../../models/avaliacao';
import { AvaliacaoService } from './../../services/avaliacao.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CredencialService } from 'src/app/services/credencial.service';
import { Prova } from 'src/app/models/prova';

@Component({
  selector: 'app-prova-imprimir',
  templateUrl: './prova-imprimir.component.html',
  styleUrls: ['./prova-imprimir.component.css']
})
export class ProvaImprimirComponent implements OnInit {

  public prova: Prova;
  public avaliacao: Avaliacao;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private credencialService: CredencialService,
    private avaliacaoService: AvaliacaoService,
    private provaService: ProvaService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {

      this.avaliacaoService.getAvaliacaoFromId(params.id).then(avaliacao => {

        if (!this.estouAutorizado(avaliacao)) {
          this.snack.open("Você não está autorizado a acessar essa página", null, { duration: 3500 });
          this.router.navigate(['']);
          return;
        }

        this.avaliacao = avaliacao;
        console.log(avaliacao.provaGabarito);
        this.provaService.getProvaFromId(avaliacao.provaGabarito).then(prova => {

          this.prova = this.provaService.getProvaFromGabarito(prova);
        });


      }).catch(reason => {
        console.log(reason);
        this.snack.open("Avaliação não encontrada", null, { duration: 3500 });
        this.router.navigate(['']);
        return;
      });
    });
  }

  estouAutorizado(avaliacao: Avaliacao): boolean {
    return avaliacao.alunosIds.includes(this.credencialService.getLoggedUserIdFromCookie())
      || this.credencialService.getLoggedUserIdFromCookie() == avaliacao.professorId
      || this.credencialService.getLoggedUserIdFromCookie() == avaliacao.id;

  }

}
