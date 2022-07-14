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
import { theHTTPGet } from '../httpGETservice';
import { HTTPget } from '../httpGETservice';
import {saveLogConsole } from '../consoleLog';
import { msginLogConsole } from '../consoleLog';


@Component({
  selector: 'app-GetImages',
  templateUrl: './GetImages.component.html',
  styleUrls: ['./GetImages.component.css']
})

export class GetImagesComponent {

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


    //@Input() LoginTable_User_Data:Array<EventAug>=[];
    //@Input() LoginTable_DecryptPSW:Array<string>=[];

    @Input() WeddingPhotos:Array<StructurePhotos>=[];
    @Input() ConfigXMV=new XMVConfig;
    @Input() identification={
      id: 0,
      key:0,
      method:'',
      UserId:'',
      psw:'',
      phone:'',
    };
    EventHTTPReceived1:boolean=false;
    EventHTTPReceived2:boolean=false;
    EventHTTPReceived3:boolean=false;

    myLogConsole:boolean=false;
    myConsole:Array<string>=[];
    returnConsole:Array<string>=[];
    SaveConsoleFinished:boolean=true;
    // ACCESS TO GOOGLE STORAGE
  
    Google_Bucket_Access_Root:string='https://storage.googleapis.com/storage/v1/b/';
    Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';
  
    Google_Bucket_Name:string='manage-login'; 
    Google_Object_Name:string='';
   
    bucketMgt=new BucketExchange;
    nextBucketOnChange:number=0;


    i_loop:number=0;
    j_loop:number=0;
    max_i_loop:number=20000;
    max_j_loop:number=20000;
    id_Animation:number=0;
    id_Animation1:number=0;
    i:number=0;
    j:number=0;
   
    myTime=new Date();
    myDate:string='';
    thetime:string='';
    

    Bucket_Info_Array:Array<Bucket_List_Info>=[];
    ref_Bucket_List_Info=new Bucket_List_Info;

    error_message:string='';
    Error_Access_Server:string='';
    HTTP_Address:string='';

    BooleanTab:Array<number>=[0,0,0];
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
      //**this.LogMsgConsole('ngOnInit Event27AUG2022 ===== Device ' + navigator.userAgent + '======');

      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
      this.EventHTTPReceived1=false;
      this.waitHTTP(0, 2000);
      
  }    


