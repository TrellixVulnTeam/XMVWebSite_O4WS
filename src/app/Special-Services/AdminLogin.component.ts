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
import { ThisReceiver } from '@angular/compiler';

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

    Encrypt:string='';
    Decrypt:string='';
    Crypto_Method:string='';
    Crypto_Error:string='';
    Crypto_Key:number=0;
    Encrypt_Data=new LoginIdentif;
  
    id_Animation:number=0;

    CommentStructure=new EventCommentStructure;
    Table_User_Data:Array<EventAug>=[];
    Table_DecryptPSW:Array<string>=[];

    TabTestProd:Array<TableOfEventLogin>=[];
    RefTestProd=new TableOfEventLogin;

    i:number=0;

    FileName:Array<string>=['Event-27AUG2022Prod.json', 'Event-27AUG2022Test.json' ] ;
    EventHTTPReceived:Array<boolean>=[false,false];
    FileNameNew:Array<string>=['Event-27AUG2022ProdNew.json', 'Event-27AUG2022TestNew.json' ] ;

    bucket_data:string='';
   

    myHeader=new HttpHeaders();    
    getScreenWidth: any;
    getScreenHeight: any;
    device_type:string='';

    myLogConsole:boolean=false;
    myConsole:Array<string>=[];
    returnConsole:Array<string>=[];
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

    EventProdLength:number=0;
    EventTestLength:number=0;

    DataType:string='Test';
    ConfirmSaveTest:boolean=false;
    ConfirmSaveProd:boolean=false;
 
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
      this.getEventAug(0);

      this.getEventAug(1);
      
      this.waitHTTP(0,30000);

  }    
  
Process(event:string){
  if (event==='Test'){
        this.DataType='Test';
    } else {
      this.DataType='Prod';
    }
  }

Copy(event:string){
  this.scroller.scrollToAnchor('targetCopy');
  let i=2;
  if (this.DataType='Test') {
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
  console.log("DeleteItem# "+ recordId);
  let i=0;
  if (this.DataType='Test') {i=3} else {i=1};
  if (recordId>this.EventProdLength-1){
    recordId=recordId-this.EventProdLength;
    console.log("DeleteItem# "+ recordId);
  } 
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
  const myDate= myTime.toString().substring(8,24);
  const thetime=myTime.getTime();
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
    if (environment.production === false){
      this.HTTP_Address = './assets/'+ this.FileName[i-2];
      //
    }
    else {     
        this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" + this.FileName[i-2]   + "&uploadType=media" ;
    }

    this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" +myDate+myTime+ this.FileName[i-2]   + "&uploadType=media" ;

    
    this.Table_User_Data.splice(0, this.Table_User_Data.length);

    
    for (let j=0; j<this.TabTestProd[i].data.length; j++){
      if (this.TabTestProd[i].data[j].UserId!=='RECORD IS DELETED'){
        const Individual_User_Data= new EventAug;
        this.Table_User_Data.push(Individual_User_Data);
        this.Table_User_Data[this.Table_User_Data.length-1]=this.TabTestProd[i].data[j];
      }
    }
    
    this.http.post(this.HTTP_Address,  this.Table_User_Data , {'headers':this.myHeader} )
      .subscribe(res => {
            this.Error_Access_Server='record saved';
            console.log(this.Error_Access_Server);
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
      this.TabTestProd[i].data[j].method='';
      this.TabTestProd[i].data[j].nbinvitees=0;
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
    this.FieldsReference.nbinvitees=this.TabTestProd[i].data[j].nbinvitees;
    this.FieldsReference.myComment=this.TabTestProd[i].data[j].myComment;
    this.FieldsReference.yourComment=this.TabTestProd[i].data[j].yourComment;
    this.FieldsReference.timeStamp=this.TabTestProd[i].data[j].timeStamp;
    let iForm=0;
    if (this.DataType='Test') {iForm=j+this.TabTestProd[i-2].data.length} else {iForm=j};
    this.theEvent.controls[iForm].setValue(this.FieldsReference);

  }

  CheckRecord(event:number){
    console.log('check record nb '+event);
  }
  
  getEventAug(objectNb:number){
    console.log('getEventAug(); this.Table_User_Data = ');
    if (environment.production === false){
      this.HTTP_Address = './assets/'+ this.FileName[objectNb];
    }
    else {     
        this.HTTP_Address=this.Google_Bucket_Access_Root + this.Google_Bucket_Name + "/o/" + this.FileName[objectNb]   + "?alt=media" ;
    }
    
    this.http.get<EventAug>(this.HTTP_Address, {'headers':this.myHeader} )
              .subscribe((data ) => {
                console.log('getEventAug() - data received');
                this.Error_Access_Server='';
                this.EventHTTPReceived[objectNb]=true;

                this.bucket_data=JSON.stringify(data);
                var obj = JSON.parse(this.bucket_data);
                this.Table_User_Data.splice(0, this.Table_User_Data.length);
      
                this.Table_DecryptPSW.splice(0, this.Table_DecryptPSW.length);
                for (this.i=0; this.i<obj.length; this.i++){
                  let Individual_User_Data= new EventAug;
                  this.Table_User_Data.push(Individual_User_Data);

                  this.Table_User_Data[this.i] =obj[this.i];

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



waitHTTP(loop:number, max_loop:number){
  const pas=500;
  if (loop%pas === 0){
    console.log('waitHTTP ==> loop=', loop, ' max_loop=', max_loop);
  }
 loop++
  
  this.id_Animation=window.requestAnimationFrame(() => this.waitHTTP(loop, max_loop));
  if (loop>max_loop || (this.EventHTTPReceived[0]===true && this.EventHTTPReceived[1]===true)){
            console.log('exit waitHTTP ==> loop=', loop + ' max_loop=', max_loop + ' this.EventHTTPReceived=' + 
                    this.EventHTTPReceived[0] + '  ' +  this.EventHTTPReceived[1]);
            window.cancelAnimationFrame(this.id_Animation);
            this.fillinForm();
      }  

  }

LogMsgConsole(msg:string){
    msginLogConsole(msg, this.myConsole,this.myLogConsole, this.SaveConsoleFinished,this.HTTP_AddressLog, this.type);
}

}