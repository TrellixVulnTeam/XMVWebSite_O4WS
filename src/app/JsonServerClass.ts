export class BioDataList{
    id:number=0;
    name:string='';
    Topic:string='';
    element:string='';
    class:string='';
    style:string='';
  }
export class BioData{
    id:number=0;
    name:string='';
    Topic:string='';
    class:string='';
  }
  export class TopicURL {
    id:number=0;
    type:string='';
    topic:string='';
    url:string='';
    };

  export class EventAug {
      id: number=0;
      key:number=0;
      method:string='';
      UserId:string='';
      psw:string='';
      phone:string='';
      firstname:string='';
      surname:string='';
      night:string='';
      brunch:string='';
      nbinvitees:number=0;
      myComment:string='';
      yourComment:any;
      timeStamp:string='';
    };


 export class Bucket_List_Info{
  kind:string='storage#object';
  items:Array<any>=[
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
      timeStorageClassUpdated: "",
  }]
};

export class StructurePhotos{
  name:string='';
  mediaLink:string='';
  selfLink:string='';
  photo=new Image();
  vertical:boolean=false;
  isdiplayed:boolean=false;
 }

export class  BucketExchange{
  bucket_wedding_name:Array<string>=[];
  bucket_list_returned:Array<string>=[];
  Max_Nb_Bucket_Wedding:number=6;
  i_Bucket:number=0;
  array_i_loop:Array<number>=[];
  bucket_is_processed:boolean=false;
  GetOneBucketOnly:boolean=true;
  Nb_Buckets_processed:number=0;
}

export class XMVConfig{
  BucketLogin:string="";
  BucketConsole:string="";
  BucketContact:string="";
  Max_Nb_Bucket_Wedding:number=6;
  GetOneBucketOnly:boolean=false;
  BucketWeddingRoot:string="";
  nb_photo_per_page:number=10;
  UserSpecific:Array<UserParam>=[];
}

export class UserParam{
    id:string="XMVanstaen";
    type:string="";
    log:boolean=false;
  }
