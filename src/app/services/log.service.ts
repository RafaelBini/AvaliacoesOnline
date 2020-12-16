import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  public me = {
    ipAddress: '',
    city: '',
    region: '',
    country: '',
    timezone: {
      name: '',
      offset: '',
    },
    currentTime: null,
    browser: '',
    os: '',
    location: '',
    previousUrl: '',
  }

  constructor(
    private http: HttpClient,
  ) { }

  getBasicInfo() {
    this.http.get<any>('https://avaliacoes-online.herokuapp.com/ip').subscribe(info => {
      this.me.ipAddress = info.ipAddress;
      this.me.city = info.city;
      this.me.region = info.region;
      this.me.country = info.country;
      this.me.timezone = info.timezone;
      this.me.currentTime = new Date().getTime();
      this.me.browser = this.getBrowserFromUserAgent(navigator.userAgent);
      this.me.os = this.getOperationalSystemFromUserAgent(navigator.userAgent);
      this.me.location = `${info.ll[0]},${info.ll[1]}`;
      this.me.previousUrl = document.referrer;
      console.log(this.me);
    })
  }

  getBrowserFromUserAgent(userAgent: string) {

    var ua = userAgent.toLowerCase();

    if (ua.includes('edg')) {
      return 'Edge'
    }
    else if (ua.includes('firefox') && !ua.includes('seamonkey')) {
      return 'Firefox'
    }
    else if (ua.includes('seamonkey')) {
      return 'Seamonkey'
    }
    else if (ua.includes('chrome') && !ua.includes('chromium')) {
      return 'Chrome'
    }
    else if (ua.includes('chromium')) {
      return 'Chromium'
    }
    else if (ua.includes('safari') && !ua.includes('chrome')) {
      return 'Safari'
    }
    else if (ua.includes('opera') || ua.includes('opr')) {
      return 'Opera'
    }
    else if (ua.includes('trident') || ua.includes('msie')) {
      return 'Internet Explorer'
    }
    else {
      return 'Não Identificado'
    }
  }

  getOperationalSystemFromUserAgent(userAgent: string) {
    var ua = userAgent.toLowerCase();

    if (ua.includes('android')) {
      return 'Android'
    }
    else if (ua.includes('windows')) {
      return 'Windows'
    }
    else if (ua.includes('ios')) {
      return 'IOS'
    }
    else if (ua.includes('mac')) {
      return 'Mac'
    }
    else if (ua.includes('linux')) {
      return 'Linux'
    }
  }
}
