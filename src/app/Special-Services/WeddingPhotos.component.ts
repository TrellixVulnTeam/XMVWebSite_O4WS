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
      ForceSaveLog: new FormControl(),
    });
    prevCanvasPhoto:number=0;
    initialdrawCanvas:boolean=false;
    message_canvas:string='';
    initialCanvasPhoto:number=160;
    first_onload:boolean=true;
    getScreenWidth: any;
    getScreenHeight: any;
    device_type:string='';
    yourLanguage:string='FR';
    @Input() buckets_all_processed:boolean=false;
    @Input() WeddingPhotos:Array<StructurePhotos>=[];
    DisplayPhotos:Array<StructurePhotos>=[];
    PhotoNumber:Array<number>=[];
    isWeddingPhotoEmpty:boolean=true;
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
    @Input() myLogConsole:boolean=false;
    @Input() EventLogConsole:Array<string>=[];
    SaveConsoleFinished:boolean=true;

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


    thetime:string='';;
    theWidthH:number=0;
    theWidthV:number=0;
    theHeightH:number=0;
    theHeightV:number=0;

    first_canvas_displayed:boolean=false;
    slow_table:Array<string>=[];

    ii:number=0;
jj:number=0;
kk:number=0;
tab_x:Array<number>=[0,0,0,0,0,0,0,0,0,0];
tab_y:Array<number>=[0,0,0,0,0,0,0,0,0,0];
second_photo=new Date;
mysecond:number=0;
compteur:number=0;



@HostListener('window:resize', ['$event'])
onWindowResize() {
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
      this.SizeImage();
      this.change_canvas_size(this.initialCanvasPhoto);
    }

SizeImage(){
  if (this.getScreenWidth<900){
    this.theWidthH=Math.floor(this.getScreenWidth*0.85);
    this.theHeightH=Math.floor(this.getScreenWidth*0.50);

    this.theWidthV=Math.floor(this.getScreenWidth*0.50);
    this.theHeightV=Math.floor(this.getScreenWidth*0.75);
    this.PhotoNbForm.controls['Width'].setValue(this.theWidthH);
    this.PhotoNbForm.controls['Height'].setValue(this.theHeightH);
  } else{
    this.theWidthH=900;
    this.theHeightH=600;

    this.theWidthV=400;
    this.theHeightV=600;
    this.PhotoNbForm.controls['Width'].setValue(this.theWidthH);
    this.PhotoNbForm.controls['Height'].setValue(this.theHeightH);
  }
}

  ngOnInit(){
    this.LogMsgConsole('Device '+navigator.userAgent);
    this.LogMsgConsole('ngOnInit() WeddingPhotos; buckets_all_processed is '+ this.buckets_all_processed+ ' size file '+ this.WeddingPhotos.length);
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.device_type = navigator.userAgent;

    if (this.EventLogConsole.length!==0){
        this.saveLogConsole(this.EventLogConsole,'Event27AUG');
    }
      
    this.SizeImage();
    this.PhotoNbForm.controls['SelectNb'].setValue(null);

    this.nb_current_page = 1;
    
    this.scroller.scrollToAnchor('targetTop');

  }    

  ngAfterViewInit() { 
    this.theCanvas=document.getElementById('canvasElem');
    if (!this.ctx) { //true
        this.ctx=this.theCanvas.getContext('2d');
        this.ctx.canvas.width=this.PhotoNbForm.controls['Width'].value;
        this.ctx.canvas.height=this.PhotoNbForm.controls['Height'].value;
        if (this.WeddingPhotos.length!==0){
          this.isWeddingPhotoEmpty=false;
        }
        this.displayPhotos();
    }

  }

goDown(event:string){
    this.pagePhotos=false;
    this.scroller.scrollToAnchor(event);
  }


