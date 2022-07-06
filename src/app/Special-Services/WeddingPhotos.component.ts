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
    initialCanvasPhoto:number=160;
    
    getScreenWidth: any;
    getScreenHeight: any;
    device_type:string='';
    yourLanguage:string='FR';
    @Input() buckets_all_processed:boolean=false;
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
    theWidthH:number=0;
    theWidthV:number=0;
    theHeightH:number=0;
    theHeightV:number=0;

    first_canvas_displayed:boolean=false;
    slow_table:Array<string>=[];

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
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.myDate= this.myTime.toString().substring(8,24);
    this.thetime=this.myTime.getTime();
      
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
        this.displayPhotos();
    }

  }

goDown(event:string){
    this.pagePhotos=false;
    this.scroller.scrollToAnchor(event);
  }


displayPhotos(){
  this.j=(this.nb_current_page-1)*this.nb_photo_per_page;
  if (this.buckets_all_processed===true && this.WeddingPhotos.length!==0){
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
  if (this.nb_current_page===2 && this.first_canvas_displayed===false){
    this.waiting_function(0, this.max_i_loop, event);
  } else {this.manage_page(event);}
  this.scroller.scrollToAnchor('targetTop');
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
  this.j=(this.nb_current_page-1)*this.nb_photo_per_page;
  for (this.i=0; this.i<this.nb_photo_per_page; this.i++){
      this.DisplayPhotos[this.i]=this.WeddingPhotos[this.j];
      this.slow_table[this.i]=this.WeddingPhotos[this.j].mediaLink;
      this.j++;
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

          this.myImage=new Image();         

        setTimeout(() => {
          this.myImage.onload = () => {
              this.change_canvas_size(this.PhotoNbForm.controls['SelectNb'].value-1);
          };
          this.myImage.src=this.WeddingPhotos[this.PhotoNbForm.controls['SelectNb'].value-1].mediaLink;
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
                  console.log('==== first_canvas_displayed after', this.j_loop, ' loops');
                  this.stop_waiting_photo=true;
                  this.first_canvas_displayed=true;
                  this.ClearCanvas();
                  this.change_canvas_size(this.initialCanvasPhoto);

                };
              this.i_loop++;
              this.waiting_photo();
              console.log('draw first canvas image -- start onLoad ===> j_loop=', this.j_loop, ' i_loop=', this.i_loop);
              this.PhotoNbForm.controls['SelectNb'].setValue(this.initialCanvasPhoto);
              this.myImage.src=this.WeddingPhotos[this.initialCanvasPhoto].mediaLink;
              this.j_loop=0;
           },1);

           this.nb_current_page=1;
           //this.SlowShowImage(0, 800, 1, this.nb_photo_per_page);

           console.log('end of the drawing');

     }
         
  }
