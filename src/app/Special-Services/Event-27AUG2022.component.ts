import { Component, OnInit , Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges, 
  AfterContentInit, HostListener, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ViewportScroller } from "@angular/common";
import { EventAug } from '../JsonServerClass';
import { encrypt, decrypt} from '../EncryptDecryptServices';

export class StructurePhotos{
  name:string='';
  mediaLink:string='';
  photo=new Image();
 }


@Component({
  selector: 'app-Event-27AUG2022',
  templateUrl: './Event-27AUG2022.component.html',
  styleUrls: ['./Event-27AUG2022.component.css']
})

export class Event27AugComponent {

  constructor(
    private router:Router,
    private http: HttpClient,
    private scroller: ViewportScroller,
    ) {}
  
    myHeader=new HttpHeaders();
    isDeleted:boolean=false;
    getScreenWidth: any;
    getScreenHeight: any;
    device_type:string='';
    yourLanguage:string='FR';
    @Input() LoginTable_User_Data:Array<EventAug>=[];
    @Input() LoginTable_DecryptPSW:Array<string>=[];
    @Input() identification={
      id: 0,
      key:0,
      method:'',
      UserId:'',
      psw:'',
      phone:'',
    };

    Total={
      brunch:0,
      practice:0,
      petanqueS:0,
      petanqueD:0,
      golfS9:0,
      golfS18:0,
      golfD9:0,
      golfD18:0
    }



    FrenchLabels=['Formulaire', 'Nombre de personnes','Plat principal','Bœuf', 'Poisson', "Reste la nuit à l'hotel", 'Oui', 'Non',
          "Si vous voulez jouer au golf merci d'indiquer",'jour','Samedi', 'Dimanche', 'nombre de joueurs', 'nombre de trous','trous',
          'Nos commentaires','Vos commentaires (i.e. restriction nourriture, autres)','Valider', 'Adresse',"Dîner"];
    EnglishLabels=['Form', 'Number of people','Main dish','Beef', 'Fish', 'Spend the night at the hotel', 'Yes', 'No',
          'If you want to play golf please indicate','day','Saturday', 'Sunday', 'number of people', 'number of holes','holes',
          'Our comments','Your feedback (e.g. food requirements, others)','Validate', 'Address',"Dinner"];
    LanguageLabels=['', '','','', '', '', 'Yes', 'No',
          'If you want to play golf please indicate','','Saturday', 'Sunday', 'number of people', 'number of holes','holes',
          '','Your feedback (e.g. food requirements, others)','Validate', 'Address',""];

    @Output() returnDATA= new EventEmitter<any>();


    pagePhotos:boolean=false;
    display_download:boolean=false;
    selected_photo:number=-1;
    thePhotos = new Image();
    WeddingPhotos:Array<StructurePhotos>=[];
    WeddingPhotosOutdoor:Array<StructurePhotos>=[];
    nb_total_page:number=0;
    nb_photo_per_page:number=10;
    nb_current_page:number=0;
    nb_current_photo:number=0;
    pages_to_display:Array<number>=[1,2,3,4,5,6,7,8,9,10]

    Admin_UserId:string="XMVIT-Admin";
    invite:boolean=true;
    total_invitee:number=0;
    total_rooms:number=0;
    resetAccess:boolean=false;

    myDate:string='';
    myTime=new Date();
    thetime:string='';

    MrName:string='';
    MrsName:string='';

    myForm = new FormGroup({
      userId: new FormControl(''),
      psw: new FormControl(''),
      firstname: new  FormControl(''),
      surname: new  FormControl(''),
      nbInvitees: new  FormControl(0),
      night: new  FormControl(''),
      brunch: new  FormControl(''),
      day: new  FormControl(''),
      golf: new  FormControl(0),
      golfHoles: new  FormControl(0),
      dishMr: new  FormControl(''),
      dishMrs: new  FormControl(''),
      practiceSaturday: new  FormControl(''),
      bouleSaturday: new  FormControl(''),
      bouleSunday: new  FormControl(''),
      readRecord: new  FormControl(0),
      myComment: new  FormControl(''),
      yourComment: new  FormControl(''),
      readAccess: new  FormControl(0),
      writeAccess: new  FormControl(0),
      
    });

