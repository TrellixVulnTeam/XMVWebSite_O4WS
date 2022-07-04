import { Component, OnInit , Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges, 
  AfterContentInit, HostListener, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ViewportScroller } from "@angular/common";
import { EventAug } from '../JsonServerClass';
import { encrypt, decrypt} from '../EncryptDecryptServices';

export class StructurePhotos{
  name:string='';
  mediaLink:string='';
  selfLink:string='';
  photo=new Image();
  vertical:boolean=false;
 }


@Component({
  selector: 'app-WeddingPhotos',
  templateUrl: './WeddingPhotos.component.html',
  styleUrls: ['./WeddingPhotos.component.css']
})

export class WeddingPhotosComponent {

  constructor(
    private router:Router,
    private http: HttpClient,
    private scroller: ViewportScroller,
    ) {}
  
    @ViewChild('ImageCanvas', { static: true })
    myImage = new Image();
    theCanvas:any;
    ctx:any;
    PhotoNbForm: FormGroup = new FormGroup({ 
      SelectNb: new FormControl(),
      Width: new FormControl(),
      Height: new FormControl(),
    });
    prevCanvasPhoto:number=0;
    initialdrawCanvas:boolean=false;
    message_canvas:string='';
    
    getScreenWidth: any;
    getScreenHeight: any;
    device_type:string='';
    yourLanguage:string='FR';
    @Input() WeddingPhotos:Array<StructurePhotos>=[];
   
    pagePhotos:boolean=false;
    display_download:boolean=false;
    selected_photo:number=-1;
    thePhotos = new Image();

    nb_total_page:number=0;
    nb_photo_per_page:number=10;
    nb_current_page:number=0;
    nb_current_photo:number=0;
    pages_to_display:Array<number>=[1,2,3,4,5,6,7,8,9,10];

    myConsole:Array<string>=[];
    msgConsole:string='';
    i:number=0;
    j:number=0;
    id_Animation:number=0;
    j_loop:number=0;

    Google_Bucket_Access_Root:string='https://storage.googleapis.com/storage/v1/b/';
    Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';
    Google_Bucket_Name:string='logconsole'; 
    Google_Object_Name:string='WeddingLogs';
    HTTP_Address:string='';

    myDate:string='';
    myTime=new Date();
    thetime:number=0;
    theWidth:number=0;
    theHeight:number=0;

@HostListener('window:resize', ['$event'])
onWindowResize() {
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
      this.SizeImage();
    }

SizeImage(){
  if (this.getScreenWidth<900){
    this.theWidth=Math.floor(this.getScreenWidth*0.9);
    this.theHeight=Math.floor(this.getScreenHeight*0.6);
    this.PhotoNbForm.controls['Width'].setValue(this.theWidth);
    this.PhotoNbForm.controls['Height'].setValue(this.theHeight);
  } else{
    this.theWidth=900;
    this.theHeight=600;
    this.PhotoNbForm.controls['Width'].setValue(this.theWidth);
    this.PhotoNbForm.controls['Height'].setValue(this.theHeight);
  }
}


  ngOnInit(){
    this.msgConsole='ngOnInit() in WeddingPhotos component';
    console.log(this.msgConsole);
    this.myConsole.push('');
    this.myConsole[this.myConsole.length-1]=this.msgConsole;
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
      this.myDate= this.myTime.toString().substring(8,24);
      this.thetime=this.myTime.getTime();
      
      this.SizeImage();
      this.PhotoNbForm.controls['SelectNb'].setValue(null);
      }    