change_canvas_size(nb_photo:number){
                  
  this.ctx.beginPath(); // critical
                  
  this.ctx.globalCompositeOperation = 'source-over';
  if (this.WeddingPhotos[nb_photo].vertical===true){
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

ii:number=0;
jj:number=0;
kk:number=0;
tab_x:Array<number>=[0,0,0,0,0,0,0,0,0,0];
tab_y:Array<number>=[0,0,0,0,0,0,0,0,0,0];
second_photo=new Date;
mysecond:number=0;
waiting_photo(){
  const time = new Date();
  const photo1=new Image;
  const photo2=new Image;
  const photo3=new Image;
  const photo4=new Image;
  const widthPic=0.45;
  const heightPic=0.39;
  photo1.src='./assets/Photo1.PNG';
  photo2.src='./assets/Photo2.PNG';
  photo3.src='./assets/Photo3.PNG';
  photo4.src='./assets/Photo4.jpg';
  const pas=600;
  const nbPhoto=4;
  if (this.j_loop===0){
     const refSecond=new Date;
      // const mysecond= this.second_photo.getHours()*60+this.second_photo.getMinutes()*60+this.second_photo.getSeconds();
     this.mysecond=this.second_photo.getSeconds();
  }
    // setTimeout(() => {},1000); // 1 second
    if (this.j_loop<this.max_j_loop && this.stop_waiting_photo===false)
    {
      
      this.ctx.beginPath(); // critical
      this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
      this.ctx.fillStyle = 'grey';
      this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.fill();
     // this.ctx.stroke();
      let i=this.j_loop%pas;
      
      if (i===0){
        this.ii++
        if (this.ii>nbPhoto){this.ii=1};
        if (this.jj===nbPhoto){this.jj=0};
            this.tab_x[this.jj]=20;
            this.tab_y[this.jj]=20;
        this.jj++;
        if (this.jj===nbPhoto){this.jj=0};
            this.tab_x[this.jj]=20;
            this.tab_y[this.jj]=this.ctx.canvas.height-20-this.ctx.canvas.height*heightPic;
        this.jj++;
        if (this.jj===nbPhoto){this.jj=0};
            this.tab_x[this.jj]=this.ctx.canvas.width-20-this.ctx.canvas.width*widthPic;
            this.tab_y[this.jj]=20;
        this.jj++;
        if (this.jj===nbPhoto){this.jj=0};
            this.tab_x[this.jj]=this.ctx.canvas.width-20-this.ctx.canvas.width*widthPic;
            this.tab_y[this.jj]=this.ctx.canvas.height-20-this.ctx.canvas.height*heightPic;
      }
      
      this.jj=this.ii;
      this.ctx.beginPath(); // critical
      this.ctx.arc(this.ctx.canvas.width/2,this.ctx.canvas.height/2, 20, 0, 2 * Math.PI); 
      this.ctx.fillStyle = 'yellow';
      this.ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
      this.ctx.lineWidth = 2; // weight of the line
      this.ctx.fill();
      //this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
      this.ctx.font = 'bold 14px sans-serif';
      this.ctx.fillStyle = 'black';
  
      this.ctx.fillText(time.getSeconds()-this.mysecond,this.ctx.canvas.width/2-8,this.ctx.canvas.height/2+4);

      
      this.ctx.drawImage(photo1,this.tab_x[0],this.tab_y[0],this.ctx.canvas.width*widthPic,this.ctx.canvas.height*heightPic); 
      this.ctx.drawImage(photo2,this.tab_x[1],this.tab_y[1],this.ctx.canvas.width*widthPic,this.ctx.canvas.height*heightPic); 
      this.ctx.drawImage(photo3,this.tab_x[2],this.tab_y[2],this.ctx.canvas.width*widthPic,this.ctx.canvas.height*heightPic); 
      this.ctx.drawImage(photo4,this.tab_x[3],this.tab_y[3],this.ctx.canvas.width*widthPic,this.ctx.canvas.height*heightPic); 



      this.ctx.stroke();
   
      this.ctx.translate(this.ctx.canvas.width/2,this.ctx.canvas.height/2);
  
      const angle=((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds();
      this.ctx.rotate(angle*15);
      //this.ctx.translate(this.ctx.canvas.width/1.5,this.ctx.canvas.height/1.5);
      this.ctx.beginPath(); // critical
      // this.ctx.arc(this.ctx.canvas.width/2,this.ctx.canvas.height/2, 20, 0, 2 * Math.PI); 
      this.ctx.arc(30,30, 10, 0, 2 * Math.PI); 
      
      this.ctx.fillStyle = 'red';
      this.ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
      this.ctx.lineWidth = 2; // weight of the line
      this.ctx.fill();
      this.ctx.stroke();
      
      
      
      /****
      this.ctx.translate(90,90);
      this.ctx.rotate(angle*10);
      this.ctx.fillStyle = 'cyan';
      this.ctx.font = 'bold 18px sans-serif';
      this.ctx.fillText(this.j_loop,50,0);
      this.ctx.stroke();
       */

 
      this.j_loop++;
      this.id_Animation_three=window.requestAnimationFrame(() => this.waiting_photo());
    }
    
//if (this.j_loop===8000) {this.j_loop=this.max_j_loop+1}

 // if (this.j_loop>=this.max_j_loop )
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

    this.nb_total_page = Math.floor(this.WeddingPhotos.length / this.nb_photo_per_page);
    if (this.WeddingPhotos.length % this.nb_photo_per_page){
      this.nb_total_page++
    }
    this.ManageCanvas();
    window.cancelAnimationFrame(this.id_Animation);
     
  } 
}

/*** NOT USED *****/
SlowShowImage(loop:number, max_loop:number, i:number, max_i:number){
  const pas=500;
  if (loop%pas === 0){
    console.log('SlowShowImage ==> loop=', loop, ' max_loop=', max_loop, ' this.first_canvas_displayed=', this.first_canvas_displayed);
  }
  if (i===1){ loop=max_loop+1}
  else {loop++}
  
  this.id_Animation=window.requestAnimationFrame(() => this.SlowShowImage(loop, max_loop, i, max_i));
  if (loop>max_loop || this.first_canvas_displayed===true){
            window.cancelAnimationFrame(this.id_Animation);
      }  

}

ngOnChanges(changes: SimpleChanges) {   
  // console.log('onChanges ', changes, 'buckets_all_processed=', this.buckets_all_processed, '  length weddingPhotos=', this.WeddingPhotos.length);
  if (this.WeddingPhotos.length!==0 ){
    setTimeout(() => {
        this.displayPhotos();
    }, 1000); // 1 second 
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
}