    CommentStructure={
      dishMr:'B',
      dishMrs:'F',
      day:'',
      golf:0,
      holes:0,
      practiceSaturday:'y',
      bouleSaturday:'y',
      bouleSunday:'y',
      theComments:'',
      readAccess:0,
      writeAccess:0,
    }

    Encrypt:string='';
    Decrypt:string='';
    Crypto_Method:string='AES';
    Crypto_Error:string='';
    Crypto_Key:number=2;

    // ACCESS TO GOOGLE STORAGE
    Server_Name:string='Google'; // "Google" or "MyJson"
    Google_Bucket_Access_Root:string='https://storage.googleapis.com/storage/v1/b/';
    Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';
    //Google_Bucket_Name:string='my-db-json'; // if "MyJson"
    Google_Bucket_Name:string='manage-login'; 
    Google_Object_Name:string='';

    Bucket_Info_Array:any={
      kind:'storage#object',
      items:[
      {
          kind: "storage#object",
          id: "manage-login/Event-27AUG2022.json/1655279866897148", 
          selfLink: "https://www.googleapis.com/storage/v1/b/manage-login/o/Event-27AUG2022.json", // link to the general info of the bucket/objectobject
          mediaLink: "https://storage.googleapis.com/download/storage/v1/b/manage-login/o/Event-27AUG2022.json?generation=1655279866897148&alt=media", // link to get the content of the object
          name: "Event-27AUG2022.json", // name of the object
          bucket: "manage-login", //name of the bucket
          cacheControl:"max-age=0, private, no-store",
          generation: "1655279866897148", 
          metageneration: "1",
          contentType: "application/json", 
          storageClass: "STANDARD", 
          size: "", // number of bytes
          md5Hash: "qdWPGdgcYW4N0Wc2lodB0g==",
          crc32c: "oLhslw==",
          etag: "CPzF4YP+rvgCEAE=",
          timeCreated: "2022-06-15T07:57:46.909Z",
          updated: "",
          timeStorageClassUpdated: ""
      }
    ]
    
  };
  PostData:any={
    ObjectMetadata:{
      kind: "storage#object",
      id: "manage-login/Event-27AUG2022.json/1655279866897148", 
      selfLink: "https://www.googleapis.com/storage/v1/b/manage-login/o/Event-27AUG2022.json", // link to the general info of the bucket/objectobject
      mediaLink: "https://storage.googleapis.com/download/storage/v1/b/manage-login/o/Event-27AUG2022.json?generation=1655279866897148&alt=media", // link to get the content of the object
      name: "Event-27AUG2022.json", // name of the object
      bucket: "manage-login", //name of the bucket
      cacheControl:"max-age=0, private, no-store",
      generation: "1655279866897148", 
      metageneration: "1",
      contentType: "application/json", 
      storageClass: "STANDARD", 
      size: "", // number of bytes
      md5Hash: "qdWPGdgcYW4N0Wc2lodB0g==",
      crc32c: "oLhslw==",
      etag: "CPzF4YP+rvgCEAE=",
      timeCreated: "2022-06-15T07:57:46.909Z",
      updated: "",
      timeStorageClassUpdated: "",
    },
      User_Data:[],
    }

    myKeyUp:any;
    error_message:string='';
    HTTP_Address:string='';
    HTTP_AddressMetaData:string='';
    Error_Access_Server:string='';

    i:number=0;
    j:number=0;
    
    bucket_data:string='';
    Table_User_Data:Array<EventAug>=[];
    Table_DecryptPSW:Array<string>=[];
    Individual_User_Data= new EventAug;
    Retrieve_User_Data:Array<EventAug>=[];
    Tab_Record_Update:Array<Boolean>=[];
    message:string='';
    recordToUpdate:number=0;
    updateRecord:number=0;
    init:boolean=true;

@HostListener('window:resize', ['$event'])
onWindowResize() {
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
    }


