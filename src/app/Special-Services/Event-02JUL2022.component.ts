import { Component, Input, HostListener, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ViewportScroller } from "@angular/common";

@Component({
  selector: 'app-Event-02JUL2022',
  templateUrl: './Event-02JUL2022.component.html',
  styleUrls: ['./Event-02JUL2022.component.css']
})

export class Event02JULComponent {

  constructor(
    private router:Router,
    private http: HttpClient,
    private scroller: ViewportScroller,
    ) {}
  

    getScreenWidth: any;
    getScreenHeight: any;
    device_type:string='';

    text_error:string=''
 


@HostListener('window:resize', ['$event'])
onWindowResize() {
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
    }


  ngOnInit(){
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
  }

  goDown(event:string){
    this.scroller.scrollToAnchor(event);
  }

}