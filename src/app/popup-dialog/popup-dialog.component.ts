import { Component, OnInit, Inject,Input,EventEmitter,Output } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { Observable }  from 'rxjs';

export interface DialogData {
  msg: '',
  eventName: '';
  data:{
    name:'',
    email:'',
    gender:'',
    address:'',
    dob:''
  };
  index:null;
}

@Component({
  selector: 'app-popup-dialog',
  templateUrl: './popup-dialog.component.html',
  styleUrls: ['./popup-dialog.component.scss']
})
export class PopupDialogComponent implements OnInit {
  // private eventsSubscription: any;
  @Output() getUpdateValue: EventEmitter<any> = new EventEmitter();

  @Input() events: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    // this.eventsSubscription = this.events.subscribe(() => console.log("=========child=========="));

  }

  notifyMe(data:any) {
    // console.log('Event Fired', data);
    this.openDialog(data);
  }

  childCom(datam:any){
    // console.log("=childCom=>",datam)
  }

  openDialog(data:any) {
    // console.log("==openDialog==")
    const dialogRef = this.dialog.open(DialogDataExampleDialog, {
      data: {
        eventName:data.eventName,
        data: data.data,
        index: data.index,
        msg: data?.msg
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.openDialog({eventName: 'msg'})
      if(result){
        this.getUpdateValue.emit({ eventName:data.eventName, ...result });
        if(data.eventName == 'delete'){
          this.openDialog({eventName: 'msg', msg: "Deleted Successfully"});
        }
        else if(data.eventName == 'edit'){
          this.openDialog({eventName: 'msg', msg: "Record Update Successfully"});
        }
        else if(data.eventName == 'add'){
          this.openDialog({eventName: 'msg', msg: "Record Add Successfully"});
        }
      }
      // console.log(Object.keys(result).length,'The dialog was closed', result);
    })
  }
  data: any;
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
  styleUrls: ['./popup-dialog.component.scss']
})
export class DialogDataExampleDialog {
  formGroup: FormGroup;
  eventName: any;
  msg: any;
  constructor(
    public dialogRef: MatDialogRef < DialogDataExampleDialog > ,
    @Inject(MAT_DIALOG_DATA) public uData: DialogData, private formBuilder: FormBuilder) {
      // console.log(typeof this.uData['data']?.['dob'],"-d-d--d-d-L-uData->",this.uData['data'])
      this.eventName = this.uData['eventName'];
      let dob = (typeof this.uData['data']?.['dob'] == 'string')?(this.uData['data']?.dob?new Date(String(this.uData['data']['dob'])):null):(this.uData['data']?.dob?new Date(Number(this.uData['data']['dob'])):null)
      this.msg = this.uData['msg']
      this.formGroup = this.formBuilder.group({
        'email': [this.uData['data']?.email || null, [Validators.required, Validators.email, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]],
        'name': [this.uData['data']?.name || null, Validators.required],
        'gender': [this.uData['data']?.gender || null, Validators.required],
        'dob': [dob, Validators.required],
        'address': [this.uData['data']?.address || null, [Validators.required, Validators.minLength(5)]],
        'validate': '',
        'index': this.uData.index
      });
    }

  onNoClick(event:any): void {
    if(event=='y'){
      // console.log('--->',event,this.uData)
      this.dialogRef.close({eventName: 'delete', index: this.uData.index});
    }
    else{
      this.dialogRef.close();
    }
  }

  onSubmit(post: any) {
    console.log(this.formGroup.valid,"=post=>", post, this.eventName);
    if(this.formGroup.valid){
      this.dialogRef.close(post);
    }
  }

}