  ngOnInit(){
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;

      this.myKeyUp='';
      this.myTime=new Date();
      this.myDate= this.myTime.toString().substring(8,24);
      this.thetime=this.myDate+this.myTime.getTime();
      // get all the records from the login component via the @input
      this.Table_User_Data = this.LoginTable_User_Data;
      this.Table_DecryptPSW= this.LoginTable_DecryptPSW;
      
      // by default language is French
      this.LanguageLabels=this.EnglishLabels;
      this.yourLanguage='UK';

      this.myHeader=new HttpHeaders({
        'content-type': 'application/json',
        'cache-control': 'private, max-age=0'
      });

      // Admin features which purpose is to list all the records and update any field
      if (this.identification.UserId===this.Admin_UserId) {
        // administrator is connected
        this.invite=false;

        this.Error_Access_Server='';    
        this.count_invitees('Y');

      } else {
        this.invite=true;
        for (this.i=0; this.i<this.Table_User_Data.length; this.i++){
          this.Tab_Record_Update.push(false);
          this.Tab_Record_Update[this.i]=false;
        }
          //this.manageInvitees(); // retrieve the object
          // a user is connected so must display his/her information
          this.myForm.controls['brunch'].setValue(this.Table_User_Data[this.identification.id].brunch);
          this.myForm.controls['night'].setValue(this.Table_User_Data[this.identification.id].night);
          this.Table_User_Data[this.identification.id].nbinvitees=Number(this.Table_User_Data[this.identification.id].nbinvitees);
          this.myForm.controls['nbInvitees'].setValue(this.Table_User_Data[this.identification.id].nbinvitees);
          if (this.Table_User_Data[this.identification.id].myComment === null){
            this.Table_User_Data[this.identification.id].myComment='';
          }
          this.myForm.controls['myComment'].setValue(this.Table_User_Data[this.identification.id].myComment);
            
          this.ConvertComment();
          this.CommentStructure.readAccess ++;
          this.Table_User_Data[this.identification.id].yourComment=JSON.stringify(this.CommentStructure);
          this.SaveRecord();

        }
        if (this.invite===false){
              this.scroller.scrollToAnchor('targetTOP');
          }
        // this.patchMetaData();
        this.getListPhotos('xavier-monica-mariage', this.WeddingPhotos, 0);
        // this.getListPhotos('xavier-monica-mariage-outdoor', this.WeddingPhotos, this.WeddingPhotos.length);
  }    

  goDown(event:string){
    this.pagePhotos=false;
    if (event==='FR'){
      this.yourLanguage='FR';
      this.LanguageLabels=this.FrenchLabels;
    } if (event==='UK'){
      this.yourLanguage='UK';
      this.LanguageLabels=this.EnglishLabels;
    } else {
    this.scroller.scrollToAnchor(event);
    }
  }


  patchMetaData(){
   
    // NOT USED
    
    // ****** get content of object *******
    this.Google_Object_Name="Event-27AUG2022.json";
    this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name +  "/o?name="  + this.Google_Object_Name +'TEST' ; 
    this.HTTP_AddressMetaData=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" + this.Google_Object_Name  +  'TEST&uploadType=metadata' + "?cacheControl='max-age=0, no-store'";
    this.PostData.User_Data=this.Table_User_Data;
    
    this.http.post(this.HTTP_Address, this.Table_User_Data, {params: {'cacheControl':'max-age=0, no-store, private'}} )
          .subscribe((data ) => {
               
               console.log('patch metadata: ',data);

                },
                error_handler => {
                  this.Error_Access_Server='error message==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
                } 
          )
    }
  
clear(){
    this.myForm.reset({
      userId: '',
      psw:'',
      firstname:'',
      surname:'',
      readRecord:0
    });
  }

ResetAccess(){
  this.resetAccess=true;
  this.myForm.controls['readAccess'].setValue(0);
  this.myForm.controls['writeAccess'].setValue(0);
}

