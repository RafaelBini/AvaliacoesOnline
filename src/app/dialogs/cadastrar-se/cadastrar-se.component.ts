import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from './../../models/usuario';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  };

  constructor(public dialogRef: MatDialogRef<CadastrarSeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public snack: MatSnackBar) { }

  ngOnInit(): void {

  }

}
