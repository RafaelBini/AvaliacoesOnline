import { Component, OnInit } from '@angular/core';
import { ComumService } from './services/comum.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public comumService: ComumService) { }

  ngOnInit() {

  }

}
