import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private storage: AngularFireStorage) { }

  upload(caminho: string, arquivo: any) {

    return this.storage.upload(caminho, arquivo);
  }

  delete(caminho: string) {
    this.storage.ref(caminho).delete();
  }



  async makePDF(pageClassName: string, documentName: string, action: 'download' | 'print') {
    let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  

    for (var i = 0; i < document.getElementsByClassName(pageClassName).length; i++) {


      var data = document.getElementsByClassName(pageClassName)[i] as HTMLElement;
      var canvas = await html2canvas(data);
      // Few necessary setting options  
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')

      var position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)



      if (pdf.getNumberOfPages() >= document.getElementsByClassName(pageClassName).length) {


        if (action == 'download')
          pdf.save(`${documentName}.pdf`); // Generated PDF  
        else if (action == 'print') {
          pdf.autoPrint();
          window.open(pdf.output('bloburl').toString(), '_blank');
        }

      }
      else
        pdf.addPage('a4', 'p');
    }
  }

}
