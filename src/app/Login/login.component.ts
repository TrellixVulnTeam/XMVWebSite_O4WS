import { Component, Input, Output, EventEmitter, HostListener, OnChanges, SimpleChanges} from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { encrypt, decrypt} from '../EncryptDecryptServices';
import { EventAug } from '../JsonServerClass';
import {Bucket_List_Info} from '../JsonServerClass';
import { XMVConfig } from '../JsonServerClass';
import { XMVTestProd } from '../JsonServerClass';
import { LoginIdentif } from '../JsonServerClass';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(
    private router:Router,
    private http: HttpClient,    
    ) {}

    @Input() identification=new LoginIdentif; 
    // from xmv-company.cmoponent.ts which got it through an @output action
    // putpose is to keep the identification if user goes to other part of the website so that he/she does not need to reenter the information


    ConfigXMV=new XMVConfig;
    ConfigTestProd=new XMVTestProd;

    id_Animation:number=0;
    id_Animation_Two:number=0;
    j_loop:number=0;
    max_j_loop:number=20000;

    @Output() my_output1= new EventEmitter<any>();
    @Output() my_output2= new EventEmitter<string>();
    
    
    myHeader= new  HttpHeaders();
    getScreenWidth: any;
    getScreenHeight: any;
    device_type:string='';
    routing_code:number=0;
    text_error:string='';
    i:number=0;

    myForm = new FormGroup({
      userId: new FormControl(''),
      password: new FormControl(''),
      action: new  FormControl(''),
    });

    Encrypt:string='';
    Decrypt:string='';
    Crypto_Method:string='';
    Crypto_Error:string='';
    Crypto_Key:number=0;
    Encrypt_Data=new LoginIdentif;

    Table_User_Data:Array<EventAug>=[];
    Table_DecryptPSW:Array<string>=[];
    Individual_User_Data= new EventAug;
    bucket_data:string='';

    HTTP_Address:string='';
    HTTP_AddressMetaData:string='';
    Server_Name:string='Google'; // "Google" or "MyJson"
    Google_Bucket_Access_Root:string='https://storage.googleapis.com/storage/v1/b/';
    Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';
    //Google_Bucket_Name:string='my-db-json';
    Google_Bucket_Name:string='manage-login'; 
    Google_Object_Name:string='';
    Google_Object_Name_Extension:string='.json';
    Bucket_Info_Array=new Bucket_List_Info;

    EventHTTPReceived:boolean=false;
  
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
    }

  ngOnInit(){
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
      this.device_type = navigator.userAgent;
      this.device_type = this.device_type.substring(10, 48);

      this.myHeader=new HttpHeaders({
        'content-type': 'application/json',
        'cache-control': 'private, max-age=0'
      });
      this. getConfigAsset();
      this.waitHTTP(0, 30000);
      //this.httpHeader.append('content-type', 'application/json');
      //this.httpHeader.append('Cache-Control', 'no-store, must-revalidate, private, max-age=0, no-transform');
      this.routing_code=0;
      this.EventHTTPReceived=false;
      this.getEventAug();

      if (this.identification.UserId!=='' && this.identification.psw!=='') {
       // go through login panel again to allow the change of user id if needed SIN!02#JUL
          this.myForm.controls['userId'].setValue(this.identification.UserId);
          this.Crypto_Key=this.identification.key;
          this.Crypto_Method=this.identification.method;
          this.Encrypt=this.identification.psw;
          this.onCrypt("Decrypt");
          this.myForm.controls['password'].setValue(this.Decrypt);
      } else {
          this.myForm.controls['action'].setValue("");
        }


      this.myForm.controls['userId'].setValue(this.identification.UserId);
      this.myForm.controls['password'].setValue(this.identification.psw);
  }

waitHTTP(loop:number, max_loop:number){
    const pas=500;
    if (loop%pas === 0){
      console.log('waitHTTP ==> loop=', loop, ' max_loop=', max_loop, ' this.EventHTTPReceived=', this.EventHTTPReceived);
    }
   loop++
    
    this.id_Animation=window.requestAnimationFrame(() => this.waitHTTP(loop, max_loop));
    if (loop>max_loop || this.EventHTTPReceived===true){
              console.log('exit waitHTTP ==> loop=', loop, ' max_loop=', max_loop, ' this.EventHTTPReceived=', this.EventHTTPReceived);
              window.cancelAnimationFrame(this.id_Animation);
        }  

    }

