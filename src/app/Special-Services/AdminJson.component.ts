import { Component, OnInit , Input, HostListener} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';
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
import { msgConsole } from '../JsonServerClass';
import { UserParam } from '../JsonServerClass';
import { OneBucketInfo } from '../JsonServerClass';

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
    myConsole:Array< msgConsole>=[];
    returnConsole:Array< msgConsole>=[];
    SaveConsoleFinished:boolean=true;
    type:string='';


    EventHTTPReceived:Array<boolean>=[false,false,false,false,false,false];
    id_Animation:Array<number>=[0,0,0,0,0];
    TabLoop:Array<number>=[0,0,0,0,0];

     // ACCESS TO GOOGLE STORAGE
    HTTP_AddressLog:string='';
    HTTP_Address:string='';

    bucket_data:string='';
    
    ListOfBucket=new BucketList;
    SelectedBucketInfo=new OneBucketInfo;

    Google_Bucket_Access_Root:string='https://storage.googleapis.com/storage/v1/b/';
    Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';
  
    Google_Bucket_Name:string=''; 
    Google_Object_Name:string='';
    Error_Access_Server:string='';

    GoToComponent:number=-1;

    // https://storage.googleapis.com/storage/v1/b?project=xmv-it-consulting
    @Input() LoginTable_User_Data:Array<EventAug>=[];
    @Input() LoginTable_DecryptPSW:Array<string>=[];

    @Input() identification=new LoginIdentif;
    @Input() WeddingPhotos:Array<StructurePhotos>=[];
    @Input() ConfigXMV=new XMVConfig;
   
    SelectedConfigFile=new XMVConfig;
    ModifConfigFile=new XMVConfig;
    fileRetrieved:boolean=false;
         // ACCESS TO GOOGLE STORAGE

    Message:string='';
     
    ContentTodisplay:boolean=false;
    ModifyText:boolean=false;
    ModifiedField:Array<string>=[];
    IsFieldModified:Array<boolean>=[];
    Max_Fields:number=0;

    theReceivedData:any;
    isDataReceived:boolean=false;

@HostListener('window:resize', ['$event'])
onWindowResize() {
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
    }


ngOnInit(){
      //this.LogMsgConsole('ngOnInit ManageJson ===== Device ' + navigator.userAgent + '======');

      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;

      this.HTTP_AddressLog=this.Google_Bucket_Access_RootPOST + this.ConfigXMV.BucketConsole+ "/o?name="  ;
      this.myHeader=new HttpHeaders({
        'content-type': 'application/json',
        'cache-control': 'private, max-age=0'
      });
      this.EventHTTPReceived[0]=false;
      //this.waitHTTP(this.TabLoop[0], 20000, 0);
      this.getBucketAsset();


  }    
ActionMessage:string='';
Process(event:string){
  this.ActionMessage='';
  this.isDataReceived=false;
  this.ContentTodisplay=false;
  this.isDataReceived=false;
  if (event==='Bucket'){
    this.GoToComponent=0;
    this.ActionMessage='Administration of Buckets';
  } else
  if (event==='Photos'){
    this.GoToComponent=1;
  } else if (event==='27Aug'){
    this.GoToComponent=2;
  
  } else if (event==='Contact'){
    this.GoToComponent=3;
  } else if (event==='Login'){
    this.ActionMessage='Administration of Logins';
    this.GoToComponent=4; 
    this.Google_Bucket_Name=this.ListOfBucket.Login;
  } else if (event==='Console'){
    this.GoToComponent=5;
    this.ActionMessage='Administration of Log Console';
    this.Google_Bucket_Name=this.ListOfBucket.Console;
  } else if (event==='Config'){
    this.ActionMessage='Administration of Configuration parameters';
    this.Google_Bucket_Name=this.ListOfBucket.Config;
    this.GoToComponent=6;
    this.scroller.scrollToAnchor('targetConfig');
  }
  }



getBucketAsset(){
  this.Error_Access_Server='';
  this.http.get<BucketList>('./assets/ListOfBuckets.json' )
  .subscribe((data ) => {
    
    this.ListOfBucket=data;

    console.log('getBucketAsset() - data received '+this.ListOfBucket.Config+' ; '+this.ListOfBucket.Login+' ; ');
    this.EventHTTPReceived[0]=true;
  },
    error_handler => {
      console.log('getBucketAsset() - error handler');
      this.Error_Access_Server='getBucketAsset()==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
    } 
  )
}


  // ================

ReceivedDataConfig(event:any){
  this.SelectedConfigFile=event;
  this.ModifConfigFile=event;
  this.ContentTodisplay=true;
  this.Message='';
  this.ModifyText=false;
  this.scroller.scrollToAnchor('targeEndList');
  this.Max_Fields=20+this.ModifConfigFile.TabBucketPhoto.length+(this.ModifConfigFile.UserSpecific.length*3);
  for (let i=0; i<this.Max_Fields; i++){
    this.ModifiedField.push('');
    this.IsFieldModified.push(false);
  }
}

BucketInfo(event:any){
  this.SelectedBucketInfo=event;
}


ReceivedData(event:any){
  this.theReceivedData=event;
  this.isDataReceived=true;
  this.scroller.scrollToAnchor('targeEndList');

  }

// ================
  
  
TextInput(event:any){
  this.ModifyText=true;

  const d=Number(event.target.id.substring(5));
  this.ModifiedField[d]=event.target.value;
  this.IsFieldModified[d]=true;

}