displayPhotos(){
  this.LogMsgConsole('DisplayPhotos buckets processed '+ this.buckets_all_processed+ ' size file '+ this.WeddingPhotos.length);
  this.j=(this.nb_current_page-1)*this.nb_photo_per_page;
  if (this.buckets_all_processed===true && this.WeddingPhotos.length!==0){
        this.isWeddingPhotoEmpty=false;
        for (this.i=0; this.i<this.nb_photo_per_page; this.i++){
          const pushPhotos=new StructurePhotos;
          this.DisplayPhotos.push(pushPhotos);
          this.slow_table.push('');
          this.PhotoNumber.push(0);

          this.DisplayPhotos[this.i]=this.WeddingPhotos[this.j];
          this.slow_table[this.i]=this.WeddingPhotos[this.j].mediaLink;
          this.j++;
          this.PhotoNumber[this.i]=this.j;

        };
        this.pagePhotos=true;
        this.display_download=false;
        this.selected_photo=-1;
        this.drawPhotoCanvas();
}
}

next_prev_page(event:any){
  this.LogMsgConsole('DisplayPhotos; event ='+event+' current page ='+this.nb_current_page+' first_canvas_displayed='+this.first_canvas_displayed);
  if (this.nb_current_page===2 && this.first_canvas_displayed===false){
    this.waiting_function(0, this.max_i_loop, event);
  } else {this.manage_page(event);}
  this.scroller.scrollToAnchor('targetTop');
}


waiting_function(loop:number, max_loop:number, event:any){
  const pas=2000;
  if (loop%pas === 0){
    this.LogMsgConsole('waiting_function ==> loop='+loop+' max_loop='+ max_loop+ ' this.first_canvas_displayed='+ this.first_canvas_displayed);
  }
  loop++
  this.id_Animation=window.requestAnimationFrame(() => this.waiting_function(loop, max_loop, event));
  if (loop>max_loop || this.first_canvas_displayed===true){
    this.LogMsgConsole('waiting_function end process ==> loop='+ loop+ ' max_loop='+ max_loop+ ' this.first_canvas_displayed='+ this.first_canvas_displayed);
        window.cancelAnimationFrame(this.id_Animation);
        this.manage_page(event);
      }     
}

 manage_page(event:any){ 
  this.LogMsgConsole('manage_page(event)='+ event+' nb_current_page='+ this.nb_current_page+'  length table='+this.WeddingPhotos.length );
  this.selected_photo=-1;
  this.display_download=false;
  if(event === 'prev' && this.nb_current_page > 1){
    this.nb_current_page--
  } else if (event === 'next' && this.nb_current_page < this.nb_total_page){
    this.nb_current_page++
  }
  this.nb_current_photo=(this.nb_current_page-1)*this.nb_photo_per_page; // first photo for the next page -1
  
  // looking for the middle of the page
   // if number of pages to display is < 10 then nothing to change 
  if ( this.pages_to_display.length>this.nb_total_page){
   this.j=1;
  } else {
      this.j = this.nb_current_page-Math.floor(this.pages_to_display.length/2);
      if (this.pages_to_display.length%2!==0){
            this.j ++;
        }
   }
  if ( this.j + this.pages_to_display.length > this.nb_total_page){
      this.j=this.nb_total_page-this.pages_to_display.length+1;
    }
  if ( this.j<1 ){this.j=1; } 

  //if ( this.pages_to_display[0]!== this.j ){
      for (this.i=0; this.i<this.pages_to_display.length; this.i++){
        if (this.i+this.j<=this.nb_total_page){
          this.pages_to_display[this.i]=this.i+this.j;
        } else {
              this.pages_to_display[this.i]=-1;
        }
      }
  //}
  
  this.slow_table.splice(0,this.slow_table.length);
  this.PhotoNumber.splice(0,this.PhotoNumber.length);
  this.j=(this.nb_current_page-1)*this.nb_photo_per_page;
  for (this.i=0; this.i<this.nb_photo_per_page && this.j<this.WeddingPhotos.length; this.i++){
      //this.DisplayPhotos[this.i]=this.WeddingPhotos[this.j];
      this.slow_table.push('');
      this.slow_table[this.i]=this.WeddingPhotos[this.j].mediaLink;
      this.j++;
      this.PhotoNumber.push(0);
      this.PhotoNumber[this.i]=this.j;
      this.LogMsgConsole('end manage_page(event); slow_table[this.i]='+ this.slow_table[this.i]+' PhotoNumber[this.i]='+ this.PhotoNumber[this.i]+'  this.j='+this.j+'  length table='+ this.WeddingPhotos.length);
    };


}

