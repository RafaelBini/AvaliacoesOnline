import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor(private http: HttpClient) { }

  getCurrentTime() {
    return new Promise<number>((resolve, reject) => {
      this.http.get<any>('http://worldtimeapi.org/api/timezone/America/Argentina/Salta').toPromise().then(data => {
        resolve(data.unixtime as number);
      }).catch(reason => reject(reason));
    });

  }

}
