import { FileService } from './../../services/file.service';
import { MatDialog } from '@angular/material/dialog';
import { Arquivo } from './../../models/arquivo';
import { Questao } from 'src/app/models/questao';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImagemAmpliadaComponent } from 'src/app/dialogs/imagem-ampliada/imagem-ampliada.component';
import { ConfirmarComponent } from 'src/app/dialogs/confirmar/confirmar.component';

@Component({
  selector: 'app-arquivo-imagem',
  templateUrl: './arquivo-imagem.component.html',
  styleUrls: ['./arquivo-imagem.component.css']
})
export class ArquivoImagemComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private fileService: FileService,
  ) { }

  @Input() questao: Questao;
  @Input() file: Arquivo;
  @Input() imagemIndex: number;
  @Input() editando: boolean = false;
  @Input() tipo: 'imagens' | 'imagensEntregues' = 'imagens';

  @Output() imagemRemovida = new EventEmitter<void>();

  ngOnInit(): void {
  }

  removerImagem(questao: Questao, imagemIndex: number) {
    if (this.tipo == 'imagens') {
      // Remove no fire
      this.fileService.delete(questao.imagens[imagemIndex].caminhoArquivo);
      // Remove daqui
      questao.imagens.splice(imagemIndex, 1);
    }
    else if (this.tipo == 'imagensEntregues') {
      // Remove no fire
      this.fileService.delete(questao.imagensEntregues[imagemIndex].caminhoArquivo);
      // Remove daqui
      questao.imagensEntregues.splice(imagemIndex, 1);
      this.imagemRemovida.emit();
    }

  }
  cancelarUploadImagem(anexo: Arquivo) {
    var diagRef = this.dialog.open(ConfirmarComponent, {
      data: {
        titulo: "Cancelar Upload",
        mensagem: `Você tem certeza de que deseja cancelar o upload do arquivo ${anexo.nomeArquivo}?`
      }
    });
    diagRef.afterClosed().subscribe(result => {
      if (result == true) {
        anexo.descricao = "cancelar";
      }
    });

  }
  ampliarImagem(imagem: Arquivo) {
    this.dialog.open(ImagemAmpliadaComponent, {
      data: imagem,
      width: '85%',
      height: '90%',
    })
  }

}
