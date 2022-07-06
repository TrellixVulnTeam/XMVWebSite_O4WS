import { Component, OnInit , Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges, 
  AfterContentInit, HostListener, AfterViewInit, ComponentFactoryResolver} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ViewportScroller } from "@angular/common";
import { EventAug } from '../JsonServerClass';
import { StructurePhotos } from '../JsonServerClass';
import { encrypt, decrypt} from '../EncryptDecryptServices';

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
    DisplayPhotos:Array<StructurePhotos>=[];
    PhotoNumber:Array<number>=[];

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
    id_Animation_two:number=0;
    id_Animation_three:number=0;
    j_loop:number=0;
    i_loop:number=0;
    max_i_loop:number=30000;
    max_j_loop:number=30000;
    stop_waiting_photo:boolean=false;

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

    first_canvas_displayed:boolean=false;
    slow_table:Array<string>=[];

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

    this.nb_current_page = 1;
    
    this.scroller.scrollToAnchor('targetTop');

    // for the first 20 pages
    //for (let i=0; i<20; i++){
    //  this.slow_table.push('');
    //}
    for (this.i=0; this.i<this.nb_photo_per_page; this.i++){
      const pushPhotos=new StructurePhotos;
      this.DisplayPhotos.push(pushPhotos);
      this.slow_table.push('');
      this.PhotoNumber.push(0);
      this.j=(this.nb_current_page-1)*this.nb_photo_per_page+1;
      this.DisplayPhotos[this.i]=this.WeddingPhotos[this.i];
      this.slow_table[this.i]=this.WeddingPhotos[this.i].mediaLink;
      this.PhotoNumber[this.i]=this.j;
    };

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
  if (this.nb_current_page===2 && this.first_canvas_displayed===false){
    this.waiting_function(0, this.max_i_loop, event);
  } else {this.manage_page(event);}
  this.scroller.scrollToAnchor('targetTop');
}

SlowShowImage(loop:number, max_loop:number, i:number, max_i:number){
  const pas=500;
  if (loop%pas === 0){
    console.log('SlowShowImage ==> loop=', loop, ' max_loop=', max_loop, ' this.first_canvas_displayed=', this.first_canvas_displayed);
  }
  if (i===1){ loop=max_loop+1}
  else {loop++}
  
  this.id_Animation=window.requestAnimationFrame(() => this.SlowShowImage(loop, max_loop, i, max_i));
  if (loop>max_loop || this.first_canvas_displayed===true){
        if (this.first_canvas_displayed===true){
            for (i=i; i<=max_i; i++){
              this.slow_table[i-1]=this.WeddingPhotos[i-1].mediaLink;
            }
            window.cancelAnimationFrame(this.id_Animation);
        } else {
            this.slow_table[i-1]=this.WeddingPhotos[i-1].mediaLink;
            if (i<=max_i){i++};
            loop=0;
        }
      }  

}


showImage(){ //NOT USED 
     
    const width=550;
    const height=400;
    this.j=0;
    for (let i=this.nb_current_photo; i<this.nb_current_photo+this.nb_photo_per_page; i++){
      setTimeout(() => {
          //const toto=document.getElementById("myimage2").src;
          //document.getElementById("demo").innerHTML =toto;
  

          const para = document.createElement("p");
          para.innerText = this.WeddingPhotos[i].name;
          document.body.appendChild(para);

          console.log('showImage', this.WeddingPhotos[i].mediaLink);
          this.j++;
          var img = document.createElement('img')  
          var myloc = new Image();
          myloc.useMap = this.WeddingPhotos[i].mediaLink; 
          img.setAttribute('src', myloc.useMap);  
          let margin_top= (20)*this.j;
          const attribute="height:300px;width:400px; margin-top:"+margin_top+"px; margin-left:20px;";
          img.setAttribute('style', attribute);  
          document.body.appendChild(img);  

          var x = document.createElement("img");
          x.setAttribute("src", this.WeddingPhotos[i].mediaLink);
          x.setAttribute("width", "304");
          x.setAttribute("height", "228");
          x.setAttribute("margin_top", "30px");
          x.setAttribute("margin_left", "20px");
          x.setAttribute("alt", "The Pulpit Rock"+i);
          document.body.appendChild(x);
      },0);
         
      }
     
    }  



