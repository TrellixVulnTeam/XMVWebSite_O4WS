import { Component, OnInit , Input, HostListener} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { ViewportScroller } from "@angular/common";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray} from '@angular/forms';
import { encrypt, decrypt} from '../EncryptDecryptServices';

import { XMVConfig } from '../JsonServerClass';
import { msginLogConsole } from '../consoleLog';
import { LoginIdentif } from '../JsonServerClass';

import { environment } from 'src/environments/environment';
import { EventAug } from '../JsonServerClass';
import { EventCommentStructure } from '../JsonServerClass';
import { TableOfEventLogin } from '../JsonServerClass';
import { BucketList } from '../JsonServerClass';
import { Bucket_List_Info } from '../JsonServerClass';
import { msgConsole } from '../JsonServerClass';

@Component({
  selector: 'app-AdminConsole',
  templateUrl: './AdminConsole.component.html',
  styleUrls: ['./AdminConsole.component.css']
})

export class AdminConsoleComponent {

  
  constructor(
    private router:Router,
    private http: HttpClient,
    private scroller: ViewportScroller

    ) {}

    
    @Input() ConfigXMV=new XMVConfig;
    @Input() ListOfBucket=new BucketList;

    Encrypt:string='';
    Decrypt:string='';
    Crypto_Method:string='';
    Crypto_Error:string='';
    Crypto_Key:number=0;
    Encrypt_Data=new LoginIdentif;

   

    EventHTTPReceived:Array<boolean>=[false,false,false,false,false,false];
    id_Animation:Array<number>=[0,0,0,0,0];
    TabLoop:Array<number>=[0,0,0,0,0];

    bucket_data:string='';
    myListOfObjects=new Bucket_List_Info;

    myHeader=new HttpHeaders();    
    getScreenWidth: any;
    getScreenHeight: any;
    device_type:string='';

    myLogConsole:boolean=false;
    myConsole:Array<msgConsole>=[];
    returnConsole:Array<string>=[];
    SaveConsoleFinished:boolean=true;
    type:string='';

    

     // ACCESS TO GOOGLE STORAGE
    HTTP_AddressLog:string='';

    HTTP_Address:string='';

    Google_Bucket_Access_Root:string='https://storage.googleapis.com/storage/v1/b/';

    Google_Object_Name:string='';
    Error_Access_Server:string='';
    Message:string='';

    DisplayListOfObjects:boolean=false;
    SelectedFile:boolean=false;
    ContentTodisplay:boolean=false;
    FileMedialink:string='';

 
@HostListener('window:resize', ['$event'])
onWindowResize() {
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
    }

ngOnInit(){
      //**this.LogMsgConsole('AdminLogin ===== Device ' + navigator.userAgent + '======');

      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;

      this.HTTP_Address=this.Google_Bucket_Access_Root + this.ConfigXMV.BucketConsole+ "/o"  ;
      this.myHeader=new HttpHeaders({
        'content-type': 'application/json',
        'cache-control': 'private, max-age=0'
      });
      this.Error_Access_Server='';
      this.Message='';
      this.EventHTTPReceived[0]=false;
      this.DisplayListOfObjects=false;
      this.RetrieveAllObjects();

      let theMSG=new msgConsole;
      this.myConsole.push(theMSG)
      this.myConsole[0].msg='Zouzou';
      this.myConsole[0].timestamp='my GMT';
      theMSG=new msgConsole;
      this.myConsole.push(theMSG)
      this.myConsole[1].msg='QWERTY';
      this.myConsole[1].timestamp='Oh date';

  }    



RetrieveAllObjects(){
// bucket name is ListOfObject.login
console.log('RetrieveAllObjects()');
this.http.get<Bucket_List_Info>(this.HTTP_Address )
        .subscribe((data ) => {
          console.log('RetrieveAllObjects() - data received');
          this.myListOfObjects=data;
          this.DisplayListOfObjects=true;
          this.EventHTTPReceived[0]=true;
        },
        error_handler => {
          this.EventHTTPReceived[0]=true;
          
          console.log('RetrieveAllObjects() - error handler');
          this.Message='HTTP_Address='+this.HTTP_Address;
          this.Error_Access_Server='RetrieveAllObjects()==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
        } 
  )
}


RetrieveSelectedFile(event:any){
  this.scroller.scrollToAnchor('SelectedFile');
  this.ContentTodisplay=false;
  this.FileMedialink=event.mediaLink;
    this.http.get<any>(this.FileMedialink )
    .subscribe((data ) => {
      console.log('RetrieveSelectedFile='+this.FileMedialink);
      this.Error_Access_Server='';
      //this.ContentObject=JSON.stringify(data);
      
      if (Array.isArray(data)===false){
        //this.myConsole.push('');
        //this.myConsole[0]=JSON.stringify(data);
        // not an array
      } else {
        // is an array
        this.myConsole=data;
      }
      this.ContentTodisplay=true;
      //
    },
    error_handler => {
      this.EventHTTPReceived[2]=true;
      
      this.Message='HTTP_Address='+this.HTTP_Address;
      this.Error_Access_Server='INIT - error message==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
      console.log('RetrieveSelectedFile- error handler '+this.Error_Access_Server);
      this.Error_Access_Server='INIT - error status==> '+ error_handler.status+ '   Error url==>  '+ error_handler.url;
    } 
    )

  
}



waitHTTP(loop:number, max_loop:number, eventNb:number){
  const pas=500;
  if (loop%pas === 0){
    console.log('waitHTTP ==> loop='+ loop+ ' max_loop=', max_loop+'  event='+eventNb);
  }
 loop++
  
  this.id_Animation[eventNb]=window.requestAnimationFrame(() => this.waitHTTP(loop, max_loop, eventNb));
  if (loop>max_loop || this.EventHTTPReceived[eventNb]===true){
            console.log('exit waitHTTP ==> loop=', loop + ' max_loop=', max_loop + ' this.EventHTTPReceived=' + 
                    this.EventHTTPReceived[eventNb] );
            if (this.EventHTTPReceived[eventNb]===true ){
              window.cancelAnimationFrame(this.id_Animation[eventNb]);
              // action to define
            } 

            
      }  

  }



LogMsgConsole(msg:string){
    msginLogConsole(msg, this.myConsole,this.myLogConsole, this.SaveConsoleFinished,this.HTTP_AddressLog, this.type);
}

}