access_all_buckets(){
// HOW TO FORCE TO THE STORAGE OF THE RIGHT BUCKET AT THE END OF THE TABLE
    if (this.bucketMgt.array_i_loop[this.bucketMgt.i_Bucket-1]%20===0){
      //**this.LogMsgConsole('access bucket '+this.bucketMgt.bucket_wedding_name[this.bucketMgt.i_Bucket-1] + ' bucketMgt.i_Bucket='+ this.bucketMgt.i_Bucket+ ' + i_loop=' + this.bucketMgt.array_i_loop[this.bucketMgt.i_Bucket-1]+ '  bucketMgt.bucket_list_returned'+ this.bucketMgt.bucket_list_returned[this.bucketMgt.i_Bucket-1]);
    }
    this.id_Animation=window.requestAnimationFrame(() => this. access_all_buckets());
    this.bucketMgt.array_i_loop[this.bucketMgt.i_Bucket-1]++;
    // check how to manage error_server
    if (this.bucketMgt.array_i_loop[this.bucketMgt.i_Bucket-1]>this.max_i_loop || this.bucketMgt.bucket_list_returned[this.bucketMgt.i_Bucket-1]==='1'){
       
      // //**this.LogMsgConsole('===== bucket# '+ this.bucketMgt.i_Bucket+ 'processed; this.i_loop='+ this.bucketMgt.array_i_loop[this.bucketMgt.i_Bucket-1]+ 'length global table='+ this.WeddingPhotos.length+ 'length specific table='+ this.Bucket_Info_Array[this.bucketMgt.i_Bucket-1].items.length);
      
                  // check for next bucket only if process all buckets at once
      if (this.bucketMgt.GetOneBucketOnly===false){
        this.bucketMgt.i_Bucket++
      }

      ////**this.LogMsgConsole('===== bucket - process next bucket which is '+ this.bucketMgt.i_Bucket + ' bucketMgt.GetOneBucketOnly is '+this.bucketMgt.GetOneBucketOnly);
      if (this.bucketMgt.i_Bucket===this.bucketMgt.Max_Nb_Bucket_Wedding+1 || this.bucketMgt.GetOneBucketOnly===true){
            
          //**this.LogMsgConsole('===== bucket - all buckets processed; fill-in now WeddingPhotos ');
            this.j=-1;
            let i=1;
            if (this.bucketMgt.GetOneBucketOnly===true && this.bucketMgt.Nb_Buckets_processed>0){ 
               i=this.bucketMgt.Nb_Buckets_processed;
            } 
            for (this.bucketMgt.i_Bucket=i; this.bucketMgt.i_Bucket<=this.bucketMgt.Max_Nb_Bucket_Wedding;  this.bucketMgt.i_Bucket++){
              this.bucketMgt.Nb_Buckets_processed++;
                for (this.i=0; this.i<this.Bucket_Info_Array[this.bucketMgt.i_Bucket-1].items.length; this.i++ ){
                      this.fillFromBucket();
                } // end second loop For(){} which is too fill-in WeddingPhotos
                
                if (this.bucketMgt.GetOneBucketOnly===true){ // this means only one bucket is to be stored in WeddingPhotos
                    // must stop the loop on all buckets
                    this.bucketMgt.i_Bucket=this.bucketMgt.Max_Nb_Bucket_Wedding+1;
                }


            } // end first loop For(){} which purpose was to fill-in theWeddingPhotos table
 
            this.bucketMgt.bucket_is_processed=true; // process to retrieve data from a bucket is over
            ////**this.LogMsgConsole('this.bucketMgt.bucket_is_processed'+ this.bucketMgt.bucket_is_processed +'  and table length is ='+this.WeddingPhotos.length+'  bucketMgt.Nb_Buckets_processed='+this.bucketMgt.Nb_Buckets_processed);
            window.cancelAnimationFrame(this.id_Animation);
            if (this.bucketMgt.GetOneBucketOnly===true){ // this means only one bucket had to be processed
              // must trigger ngOnChange in WeddingPhotods component
              this.nextBucketOnChange++
               
              }
       
          }
    } // condition on loop exceeding or bucket data was received
  }
fillFromBucket(){
  //**this.LogMsgConsole('***** fillFromBucket ='+this.bucketMgt.i_Bucket+'  and table length is ='+this.WeddingPhotos.length+'  bucketMgt.Nb_Buckets_processed'+this.bucketMgt.Nb_Buckets_processed);

  const pushPhotos=new StructurePhotos;
  this.WeddingPhotos.push(pushPhotos);
  this.j=this.WeddingPhotos.length-1;
  this.WeddingPhotos[this.j].name=this.Bucket_Info_Array[this.bucketMgt.i_Bucket-1].items[this.i].name;

      this.WeddingPhotos[this.j].mediaLink=this.Bucket_Info_Array[this.bucketMgt.i_Bucket-1].items[this.i].mediaLink;
      this.WeddingPhotos[this.j].selfLink=this.Bucket_Info_Array[this.bucketMgt.i_Bucket-1].items[this.i].selfLink;
      this.WeddingPhotos[this.j].photo.src=this.Bucket_Info_Array[this.bucketMgt.i_Bucket-1].items[this.i].mediaLink;
      this.WeddingPhotos[this.j].isdiplayed=false;

  if (this.Bucket_Info_Array[this.bucketMgt.i_Bucket-1].items[this.i].name.indexOf('Vertical')!==-1){
    this.WeddingPhotos[this.j].vertical=true;
  }
  else{
    this.WeddingPhotos[this.j].vertical=false;
  }
}

process_next_bucket(bucket_nb:number){
    // this is called by WeddinPhotosComponents through @Output
    //**this.LogMsgConsole('***** process_next_bucket ='+bucket_nb+'  and table length is ='+this.WeddingPhotos.length+'  bucketMgt.Nb_Buckets_processed'+this.bucketMgt.Nb_Buckets_processed);
    this.bucketMgt.Nb_Buckets_processed=bucket_nb+1;
    this.bucketMgt.i_Bucket=bucket_nb+1;
    if (this.bucketMgt.i_Bucket<=this.bucketMgt.Max_Nb_Bucket_Wedding){
          this.getListPhotos(this.bucketMgt.bucket_wedding_name[this.bucketMgt.i_Bucket-1], this.bucketMgt.i_Bucket); 
    }
    this.access_all_buckets();
    
    //**this.LogMsgConsole('end process_next_bucket ='+this.bucketMgt.i_Bucket+'  and new table length is ='+this.WeddingPhotos.length);
  }