 ConfirmData(){
      const i=this.identification.id;

      // always update the record 
      this.Table_User_Data[i].nbinvitees=Number(this.myForm.controls['nbInvitees'].value);
      this.Table_User_Data[i].night=this.myForm.controls['night'].value;
      this.Table_User_Data[i].brunch=this.myForm.controls['brunch'].value;

      this.CommentStructure.dishMr=this.myForm.controls['dishMr'].value;
      this.CommentStructure.dishMrs=this.myForm.controls['dishMrs'].value;
      this.CommentStructure.golf=Number(this.myForm.controls['golf'].value);
      if (this.myForm.controls['golf'].value===0){
          this.myForm.controls['golfHoles'].setValue(0);
          this.myForm.controls['day'].setValue('');
      } 
      this.CommentStructure.holes=Number(this.myForm.controls['golfHoles'].value);
      this.CommentStructure.day=this.myForm.controls['day'].value;
      
      this.CommentStructure.theComments=this.myForm.controls['yourComment'].value;
      this.CommentStructure.practiceSaturday=this.myForm.controls['practiceSaturday'].value;
      this.CommentStructure.bouleSaturday=this.myForm.controls['bouleSaturday'].value;
      this.CommentStructure.bouleSunday=this.myForm.controls['bouleSunday'].value;

      this.CommentStructure.writeAccess ++;
      this.Table_User_Data[i].yourComment=JSON.stringify(this.CommentStructure);
      this.updateRecord=1;
      this.init=false;
      this.SaveRecord();
  }