waiting_function(loop:number, max_loop:number, event:any){
  const pas=2000;
  if (loop%pas === 0){
    console.log('waiting_function ==> loop=', loop, ' max_loop=', max_loop, ' this.first_canvas_displayed=', this.first_canvas_displayed);
  }
  loop++
  this.id_Animation=window.requestAnimationFrame(() => this.waiting_function(loop, max_loop, event));
  if (loop>max_loop || this.first_canvas_displayed===true){
        console.log('waiting_function end process ==> loop=', loop, ' max_loop=', max_loop, ' this.first_canvas_displayed=', this.first_canvas_displayed);
        window.cancelAnimationFrame(this.id_Animation);
        this.manage_page(event);
      }     
}

 manage_page(event:any){ 
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

  for (this.i=0; this.i<this.nb_photo_per_page; this.i++){
      this.j=(this.nb_current_page-1)*this.nb_photo_per_page+1;
      this.DisplayPhotos[this.i]=this.WeddingPhotos[this.i];
      this.slow_table[this.i]=this.WeddingPhotos[this.i].mediaLink;
      this.PhotoNumber[this.i]=this.j;
    };

  if (this.nb_current_page===2){
          this.SlowShowImage(0, 600, this.nb_photo_per_page+1, this.nb_photo_per_page*this.nb_current_page);
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

onSaveFile(event:any): void { // ===================== to be changed
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
  console.log('drawPhotoCanvas()', this.WeddingPhotos.length);
  this.i_loop=0;
  this.j_loop=0;
  this.wait_WeddingPhotos();
}

ManageCanvas(){
  this.msgConsole='ManageCanvas & message is '+ this.message_canvas + ' length of table is ' + this.WeddingPhotos.length;
  console.log(this.msgConsole);
  this.myConsole.push('');
  this.myConsole[this.myConsole.length-1]=this.msgConsole;
 
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

        let img=new Image();         
        this.nb_current_photo=this.PhotoNbForm.controls['SelectNb'].value;
        this.ctx.font = 'bold 18px red sans-serif roboto';
        this.ctx.strokeText('Image is being processed .... please wait', 40, 40);
        setTimeout(() => {
            img.onload = () => {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.drawImage(img,0,0,this.ctx.canvas.width,this.ctx.canvas.height);
          };
          img.src=this.WeddingPhotos[this.PhotoNbForm.controls['SelectNb'].value-1].mediaLink;
                  console.log(' img.src = ', this.WeddingPhotos[this.PhotoNbForm.controls['SelectNb'].value-1].mediaLink);
        }, 10);
       
          
        } else {

          console.log('draw first canvas image');
          this.myImage=new Image();
          this.stop_waiting_photo=false;
          this.j_loop=0;
          this.i_loop=0;
          this.max_j_loop=20000;
          const time = new Date();
          this.first_canvas_displayed=false;
          setTimeout(() => {
             this.myImage.onload = () => {
                  console.log('==== first_canvas_displayed after', this.i_loop, ' loops');
                  this.first_canvas_displayed=true;
                  this.ClearCanvas();
                  
                  this.ctx.beginPath(); // critical
                  this.stop_waiting_photo=true;
                  this.ctx.globalCompositeOperation = 'source-over';
                  this.ctx.drawImage(this.myImage,0,0,this.ctx.canvas.width,this.ctx.canvas.height);
                  this.ctx.stroke();
                  this.ctx.closePath();
                };
              this.i_loop++;
              this.waiting_photo();
              console.log('draw first canvas image -- start onLoad ===> j_loop=', this.j_loop, ' i_loop=', this.i_loop);
              this.myImage.src=this.slow_table[10]
              // this.myImage.src=this.WeddingPhotos[22].mediaLink;
              this.j_loop=0;
           }, 10);

           this.nb_current_page=1;
           this.SlowShowImage(0, 800, 1, this.nb_photo_per_page);

           console.log('end of the drawing');

     }
         
  }



waiting_photo(){
  const time = new Date();

    setTimeout(() => {},60);
    if (this.j_loop<this.max_j_loop && this.stop_waiting_photo===false)
    {
     
      this.ClearCanvas();
      this.ctx.beginPath(); // critical
      this.ctx.rotate(((2 * Math.PI) / 600000) * time.getSeconds() + ((2 * Math.PI) / 600000000) * time.getMilliseconds());

      this.ctx.arc(40, 40, 5, 0, 2 * Math.PI); 

      this.ctx.fillText(this.j_loop,400,300);
      this.ctx.stroke();
      this.j_loop++;
      this.id_Animation_three=window.requestAnimationFrame(() => this.waiting_photo());
    }
  if (this.j_loop>this.max_j_loop || this.stop_waiting_photo===true)
     {
        window.cancelAnimationFrame(this.id_Animation_three);
       
    }
}

ClearCanvas(){
  this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
  this.ctx.beginPath();
  this.ctx.clearRect(0,0,this.theCanvas.width,this.theCanvas.height);
  this.ctx.closePath();
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




wait_WeddingPhotos(){
  console.log('start wait_WeddingPhotos', this.WeddingPhotos.length,  '  j_loop ', this.j_loop);

  const max_i_loop=90000;
  this.i_loop++
  this.j_loop++
  if (this.WeddingPhotos.length===0){
          this.id_Animation=window.requestAnimationFrame(() => this.wait_WeddingPhotos());
  }
  if (this.i_loop > max_i_loop || this.WeddingPhotos.length!==0){
    this.msgConsole='wait_WeddingPhotos & i_loop = '+ this.i_loop.toString() + ' length of table is ' + this.WeddingPhotos.length.toString();
    console.log(this.msgConsole);
    this.myConsole.push('');
    this.myConsole[this.myConsole.length-1]=this.msgConsole;
    this.nb_total_page = Math.floor(this.WeddingPhotos.length / this.nb_photo_per_page);
    if (this.WeddingPhotos.length % this.nb_photo_per_page){
      this.nb_total_page++
    }
    window.cancelAnimationFrame(this.id_Animation);
    this.ManageCanvas();
     
  } 

  console.log('end wait_WeddingPhotos', this.WeddingPhotos.length, ' i_loop=', this.i_loop, '  j_loop ', this.j_loop);
}

}