import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

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
}
