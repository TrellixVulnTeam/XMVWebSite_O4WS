import { Component, OnInit , Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges, 
  AfterContentInit, HostListener, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ViewportScroller } from "@angular/common";
import { EventAug } from '../JsonServerClass';
import { encrypt, decrypt} from '../EncryptDecryptServices';
import {Bucket_List_Info} from '../JsonServerClass';
import { StructurePhotos } from '../JsonServerClass';

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
  
    PhotoNbForm: FormGroup = new FormGroup({ 
      SelectNb: new FormControl(),
      Width: new FormControl(),
      Height: new FormControl(),
    });

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

    myLogConsole:boolean=false;
    myConsole:Array<string>=[];
    SaveConsoleFinished:boolean=true;

    pagePhotos:boolean=false;

    WeddingPhotos:Array<StructurePhotos>=[];

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
   
    bucket_wedding_name:string='';
    bucket_list_returned:Array<string>=[];
    array_i_loop:Array<number>=[];
    buckets_all_processed:boolean=false;

    i_loop:number=0;
    j_loop:number=0;
    max_i_loop:number=20000;
    max_j_loop:number=20000;
    id_Animation:number=0;
    i:number=0;
    j:number=0;
    i_Bucket:number=0;
    Max_Nb_Bucket_Wedding:number=6;

    Bucket_Info_Array:Array<Bucket_List_Info>=[];
    ref_Bucket_List_Info=new Bucket_List_Info;

  // for patchData() which is not used indeed
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
      this.LogMsgConsole('Device ' + navigator.userAgent + ' ngOnInit() Event27AUG')
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
        if (this.identification.UserId!=='XMVanstaen'){

            if (this.identification.UserId==='AFGazikian'){this.myLogConsole=true;}

            for (this.i_Bucket=1; this.i_Bucket<=this.Max_Nb_Bucket_Wedding; this.i_Bucket++){
              this.ref_Bucket_List_Info=new Bucket_List_Info;
              this.Bucket_Info_Array.push(this.ref_Bucket_List_Info);
              const bucket_str_nb=this.i_Bucket-1;
              if (this.i_Bucket<10){
                  this.bucket_wedding_name='xavier-monica-mariage-0'+bucket_str_nb.toString();
              } else { 
                  this.bucket_wedding_name='xavier-monica-mariage-'+bucket_str_nb.toString()
                };
              this.bucket_list_returned.push('0');
              this.bucket_list_returned[this.i_Bucket-1]='0';
              this.array_i_loop.push(0);
              this.array_i_loop[this.i_Bucket-1]=0;
              this.getListPhotos(this.bucket_wedding_name, this.i_Bucket); 
            }
          } else {
              this.myLogConsole=true;
              this.i_Bucket=1;
              this.ref_Bucket_List_Info=new Bucket_List_Info;
              this.Bucket_Info_Array.push(this.ref_Bucket_List_Info);
              this.bucket_wedding_name='xavier-monica-mariage-04';
              this.bucket_list_returned.push('0');
              this.bucket_list_returned[this.i_Bucket-1]='0';
              this.array_i_loop.push(0);
              this.array_i_loop[this.i_Bucket-1]=0;
              this.getListPhotos(this.bucket_wedding_name, this.i_Bucket);
              this.Max_Nb_Bucket_Wedding=1;
          }
        // want to be sure that all buckets have been accessed
        this.i_Bucket=1;
        this.LogMsgConsole('before calling access_all_buckets() '+this.buckets_all_processed);
        this.access_all_buckets();
  }    


  access_all_buckets(){

    if (this.array_i_loop[this.i_Bucket-1]%20===0){
      this.LogMsgConsole('access bucket '+this.bucket_wedding_name + ' i_Bucket='+ this.i_Bucket+ ' + i_loop=' + this.array_i_loop[this.i_Bucket-1]+ '  bucket_list_returned'+ this.bucket_list_returned[this.i_Bucket-1]);
    }
    this.id_Animation=window.requestAnimationFrame(() => this. access_all_buckets());
    this.array_i_loop[this.i_Bucket-1]++;
    // check how to manage error_server
    if (this.array_i_loop[this.i_Bucket-1]>this.max_i_loop || this.bucket_list_returned[this.i_Bucket-1]==='1'){
       
      this.LogMsgConsole('===== bucket# '+ this.i_Bucket+ 'processed; this.i_loop='+ this.array_i_loop[this.i_Bucket-1]+ 'length global table='+ 
                  this.WeddingPhotos.length+ 'length specific table='+ this.Bucket_Info_Array[this.i_Bucket-1].items.length);
        this.i_Bucket++
        this.LogMsgConsole('===== bucket - process next bucket which is '+ this.i_Bucket);
        if (this.i_Bucket===this.Max_Nb_Bucket_Wedding+1){
            
          this.LogMsgConsole('===== bucket - all buckets processed; fill-in now WeddimgPhotos ');
            this.j=-1;
            for (this.i_Bucket=1; this.i_Bucket<=this.Max_Nb_Bucket_Wedding; this.i_Bucket++){
        
                for (this.i=0; this.i<this.Bucket_Info_Array[this.i_Bucket-1].items.length; this.i++ ){
                        this.j++
                        const pushPhotos=new StructurePhotos;
                        this.WeddingPhotos.push(pushPhotos);
                        this.WeddingPhotos[this.j].name=this.Bucket_Info_Array[this.i_Bucket-1].items[this.i].name;
                        /*
                        if (this.i_Bucket===1){
                          this.WeddingPhotos[this.j].photo.src=this.WeddingPhotos[this.j].mediaLink;
                          this.WeddingPhotos[this.j].mediaLink='./assets/Marriage/'+this.WeddingPhotos[this.j].name;
                          this.WeddingPhotos[this.j].selfLink=this.WeddingPhotos[this.j].mediaLink;
                        } else {
                        */
                            this.WeddingPhotos[this.j].mediaLink=this.Bucket_Info_Array[this.i_Bucket-1].items[this.i].mediaLink;
                            this.WeddingPhotos[this.j].selfLink=this.Bucket_Info_Array[this.i_Bucket-1].items[this.i].selfLink;
                            this.WeddingPhotos[this.j].photo.src=this.Bucket_Info_Array[this.i_Bucket-1].items[this.i].mediaLink;
                         /* } */
                        if (this.Bucket_Info_Array[this.i_Bucket-1].items[this.i].name.indexOf('Vertical')!==-1){
                          this.WeddingPhotos[this.j].vertical=true;
                        }
                        else{
                          this.WeddingPhotos[this.j].vertical=false;
                        }
                }
                
            }
            this.buckets_all_processed=true;
            this.LogMsgConsole('this.buckets_all_processed'+ this.buckets_all_processed);
            window.cancelAnimationFrame(this.id_Animation);
          }
    }
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
  this.LogMsgConsole('ReadRecord()');
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
      this.LogMsgConsole('SaveRecord(), update individual object '+ this.Table_User_Data[this.identification.id].UserId);
      this.http.post(this.HTTP_Address,  this.Table_User_Data[this.identification.id] , {'headers':this.myHeader} )
      .subscribe(res => {
        this.LogMsgConsole('Individual Record is updated: '+ this.Table_User_Data[this.identification.id].UserId );

            },
            error_handler => {
              this.LogMsgConsole('Individual Record is not updated: '+ this.Table_User_Data[this.identification.id].UserId );

            } 
          )
    }

      // ****** get content of object *******
    
      this.HTTP_Address=this.Google_Bucket_Access_Root + this.Google_Bucket_Name + "/o/" + this.Google_Object_Name   + "?alt=media";     
      this.LogMsgConsole('SaveRecord(), read object '+ this.Google_Object_Name );
      this.http.get(this.HTTP_Address, {'headers':this.myHeader} )
                  .subscribe(data => {
                  this.bucket_data=JSON.stringify(data);
                  var obj = JSON.parse(this.bucket_data);
                  this.Error_Access_Server='';
                  this.LogMsgConsole('SaveRecord(),  data received for object '+ this.Google_Object_Name );

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
                        this.message='record to be saved';
                        this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" + this.Google_Object_Name   + '&uploadType=media';
                        this.HTTP_AddressMetaData=this.Google_Bucket_Access_Root + this.Google_Bucket_Name + "/o?name=" + this.Google_Object_Name  + '&uploadType=media' +  "?cache-control=max-age=0, no-store, private";    
                        this.LogMsgConsole('SaveRecord() - object Event-27AUG2022 to be saved');
                        this.http.post(this.HTTP_Address,  this.Table_User_Data , {'headers':this.myHeader} )
                        .subscribe(res => {
                              this.returnDATA.emit(this.Table_User_Data);
                              this.message='Record is updated / Mise à jour réussie';
                              this.LogMsgConsole('SaveRecord() ; data received ');

                              },
                              error_handler => {
                                this.message='error to save save record';
                                this.LogMsgConsole('SaveRecord() ; data not received - error');
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
    this.LogMsgConsole('AccessRecord(id:number)');
    this.message='';
    this.myForm.controls['readRecord'].setValue(id);
    this.ReadRecord();
    this.scroller.scrollToAnchor('targetInvitees');
  }

  DeleteRecords(){

    this.message='';
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

displayWedPhotos(){
  this.LogMsgConsole('displayWedPhotos() in Event-27Aug');
  const pas=20;
  this.pagePhotos=true;
  /***
  for (this.i=0; this.i<this.Max_Nb_Bucket_Wedding; this.i++){
    console.log('displayWedPhotos() in Event-27Aug ', 'this.bucket_list_returned of ', this.i, ' is ' + this.bucket_list_returned[this.i]);
    for (this.j=0; this.j<this.max_j_loop && this.bucket_list_returned[this.i]==='0'; this.j++){
        // waiting for all buckets content to be received
        if (this.j%pas === 0){
          console.log('displayWedPhotos() in Event-27Aug ==> loop=', this.j, 'this.bucket_list_returned of ', this.i, ' is ' + this.bucket_list_returned[this.i]);
        }
    }
  }
   */
}


  getListPhotos(BucketPhotos:string, bucket_nb:number){
    // get list of objects in bucket
    this.LogMsgConsole('getListPhotos() from '+BucketPhotos+'  nb='+bucket_nb);
    this.bucket_list_returned[bucket_nb-1]='0';
    const HTTP_Address='https://storage.googleapis.com/storage/v1/b/' + BucketPhotos + "/o";
    this.http.get<any>(HTTP_Address )
          .subscribe(data => {
                this.bucket_list_returned[bucket_nb-1]='1';
                this.LogMsgConsole('getListPhotos() - received data from BucketPhotos '+BucketPhotos);
                this.LogMsgConsole(data);
                this.Bucket_Info_Array[bucket_nb-1]=data;
                this.LogMsgConsole('getListPhotos() - Bucket_Info_Array.items.length =  '+this.Bucket_Info_Array[bucket_nb-1].items.length);
              },   
              error_handler => {
                this.Error_Access_Server='getListPhoto : error message==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
                  alert(this.message  + ' -- http get = ' + this.HTTP_Address);
                  this.bucket_list_returned[bucket_nb-1]='402';
                } 
          )
  

  }


  LogMsgConsole(msg:string){
    console.log(msg);
    this.myTime=new Date();
    this.myDate= this.myTime.toString().substring(8,24);
    this.thetime=this.myTime.getTime().toString();
    let i = 0;
    if (this.myLogConsole===true){
            this.myConsole.push('');
            i = this.myConsole.length;
            this.myConsole[i-1]='<==> '+this.thetime.substr(0,16) + ' ' +msg;
  
    }
    if (i>80 && this.SaveConsoleFinished===true){
      this.saveLogConsole(this.myConsole, 'Event27AUG');
    }
       
  
  }
  
  saveLogConsole(LogConsole:any, type:string){
  
    this.myTime=new Date();
    this.myDate= this.myTime.toString().substring(8,24);
    this.thetime=this.myTime.getTime().toString();
    const consoleLength=LogConsole.length;
    this.SaveConsoleFinished=false;
    // this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" + this.Google_Object_Name   + '&uploadType=media';
    this.HTTP_Address=this.Google_Bucket_Access_RootPOST +  "logconsole/o?name="  + this.thetime.substr(0,16)+ type + '.json&uploadType=media';
  
    this.http.post(this.HTTP_Address, LogConsole)
      .subscribe(res => {
              this.SaveConsoleFinished=true;
              if (LogConsole.length===consoleLength){
                LogConsole.splice(0,LogConsole.length);
                }
              else {
                for (let i=consoleLength; i>0; i--){
                  LogConsole.splice(i-1,1);
                }
              }
              LogConsole.push('');
              this.myConsole[LogConsole.length-1]='Log Console ' + type + ' has been deleted at '+this.myDate+'  ' +this.thetime;
            },
            error_handler => {
              console.log('Log record failed for ' + type + this.Google_Object_Name + '  error handller is ' + error_handler);
              // this.Error_Access_Server= "  object ===>   " + JSON.stringify( this.Table_User_Data)  + '   error message: ' + error_handler.message + ' error status: '+ error_handler.statusText+' name: '+ error_handler.name + ' url: '+ error_handler.url;
              // alert( 'Log record failed -- http post = ' + this.Google_Object_Name);
             } )
  }


  //===================================
  patchMetaData(){
   
    // NOT USED
    
    // ****** get content of object *******
    this.Google_Object_Name="Event-27AUG2022.json";
    this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name +  "/o?name="  + this.Google_Object_Name +'TEST' ; 
    this.HTTP_AddressMetaData=this.Google_Bucket_Access_RootPOST + this.Google_Bucket_Name + "/o?name=" + this.Google_Object_Name  +  'TEST&uploadType=metadata' + "?cacheControl='max-age=0, no-store'";
    this.PostData.User_Data=this.Table_User_Data;
    
    this.http.post(this.HTTP_Address, this.Table_User_Data, {params: {'cacheControl':'max-age=0, no-store, private'}} )
          .subscribe((data ) => {
               
            this.LogMsgConsole('patch metadata: '+data);

                },
                error_handler => {
                  this.Error_Access_Server='error message==> ' + error_handler.message + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
                } 
          )
    }
  

}