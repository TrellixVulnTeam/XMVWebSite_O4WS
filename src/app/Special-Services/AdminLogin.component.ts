import { Component, OnInit , Input, HostListener, SimpleChanges,} from '@angular/core';
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
import { OneBucketInfo } from '../JsonServerClass';
import { msgConsole } from '../JsonServerClass';

@Component({
  selector: 'app-AdminLogin',
  templateUrl: './AdminLogin.component.html',
  styleUrls: ['./AdminLogin.component.css']
})

export class AdminLoginComponent {
  myForm:FormGroup; 
  
  constructor(
    private router:Router,
    private http: HttpClient,
    private scroller: ViewportScroller,
    private fb:FormBuilder,
    ) {
      this.myForm=this.fb.group({ 
        tabEvent: this.fb.array([])  
      });
    }

    get theEvent() { 
      return this.myForm.controls["tabEvent"] as FormArray; 
      //return this.myForm.get("lessons") as FormArray;
    }

    get theEventRef() { 
      return this.myForm.controls["tabEvent"] as FormArray; 
      //return this.myForm.get("lessons") as FormArray;
    }

    newEvent(): FormGroup { 
      return this.fb.group({
        id: 0,
        key:0,
        method:'',
        UserId:'',
        psw:'',
        phone:'',
        firstname:'',
        surname:'',
        night:'',
        brunch:'',
        nbinvitees:0,
        myComment:'',
        yourComment:'',
        timeStamp:'', 
        
       })
    }
    newEventRef(): FormGroup { 
      return this.fb.group({
        id: 0,
        key:0,
        method:'',
        UserId:'',
        psw:'',
        phone:'',
        firstname:'',
        surname:'',
        night:'',
        brunch:'',
        nbinvitees:0,
        myComment:'',
        yourComment:'',
        timeStamp:'', 
        
       })
    }

    FieldsReference={
      id: 0,
      key:0,
      method:'',
      UserId:'',
      psw:'',
      phone:'',
      firstname:'',
      surname:'',
      night:'',
      brunch:'',
      nbinvitees:0,
      myComment:'',
      yourComment:'',
      timeStamp:'', 
      
    }
    @Input() ConfigXMV=new XMVConfig;
    @Input() ListOfBucket=new BucketList;
    @Input() theReceivedData=new EventAug;
    @Input() SelectedBucketInfo=new OneBucketInfo;
    FirstSelection=true;

    Encrypt:string='';
    Decrypt:string='';
    Crypto_Method:string='';
    Crypto_Error:string='';
    Crypto_Key:number=0;
    Encrypt_Data=new LoginIdentif;

    CommentStructure=new EventCommentStructure;
    Table_User_Data:Array<EventAug>=[];
    Table_DecryptPSW:Array<string>=[];

    TabTestProd:Array<TableOfEventLogin>=[];
    RefTestProd=new TableOfEventLogin;

    i:number=0;

    EventHTTPReceived:Array<boolean>=[false,false,false,false,false,false];
    id_Animation:Array<number>=[0,0,0,0,0];
    TabLoop:Array<number>=[0,0,0,0,0];
    FileName:Array<string>=['Event-27AUG2022Prod.json', 'Event-27AUG2022Test.json' ] ;
    FileNameNew:Array<string>=['Event-27AUG2022ProdNew.json', 'Event-27AUG2022TestNew.json' ] ;

    bucket_data:string='';
    myListOfObjects=new Bucket_List_Info;

    myHeader=new HttpHeaders();    
    getScreenWidth: any;
    getScreenHeight: any;
    device_type:string='';

    myLogConsole:boolean=false;
    myConsole:Array< msgConsole>=[];
    returnConsole:Array<msgConsole>=[];
    SaveConsoleFinished:boolean=true;
    type:string='';
    isFormFilled:boolean=false;

     // ACCESS TO GOOGLE STORAGE
    HTTP_AddressLog:string='';

    HTTP_Address:string='';
    HTTP_AddressPOST:string='';
    Google_Bucket_Access_Root:string='https://storage.googleapis.com/storage/v1/b/';
    Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';
  
    Google_Bucket_Name:string='manage-login'; 
    Google_Object_Name:string='';
    Error_Access_Server:string='';
    Message:string='';

