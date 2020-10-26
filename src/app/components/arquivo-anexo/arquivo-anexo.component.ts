import { MatDialog } from '@angular/material/dialog';
import { FileService } from './../../services/file.service';
import { Questao } from 'src/app/models/questao';
import { Arquivo } from './../../models/arquivo';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ConfirmarComponent } from 'src/app/dialogs/confirmar/confirmar.component';

@Component({
  selector: 'app-arquivo-anexo',
  templateUrl: './arquivo-anexo.component.html',
  styleUrls: ['./arquivo-anexo.component.css']
})
export class ArquivoAnexoComponent implements OnInit {

  constructor(
    private fileService: FileService,
    private dialog: MatDialog,
  ) { }

  @Input() file: Arquivo;
  @Input() questao: Questao;
  @Input() anexoIndex: number;
  @Input() editando: boolean = false;
  @Input() tipo: 'anexo' | 'arquivosEntregues' = 'anexo';

  @Output() uploadCancelado = new EventEmitter<void>();
  @Output() anexoRemovido = new EventEmitter<void>();


  ngOnInit(): void {
  }

  cancelarUploadAnexo(anexo: Arquivo) {
    var diagRef = this.dialog.open(ConfirmarComponent, {
      data: {
        titulo: "Cancelar Upload",
        mensagem: `Você tem certeza de que deseja cancelar o upload do arquivo ${anexo.nomeArquivo}?`
      }
    });
    diagRef.afterClosed().subscribe(result => {
      if (result == true) {
        console.log("vou cancelar");
        anexo.descricao = "cancelar";
      }
    });

  }
  removerAnexo(questao: Questao, anexoIndex: number) {
    if (this.tipo == 'anexo') {
      // Remove no fire
      this.fileService.delete(questao.anexos[anexoIndex].caminhoArquivo);
      // Remove daqui
      questao.anexos.splice(anexoIndex, 1);
    }
    else if (this.tipo == 'arquivosEntregues') {
      // Remove no fire
      this.fileService.delete(questao.arquivosEntregues[anexoIndex].caminhoArquivo);
      // Remove daqui
      questao.arquivosEntregues.splice(anexoIndex, 1);
      this.anexoRemovido.emit();
    }

  }
  baixarAnexo(anexo: Arquivo) {

    window.open(anexo.url, '_blank');
  }

}
