import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor(private http: HttpClient) { }

  private delta: number = null;

  updateDelta() {

    return new Promise<number>((resolve, reject) => {

      var intervalRef = setInterval(() => {
        this.http.get<any>('http://worldtimeapi.org/api/timezone/America/Sao_Paulo').toPromise().then(data => {
          const DATETIME_SERVIDOR = new Date((data.datetime as string).substr(0, 19));
          const DATETIME_AGORA = new Date();

          this.delta = DATETIME_SERVIDOR.getTime() - DATETIME_AGORA.getTime();
          clearInterval(intervalRef);
          resolve(this.delta);

        }).catch(() => reject("erro ao tentar receber delta"));
      });



    });


  }

  getCurrentDateTime(): Date {
    if (this.delta)
      return new Date(new Date().getTime() + this.delta);
    else {
      return null;
    }

  }

}
