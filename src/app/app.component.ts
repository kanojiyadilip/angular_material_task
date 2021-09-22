import { Component, EventEmitter,Output,ViewChild, ChangeDetectorRef } from '@angular/core';
import myData from '../assets/data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'material-app';
  progressbar: any;

  @Output() submitButtonClicked = new EventEmitter<string>();
  @Output() myData = myData;
  genderCount: any = {
    male: 0,
    female: 0
  }

  @ViewChild('child')
  private child: any;

  constructor(private ref: ChangeDetectorRef){
    this.counts();
  }


  ngOninit(){}
  onGetValue(event: any) {
    // console.log('eventName::' + event);
    this.child.notifyMe(event);
    this.submitButtonClicked.next();
  }

  @Output() editVal:any
  onGetUpdateValue(editData: JSON) {
    this.editVal = editData
    // console.log('editData::>', this.editVal);
    if(this.editVal?.eventName == 'delete'){
      this.myData = this.myData.map((item:any)=>({status:1,...item}))
      let datam = this.myData
      datam[this.editVal['index']] = {status: 0, ...this.editVal};
      this.myData.map((item:any)=>(console.log("--item-->",item['status'])))
      this.myData = this.myData.filter((item:any, index: any)=>(item['status']))
      this.counts();
    }
    else if(this.editVal?.eventName == 'add'){
      // console.log(editData,"<-myData->", this.myData);
      this.myData.push({updateTime: Date.now(), ...JSON.parse(JSON.stringify(editData))})
      this.myData = this.myData.map((item:any, index: any)=>({position:index+1,...item}));
      console.log(editData,"<-myData->", this.myData);
      this.counts();
      this.ref.detectChanges(); 
    }
    else{
        let datam = this.myData
        datam[this.editVal['index']] = {updateTime: Date.now(), ...this.editVal};
        this.myData = datam; 
        this.myData = this.myData.map((item:any, index: any)=>({position:index+1,...item}));
        this.counts();
        this.ref.detectChanges(); 
        console.log("-myData->", this.myData);
      }
  }

  counts(){
    this.progressbar = this.myData.length*10;
    this.genderCount.male = this.myData.filter((item:any, index: any)=>(item['gender']=='male')).length;
    this.genderCount.female = this.myData.filter((item:any, index: any)=>(item['gender']=='female')).length;
  }
}