display_page(page_nb:number){
  this.nb_current_page=page_nb-1;
  this.next_prev_page('next');
}



onZoomPhoto(event:any){
   // this.display_download=true;
   // this.selected_photo=event;
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
  this.LogMsgConsole('drawPhotoCanvas()');
  this.initialdrawCanvas=true;
  console.log('drawPhotoCanvas() - WeddingPhotos.length=' + this.WeddingPhotos.length+' initialdrawCanvas ='+this.initialdrawCanvas);
  this.i_loop=0;
  this.j_loop=0;
  this.wait_WeddingPhotos();
}

ManageCanvas(){
  this.LogMsgConsole('ManageCanvas & message is '+ this.message_canvas + ' length of table is ' + this.WeddingPhotos.length);

 
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
            this.message_canvas= this.WeddingPhotos[this.PhotoNbForm.controls['SelectNb'].value-1].name;
          }

          this.myImage=new Image();         

        //setTimeout(() => {
          this.myImage.onload = () => {
              this.change_canvas_size(this.PhotoNbForm.controls['SelectNb'].value-1);
          };
          this.myImage.src=this.WeddingPhotos[this.PhotoNbForm.controls['SelectNb'].value-1].mediaLink;
                  console.log(' img.src = ', this.WeddingPhotos[this.PhotoNbForm.controls['SelectNb'].value-1].mediaLink);
        //}, 10);
       
          
    } else {

      //To be deleted when comments below are removed
      //this.stop_waiting_photo=true;
      //this.first_canvas_displayed=true;
               
          console.log('draw first canvas image');
          this.myImage=new Image();
          this.stop_waiting_photo=false;
          this.j_loop=0;
          this.i_loop=0;
          this.max_j_loop=20000;
          const time = new Date();
          this.first_canvas_displayed=false;
          //setTimeout(() => {
          this.myImage.onload = () => {
              this.LogMsgConsole('this.myImage.onload ==== first_canvas_displayed after '+ this.j_loop+ ' loops'+ ' initialCanvasPhoto='+this.initialCanvasPhoto);
                  this.stop_waiting_photo=true;
                  this.first_canvas_displayed=true;
                  this.ClearCanvas();
                  this.change_canvas_size(this.initialCanvasPhoto);

                };
              this.i_loop++;
              this.ii=0;
      // this.waiting_photo();
      this.LogMsgConsole('removed the process of this.waiting_photo()');
              this.LogMsgConsole('draw first canvas image -- start onLoad ===> j_loop='+ this.j_loop+ ' i_loop='+ this.i_loop+ ' this.ii='+ this.ii);
              if (this.initialCanvasPhoto>=this.WeddingPhotos.length){
                this.LogMsgConsole('initialCanvasPhoto='+this.initialCanvasPhoto+'  WeddingPhotos.length = '+this.WeddingPhotos.length);
                if (this.WeddingPhotos.length>0) {
                    this.PhotoNbForm.controls['SelectNb'].setValue(this.WeddingPhotos.length);
                    this.initialCanvasPhoto=this.WeddingPhotos.length;
                    this.myImage.src=this.WeddingPhotos[this.PhotoNbForm.controls['SelectNb'].value-1].mediaLink;
                } else {
                  this.LogMsgConsole('Big issue as WeddingPhotos.length = '+this.WeddingPhotos.length + '  ; access to ./assets library');
                  this.myImage.src='./assets/Photo3.PNG';
                  this.PhotoNbForm.controls['SelectNb'].setValue(1);
                  this.initialCanvasPhoto=1;
                }
              
              } else {
                  this.PhotoNbForm.controls['SelectNb'].setValue(this.initialCanvasPhoto);
                  this.myImage.src=this.WeddingPhotos[this.initialCanvasPhoto].mediaLink;
              }
              this.j_loop=0;
           //},1);

           this.nb_current_page=1;


           this.LogMsgConsole('end of the drawing');

     }
         
  }
