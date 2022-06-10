import { Component, Input, Output, EventEmitter, HostListener, OnChanges, SimpleChanges} from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { encrypt, decrypt} from '../EncryptDecryptServices';
import { EventAug } from '../JsonServerClass';

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

    @Input() identification={
      id: 0,
      key:0,
      method:'',
      UserId:'',
      psw:'',
      phone:''
    };


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
    Encrypt_Data:any={
      id: 0,
      key:0,
      method:'',
      UserId:'',
      psw:'',
      phone:'',
    }

    Table_User_Data:Array<EventAug>=[];
    Table_DecryptPSW:Array<string>=[];
    Individual_User_Data= new EventAug;
    bucket_data:string='';

    HTTP_Address:string='';
    Server_Name:string='Google'; // "Google" or "MyJson"
    Google_Bucket_Access_Root:string='https://storage.googleapis.com/storage/v1/b/';
    Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';
    //Google_Bucket_Name:string='my-db-json';
    Google_Bucket_Name:string='manage-login'; 
    Google_Object_Name:string='';
    Google_Object_Name_Extension:string='.json';
    Bucket_Info_Array:any={
      kind:'',
      items:[
      {
          kind: "",
          id: "", 
          selfLink: "", // link to the general info of the bucket/objectobject
          mediaLink: "", // link to get the content of the object
          name: "", // name of the object
          bucket: "", //name of the bucket
          generation: "", 
          metageneration: "",
          contentType: "", //application/json
          storageClass: "", //STANDARD
          size: "", // number of bytes
          md5Hash: "",
          crc32c: "",
          etag: "",
          timeCreated: "",
          updated: "",
          timeStorageClassUpdated: ""
        }]
      };
  
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
      //this.httpHeader.append('content-type', 'application/json');
      //this.httpHeader.append('Cache-Control', 'no-store, must-revalidate, private, max-age=0, no-transform');
      this.routing_code=0;
      this.getEventAug();

      // ================ TO BE DELETED AFTER TESTING
      // this.myForm.controls['password'].setValue("SIN!02#JUL");
      // this.myForm.controls['userId'].setValue("Event-02JUL2022");


      // ================ TO BE DELETED AFTER TESTING
      this.myForm.controls['password'].setValue("LIM!12monica#Chin");
      this.myForm.controls['userId'].setValue("XMVIT-Admin");
      

      if (this.identification.UserId!=='' && this.identification.psw!=='') {
       // go through login panel again to allow the change of user id if needed SIN!02#JUL
          this.myForm.controls['userId'].setValue(this.identification.UserId);
          this.Crypto_Key=this.identification.key;
          this.Crypto_Method=this.identification.method;
          this.Encrypt=this.identification.psw;
            
          this.onCrypt("Decrypt");
          this.myForm.controls['password'].setValue(this.Decrypt);
      } else {this.myForm.controls['action'].setValue("");}
    }

  GetObject(){
// ****** get content of object *******
      this.HTTP_Address=this.Google_Bucket_Access_Root + this.Google_Bucket_Name + "/o/" + this.Google_Object_Name   + "?alt=media"; 
      this.myHeader=new HttpHeaders({
        'content-type': 'application/json',
        'Cache-Control': 'no-store, must-revalidate, private, max-age=0, no-transform'
      });
      this.http.get(this.HTTP_Address, {'headers':this.myHeader} )
            .subscribe(data => {
            this.Encrypt_Data = data;

            this.Crypto_Key=this.Encrypt_Data.key;
            this.Crypto_Method=this.Encrypt_Data.method;
            this.Encrypt=this.Encrypt_Data.psw;
            
            this.onCrypt("Decrypt");
                
              if (this.Encrypt_Data.UserId===this.myForm.controls['userId'].value && this.Decrypt===this.myForm.controls['password'].value){
              // identification is correct

                this.my_output1.emit(this.Encrypt_Data);
                
                if (this.Encrypt_Data.UserId==='XMVIT-Admin' || this.Encrypt_Data.UserId==='xvanstaen@XMV' ) {
                  
                      if (this.myForm.controls['action'].value==='' || this.myForm.controls['action'].value===null){ 
                        this.routing_code=4;
                        // ************
                        // TO BE DELETED AFTER TESTING PERIOD
                        this.myForm.controls['action'].setValue("Event-27AUG2022");
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
              console.log(error_handler);
              //if (error_handler.error.substring(0, 14)==='No such object'){
              //  this.text_error='identification failed; retry';
              //} else {
                this.text_error='server failure; error code ==> ' + error_handler.status ;
              //}
              
                // alert(this.message  + ' -- http get = ' + this.HTTP_Address);
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
  this.Google_Object_Name = this.myForm.controls['userId'].value;

  if (this.Google_Object_Name==='')  {
    this.text_error=" provide your user id";
  }
  else
  if (this.myForm.controls['password'].value==='')  {
    this.text_error=" provide your password";
  }
  else
  {
    // check first if it's related to Event of 27Aug2022
    this.ValidateEventAug();
    if (this.text_error!== ''){
        // user id not found so go through through next validation step
        this.Google_Object_Name=this.Google_Object_Name+this.Google_Object_Name_Extension;
        this.text_error='';
        this.GetObject();
    } else {
      this.routing_code=3;
      this.Encrypt_Data.UserId=this.Table_User_Data[this.i].UserId;
      this.Encrypt_Data.id=this.Table_User_Data[this.i].id;
      this.Encrypt_Data.invitees=this.Table_User_Data[this.i].nbinvitees;
      this.Encrypt_Data.night=this.Table_User_Data[this.i].night;
      this.Encrypt_Data.brunch=this.Table_User_Data[this.i].brunch;
    }
  }
}

getEventAug(){

  this.Google_Object_Name="Event-27AUG2022.json";
   
  this.HTTP_Address=this.Google_Bucket_Access_Root + this.Google_Bucket_Name + "/o/" + this.Google_Object_Name   + "?alt=media"; 
  this.myHeader=new HttpHeaders({
    'content-type': 'application/json',
    'Cache-Control': 'private, max-age=0'
  });
  this.http.get(this.HTTP_Address, {'headers':this.myHeader} )
        .subscribe((data ) => {
             

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

ngOnChanges(changes: SimpleChanges) {   
      //console.log('onChanges login.ts');
  }


}