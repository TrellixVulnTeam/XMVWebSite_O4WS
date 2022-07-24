import { Component, OnInit , Input, Output, HostListener, EventEmitter, SimpleChanges,} from '@angular/core';
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
import { Return_Data } from '../JsonServerClass';

@Component({
    selector: 'app-ChangeSaveFileName',
    templateUrl: './ChangeSaveFileName.component.html',
    styleUrls: ['./AdminLogin.component.css']
  })
  
export class ChangeSaveFileNameComponent {

    constructor(
        private router:Router,
        private http: HttpClient,
        private scroller: ViewportScroller,
        private fb:FormBuilder,
        ) {}  
    
    @Input() LoginToHttpPost:any;
    @Input() SelectedBucketInfo=new OneBucketInfo;
    @Output() SaveStatus=new EventEmitter<Return_Data>();

    FileName:string='';
    Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';
    isObjectToSave:boolean=false;
    ConfirmSave=true;
    Return_SaveStatus=new Return_Data;

    ngOnInit(){
        const myTime=new Date();
        const myDate= myTime.toString().substring(4,25);
        this.FileName=myDate + this.SelectedBucketInfo.name;
    }


    InputFile(event:any){
        this.FileName=event.target.value;

    }
    SaveModif(event:string){

        if (event='YES'){
            this.isObjectToSave=true;
            this.ConfirmSave=false;
        }
        else {
            this.Return_SaveStatus.SaveIsCancelled=true;
        }

    }


d:boolean=false;
b:boolean=false;
a:boolean=false;
c:number=0;
k:any;
f:any;
    SaveFile(){
   
    if (Array.isArray(this.LoginToHttpPost)===true){
        if (this.LoginToHttpPost[0].night===undefined){
          console.log('it is undefined so it is not type EventAUG');
        }
        else {
          console.log('it is NOT undefined so it IS type EventAUG');
        }


     } else {
      if (this.LoginToHttpPost.id===undefined){
        console.log('it is undefined so it is not type EventAUG');
      }
      else {
        console.log('it is NOT undefined so it IS type EventAUG');
      }
     }


    

    const HTTP_Address=this.Google_Bucket_Access_RootPOST + this.SelectedBucketInfo.bucket+ "/o?name=" + this.FileName   + "&uploadType=media" ;
    
      // update the file
      this.http.post(HTTP_Address,  this.LoginToHttpPost  )
        .subscribe(res => {
              this.Return_SaveStatus.Message='File ' +  this.FileName +' is saved';
              console.log(this.Return_SaveStatus.Message);
              this.SaveStatus.emit(this.Return_SaveStatus);
              },
              error_handler => {
                this.Return_SaveStatus.Error_Access_Server=error_handler.status + ' HTTP='+ HTTP_Address;
                console.log(this.Return_SaveStatus.Error_Access_Server);
                this.SaveStatus.emit(this.Return_SaveStatus);
              } 
            )
    }


  }


