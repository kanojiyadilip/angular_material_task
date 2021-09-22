import {AfterViewInit, ViewChild, Component, OnInit, Output, Input, EventEmitter,  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, AfterViewInit, OnChanges {

  @Output() getValue: EventEmitter<string> = new EventEmitter();
  @Input() myData:any;

  constructor() { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    // console.log(this.myData,"<=====this.dataSource=>",this.dataSource)
    this.datas = this.myData.map((item:any, index: any)=>({position:index+1,dob: new Date(item.dob), ...item}));
    // console.log("------datas----->", this.datas)
    this.datas = this.datas.sort(function(a,b){
      return Number(b.updateTime) - Number(a.updateTime);
    });
    this.dataSource = new MatTableDataSource<userDataElement>(this.datas);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("=changes=>",changes.myData.currentValue);
    this.datas = changes.myData.currentValue
    this.datas.sort(function(a,b){
      return Number(b.updateTime) - Number(a.updateTime);
    });
    this.dataSource = new MatTableDataSource<userDataElement>(this.datas);
  }

  datas: userDataElement[] = [];
  


  displayedColumns: string[] = ['select', 'name', 'email', 'gender', 'DOB', 'update', 'action'];
  dataSource = new MatTableDataSource<userDataElement>(this.datas);
  selection = new SelectionModel<userDataElement>(true, []);

  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: userDataElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  action(event:any){
    // console.log("===eventName===>",eventName, data);
    // let event = {eventName: eventName, dat a:data};
    this.getValue.emit(event);
  }

}

export interface userDataElement {
  name: string;
  position: string;
  email: string;
  gender: string;
  dob: string,
  updateTime: any
}