  ValidateRecord(){
          if (this.recordToUpdate!==0){
            this.i=this.recordToUpdate;
            this.recordToUpdate=0;
          } else 
          {
                for (this.i=0; this.i<this.Table_User_Data.length && this.Table_User_Data[this.i].UserId!=='' && (
                    this.Table_User_Data[this.i].surname!==this.myForm.controls['surname'].value ||
                    this.Table_User_Data[this.i].firstname!==this.myForm.controls['firstname'].value)
                    ; this.i++ ){
                  
                }
                if (this.i>this.Table_User_Data.length-1) {     
                  this.Individual_User_Data= new EventAug;
                  this.Table_User_Data.push(this.Individual_User_Data);

                  this.i=this.Table_User_Data.length-1;
                  this.Table_User_Data[this.i]=this.Table_User_Data[0];
                  this.identification.id=this.i;
                } 
              }
          this.Table_User_Data[this.i].UserId=this.myForm.controls['userId'].value;
          this.Table_User_Data[this.i].firstname= this.myForm.controls['firstname'].value;
          this.Table_User_Data[this.i].surname=this.myForm.controls['surname'].value;
          this.Table_User_Data[this.i].nbinvitees=Number(this.myForm.controls['nbInvitees'].value);
          this.Table_User_Data[this.i].brunch=this.myForm.controls['brunch'].value;
          this.Table_User_Data[this.i].night=this.myForm.controls['night'].value;
          this.Table_User_Data[this.i].myComment=this.myForm.controls['myComment'].value;
          this.CommentStructure.dishMr=this.myForm.controls['dishMr'].value;
          this.CommentStructure.dishMrs=this.myForm.controls['dishMrs'].value;
          if (this.myForm.controls['golf'].value===0){
            this.myForm.controls['golfHoles'].setValue(0);
            this.myForm.controls['day'].setValue('');
          }
          this.CommentStructure.practiceSaturday=this.myForm.controls['practiceSaturday'].value;
          this.CommentStructure.bouleSaturday=this.myForm.controls['bouleSaturday'].value;
          this.CommentStructure.bouleSunday=this.myForm.controls['bouleSunday'].value;
          this.CommentStructure.golf=Number(this.myForm.controls['golf'].value);
          this.CommentStructure.holes=Number(this.myForm.controls['golfHoles'].value);
          this.CommentStructure.day=this.myForm.controls['day'].value;
          this.CommentStructure.theComments=this.myForm.controls['yourComment'].value;
          if (this.resetAccess===true) {
            this.CommentStructure.writeAccess=0;
            this.CommentStructure.readAccess=0;
            this.myForm.controls['readAccess'].setValue(0);
            this.myForm.controls['writeAccess'].setValue(0);
            this.resetAccess=false;
          }
          this.Table_User_Data[this.i].yourComment=JSON.stringify(this.CommentStructure);

          this.Table_User_Data[this.i].id=this.i;
          this.Table_User_Data[this.i].key=2;
          this.Table_User_Data[this.i].method='AES';
          this.Table_DecryptPSW[this.i]=this.myForm.controls['psw'].value;
          this.Crypto_Key=this.Table_User_Data[this.i].key;
          this.Crypto_Method=this.Table_User_Data[this.i].method;
          this.Decrypt=this.Table_DecryptPSW[this.i];
          this.onCrypt("Encrypt");
          this.Table_User_Data[this.i].psw= this.Encrypt;

          this.Individual_User_Data=this.Table_User_Data[this.i];
          this.Tab_Record_Update[this.i]=true;
          this.count_invitees('N')
  }  

ReadRecord(){

  if (this.myForm.controls['readRecord'].value<=this.Table_User_Data.length){
    // read the item
        this.i=this.myForm.controls['readRecord'].value;
        this.identification.id=this.i;
        this.myForm.controls['userId'].setValue(this.Table_User_Data[this.i].UserId);
        this.myForm.controls['firstname'].setValue(this.Table_User_Data[this.i].firstname);
        this.myForm.controls['surname'].setValue(this.Table_User_Data[this.i].surname);
        this.Table_User_Data[this.i].nbinvitees=Number(this.Table_User_Data[this.i].nbinvitees);
        this.myForm.controls['nbInvitees'].setValue(this.Table_User_Data[this.i].nbinvitees);
        this.myForm.controls['brunch'].setValue(this.Table_User_Data[this.i].brunch);
        this.myForm.controls['night'].setValue(this.Table_User_Data[this.i].night);
        this.myForm.controls['psw'].setValue(this.Table_DecryptPSW[this.i]);

        this.ConvertComment();

        this.myForm.controls['readRecord'].setValue(0);
        if (this.resetAccess===true) {
          this.CommentStructure.writeAccess=0;
          this.CommentStructure.readAccess=0;
          this.myForm.controls['readAccess'].setValue(0);
          this.myForm.controls['writeAccess'].setValue(0);
          this.resetAccess=false;
        }
  } else { this.error_message='wrong record to access';}
}


count_invitees(ConvertComment:string){
  this.total_invitee = 0;
  this. total_rooms = 0;
  this.Total.brunch=0;
  this.Total.practice=0;
  this.Total.petanqueS=0;
  this.Total.petanqueD=0;
  this.Total.golfS9=0;
  this.Total.golfS18=0;
  this.Total.golfD9=0;
  this.Total.golfD18=0;
  //this.Table_User_Data[0].nbinvitees=0;
  //this.Table_User_Data[0].id=0;
  //this.Table_User_Data[0].night="n";
  //this.Table_User_Data[0].brunch="n";
  //this.Table_User_Data[0].UserId="master";

  for (this.i=1; this.i<this.Table_User_Data.length; this.i ++){
//if (this.Table_User_Data[this.i].night===""){
//  this.Table_User_Data[this.i].night="n";
//}
//if (this.Table_User_Data[this.i].brunch===""){
//  this.Table_User_Data[this.i].brunch="n";
//}
    this.total_invitee = this.total_invitee + Number(this.Table_User_Data[this.i].nbinvitees);
    if (this.Table_User_Data[this.i].night==='y'){
      this.total_rooms = this.total_rooms+Number(this.Table_User_Data[this.i].nbinvitees);
    }
    if (this.Table_User_Data[this.i].brunch==='y'){
      this.Total.brunch=this.Total.brunch+ Number(this.Table_User_Data[this.i].nbinvitees);
    }

    if (ConvertComment==='Y'){
        this.identification.id=this.i;
        this.ConvertComment();
        this.Table_User_Data[this.i].yourComment=JSON.stringify(this.CommentStructure);
        if (this.CommentStructure.practiceSaturday==='y'){
            this.Total.practice=this.Total.practice+ Number(this.Table_User_Data[this.i].nbinvitees);
          }
        if (this.CommentStructure.bouleSaturday==='y'){
            this.Total.petanqueS=this.Total.petanqueS+ Number(this.Table_User_Data[this.i].nbinvitees);
          }
        if (this.CommentStructure.bouleSunday==='y'){
            this.Total.petanqueD=this.Total.petanqueD+ Number(this.Table_User_Data[this.i].nbinvitees);
          }
        if (this.CommentStructure.golf!==0){
          if (this.CommentStructure.holes===9){
            if (this.CommentStructure.day==='Sat'){
                this.Total.golfS9=this.Total.golfS9+ this.CommentStructure.golf;
            }
            else if (this.CommentStructure.day==='Sun'){
              this.Total.golfD9=this.Total.golfD9+ this.CommentStructure.golf;
            }
          }
          else if (this.CommentStructure.holes===18){
            if (this.CommentStructure.day==='Sat'){
              this.Total.golfS18=this.Total.golfS18+ this.CommentStructure.golf;
            }
            else if (this.CommentStructure.day==='Sun'){
              this.Total.golfD18=this.Total.golfD18+ this.CommentStructure.golf;
            }
          }
        }

    }
  }
  this. total_rooms = this. total_rooms/2;
}

ConvertComment(){

  if (this.Table_User_Data[this.identification.id].timeStamp===undefined){
    this.Table_User_Data[this.identification.id].timeStamp= this.thetime;
  }
  this.CommentStructure=JSON.parse(this.Table_User_Data[this.identification.id].yourComment);

  if (this.CommentStructure.dishMr==='M'){
    this.CommentStructure.dishMr='B';
  }
  this.myForm.controls['dishMr'].setValue(this.CommentStructure.dishMr);
  if (this.CommentStructure.dishMrs===null){
    this.CommentStructure.dishMrs='F';
  }
  this.myForm.controls['dishMrs'].setValue(this.CommentStructure.dishMrs);
  this.CommentStructure.golf=Number(this.CommentStructure.golf);
  this.CommentStructure.holes=Number(this.CommentStructure.holes);
  if (this.CommentStructure.golf===0){
    this.CommentStructure.holes=0;
    this.CommentStructure.day='';
  }
  this.myForm.controls['golf'].setValue(Number(this.CommentStructure.golf));
  this.myForm.controls['golfHoles'].setValue(Number(this.CommentStructure.holes));
  this.myForm.controls['yourComment'].setValue(this.CommentStructure.theComments);
  this.myForm.controls['day'].setValue(this.CommentStructure.day);
  if (this.CommentStructure.practiceSaturday===undefined){
    this.CommentStructure.practiceSaturday='n';
    this.CommentStructure.bouleSaturday='n';
    this.CommentStructure.bouleSunday='n';
  } 
  if (this.CommentStructure.readAccess===undefined){
    this.CommentStructure.readAccess=0;
  }
  this.myForm.controls['readAccess'].setValue(this.CommentStructure.readAccess);
  if (this.CommentStructure.writeAccess===undefined){
    this.CommentStructure.writeAccess=0;
  }

  this.myForm.controls['writeAccess'].setValue(this.CommentStructure.writeAccess);

  this.myForm.controls['practiceSaturday'].setValue(this.CommentStructure.practiceSaturday);
  this.myForm.controls['bouleSaturday'].setValue(this.CommentStructure.bouleSaturday);
  this.myForm.controls['bouleSunday'].setValue(this.CommentStructure.bouleSunday);

  const i=this.Table_User_Data[this.identification.id].firstname.indexOf('&');
  if (i>1){
        this.MrName=this.Table_User_Data[this.identification.id].firstname.substring(0,i-1);
        this.MrsName=this.Table_User_Data[this.identification.id].firstname.substring(i+1,this.Table_User_Data[this.identification.id].firstname.length);
  } else{
      this.MrName=this.Table_User_Data[this.identification.id].firstname
      if (this.yourLanguage==='FR'){
          this.MrsName='Madame';
        } else{
            this.MrsName='Mrs'
          }
  }
}

