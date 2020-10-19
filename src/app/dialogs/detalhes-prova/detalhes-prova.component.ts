import { ComumService } from 'src/app/services/comum.service';
import { Usuario } from 'src/app/models/usuario';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detalhes-prova',
  templateUrl: './detalhes-prova.component.html',
  styleUrls: ['./detalhes-prova.component.css']
})
export class DetalhesProvaComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public aluno: Usuario,
    public comumService: ComumService,
  ) { }

  ngOnInit(): void {
  }

}