  ngAfterViewInit() { 
    this.msgConsole='ngAfterViewInit() in WeddingPhotos component';
    console.log(this.msgConsole);
    this.myConsole.push('');
    this.myConsole[this.myConsole.length-1]=this.msgConsole;
    this.theCanvas=document.getElementById('canvasElem');
          
    if (!this.ctx) { //true
        this.ctx=this.theCanvas.getContext('2d');
        this.ctx.canvas.width=this.PhotoNbForm.controls['Width'].value;
        this.ctx.canvas.height=this.PhotoNbForm.controls['Height'].value;
        this.displayPhotos();
    }

  }

goDown(event:string){
    this.pagePhotos=false;
    this.scroller.scrollToAnchor(event);
  }



displayPhotos(){
  this.msgConsole='displayPhotos() in WeddingPhotos component';
  console.log(this.msgConsole);
  this.myConsole.push('');
  this.myConsole[this.myConsole.length-1]=this.msgConsole;
  this.pagePhotos=true;
  this.display_download=false;
  this.selected_photo=-1;
  this.drawPhotoCanvas();
 
}

next_prev_page(event:any){
  this.selected_photo=-1;
  this.display_download=false;
  if(event === 'prev' && this.nb_current_page > 1){
    this.nb_current_page--
    this.nb_current_photo=(this.nb_current_page-1)*this.nb_photo_per_page;
  } else if (event === 'next' && this.nb_current_page < this.nb_total_page){
    this.nb_current_page++
    this.nb_current_photo=(this.nb_current_page-1)*this.nb_photo_per_page;
  }
  this.j = this.nb_current_page-(this.pages_to_display.length/2)+1;
  if ( this.j<1 ){this.j=1;}
  if ( this.j + this.pages_to_display.length > this.nb_total_page){this.j=this.nb_total_page-this.pages_to_display.length+1;}
  if ( this.pages_to_display[0]!== this.j ){
      for (this.i=0; this.i<10; this.i++){
        this.pages_to_display[this.i]=this.i+this.j;
      }
  }
}

display_page(page_nb:number){
  this.nb_current_page=page_nb-1;
  this.next_prev_page('next');
}



onZoomPhoto(event:any){
    this.display_download=true;
    this.selected_photo=event;
}

onSaveFile(event:any): void {
    this.selected_photo=-1;
    this.display_download=false;
    const link = document.createElement("a");
    //link.href = URL.createObjectURL(file);
    link.href=event.mediaLink;
    link.download = event.name; // filename
    link.click();
    link.remove(); 
  }

drawPhotoCanvas(){
  const myLoop=10000;
  this.initialdrawCanvas=true;
  this.msgConsole='drawPhotoCanvas & message is '+ this.message_canvas, ' length of table is ' + this.WeddingPhotos.length;
  console.log(this.msgConsole);
  this.myConsole.push('');
  this.myConsole[this.myConsole.length-1]=this.msgConsole;
  if (this.WeddingPhotos.length===0){
    const j= () => {
      this.id_Animation=window.requestAnimationFrame(j) ;
      if (this.j_loop>30000 || this.WeddingPhotos.length!==0){
              this.msgConsole='drawPhotoCanvas & j_loop = '+ this.j_loop.toString() + ' length of table is ' + this.WeddingPhotos.length.toString();
              console.log(this.msgConsole);
              this.myConsole.push('');
              this.myConsole[this.myConsole.length-1]=this.msgConsole;
              window.cancelAnimationFrame(this.id_Animation);
        } 
      }
    j();
  } 


  this.message_canvas='';
  this.prevCanvasPhoto=this.PhotoNbForm.controls['SelectNb'].value;
  this.ctx.canvas.width=this.PhotoNbForm.controls['Width'].value;
  this.ctx.canvas.height=this.PhotoNbForm.controls['Height'].value;
  if (this.PhotoNbForm.controls['SelectNb'].value!==null){
        if (this.PhotoNbForm.controls['SelectNb'].value<1 || this.PhotoNbForm.controls['SelectNb'].value>this.WeddingPhotos.length){
              
            this.message_canvas='value must be between 1 and '+ this.WeddingPhotos.length + ' Nb captured:'+this.PhotoNbForm.controls['SelectNb'].value+
                'length of the table ' + this.WeddingPhotos.length + '     i='+ this.i;
            }
        else {
            this.message_canvas='Photo => nb: '+this.PhotoNbForm.controls['SelectNb'].value+'  Name: ' + this.WeddingPhotos[this.PhotoNbForm.controls['SelectNb'].value-1].name;
          }
        
       
        if (this.PhotoNbForm.controls['SelectNb'].value===1 || this.PhotoNbForm.controls['SelectNb'].value===2){
          this.ctx.beginPath();
          this.ctx.font = 'bold 18px serif';
          this.ctx.strokeText('Video is not displayed there', 40, 40);
        } else {
          console.log('this.ctx.drawImage, nb=', this.PhotoNbForm.controls['SelectNb'].value-1);
          this.ctx.beginPath();
          const myImage=this.WeddingPhotos[this.PhotoNbForm.controls['SelectNb'].value-1].photo;
          // console.log('myImage = ', myImage);
          this.ctx.drawImage(myImage,0,0,this.ctx.canvas.width,this.ctx.canvas.height);
          this.ctx.stroke(); 
        }
    } else {
        this.ctx.beginPath(); 
        this.ctx.font = 'bold 18px Tangerine';
        this.ctx.strokeText('Photo will be displayed here', 40, 40);
        //this.myImage.src='./assets/GA00 - M&X indoor 3.jpg';
        //this.myImage.onload = () => this.ctx.drawImage(this.myImage, 0, 0);
        //this.ctx.drawImage(this.myImage,0,0,this.ctx.canvas.width,this.ctx.canvas.height);
      }
    this.ctx.stroke(); 
    this.saveLogConsole();
  }

saveLogConsole(){
  this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" + this.Google_Object_Name   + '&uploadType=media';
  this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" + this.Google_Object_Name + this.thetime  + '.json&uploadType=media';

  this.http.post(this.HTTP_Address, this.myConsole)
    .subscribe(res => {
          // alert('Log record is saved ')
          },
          error_handler => {
            console.log('Log record failed ' + this.Google_Object_Name + '  error handller is ' + error_handler);
            // this.Error_Access_Server= "  object ===>   " + JSON.stringify( this.Table_User_Data)  + '   error message: ' + error_handler.message + ' error status: '+ error_handler.statusText+' name: '+ error_handler.name + ' url: '+ error_handler.url;
            // alert( 'Log record failed -- http post = ' + this.Google_Object_Name);
           } )
}



}