  keyupFunction(event:any){ // TO BE TESTED
      this.myKeyUp=event.target.value;
  }

  ClickInvitees(event:any){
    const i = event;
    this.Table_User_Data[this.identification.id].nbinvitees=Number(event.target.value);
  }


  SaveRecord(){
    this.Google_Object_Name="Event-27AUG2022.json";
    // read record
    // if time stamp still is the same then can update the record
    // otherwise check when each item was updated
    // ***********
    this.myTime=new Date();
    this.myDate= this.myTime.toString().substring(8,24);
    this.thetime=this.myDate+this.myTime.getTime();
    // ***********
   
    // save individual record in case reconciliation is needed
    if (this.invite===true && this.init===false){
      this.HTTP_AddressMetaData=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" + this.Table_User_Data[this.identification.id].UserId  +  "?cacheControl=max-age=0, no-store, private";
      this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" + this.Table_User_Data[this.identification.id].UserId ;
      this.http.post(this.HTTP_Address,  this.Table_User_Data[this.identification.id] , {'headers':this.myHeader} )
      .subscribe(res => {
           console.log('Individual Record is updated: ', this.Table_User_Data[this.identification.id].UserId );

            },
            error_handler => {
              console.log('Individual Record is not updated: ', this.Table_User_Data[this.identification.id].UserId );

            } 
          )
    }

      // ****** get content of object *******
    
      this.HTTP_Address=this.Google_Bucket_Access_Root + this.Google_Bucket_Name + "/o/" + this.Google_Object_Name   + "?alt=media";     

      this.http.get(this.HTTP_Address, {'headers':this.myHeader} )
                  .subscribe(data => {
                  this.bucket_data=JSON.stringify(data);
                  var obj = JSON.parse(this.bucket_data);
                  this.Error_Access_Server='';
                 // if (this.isDeleted===true){ // temporary
                 //       this.isDeleted=false;
                 // }
                 // else{
                  if (this.invite===false){
                      // To be tested
                      this.i=0;
                      for (this.j=1; this.j<obj.length; this.j++){
                        if (this.i<this.Table_User_Data.length-1){
                          if (obj.length!==this.Table_User_Data.length ){ 
                            this.i++
                            while (obj[this.j].UserId !== this.Table_User_Data[this.i].UserId &&  this.j<obj.length){
                              this.j++
                            }
                            
                          }
                          else {
                            this.i=this.j;
                          }
                          if (this.j<obj.length && obj[this.j].timeStamp!== undefined && obj[this.j].timeStamp!== this.Table_User_Data[this.i].timeStamp ){

                            this.Error_Access_Server= 'record ' +this.j+ ' has been updated by another user; redo your updates'
                            this.Table_User_Data[this.i].timeStamp=obj[this.j].timeStamp;
                            this.AccessRecord(this.j);
                            // stop the process
                            this.j=obj.length;
                          }
                        }
                      }
                    }
                  else {
                    // check only one record
                    if (obj[this.identification.id].timeStamp!== undefined && obj[this.identification.id].timeStamp!== this.Table_User_Data[this.identification.id].timeStamp ){
                      this.Table_User_Data[this.i].timeStamp=obj[this.i].timeStamp;
                      this.AccessRecord(this.i);
                      this.Error_Access_Server= 'record ' +this.i+ 'has been updated by another user; redo your updates'   
                    }
                  }
                  // }
                  if (this.Error_Access_Server===''){
                        this.resetAccess=false;
                        if (this.invite===false){
                              for (this.i=0; this.i<this.Tab_Record_Update.length; this.i++){
                                if (this.Tab_Record_Update[this.i]===true){
                                      this.Table_User_Data[this.i].timeStamp=this.thetime;
                                }
                              }
                        } 
                        else{
                          this.Table_User_Data[this.identification.id].timeStamp=this.thetime;
                        }

                        this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" + this.Google_Object_Name   + '&uploadType=media';
                        this.HTTP_AddressMetaData=this.Google_Bucket_Access_Root + this.Google_Bucket_Name + "/o?name=" + this.Google_Object_Name  + '&uploadType=media' +  "?cache-control=max-age=0, no-store, private";    
                        this.http.post(this.HTTP_Address,  this.Table_User_Data , {'headers':this.myHeader} )
                        .subscribe(res => {
                              this.returnDATA.emit(this.Table_User_Data);
                              this.message='Record is updated / Mise à jour réussie'

                              },
                              error_handler => {
                                this.Error_Access_Server= "  object ===>   " + JSON.stringify( this.Table_User_Data)  + '   error message: ' + error_handler.message + ' error status: '+ error_handler.statusText+' name: '+ error_handler.name + ' url: '+ error_handler.url;
                                // alert(this.Error_Access_Server_Post + ' --- ' +  this.Sent_Message + ' -- http post = ' + this.HTTP_AddressPOST);
                              } 
                        )
                      }
              })
  }