getListPhotos(BucketPhotos:string, bucket_nb:number){
    // get list of objects in bucket
    //**this.LogMsgConsole('getListPhotos() from '+BucketPhotos+'  nb='+bucket_nb);
    this.bucketMgt.bucket_list_returned[bucket_nb-1]='0';
    const HTTP_Address='https://storage.googleapis.com/storage/v1/b/' + BucketPhotos + "/o";
    this.http.get<any>(HTTP_Address )
          .subscribe(data => {
                this.bucketMgt.bucket_list_returned[bucket_nb-1]='1';
                //**this.LogMsgConsole('getListPhotos() - received data from BucketPhotos '+BucketPhotos);
                console.log('received data'+data);
                this.Bucket_Info_Array[bucket_nb-1]=data;
                this.LogMsgConsole('getListPhotos() - Bucket_Info_Array.items.length =  '+this.Bucket_Info_Array[bucket_nb-1].items.length+' Bucket is '+this.Bucket_Info_Array[bucket_nb-1].items[0].id);
              },   
              error_handler => {
                this.Error_Access_Server='getListPhoto : error message==> ' + error_handler.message + ' error code status==> '+ error_handler.status + ' error status==> '+ error_handler.statusText+'   name=> '+ error_handler.name + '   Error url==>  '+ error_handler.url;
                  alert(this.message  + ' -- http get = ' + this.HTTP_Address);
                  this.bucketMgt.bucket_list_returned[bucket_nb-1]=error_handler.status;
                } 
          )
  

  }


