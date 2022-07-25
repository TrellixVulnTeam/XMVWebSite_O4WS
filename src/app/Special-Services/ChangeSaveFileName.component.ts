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
    styleUrls: ['./ChangeSaveFileName.component.css']
  })
  
export class ChangeSaveFileNameComponent {

    constructor(
        private router:Router,
        private http: HttpClient,
        private scroller: ViewportScroller,
        private fb:FormBuilder,
        ) {}  
    
    @Input() DataToHttpPost:any;
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
        if (event==='YES'){
            this.isObjectToSave=true;
            this.ConfirmSave=false;
            this.Return_SaveStatus.SaveIsCancelled=false;
        }
        else {
            this.Return_SaveStatus.Message='File ' +  this.FileName +' was not saved as per your request';
            this.isObjectToSave=false;
            this.ConfirmSave=true;
            this.Return_SaveStatus.SaveIsCancelled=true;
            this.SaveStatus.emit(this.Return_SaveStatus);
        }
    }


  SaveFile(){
    let FileToSave:any;
    FileToSave=this.DataToHttpPost;
    let Table_User_Data:Array<EventAug>=[];
    if (Array.isArray(this.DataToHttpPost)===true){
        if (this.DataToHttpPost[0].night!==undefined){
          // this is type EventAUG
          // Delete all records which are flagged with keyword 'RECORD IS DELETED' in UserId field
      
          for (let j=0; j<this.DataToHttpPost.length; j++){
            if (this.DataToHttpPost[j].UserId!=='RECORD IS DELETED'){
              const Individual_User_Data= new EventAug;
              Table_User_Data.push(Individual_User_Data);
              Table_User_Data[Table_User_Data.length-1]=this.DataToHttpPost[j];
            }
          }
          FileToSave=Table_User_Data;
      }

     }

    const HTTP_Address=this.Google_Bucket_Access_RootPOST + this.SelectedBucketInfo.bucket+ "/o?name=" + this.FileName   + "&uploadType=media" ;
    
      // update the file
      this.http.post(HTTP_Address,  FileToSave  )
        .subscribe(res => {
              this.Return_SaveStatus.Message='File ' +  this.FileName +' is saved';
              this.Return_SaveStatus.Error_Access_Server='';
              this.Return_SaveStatus.Error_code=0;
              this.isObjectToSave=false;
              console.log(this.Return_SaveStatus.Message);
              this.SaveStatus.emit(this.Return_SaveStatus);
              },
              error_handler => {
                this.Return_SaveStatus.Error_Access_Server=error_handler.status + ' url='+ error_handler.url;
                this.Return_SaveStatus.Error_code=error_handler.status;
                console.log(this.Return_SaveStatus.Error_Access_Server);
                this.SaveStatus.emit(this.Return_SaveStatus);
              } 
            )
    }

  }