  onCrypt(type_crypto:string){
    if (type_crypto==='Encrypt'){
            this.Encrypt=encrypt(this.Decrypt,this.Crypto_Key,this.Crypto_Method);
      } else { // event=Decrypt
            this.Decrypt=decrypt(this.Encrypt,this.Crypto_Key,this.Crypto_Method);
          } 
  }

  updateAllRecords(){
    this.SaveRecord();
    this.clear();
  }

  AccessRecord(id:number){
    this.myForm.controls['readRecord'].setValue(id);
    this.ReadRecord();
    this.scroller.scrollToAnchor('targetInvitees');
  }

  DeleteRecords(){
    if (this.identification.id!==0){
      this.Table_User_Data.splice(this.identification.id,1);
      this.Table_DecryptPSW.splice(this.identification.id,1);
      for (this.i=this.identification.id; this.i< this.Table_User_Data.length; this.i++){
        this.Table_User_Data[this.i].id--;
      }
      this.count_invitees('N');
      this.isDeleted=true;
      this.identification.id=0;
      this.clear();
    }
  }

displayPhotos(){
  this.pagePhotos=true;
  this.display_download=false;
  this.selected_photo=-1;
  //for (this.i=0; this.i< this.WeddingPhotos.length-1; this.i++ ){
   // this.getPhoto(this.WeddingPhotos[this.i].mediaLink, this.WeddingPhotos[this.i].photo);
  //}
}

next_prev_page(event:any){
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
}

display_page(page_nb:number){
  this.nb_current_page=page_nb-1;
  this.next_prev_page('next');
}

getPhoto(http_address:string, thePhoto:any){

  this.http.get(http_address )
  .subscribe(data => {
    thePhoto=data;
  })
}

