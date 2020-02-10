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
    jQuery(document).ready(function(){

      jQuery(".carousel-fullscreen.carousel-slider").carousel({
        fullWidth: true,
        indicators: true,
      }).css("height", jQuery(window).height());
      setTimeout(autoplay, 3500);
      function autoplay() {
        jQuery(".carousel-fullscreen.carousel-slider").carousel("next");
	      setTimeout(autoplay, 3500);
      }

  });
  }

}
