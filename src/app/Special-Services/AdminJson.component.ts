import { Component, OnInit , Input, HostListener} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { ViewportScroller } from "@angular/common";
import { EventAug } from '../JsonServerClass';
import {Bucket_List_Info} from '../JsonServerClass';
import { StructurePhotos } from '../JsonServerClass';
import { BucketExchange } from '../JsonServerClass';
import { XMVConfig } from '../JsonServerClass';
import { msginLogConsole } from '../consoleLog';
import { LoginIdentif } from '../JsonServerClass';
import { BucketList } from '../JsonServerClass';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-AdminJson',
  templateUrl: './AdminJson.component.html',
  styleUrls: ['./AdminJson.component.css']
})

export class AdminJsonComponent {

  constructor(
    private router:Router,
    private http: HttpClient,
    private scroller: ViewportScroller,
    ) {}
  


    myHeader=new HttpHeaders();    
    getScreenWidth: any;
    getScreenHeight: any;
    device_type:string='';

    myLogConsole:boolean=false;
    myConsole:Array<string>=[];
    returnConsole:Array<string>=[];
    SaveConsoleFinished:boolean=true;
    type:string='';


     // ACCESS TO GOOGLE STORAGE
    HTTP_AddressLog:string='';

    ListOfBucket=new BucketList;

    Google_Bucket_Access_Root:string='https://storage.googleapis.com/storage/v1/b/';
    Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';
  
    Google_Bucket_Name:string=''; 
    Google_Object_Name:string='';
    Error_Access_Server:string='';

    GoToComponent:number=0;

    // https://storage.googleapis.com/storage/v1/b?project=xmv-it-consulting
    @Input() LoginTable_User_Data:Array<EventAug>=[];
    @Input() LoginTable_DecryptPSW:Array<string>=[];

    @Input() identification=new LoginIdentif;
    @Input() WeddingPhotos:Array<StructurePhotos>=[];
    @Input() ConfigXMV=new XMVConfig;
   


@HostListener('window:resize', ['$event'])
onWindowResize() {
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
    }


ngOnInit(){
      //**this.LogMsgConsole('ngOnInit ManageJson ===== Device ' + navigator.userAgent + '======');

      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;

      this.HTTP_AddressLog=this.Google_Bucket_Access_RootPOST + this.ConfigXMV.BucketConsole+ "/o?name="  ;
      this.myHeader=new HttpHeaders({
        'content-type': 'application/json',
        'cache-control': 'private, max-age=0'
      });
      this.ListOfBucket.Config='';
      this.Error_Access_Server='';
 
      this.getBucketAsset();
  }    

Process(event:string){
  this.GoToComponent=0;
  if (event==='Photos'){
    this.GoToComponent=1;
  } else if (event==='Event27Aug'){
    this.GoToComponent=2;
  } else if (event==='Contact'){
    this.GoToComponent=3;
  } else if (event==='Login'){
    this.GoToComponent=4;
  }
  }



getBucketAsset(){
  this.Error_Access_Server='';
  this.http.get<BucketList>('./assets/ListOfBuckets.json' )
  .subscribe((data ) => {
    console.log('getBucketAsset() - data received');
    this.ListOfBucket=data;
    
  },
    error_handler => {
      console.log('getBucketAsset() - error handler');
      this.Error_Access_Server='getBucketAsset()==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
    } 
  )
}
  

LogMsgConsole(msg:string){

  msginLogConsole(msg, this.myConsole,this.myLogConsole, this.SaveConsoleFinished,this.HTTP_AddressLog, this.type);
  
  }

}