  getListPhotos(BucketPhotos:string, WeddingPhotos:Array<StructurePhotos>, i_array:number){
    // get list of objects in bucket
    
    const HTTP_Address='https://storage.googleapis.com/storage/v1/b/' + BucketPhotos + "/o";
    this.http.get<any>(HTTP_Address )
          .subscribe(data => {

                console.log('BucketPhotos ',BucketPhotos)
                console.log(data);
                this.Bucket_Info_Array=data;
                
                for (this.i=0; this.i<this.Bucket_Info_Array.items.length-1; this.i++ ){
                        const pushPhotos=new StructurePhotos;
                        WeddingPhotos.push(pushPhotos);
                        WeddingPhotos[i_array].name=this.Bucket_Info_Array.items[this.i].name;
                        WeddingPhotos[i_array].mediaLink=this.Bucket_Info_Array.items[this.i].mediaLink;
                        i_array++
                }
                this.nb_total_page = Math.floor(this.WeddingPhotos.length / this.nb_photo_per_page);
                if (this.WeddingPhotos.length % this.nb_photo_per_page){
                  this.nb_total_page++
                }
                this.nb_current_page = 1;
                this.nb_current_photo = 0;

              },   
              error_handler => {
                this.Error_Access_Server='error message==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
                  // alert(this.message  + ' -- http get = ' + this.HTTP_Address);
                } 
          )
  

  }

onZoomPhoto(event:any){
    this.display_download=true;
    this.selected_photo=event;
}

onSaveFile(event:any): void {
    this.selected_photo=-1;
    this.display_download=false;
    const link = document.createElement("a");
    //link.href = URL.createObjectURL(file);
    link.href=event.mediaLink;
    link.download = event.name; // filename
    link.click();
    link.remove(); 
  }



}