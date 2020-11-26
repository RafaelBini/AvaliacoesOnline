import { Questao } from 'src/app/models/questao';
import { ComumService } from 'src/app/services/comum.service';
import { Associacao } from './../../models/associacao';
import { ProvaService } from './../../services/prova.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Avaliacao } from './../../models/avaliacao';
import { AvaliacaoService } from './../../services/avaliacao.service';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CredencialService } from 'src/app/services/credencial.service';
import { Prova } from 'src/app/models/prova';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-prova-imprimir',
  templateUrl: './prova-imprimir.component.html',
  styleUrls: ['./prova-imprimir.component.css']
})
export class ProvaImprimirComponent implements OnInit {

  public prova: Prova;
  public avaliacao: Avaliacao;
  @ViewChild('body') body: ElementRef;
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private credencialService: CredencialService,
    private avaliacaoService: AvaliacaoService,
    private provaService: ProvaService,
    public comumService: ComumService,
    private renderer: Renderer2,
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

          this.prova = prova;

          setTimeout(() => {
            this.alocarPages();
          });

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

  alocarPages() {
    const TAMANHO_MAXIMO_PAGE = 1014; //1114;


    // novoBody.innerHTML = "";

    var pages: Array<HTMLElement> = [];
    pages.push(this.renderer.createElement('div'));
    pages[0].setAttribute('class', 'page');


    var tamanhoAcumulado = 0;

    while (this.body.nativeElement.children[0].children.length > 0) {
      try {
        var child = this.body.nativeElement.children[0].children[0];
        tamanhoAcumulado += child.getBoundingClientRect().height;

        if (tamanhoAcumulado < TAMANHO_MAXIMO_PAGE) {
          this.renderer.appendChild(pages[pages.length - 1], child);
        }
        else {
          this.renderer.appendChild(this.body.nativeElement, pages[pages.length - 1]);
          pages.push(this.renderer.createElement('div'));
          pages[pages.length - 1].setAttribute('class', 'page');

          tamanhoAcumulado = 0;
        }
      }

      catch (reason) { }
      console.log(tamanhoAcumulado)
    };
    console.log(this.body.nativeElement.children);
    this.renderer.appendChild(this.body.nativeElement, pages[pages.length - 1]);
    this.renderer.removeChild(this.body.nativeElement, this.body.nativeElement.children[0]);


  }

  associacoesOrdenadas(associacoes: Associacao[]) {
    return associacoes.sort((a, b) => a.opcaoSelecionada > b.opcaoSelecionada ? 1 : -1)
  }

  getMaiorAssociacaoLength(associacoes: Associacao[]): number {
    var maiorLength = 0;
    for (let associacao of associacoes) {
      if (associacao.opcaoSelecionada.length > maiorLength)
        maiorLength = associacao.opcaoSelecionada.length;
    }
    return maiorLength;
  }

  opcoesPreencherOrdenadas(questao: Questao) {
    return questao.opcoesParaPreencher.sort((a, b) => a.opcaoSelecionada > b.opcaoSelecionada ? 1 : -1)
  }

  getMaiorOpcaoPreencherLength(questao: Questao): number {
    var maiorLength = 0;
    for (let opcaoPreencher of questao.opcoesParaPreencher) {
      if (opcaoPreencher.opcaoSelecionada.length > maiorLength)
        maiorLength = opcaoPreencher.opcaoSelecionada.length;
    }
    return maiorLength;
  }

  getArrayFromLength(length: number): number[] {
    var vetor = [];
    for (var i = 1; i <= length; i++)
      vetor.push(i);
    return vetor;
  }

  async makePDF(action: 'download' | 'print') {
    let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  

    for (var i = 0; i < document.getElementsByClassName('page').length; i++) {


      var data = document.getElementsByClassName('page')[i] as HTMLElement;
      var canvas = await html2canvas(data);
      // Few necessary setting options  
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')

      var position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)



      if (pdf.getNumberOfPages() >= document.getElementsByClassName('page').length) {

        pdf.autoPrint();
        if (action == 'download')
          pdf.save(`${this.avaliacao.titulo}.pdf`); // Generated PDF  
        else if (action == 'print')
          window.open(pdf.output('bloburl').toString(), '_blank')

      }
      else
        pdf.addPage('a4', 'p');





    }


  }

}