GetObject(){
// ****** get content of object *******
      this.HTTP_Address=this.Google_Bucket_Access_Root + this.Google_Bucket_Name + "/o/" + this.Google_Object_Name   + "?alt=media"; 
      // this.HTTP_AddressMetaData=this.Google_Bucket_Access_Root + this.Google_Bucket_Name + "/o/" + this.Google_Object_Name ; 
      console.log('GetObject() - object:', this.Google_Object_Name);
      this.EventHTTPReceived=false;
            this.http.get<LoginIdentif>(this.HTTP_Address, {'headers':this.myHeader} )
            .subscribe(data => {
            //console.log(data);
            this.Encrypt_Data = data;
            this.EventHTTPReceived=true;
            console.log('GetObject(); data received');
            this.Crypto_Key=this.Encrypt_Data.key;
            this.Crypto_Method=this.Encrypt_Data.method;
            this.Encrypt=this.Encrypt_Data.psw;
            
            this.onCrypt("Decrypt");
                
            if (this.Encrypt_Data.UserId===this.myForm.controls['userId'].value && this.Decrypt===this.myForm.controls['password'].value){
              // identification is correct

                this.my_output1.emit(this.Encrypt_Data);
                let i=0;
                for (this.i=0; this.i<this.ConfigXMV.UserSpecific.length && this.Encrypt_Data.UserId!==this.ConfigXMV.UserSpecific[this.i].id; this.i++){}

                
                if (this.i<this.ConfigXMV.UserSpecific.length && this.Encrypt_Data.UserId===this.ConfigXMV.UserSpecific[this.i].id && this.ConfigXMV.UserSpecific[this.i].type==='ADMIN') {
                  
                      if (this.myForm.controls['action'].value==='' || this.myForm.controls['action'].value===null){ 
                        this.routing_code=4;
                      } else if (this.myForm.controls['action'].value==='Manage Contact'){
                          this.routing_code=1; // go to Respond_Contact
                      } else if (this.myForm.controls['action'].value==='Event-27AUG2022'){
                        this.routing_code=3; // go to Respond_Contact
                      }
                    }
                  else if (this.Encrypt_Data.UserId==='Event-02JUL2022'){
                    this.routing_code=2;
                  }
                  else if (this.Encrypt_Data.UserId==='Event-27AUG2022'){
                    this.routing_code=3;
                  } else {
                    this.ValidateEventAug();
                  }
                  this.my_output2.emit(this.routing_code.toString());
                  }
              else{
                this.text_error="identification failed; retry";
              }
            },
            error_handler => {
                  // user id not found
                  this.EventHTTPReceived=true;
                  console.log('INIT - error message==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url);
                  this.text_error='identification failed; retry';
                  this.routing_code=0;
            } 
        )
    }

ValidateEventAug(){
  this.text_error='';
  for (this.i=0; this.i<this.Table_User_Data.length && (this.Table_User_Data[this.i].UserId!=this.myForm.controls['userId'].value || 
    this.Table_DecryptPSW[this.i]!=this.myForm.controls['password'].value ); this.i++ ){
    }

  if (this.i>=this.Table_User_Data.length){
    // user id not found
    this.text_error='identification failed; retry';
    this.routing_code=0;
  } 
}


ValidateData(){
    this.j_loop=0;
    this.max_j_loop=20000;
    this.ValidateDataTer();
}

ValidateDataTer(){
  const pas=10;
  if (this.j_loop%pas === 0){
    console.log('ValidateDataTer ==> loop=', this.j_loop, ' max_loop=', this.max_j_loop, ' this.EventHTTPReceived=', this.EventHTTPReceived);
  }
  this.j_loop++
  
  this.id_Animation=window.requestAnimationFrame(() => this.ValidateDataTer());
  if (this.j_loop>this.max_j_loop || this.EventHTTPReceived===true){
            console.log('exit ValidateDataTer ==> loop=', this.j_loop, ' max_loop=', this.max_j_loop, ' this.EventHTTPReceived=', this.EventHTTPReceived);
            window.cancelAnimationFrame(this.id_Animation);
            this.ValidateDataBis();
      }  
}

ValidateDataBis(){

  this.Google_Object_Name = this.myForm.controls['userId'].value;
  console.log('validateData()');
  if (this.Google_Object_Name==='')  {
    this.text_error=" provide your user id";
  }
  else
  if (this.myForm.controls['password'].value==='')  {
    this.text_error=" provide your password";
  }
  else
  {
    // check first if data has been received and if it's related to Event of 27Aug2022

    this.ValidateEventAug();
    console.log('after ValidateEventAug()');
    
    if (this.text_error!== ''){
        // user id not found in EventAug so go through through next validation step which is to check if other objects in the bucket (e.g. EventJuly)
        this.Google_Object_Name=this.Google_Object_Name+this.Google_Object_Name_Extension;
        this.text_error='';

        this.EventHTTPReceived=false;
        // once data is received all validation checks are performed in GetObject() and routing_code is assigned
        this.GetObject(); 
        // wait for the data from GetObject()
        this.waitHTTP(0, 40000); 
        console.log('after getObject()');
    } else {
        this.routing_code=3;
        this.Encrypt_Data.UserId=this.Table_User_Data[this.i].UserId;
        this.Encrypt_Data.id=this.Table_User_Data[this.i].id;
    }
  }
}

getEventAug(){
  console.log('getEventAug(); this.Table_User_Data = ', this.Table_User_Data.length);
  this.Google_Object_Name="Event-27AUG2022.json";
   
  this.HTTP_Address=this.Google_Bucket_Access_Root + this.Google_Bucket_Name + "/o/" + this.Google_Object_Name   + "?alt=media" ;

  this.HTTP_AddressMetaData=this.Google_Bucket_Access_Root + this.Google_Bucket_Name + "/o/" + this.Google_Object_Name  + "?cacheContro=max-age=0, no-store, private"; 
  
          
          this.http.get(this.HTTP_Address, {'headers':this.myHeader} )
            .subscribe((data ) => {
              console.log('getEventAug() - data received');
              this.EventHTTPReceived=true;
              this.bucket_data=JSON.stringify(data);
              var obj = JSON.parse(this.bucket_data);
        
              for (this.i=0; this.i<obj.length; this.i++){
                  this.Individual_User_Data= new EventAug;
                  this.Table_User_Data.push(this.Individual_User_Data);
                  this.Table_User_Data[this.i] =obj[this.i];

                  this.Table_DecryptPSW.push(' ');

                  this.Crypto_Key=this.Table_User_Data[this.i].key;
                  this.Crypto_Method=this.Table_User_Data[this.i].method;
                  this.Encrypt=this.Table_User_Data[this.i].psw;
                  this.onCrypt("Decrypt");
                  this.Table_DecryptPSW[this.i]= this.Decrypt;
              }

              },
              error_handler => {
                this.EventHTTPReceived=true;
                console.log('getEventAug() - error handler');
                this.text_error='INIT - error message==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
              } 

        )
  }


getConfig(ObjectName:string){
  console.log('getConfig() of '+ObjectName);

  this.HTTP_Address=this.Google_Bucket_Access_Root +  "config-xmvit/o/" + ObjectName + "?alt=media" ;    
          this.http.get<XMVConfig>(this.HTTP_Address )
            .subscribe((data ) => {
              console.log('getConfig() - data received');
              this.ConfigXMV=data;
            },
              error_handler => {
                console.log('getConfig() - error handler');
                this.text_error='INIT - error message==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
              } 
        )
  }
FileType={TestProd:''};

getConfigAsset(){
    console.log('getConfigAsset()');
  /****
            this.http.get<any>('./assets/XMVConfigTestOrProd.json' )
              .subscribe((data ) => {
                console.log('getConfigAsset() - data received');
                this.FileType=data;
                this.getConfigXMV();
              },
                error_handler => {
                  console.log('getConfigAsset() - error handler');
                  this.text_error='INIT - error message==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
                } 
          )
    
     */
    if (environment.production === false){
      this.FileType.TestProd = 'Test';
    }
    else {
      this.FileType.TestProd='Prod';
    }
    this.getConfigXMV();
  }

  getConfigXMV(){
    console.log('getConfigXMV()');
    //this.Google_Object_Name="ConfigXMVTestProd.json";
   const HTTP_Address=this.Google_Bucket_Access_Root +  "config-xmvit/o/ConfigXMVTestProd.json?alt=media" ;    
            this.http.get<XMVTestProd>(HTTP_Address )
              .subscribe((data ) => {
                console.log('getConfigXMV() - data received');
                this.ConfigTestProd=data;
                if (this.FileType.TestProd==='Test'){
                    this.getConfig(this.ConfigTestProd.TestFile);
                } else {
                  this.getConfig(this.ConfigTestProd.ProdFile);
                }
              },
                error_handler => {
                  console.log('getConfigXMV() - error handler');
                  this.text_error='INIT - error message==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
                } 
          )
    }


GetUpdatedTable(event:any){
  this.Table_User_Data=event;
}

onClear(){
  this.myForm.reset({
    userId: '',
    password:''
  });
}

onCrypt(type_crypto:string){
    if (type_crypto==='Encrypt'){
            this.Encrypt=encrypt(this.Decrypt,this.Crypto_Key,this.Crypto_Method);
      } else { // event=Decrypt
            this.Decrypt=decrypt(this.Encrypt,this.Crypto_Key,this.Crypto_Method);
          } 
  }

//ngOnChanges(changes: SimpleChanges) {   
      //console.log('onChanges login.ts');
//  }


}