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