UpdateConfigFile(){
  if (this.IsFieldModified[1]===true){this.ModifConfigFile.BucketLogin=this.ModifiedField[1]};
  if (this.IsFieldModified[2]===true){this.ModifConfigFile.BucketConsole=this.ModifiedField[2]};
  if (this.IsFieldModified[3]===true){this.ModifConfigFile.BucketContact=this.ModifiedField[3]};
  if (this.IsFieldModified[4]===true){this.ModifConfigFile.BucketSource=this.ModifiedField[4]};
  if (this.IsFieldModified[5]===true){this.ModifConfigFile.Max_Nb_Bucket_Wedding=Number(this.ModifiedField[5])};
  if (this.IsFieldModified[6]===true){
    if (this.ModifiedField[6]==='false'){this.ModifConfigFile.GetOneBucketOnly=false};
    if (this.ModifiedField[6]==='true'){this.ModifConfigFile.GetOneBucketOnly=true};
  }
 
  if (this.IsFieldModified[7]===true){this.ModifConfigFile.nb_photo_per_page=Number(this.ModifiedField[7])};
  if (this.IsFieldModified[8]===true){
    if (this.ModifiedField[8]==='false'){this.ModifConfigFile.process_display_canvas=false};
    if (this.ModifiedField[8]==='true'){this.ModifConfigFile.process_display_canvas=true};
  }
   
  if (this.IsFieldModified[9]===true){this.ModifConfigFile.padding=Number(this.ModifiedField[9])};

  if (this.IsFieldModified[10]===true){this.ModifConfigFile.width500=Number(this.ModifiedField[10])};
  if (this.IsFieldModified[11]===true){this.ModifConfigFile.maxPhotosWidth500=Number(this.ModifiedField[11])};
  if (this.IsFieldModified[12]===true){this.ModifConfigFile.width900=Number(this.ModifiedField[12])};
  if (this.IsFieldModified[13]===true){this.ModifConfigFile.maxPhotosWidth900=Number(this.ModifiedField[13])};
  if (this.IsFieldModified[14]===true){this.ModifConfigFile.maxWidth=Number(this.ModifiedField[14])};
  if (this.IsFieldModified[15]===true){this.ModifConfigFile.maxPhotosmaxWidth=Number(this.ModifiedField[15])};


  let j=16;
  for (let i=0; i<this.ModifConfigFile.TabBucketPhoto.length; i++){
    if (this.IsFieldModified[i+j]===true){this.ModifConfigFile.TabBucketPhoto[i]=this.ModifiedField[i+j]};
  };
  //j=j+this.ModifConfigFile.TabBucketPhoto.length-1;
  
  for (let i=0; i<this.ModifConfigFile.UserSpecific.length; i++){
    let j=this.ModifConfigFile.TabBucketPhoto.length+16+(i*2);
    if (this.IsFieldModified[j+i]===true)
             {this.ModifConfigFile.UserSpecific[i].id=this.ModifiedField[j+i]};
    if (this.IsFieldModified[j+i+1]===true)
             {this.ModifConfigFile.UserSpecific[i].type=this.ModifiedField[i+j+1]};
    if (this.IsFieldModified[j+i+2]===true){
              if (this.ModifiedField[i+j+2]==='true'){ this.ModifConfigFile.UserSpecific[i].log=true};
              if (this.ModifiedField[i+j+2]==='false'){ this.ModifConfigFile.UserSpecific[i].log=false};
          };
  };

}
/******
SaveRecord(event:string){
  const myTime=new Date();
  const myDate= myTime.toString().substring(4,25);

  this.ModifyText=false;
  const a=JSON.stringify(this.ModifConfigFile) ;
  this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.ListOfBucket.Config + "/o?name=" +myDate+ this.SelectedBucketInfo.name  + "&uploadType=media" ;
  if (event==='YES'){
    this.UpdateConfigFile();
    // update the file
    this.http.post(this.HTTP_Address, this.ModifConfigFile  )
      .subscribe(res => {
            this.Message='File ' +  this.SelectedBucketInfo.name+' is saved';
            console.log(this.Message);
            },
            error_handler => {
              this.Error_Access_Server=error_handler.status + ' HTTP='+ this.HTTP_Address;
              console.log(this.Error_Access_Server);
            } 
          )
  } else if (event==='NO'){
    this.Message='No change has been identified';
    } ;
  
  this.ContentTodisplay=false;
  this.scroller.scrollToAnchor('targetTop');

}
 */
BackToSaveFile(event:any){
  this.ContentTodisplay=false;
  this.scroller.scrollToAnchor('targetTop');
}


/****
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
            if (this.EventHTTPReceived[0]===true && eventNb===0 ){
                window.cancelAnimationFrame(this.id_Animation[0]);
                this.EventHTTPReceived[1]===false;
                this.TabLoop[1]=0;
                this.RetrieveAllObjects();
                this.waitHTTP(this.TabLoop[1],20000,1);
            }      
            if (this.EventHTTPReceived[1]===true  && eventNb===1){
              window.cancelAnimationFrame(this.id_Animation[eventNb]);
          }      
      }  
  }
   */

LogMsgConsole(msg:string){

  msginLogConsole(msg, this.myConsole,this.myLogConsole, this.SaveConsoleFinished,this.HTTP_AddressLog, this.type);
  
  }

}