change_canvas_size(nb_photo:number){
                  
  this.ctx.beginPath(); // critical
                  
  this.ctx.globalCompositeOperation = 'source-over';
  if (nb_photo<this.WeddingPhotos.length && this.WeddingPhotos[nb_photo].vertical===true){
    this.ctx.canvas.width=this.theWidthV;
    this.ctx.canvas.height=this.theHeightV;
    this.ctx.canvas.width=this.theWidthV;
    this.ctx.canvas.height=this.theHeightV;
    this.ctx.drawImage(this.myImage,0,0,this.theWidthV,this.theHeightV);
  } else {
    this.ctx.canvas.width=this.theWidthH;
    this.ctx.canvas.height=this.theHeightH;
    this.ctx.canvas.width=this.theWidthH;
    this.ctx.canvas.height=this.theHeightH;
    this.ctx.drawImage(this.myImage,0,0,this.theWidthH,this.theHeightH);
  }
  //this.ctx.drawImage(this.myImage,0,0,this.ctx.canvas.width,this.ctx.canvas.height);
  this.ctx.stroke();
  this.ctx.closePath();
}

waiting_photo(){
  const time = new Date();
  const photo1=new Image;
  const photo2=new Image;
  const photo3=new Image;
  const photo4=new Image;
  const widthPic=0.45;
  const heightPic=0.39;
  photo1.src='./assets/Photo1.jpg';
  photo2.src='./assets/Photo2.PNG';
  photo3.src='./assets/Photo3.PNG';
  photo4.src='./assets/Photo4.jpg';
  const pas=600;
  const nbPhoto=4;

    if (this.j_loop<this.max_j_loop && this.stop_waiting_photo===false)
    {
      //this.ctx.beginPath(); // critical
      this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
 
      let i=this.j_loop%pas;
      
      if (i===0){
        this.ii++
        if (this.ii>nbPhoto){this.ii=1};
        this.LogMsgConsole('waiting_photo() - this.j_loop='+this.j_loop+'  stop_waiting_photo='+this.stop_waiting_photo);
       
      }
      


      if (this.ii===0){
            this.ctx.drawImage(photo1,0,0,this.ctx.canvas.width, this.ctx.canvas.height); 
      }
      if (this.ii===1){
      this.ctx.drawImage(photo2,0,0,this.ctx.canvas.width, this.ctx.canvas.height); 
    }
    if (this.ii===2){
      this.ctx.drawImage(photo3,0,0,this.ctx.canvas.width, this.ctx.canvas.height); 
    }
    if (this.ii===3){
      this.ctx.drawImage(photo4,0,0,this.ctx.canvas.width, this.ctx.canvas.height); 
    }

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



wait_WeddingPhotos(){
  this.LogMsgConsole('start wait_WeddingPhotos'+this.WeddingPhotos.length+ '  j_loop '+ this.j_loop+ '  i_loop '+ this.i_loop);
  const max_i_loop=20000;
  this.i_loop++
  this.j_loop++
  if (this.WeddingPhotos.length===0){
          this.id_Animation=window.requestAnimationFrame(() => this.wait_WeddingPhotos());
  }
  if (this.i_loop > max_i_loop || this.WeddingPhotos.length!==0){

    this.nb_total_page = Math.floor(this.WeddingPhotos.length / this.nb_photo_per_page);
    if (this.WeddingPhotos.length%this.nb_photo_per_page!==0){
      this.nb_total_page++
    }
    this.j=1;
    for (this.i=0; this.i<this.pages_to_display.length; this.i++){
      if (this.i+this.j<=this.nb_total_page){
        this.pages_to_display[this.i]=this.i+this.j;
      } else {
           this.pages_to_display[this.i]=-1;
      }
    }
    this.LogMsgConsole('end wait_WeddingPhotos; call ManageCanvas() and then  window.cancelAnimationFrame(this.id_Animation)');
    this.ManageCanvas();
    window.cancelAnimationFrame(this.id_Animation);
     
  } 
}



ngOnChanges(changes: SimpleChanges) {   
  this.LogMsgConsole('onChanges '+changes+ 'buckets_all_processed='+ this.buckets_all_processed+'  length weddingPhotos='+ this.WeddingPhotos.length);
  if (this.WeddingPhotos.length!==0 &&  this.isWeddingPhotoEmpty===true){
    setTimeout(() => {
      this.LogMsgConsole('onChanges call this.displayPhotos() after a timeout of 1 second');
      this.isWeddingPhotoEmpty=false;
      this.displayPhotos();
    }, 1000); // 1 second 
  }
}

ForceSaveLog(){

  if (this.PhotoNbForm.controls['ForceSaveLog'].value==='y'){
    this.PhotoNbForm.controls['ForceSaveLog'].setValue('n');
    this.LogMsgConsole('ForceSaveLog()');
    this.saveLogConsole(this.myConsole,'WeddingPhotos');
  }
}

LogMsgConsole(msg:string){
  console.log(msg);
  this.myTime=new Date();
  this.myDate= this.myTime.toString().substring(8,24);
  this.thetime=this.myDate+this.myTime.getTime().toString();
  let i = 0;
  if (this.myLogConsole===true){
          this.myConsole.push('');
          i = this.myConsole.length;
          this.myConsole[i-1]='<==> '+this.thetime.substr(0,16) + ' ' +msg;

  }
  if (i>80 && this.SaveConsoleFinished===true){
    this.saveLogConsole(this.myConsole, 'WeddingPhotos');
  }
     

}

saveLogConsole(LogConsole:any, type:string){

  this.myTime=new Date();
  this.myDate= this.myTime.toString().substring(8,24);
  this.thetime=this.myDate+this.myTime.getTime().toString();
  const consoleLength=LogConsole.length;
  this.SaveConsoleFinished=false;
  // this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" + this.Google_Object_Name   + '&uploadType=media';
  this.HTTP_Address=this.Google_Bucket_Access_RootPOST +  "logconsole/o?name="  + this.thetime.substr(0,16)+ type + '.json&uploadType=media';

  this.http.post(this.HTTP_Address, LogConsole)
    .subscribe(res => {
            this.SaveConsoleFinished=true;
            if (LogConsole.length===consoleLength){
              LogConsole.splice(0,LogConsole.length);
              }
            else {
              for (let i=consoleLength; i>0; i--){
                LogConsole.splice(i-1,1);
              }
            }
            LogConsole.push('');
            this.myConsole[LogConsole.length-1]='Log Console ' + type + ' has been deleted at '+this.myDate+'  ' +this.thetime;
          },
          error_handler => {
            console.log('Log record failed for ' + type + this.Google_Object_Name + '  error handller is ' + error_handler);
            // this.Error_Access_Server= "  object ===>   " + JSON.stringify( this.Table_User_Data)  + '   error message: ' + error_handler.message + ' error status: '+ error_handler.statusText+' name: '+ error_handler.name + ' url: '+ error_handler.url;
            // alert( 'Log record failed -- http post = ' + this.Google_Object_Name);
           } )
}


}