    EventProdLength:number=0;
    EventTestLength:number=0;

    DataType:string='Test';
    ConfirmSaveTest:boolean=false;
    ConfirmSaveProd:boolean=false;
    DisplayListOfObjects=false;
    ObjectTodisplay=false;


    SelectedFile=false;

    FileMedialink:string='';
    ContentTodisplay=false;
    ContentObject:string='';
    ContentObjectRef:string='';
    ContentModified:boolean=false;

    TestObjectStructure:any;
    ProdTestFiles:string='';
 
@HostListener('window:resize', ['$event'])
onWindowResize() {
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
    }

ngOnInit(){
      //**this.LogMsgConsole('AdminLogin ===== Device ' + navigator.userAgent + '======');

      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;

      this.HTTP_AddressLog=this.Google_Bucket_Access_RootPOST + this.ConfigXMV.BucketConsole+ "/o?name="  ;
      this.myHeader=new HttpHeaders({
        'content-type': 'application/json',
        'cache-control': 'private, max-age=0'
      });
      for (this.i=0; this.i<4; this.i++){
        this.RefTestProd= new TableOfEventLogin;
        this.RefTestProd.structureComment=this.i.toString();
        this.TabTestProd.push(this.RefTestProd);
       
      }

      this.isFormFilled=false;
      this.DataType='Test';
      this.Initialize();

  }    

Initialize(){

  this.ContentObject=JSON.stringify(this.theReceivedData);
  this.ContentObjectRef=this.ContentObject;
  //
  // this.TestObjectStructure=this.theReceivedData;
  if (Array.isArray(this.theReceivedData)===false){
    this.Crypto_Key=2;
    this.Crypto_Method='AES';
    this.Encrypt=this.theReceivedData.psw;
    this.onCrypt("Decrypt");
  }
  this.scroller.scrollToAnchor('targetTop');
  this.ContentTodisplay=true;
}

RetrieveAllObjects(){
// bucket name is ListOfObject.login
console.log('RetrieveAllObjects()');
this.Error_Access_Server='';
this.EventHTTPReceived[2]=false;
this.HTTP_Address=this.Google_Bucket_Access_Root + this.ListOfBucket.Login + "/o";
this.http.get<Bucket_List_Info>(this.HTTP_Address )
        .subscribe((data ) => {
          console.log('RetrieveAllObjects() - data received');
          this.Error_Access_Server='';
          this.myListOfObjects=data;
          this.DisplayListOfObjects=true;
          this.Message='';
        },
        error_handler => {
          this.EventHTTPReceived[3]=true;
          
          console.log('RetrieveAllObjects() - error handler');
          this.Message='HTTP_Address='+this.HTTP_Address;
          this.Error_Access_Server='RetrieveAllObjects()==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
        } 
)

}

ConfirmSelectedFile(event:any){
  this.scroller.scrollToAnchor('SelectedFile');
  console.log('ConfirmSelectedFile()');
  //this.Message='selected event = '+event.mediaLink;
  this.SelectedFile=true;
  this.ObjectTodisplay=false;
}

RetrieveSelectedFile(event:any){
  this.scroller.scrollToAnchor('SelectedFile');
  
  this.SelectedFile=false;
  if (event='YES'){
    // this.waitHTTP(this.TabLoop[3],30000,3);
    this.http.get<any>(this.SelectedBucketInfo.mediaLink )
    .subscribe((data ) => {
      console.log('RetrieveSelectedFile='+this.SelectedBucketInfo.name);
      this.Error_Access_Server='';
      this.ContentObject=JSON.stringify(data);
      this.ContentObjectRef=this.ContentObject;
      this.ContentTodisplay=true;

      //
      this.TestObjectStructure=data;
      if (Array.isArray(this.TestObjectStructure)===false){
        this.Crypto_Key=2;
        this.Crypto_Method='AES';
        this.Encrypt=data.psw;
        this.onCrypt("Decrypt");
      }

      //
    },
    error_handler => {
      this.EventHTTPReceived[2]=true;
      console.log('RetrieveAllObjects- error handler');
      this.Message='HTTP_Address='+this.HTTP_Address;
      this.Error_Access_Server='INIT - error message==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
    } 
    )
  } else {
      this.scroller.scrollToAnchor('targetTop');
  }
  
}

ModifPSW(event:any){
  this.Crypto_Key=2;
  this.Crypto_Method='AES';
  this.Decrypt=event.target.value;
  this.onCrypt("Encrypt");
  
}
ModifContent(event:any){
  this.ContentModified=true;
  this.ContentObject=event.target.value;
}

SaveModif(event:string){
  const myTime=new Date();
  const myDate= myTime.toString().substring(4,25);
  this.ContentModified=false;
  const theFile=this.SelectedBucketInfo.mediaLink;
  this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" +myDate+ this.SelectedBucketInfo.name   + "&uploadType=media" ;
  if (this.ContentObjectRef!==this.ContentObject && event==='YES'){
    // update the file
    this.http.post(this.HTTP_Address,  this.ContentObject  )
      .subscribe(res => {
            this.Message='File ' + this.SelectedBucketInfo.name+' is saved';
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
  
  this.ClearVar();
}



ClearVar(){
  this.SelectedFile=false;
  this.ContentModified=false;
  this.ContentTodisplay=false;
  this.ObjectTodisplay=false;
  this.SelectedBucketInfo.name='';
  this.SelectedBucketInfo.mediaLink='';

  this.ContentObject='';
  this.ContentObjectRef='';

  this.scroller.scrollToAnchor('targetTop');
}
  
DisplayEventAug(event:string){
  if (event==='YES'){
    this.ObjectTodisplay=true;
    this.SelectedFile=false;
    this.ContentModified=false;
    this.ContentTodisplay=false;

    this.Google_Bucket_Name =this.ListOfBucket.Login ;
    this.FileName[0] = this.SelectedBucketInfo.name;
    this.FileName[1] = '';
    this.ProdTestFiles='Prod';
    this.Message='On-going process to format file'+this.SelectedBucketInfo.name;
    for (let i=0; i<this.EventHTTPReceived.length; i++){
        this.EventHTTPReceived[i]=false;
    }
    this.EventHTTPReceived[1]=true; // simulates that Test file has been received though there is none
    this.DataType='Prod';
    this.theEvent.controls.splice(0,this.theEvent.length)
    for (let i=0; i<this.TabTestProd.length; i++){
        this.TabTestProd[i].data.splice(0,this.TabTestProd[i].data.length);
        this.TabTestProd[i].psw.splice(0,this.TabTestProd[i].psw.length);
    }
    this.ProcessEventAug();
  }

}


ProcessEventAug(){
  this.getEventAug(0);
  this.waitHTTP(this.TabLoop[0],30000,0);
  //this.getEventAug(1);
  //this.waitHTTP(this.TabLoop[1],30000,1);
  //this.ProdTestFiles='Both';
}


Process(event:string){
  this.Message='';
  if (event==='Test'){
        this.DataType='Test';
    } else {
      this.DataType='Prod';
    }
  }

Copy(event:string){
  this.scroller.scrollToAnchor('targetCopy');
  this.Message='';
  let i=2;
  if (this.DataType==='Test') {
    i=3;
  } 
  this.CopyTo(i);
  for (let j=0; j<this.TabTestProd[i].data.length; j++){
    this.updateForm(i,j);
  }
  
}

CopyTo(objectNb:number){
  for (this.i=0; this.i<this.TabTestProd[objectNb-2].data.length; this.i++){

      this.TabTestProd[objectNb].psw[this.i]=this.TabTestProd[objectNb-2].psw[this.i]

      this.TabTestProd[objectNb].data[this.i].brunch=this.TabTestProd[objectNb-2].data[this.i].brunch;
      this.TabTestProd[objectNb].data[this.i].surname=this.TabTestProd[objectNb-2].data[this.i].surname;
      this.TabTestProd[objectNb].data[this.i].firstname=this.TabTestProd[objectNb-2].data[this.i].firstname;
      this.TabTestProd[objectNb].data[this.i].night=this.TabTestProd[objectNb-2].data[this.i].night;
      this.TabTestProd[objectNb].data[this.i].timeStamp=this.TabTestProd[objectNb-2].data[this.i].timeStamp;
      this.TabTestProd[objectNb].data[this.i].UserId=this.TabTestProd[objectNb-2].data[this.i].UserId;
      this.TabTestProd[objectNb].data[this.i].method=this.TabTestProd[objectNb-2].data[this.i].method;
      this.TabTestProd[objectNb].data[this.i].myComment=this.TabTestProd[objectNb-2].data[this.i].myComment;
      this.TabTestProd[objectNb].data[this.i].yourComment=this.TabTestProd[objectNb-2].data[this.i].yourComment;
      this.TabTestProd[objectNb].data[this.i].nbinvitees=this.TabTestProd[objectNb-2].data[this.i].nbinvitees;
      this.TabTestProd[objectNb].data[this.i].key=this.TabTestProd[objectNb-2].data[this.i].key;
      this.TabTestProd[objectNb].data[this.i].id=this.TabTestProd[objectNb-2].data[this.i].id;
  }
}

DeleteItem(recordId:number){
  console.log("DeleteItem# in the form is "+ recordId);
  this.Message='';
  let i=0;
  if (this.DataType==='Test') {
      i=3;
      recordId=recordId-this.EventProdLength;
    } else {
      i=2;
      recordId--
    };
    
    console.log("Item# in the table is  "+ recordId);
  //this.TabTestProd[i].data.splice(recordId,1); // should only be done at time of SaveRecord
 
  this.clearItem(i,recordId);
  if (recordId!==0){this.TabTestProd[i].data[recordId].UserId='RECORD IS DELETED';}
  this.updateForm(i,recordId);

}

ConfirmSave(event:string){
  this.scroller.scrollToAnchor('targetConfirm');
  if (event==='Test'){
      
      this.ConfirmSaveTest=true;
  } else {
      
      this.ConfirmSaveProd=true;
  }
  // ask for confirmation
}

saveRecord(event:string){
  const myTime=new Date();
  const myDate= myTime.toString().substring(4,25);
  
  let i=0;
  if (event==='No'){
    this.ConfirmSaveProd=false;
    this.ConfirmSaveTest=false;
  }
  else if ( this.DataType==='Prod' && this.ConfirmSaveProd===true){
      this.ConfirmSaveProd=false;
      i=2;
  } else if ( this.DataType==='Test' && this.ConfirmSaveTest===true){
      this.ConfirmSaveTest=false;
      i=3;
  } else {
      this.Error_Access_Server='Problem with '+ event + ' - cannot save the file as the values of ConfirmSaveProd and this.ConfirmSaveTest are both set to false';
      console.log(this.Error_Access_Server);
    }
const savei=i;
if (i!==0){
    // CANNOT UPDATE ./assets ==> read only
    /*** 
    if (environment.production === false){
      this.HTTP_Address = './assets/'+ this.FileName[i-2];
      //
    }
    else {     
        this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" + this.FileName[i-2]   + "&uploadType=media" ;
    }
    ***/
    this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" +myDate+ this.FileName[i-2]   + "&uploadType=media" ;

    
    this.Table_User_Data.splice(0, this.Table_User_Data.length);

    // check if psw changed; then encrypt it before saving
    // check how to get the data at time of input

    for (let j=0; j<this.TabTestProd[i].data.length; j++){
      if (this.TabTestProd[i].data[j].UserId!=='RECORD IS DELETED'){
        const Individual_User_Data= new EventAug;
        this.Table_User_Data.push(Individual_User_Data);
        this.Table_User_Data[this.Table_User_Data.length-1]=this.TabTestProd[i].data[j];
      }
    }
    
    this.http.post(this.HTTP_Address,  this.Table_User_Data , {'headers':this.myHeader} )
      .subscribe(res => {
            this.Message='record saved';
            console.log(this.Message);
            this.scroller.scrollToAnchor('targetMessage');
            //this.restoreTabSize(i);
            },
            error_handler => {
              this.Error_Access_Server=error_handler.status + ' HTTP='+ this.HTTP_Address+ '  table='+savei;
              console.log(this.Error_Access_Server);
              //this.restoreTabSize(i);
            } 
          )
    }
  }
/** 
restoreTabSize(i:number){
  const j=this.TabTestProd[i-2].data.length-this.TabTestProd[i].data.length;
  for (this.i=0; this.i<j; this.i++){
    const  Individual_User_Data= new EventAug;
    this.TabTestProd[i].data.push(Individual_User_Data);
  } 
}
**/
managePSW(recordId:number){
let i=0;
let j=0;
this.FieldsReference=this.myForm.value.tabEvent[recordId];

if (this.DataType==='Test') {
    i=3;
    j=recordId-this.EventProdLength;
  } else {
    i=2;
   j=recordId;
  };

this.Crypto_Key=this.TabTestProd[i].data[j].key;
this.Crypto_Method=this.TabTestProd[i].data[j].method;
this.Decrypt=this.myForm.value.tabEvent[recordId].psw;
this.onCrypt("Encrypt");
this.TabTestProd[i].psw[j]= this.Decrypt;
this.TabTestProd[i].data[j].psw=this.Encrypt;

}


fillinForm(){
    let j=0;
    // production
    this.FillInFields(j, false);
    this.EventProdLength=this.TabTestProd[j].data.length;

    j=1;
    // test
    this.FillInFields(j, false);
    this.EventTestLength=this.TabTestProd[j].data.length;

    j=2;
    // production REF 
    //this.CopyTo(j);

    this.FillInFields(j, false);
    this.EventProdLength=this.TabTestProd[j].data.length;

    j=3;
    // test REF
    //this.CopyTo(j);
    this.FillInFields(j, false);
    this.EventTestLength=this.TabTestProd[j].data.length;

    this.isFormFilled=true;
  }

  FillInFields(i:number, reference:boolean){

    for (let j=0; j<this.TabTestProd[i].data.length; j++){
        if (this.TabTestProd[i].data[j].night===undefined){
          this.TabTestProd[i].data[j].night='';
          if (this.TabTestProd[i].data[j].brunch===undefined){ this.TabTestProd[i].data[j].brunch='';}
          if (this.TabTestProd[i].data[j].nbinvitees===undefined){ this.TabTestProd[i].data[j].nbinvitees=0;}
          if (this.TabTestProd[i].data[j].myComment===undefined){ this.TabTestProd[i].data[j].myComment='';}
          if (this.TabTestProd[i].data[j].yourComment===undefined){ this.TabTestProd[i].data[j].yourComment='';}
          if (this.TabTestProd[i].data[j].key===undefined){ this.TabTestProd[i].data[j].key=0;}
          if (this.TabTestProd[i].data[j].surname===undefined){ this.TabTestProd[i].data[j].surname='';}
          if (this.TabTestProd[i].data[j].firstname===undefined){ this.TabTestProd[i].data[j].firstname='';}
          if (this.TabTestProd[i].data[j].timeStamp===undefined){ this.TabTestProd[i].data[j].timeStamp='';}
          }
        this.FieldsReference.UserId=this.TabTestProd[i].data[j].UserId;
        this.FieldsReference.firstname=this.TabTestProd[i].data[j].firstname;
        this.FieldsReference.surname=this.TabTestProd[i].data[j].surname;
        this.FieldsReference.psw=this.TabTestProd[i].psw[j];
        this.FieldsReference.night=this.TabTestProd[i].data[j].night;
        this.FieldsReference.brunch=this.TabTestProd[i].data[j].brunch;
        this.FieldsReference.method=this.TabTestProd[i].data[j].method;
        this.FieldsReference.nbinvitees=this.TabTestProd[i].data[j].nbinvitees;
        this.FieldsReference.myComment=this.TabTestProd[i].data[j].myComment;
        this.FieldsReference.yourComment=this.TabTestProd[i].data[j].yourComment;
        this.FieldsReference.timeStamp=this.TabTestProd[i].data[j].timeStamp;
        this.FieldsReference.key=this.TabTestProd[i].data[j].key;
        this.FieldsReference.id=this.TabTestProd[i].data[j].id;

        if (reference===false){
              this.theEvent.push(this.newEvent());
              this.theEvent.controls[this.theEvent.length-1].setValue(this.FieldsReference);
        } else {
              this.theEventRef.push(this.newEventRef());
              this.theEventRef.controls[this.theEvent.length-1].setValue(this.FieldsReference);
        }
    }
  }

  clearItem(i:number,j:number){
      this.TabTestProd[i].data[j].UserId='';
      this.TabTestProd[i].data[j].firstname='';
      this.TabTestProd[i].data[j].surname='';
      this.TabTestProd[i].data[j].night='';
      this.TabTestProd[i].data[j].psw='';
      this.TabTestProd[i].data[j].brunch='';
      this.TabTestProd[i].data[j].nbinvitees=0;
      this.TabTestProd[i].data[j].method='';
      //this.TabTestProd[i].data[j].id=0; keep it
      this.TabTestProd[i].data[j].key=0;
      this.TabTestProd[i].data[j].myComment='';
      this.TabTestProd[i].data[j].yourComment='';
      this.TabTestProd[i].data[j].timeStamp='';

      this.TabTestProd[i].psw[j]='';
  }

  updateForm(i:number,j:number){
    this.FieldsReference.UserId=this.TabTestProd[i].data[j].UserId;
    this.FieldsReference.firstname=this.TabTestProd[i].data[j].firstname;
    this.FieldsReference.surname=this.TabTestProd[i].data[j].surname;
    this.FieldsReference.psw=this.TabTestProd[i].psw[j];
    this.FieldsReference.night=this.TabTestProd[i].data[j].night;
    this.FieldsReference.brunch=this.TabTestProd[i].data[j].brunch;
    this.FieldsReference.method=this.TabTestProd[i].data[j].method;
    this.FieldsReference.id=this.TabTestProd[i].data[j].id;
    this.FieldsReference.key=this.TabTestProd[i].data[j].key;
    this.FieldsReference.nbinvitees=this.TabTestProd[i].data[j].nbinvitees;
    this.FieldsReference.myComment=this.TabTestProd[i].data[j].myComment;
    this.FieldsReference.yourComment=this.TabTestProd[i].data[j].yourComment;
    this.FieldsReference.timeStamp=this.TabTestProd[i].data[j].timeStamp;
    let iForm=0;
    if (this.DataType==='Test') {iForm=j+this.TabTestProd[i-2].data.length} else {iForm=j};
    this.theEvent.controls[iForm].setValue(this.FieldsReference);

  }

  CheckRecord(event:number){
    console.log('check record nb '+event);
  }
  



  getEventAug(objectNb:number){
    console.log('getEventAug(); this.Table_User_Data = ');
    /**** As ./assets cannot be updated no need to retrieve files from this directory*****/
    /***
    if (environment.production === false){
      this.HTTP_Address = './assets/'+ this.FileName[objectNb];
    }
    else {     
        this.HTTP_Address=this.Google_Bucket_Access_Root + this.Google_Bucket_Name + "/o/" + this.FileName[objectNb]   + "?alt=media" ;
    }
     */
    let theLength=0;
    this.HTTP_Address=this.Google_Bucket_Access_Root + this.Google_Bucket_Name + "/o/" + this.FileName[objectNb]   + "?alt=media" ;
    this.http.get<EventAug>(this.HTTP_Address, {'headers':this.myHeader} )
              .subscribe((data ) => {
                console.log('getEventAug() - data received');
                this.Error_Access_Server='';
                this.Message='';


                this.bucket_data=JSON.stringify(data);
                var obj = JSON.parse(this.bucket_data);
                this.Table_User_Data.splice(0, this.Table_User_Data.length);
      
                this.Table_DecryptPSW.splice(0, this.Table_DecryptPSW.length);
                if (Array.isArray(data)===false){
                  theLength=1;
                } else { theLength=obj.length;}
                for (this.i=0; this.i<theLength; this.i++){
                  let Individual_User_Data= new EventAug;
                  this.Table_User_Data.push(Individual_User_Data);
                  if (theLength===1){
                    this.Table_User_Data[this.i]=data;
                  } else {
                    this.Table_User_Data[this.i] =obj[this.i];
                    }

                  Individual_User_Data= new EventAug;
                  this.TabTestProd[objectNb].data.push(Individual_User_Data);
                  this.TabTestProd[objectNb].data[this.i]=this.Table_User_Data[this.i];

                  Individual_User_Data= new EventAug;
                  this.TabTestProd[objectNb+2].data.push(Individual_User_Data);
                  this.TabTestProd[objectNb+2].data[this.i].brunch=this.TabTestProd[objectNb].data[this.i].brunch;
                  this.TabTestProd[objectNb+2].data[this.i].surname=this.TabTestProd[objectNb].data[this.i].surname;
                  this.TabTestProd[objectNb+2].data[this.i].firstname=this.TabTestProd[objectNb].data[this.i].firstname;
                  this.TabTestProd[objectNb+2].data[this.i].night=this.TabTestProd[objectNb].data[this.i].night;
                  this.TabTestProd[objectNb+2].data[this.i].timeStamp=this.TabTestProd[objectNb].data[this.i].timeStamp;
                  this.TabTestProd[objectNb+2].data[this.i].UserId=this.TabTestProd[objectNb].data[this.i].UserId;
                  this.TabTestProd[objectNb+2].data[this.i].method=this.TabTestProd[objectNb].data[this.i].method;
                  this.TabTestProd[objectNb+2].data[this.i].myComment=this.TabTestProd[objectNb].data[this.i].myComment;
                  this.TabTestProd[objectNb+2].data[this.i].yourComment=this.TabTestProd[objectNb].data[this.i].yourComment;
                  this.TabTestProd[objectNb+2].data[this.i].nbinvitees=this.TabTestProd[objectNb].data[this.i].nbinvitees;
                  this.TabTestProd[objectNb+2].data[this.i].key=this.TabTestProd[objectNb].data[this.i].key;
                  this.TabTestProd[objectNb+2].data[this.i].id=this.TabTestProd[objectNb].data[this.i].id;


                  this.Table_DecryptPSW.push(' ');

                  this.Crypto_Key=this.Table_User_Data[this.i].key;
                  this.Crypto_Method=this.Table_User_Data[this.i].method;
                  this.Encrypt=this.Table_User_Data[this.i].psw;
                  this.onCrypt("Decrypt");
                  this.Table_DecryptPSW[this.i]= this.Decrypt;

                  this.TabTestProd[objectNb].psw[this.i]=this.Decrypt;
                  this.TabTestProd[objectNb+2].psw[this.i]=this.Decrypt;
                }

                this.EventHTTPReceived[objectNb]=true;


                },
                error_handler => {
                  this.EventHTTPReceived[objectNb]=true;
                  console.log('getEventAug() - error handler');
                  this.Error_Access_Server='INIT - error message==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
                } 
  
          )
    }
  
  
onCrypt(type_crypto:string){
  if (type_crypto==='Encrypt'){
          this.Encrypt=encrypt(this.Decrypt,this.Crypto_Key,this.Crypto_Method);
    } else { // event=Decrypt
          this.Decrypt=decrypt(this.Encrypt,this.Crypto_Key,this.Crypto_Method);
        } 
}



waitHTTP(loop:number, max_loop:number, eventNb:number){
  const pas=500;
  if (loop%pas === 0){
    console.log('waitHTTP ==> loop=', loop, ' max_loop=', max_loop);
  }
 loop++
  
  this.id_Animation[eventNb]=window.requestAnimationFrame(() => this.waitHTTP(loop, max_loop, eventNb));
  if (loop>max_loop || (this.EventHTTPReceived[0]===true && this.EventHTTPReceived[1]===true)){
            console.log('exit waitHTTP ==> loop=', loop + ' max_loop=', max_loop + ' this.EventHTTPReceived=' + 
                    this.EventHTTPReceived[0] + '  ' +  this.EventHTTPReceived[1]);
            if (this.EventHTTPReceived[0]===true && this.EventHTTPReceived[1]===true){
              window.cancelAnimationFrame(this.id_Animation[0]);
              window.cancelAnimationFrame(this.id_Animation[1]);
              this.fillinForm();
            } 
            //else   if (this.EventHTTPReceived[2]===true) {
            //    window.cancelAnimationFrame(this.id_Animation[2]);
            //} 
            
      }  

  }

  ngOnChanges(changes: SimpleChanges) { 
    if (this.FirstSelection===true){
      this.FirstSelection=false;
    } else {
      // must check which data is returned
      this.ContentTodisplay=false;
      this.Initialize();
    }
  }

LogMsgConsole(msg:string){
    msginLogConsole(msg, this.myConsole,this.myLogConsole, this.SaveConsoleFinished,this.HTTP_AddressLog, this.type);
}

}