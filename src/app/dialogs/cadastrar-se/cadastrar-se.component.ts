import { ComumService } from './../../services/comum.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from './../../models/usuario';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CredencialService } from 'src/app/services/credencial.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastrar-se',
  templateUrl: './cadastrar-se.component.html',
  styleUrls: ['./cadastrar-se.component.css']
})
export class CadastrarSeComponent implements OnInit {
  public novoUsuario: Usuario = {
    tipo: "",
    nome: "",
    email: "",
    senha: "",
    acesso: "professor",
  };
  public confirmacaoSenha: string;

  constructor(public dialogRef: MatDialogRef<CadastrarSeComponent>, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any, public snack: MatSnackBar, public comumService: ComumService, public credencialService: CredencialService) { }

  ngOnInit(): void {

  }

  cadastrar() {

    this.credencialService.isNovoUsuarioValido(this.novoUsuario, this.confirmacaoSenha).then(() => {
      this.credencialService.cadastrar(this.novoUsuario).then(docRef => {

        this.snack.open("Cadastrado com sucesso!", null, {
          duration: 3500
        });

        this.novoUsuario.id = docRef.id;
        this.dialogRef.close(this.novoUsuario);

      })
        .catch((reason) => {
          this.snack.open("Não foi possivel cadastrar", null, {
            duration: 2500,
          });
          console.log(reason);
        });
    })
      .catch(reason => {
        this.snack.open(reason, null, {
          duration: 3500,
        });
      });
  }

  onKeyUp(event) {
    if (event.key == 'Enter') {
      this.cadastrar();
    }
  }


}
