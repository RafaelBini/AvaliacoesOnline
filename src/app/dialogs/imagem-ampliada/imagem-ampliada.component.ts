import { Arquivo } from './../../models/arquivo';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-imagem-ampliada',
  templateUrl: './imagem-ampliada.component.html',
  styleUrls: ['./imagem-ampliada.component.css']
})
export class ImagemAmpliadaComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public imagem: Arquivo,) { }

  ngOnInit(): void {
  }

}
