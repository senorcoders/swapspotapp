import { Component, OnInit } from '@angular/core';
declare var jQuery;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
    document.addEventListener("DOMContentLoaded", function(){
      jQuery('.preloader-background').delay(10).fadeOut('slow');
    });
  }

}