LogMsgConsole(msg:string){
  const type='WeddingPhotos';
  this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.ConfigXMV.BucketConsole+ "/o?name="  + this.thetime.substr(0,20)+  type + '.json&uploadType=media';
  msginLogConsole(msg, this.myConsole,this.myLogConsole, this.SaveConsoleFinished,this. HTTP_Address, type);
  /***
    console.log(msg);
    this.myTime=new Date();
    this.myDate= this.myTime.toString().substring(8,24);
    this.thetime=this.myDate+this.myTime.getTime().toString();
    if (this.myLogConsole===true){
            this.myConsole.push('');
            this.myConsole[this.myConsole.length-1]='<==> '+this.thetime.substr(0,20) + ' ' +msg;
  
    }
    if (this.myConsole.length>500 && this.SaveConsoleFinished===true){
      //this.saveLogConsole(this.myConsole, 'Event27AUG');
    }
       */ 
  
  }
  

  
  waitHTTP(loop:number, max_loop:number ){
    const pas=500;
    if (loop%pas === 0){
      console.log('waitHTTP ==> loop=', loop, ' max_loop=', max_loop, ' this.EventHTTPReceived=', this.BooleanTab[0]);
      console.log(' HTTPBoolean', this.BooleanTab[0],' ', this.BooleanTab[1],' ', this.BooleanTab[2]);
    }
    if (loop===0 && this.BooleanTab[0]===0){
          HTTPget(this.BooleanTab,0);
    }
   loop++
    
    this.id_Animation1=window.requestAnimationFrame(() => this.waitHTTP(loop, max_loop));
    if (loop>max_loop || this.BooleanTab[0]===1 || this.BooleanTab[1]===1 || this.BooleanTab[2]===1){
              console.log('exit waitHTTP ==> loop=', loop, ' max_loop=', max_loop, ' this.EventHTTPReceived=', this.BooleanTab[0]);
              console.log(' HTTPBoolean', this.BooleanTab[0],' ', this.BooleanTab[1],' ', this.BooleanTab[2]);
           
        if (this.BooleanTab[0]===1) {
            this.BooleanTab[0]=2;
            loop=1;
            theHTTPGet(this.BooleanTab, 1, this.Bucket_Info_Array,0);
        }
        if (this.BooleanTab[1]===1 && this.BooleanTab[2]===0) {
            this.BooleanTab[1]=2;
            loop=2;
            this.myLogConsole=true;
            this.LogMsgConsole('**** testing function AsaveConsoleLog');
            this.HTTP_Address=this.Google_Bucket_Access_RootPOST + this.ConfigXMV.BucketConsole+ "/o?name="  + this.thetime.substr(0,20)+  'WeddingPhotos' + '.json&uploadType=media';
            saveLogConsole(this.myConsole, 'WeddingPhotos', this.HTTP_Address );

            console.log('Console '+this.myConsole);

            this.myTime=new Date();
            this.myDate= this.myTime.toString().substring(8,24);
            this.thetime=this.myDate+this.myTime.getTime();
            // get all the records from the login component via the @input
            //this.Table_User_Data = this.LoginTable_User_Data;
            //this.Table_DecryptPSW= this.LoginTable_DecryptPSW;
            

            this.bucketMgt.Nb_Buckets_processed=0;

            this.myHeader=new HttpHeaders({
              'content-type': 'application/json',
              'cache-control': 'private, max-age=0'
            });

            // INITIALISATION
            this.bucketMgt.bucket_is_processed=false;
            this.bucketMgt.GetOneBucketOnly=this.ConfigXMV.GetOneBucketOnly;
            this.bucketMgt.Max_Nb_Bucket_Wedding=this.ConfigXMV.Max_Nb_Bucket_Wedding;
          
            for (this.i=0; this.i<this.ConfigXMV.UserSpecific.length && this.identification.UserId!==this.ConfigXMV.UserSpecific[this.i].id; this.i++){}

            if (this.i<this.ConfigXMV.UserSpecific.length && this.identification.UserId===this.ConfigXMV.UserSpecific[this.i].id){
                  this.myLogConsole=this.ConfigXMV.UserSpecific[this.i].log;
                }  else{ 
                    this.myLogConsole=false;
                  }
              


            // Initialise the buckets
            for (this.bucketMgt.i_Bucket=1; this.bucketMgt.i_Bucket<=this.bucketMgt.Max_Nb_Bucket_Wedding; this.bucketMgt.i_Bucket++){
              this.ref_Bucket_List_Info=new Bucket_List_Info;
              this.Bucket_Info_Array.push(this.ref_Bucket_List_Info);
              const bucket_str_nb=this.bucketMgt.i_Bucket-1;
              this.bucketMgt.bucket_wedding_name.push('');
              if (this.bucketMgt.i_Bucket<10){
                  this.bucketMgt.bucket_wedding_name[this.bucketMgt.i_Bucket-1]=this.ConfigXMV.BucketWeddingRoot+'0'+bucket_str_nb.toString();
              } else { 
                  this.bucketMgt.bucket_wedding_name[this.bucketMgt.i_Bucket-1]=this.ConfigXMV.BucketWeddingRoot+bucket_str_nb.toString()
                };

              this.bucketMgt.bucket_list_returned.push('0');
              this.bucketMgt.bucket_list_returned[this.bucketMgt.i_Bucket-1]='0';
              this.bucketMgt.array_i_loop.push(0);
              this.bucketMgt.array_i_loop[this.bucketMgt.i_Bucket-1]=0;
              // TO BE USED WHEN WANT TO RETRIEVE ALL BUCKETS AT ONCE
              if (this.bucketMgt.GetOneBucketOnly===true){
                if (this.bucketMgt.i_Bucket===1){
                      this.getListPhotos(this.bucketMgt.bucket_wedding_name[this.bucketMgt.i_Bucket-1], this.bucketMgt.i_Bucket);
                  }
              } else {
              // retrieve all buckets
                      this.getListPhotos(this.bucketMgt.bucket_wedding_name[this.bucketMgt.i_Bucket-1], this.bucketMgt.i_Bucket); 
                }
              
            }
          
            // want to be sure that all buckets have been accessed
            this.bucketMgt.i_Bucket=1;
            //**this.LogMsgConsole('before calling access_one_bucket - this.bucketMgt.GetOneBucketOnly is set to '+this.bucketMgt.GetOneBucketOnly);

            // TO BE USED WHEN WANT TO RETRIEVE ALL BUCKETS AT ONCE
            // //**this.LogMsgConsole('before calling access_all_buckets() '+this.bucketMgt.bucket_is_processed);
            // *** this.bucketMgt.GetOneBucketOnly=false;
            this.access_all_buckets();
            this.BooleanTab[2]=1;
        }
        if (this.BooleanTab[2]>0 ){
          this.BooleanTab[2]=2;
            window.cancelAnimationFrame(this.id_Animation1);   
          }     
              
              
        }  

    }

}