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
  
    myFormParam = new FormGroup({
      id: new FormControl(''),
      type: new FormControl(''),
      log: new  FormControl(''),
    });
    myFormBucketPhoto = new FormGroup({
      bucketName: new FormControl(''),
    });

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
    myListOfObjects=new Bucket_List_Info;
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
   
    SelectedConfigFile=new XMVConfig;
    ModifConfigFile=new XMVConfig;
    fileRetrieved:boolean=false;
         // ACCESS TO GOOGLE STORAGE

    Message:string='';
     
    DisplayListOfObjects:boolean=false;
    SelectedFile:boolean=false;
    ContentTodisplay:boolean=false;
    FileMedialink:string='';
    FileName:string='';

    ModifyText:boolean=false;
    ModifiedField:Array<string>=[];
    IsFieldModified:Array<boolean>=[];
    Max_Fields:number=30;

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
      this.EventHTTPReceived[0]=false;
      this.waitHTTP(this.TabLoop[0], 20000, 0);
      this.getBucketAsset();
      for (let i=0; i<this.Max_Fields; i++){
        this.ModifiedField.push('');
        this.IsFieldModified.push(false);
      }

  }    

Process(event:string){
  this.GoToComponent=0;
  if (event==='Photos'){
    this.GoToComponent=1;
  } else if (event==='27Aug'){
    this.GoToComponent=2;
  } else if (event==='Contact'){
    this.GoToComponent=3;
  } else if (event==='Login'){
    this.GoToComponent=4;
  } else if (event==='Console'){
    this.GoToComponent=5;
  } else if (event==='Config'){
    this.scroller.scrollToAnchor('targetConfig');
  }
  }



getBucketAsset(){
  this.Error_Access_Server='';
  this.http.get<BucketList>('./assets/ListOfBuckets.json' )
  .subscribe((data ) => {
    console.log('getBucketAsset() - data received');
    this.ListOfBucket=data;
    this.EventHTTPReceived[0]=true;
  },
    error_handler => {
      console.log('getBucketAsset() - error handler');
      this.Error_Access_Server='getBucketAsset()==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
    } 
  )
}


RetrieveAllObjects(){
  // bucket name is ListOfObject.config
  this.HTTP_Address=this.Google_Bucket_Access_Root+ this.ListOfBucket.Config+ "/o"  ;
  console.log('RetrieveAllObjects()');
  this.http.get<Bucket_List_Info>(this.HTTP_Address )
          .subscribe((data ) => {
            console.log('RetrieveAllObjects() - data received');
            this.myListOfObjects=data;
            this.DisplayListOfObjects=true;

          },
          error_handler => {
            
            console.log('RetrieveAllObjects() - error handler');
            this.Message='HTTP_Address='+this.HTTP_Address;
            this.Error_Access_Server='RetrieveAllObjects()==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
          } 
    )
  }
  
  
  RetrieveSelectedFile(event:any){
    this.Message='';
    this.ModifyText=false;
    this.scroller.scrollToAnchor('SelectedFile');
    this.ContentTodisplay=false;
    this.FileMedialink=event.mediaLink;
    this.FileName=event.name;
      this.http.get<any>(this.FileMedialink )
      .subscribe((data ) => {
        console.log('RetrieveSelectedFile='+this.FileMedialink);
        this.Error_Access_Server='';
        //this.ContentObject=JSON.stringify(data);
        this.EventHTTPReceived[1]=true;
        this.SelectedConfigFile=data;
        this.ModifConfigFile=data;
        this.ContentTodisplay=true;
        for (let i=0; i<this.ModifConfigFile.TabBucketPhoto.length; i++){
          // need to define an array of FormControl
          //this.myFormBucketPhoto.controls[i].setValue(this.ModifConfigFile.TabBucketPhoto[i]);
        }
        
        //
      },
      error_handler => {
        this.EventHTTPReceived[1]=true;
        
        this.Message='HTTP_Address='+this.HTTP_Address;
        this.Error_Access_Server='INIT - error message==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
        console.log('RetrieveSelectedFile- error handler '+this.Error_Access_Server);
        this.Error_Access_Server='INIT - error status==> '+ error_handler.status+ '   Error url==>  '+ error_handler.url;
      } 
      )
  
    
  }
  
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
  if (this.IsFieldModified[11]===true){this.ModifConfigFile.width900=Number(this.ModifiedField[12])};
  if (this.IsFieldModified[13]===true){this.ModifConfigFile.maxPhotosWidth900=Number(this.ModifiedField[13])};
  if (this.IsFieldModified[14]===true){this.ModifConfigFile.maxWidth=Number(this.ModifiedField[14])};
  if (this.IsFieldModified[15]===true){this.ModifConfigFile.maxPhotosmaxWidth=Number(this.ModifiedField[15])};


  let j=16;
  for (let i=0; i<this.ModifConfigFile.TabBucketPhoto.length-1; i++){
    if (this.IsFieldModified[i+j]===true){this.ModifConfigFile.TabBucketPhoto[i]=this.ModifiedField[i+j]};
  };
  //j=j+this.ModifConfigFile.TabBucketPhoto.length-1;
  j=25;
  for (let i=0; i<this.ModifConfigFile.UserSpecific.length-1; i++){
    if (this.IsFieldModified[i+j]===true){this.ModifConfigFile.UserSpecific[i]=JSON.parse(this.ModifiedField[i+j])};
  };

}

SaveRecord(event:string){
  const myTime=new Date();
  const myDate= myTime.toString().substring(4,25);

  this.ModifyText=false;
  const a=JSON.stringify(this.ModifConfigFile) ;
  this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.ListOfBucket.Config + "/o?name=" +myDate+ this.FileName   + "&uploadType=media" ;
  if (event==='YES'){
    this.UpdateConfigFile();
    // update the file
    this.http.post(this.HTTP_Address, this.ModifConfigFile  )
      .subscribe(res => {
            this.Message='File ' +  this.FileName+' is saved';
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
  

LogMsgConsole(msg:string){

  msginLogConsole(msg, this.myConsole,this.myLogConsole, this.SaveConsoleFinished,this.HTTP_AddressLog, this.type);
  
  }

}