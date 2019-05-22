import { NzDrawerRef, NzModalService } from 'ng-zorro-antd';
import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { addMonths, subMonths, format } from 'date-fns';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';

@Component({
  selector: 'app-appoint',
  templateUrl: './appoint.component.html',
  styleUrls: ['./appoint.component.less']
})
export class AppointComponent implements OnInit {

  @Input() studentInfo: any = {};

  dataSet: AppointData[] = [];

  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef,
    private modal: NzModalService
  ) { }

  ngOnInit() {
    this.getData();
  }

  checkedList: string[] = [];

  checkedChange(day) {
    if (this.studentInfo.schoolRollId === null) {
      this.checkedList.includes(day) ? this.checkedList.splice(this.checkedList.indexOf(day), 1) : (this.checkedList = [day]);  
    } else {
      this.checkedList.includes(day) ? this.checkedList.splice(this.checkedList.indexOf(day), 1) : this.checkedList.push(day);
    }
  }

  saveLoading: boolean;
  @DrawerClose() close: (bool?) => void;

  save() {
      let checkedParams = [];
      this.checkedList.map(c => {
        let [reserveDate, teacherId, pitNum] = c.split('|');
        checkedParams.push({ 
          studentId: this.studentInfo.id, 
          reserveDate, 
          teacherId: Number(teacherId), 
          pitNum: Number(pitNum),
          reserveType: this.studentInfo.schoolRollId === null ? 3 : '---------------------'
        });
      })
      this.http.post('/reserve/checkReserveRecord', { 
        paramJson: JSON.stringify( checkedParams ) 
      }).then(res => this.modal[res.result == 1000 ? 'success' : res.result == 1001 ? 'error' : 'warning']({
        nzMaskClosable: true,
        nzTitle: res.message,
        nzContent: res.data && res.data.list ? res.data.list.join('、') : `确定预约吗`,
        nzOkText: '确定预约',
        nzOnOk: () => {
          this.http.post('/reserve/batchSaveReserveRecord', {
            paramJson: JSON.stringify(checkedParams)
          }, true).then(res => this.close(true));
        },
        nzCancelText: '取消预约',
        nzOnCancel: () => { console.log('取消预约') }
      }));
  }

  async getData(type?: 'up' | 'down') {
    let classInfo = await this.http.post('/reserve/getClassWithTeacher', { classId: this.studentInfo.gradeId });
    let month = format(type === 'up' ? subMonths(new Date(this.dataSet[0].key), 1) : type === 'down' ? addMonths(new Date(this.dataSet[this.dataSet.length - 1].key), 1) : new Date(), 'YYYY-MM');
    this.dataSet[type === 'up' ? 'unshift' : 'push']({ key: month, value: classInfo.data.list, days: new Array(this._monthOfDays(month)) });
    
    this.dataSet[type === 'up' ? 0 : this.dataSet.length - 1].value.map(classes => {
      classes.teacherReceptionNum = 0;
      classes.teachers.map(teacher => {
        classes.teacherReceptionNum += teacher.receptionNum;
        this.http.post('/reserve/getReserveRecordByTeacher', { teacherId: teacher.id, startMonth: month.replace('-', ''), endMonth: month.replace('-', '') }).then(res => {
          teacher.list = Object.values(res.data.list)[0] ? Object.values(res.data.list)[0] : [];
          teacher.list.map(arr => teacher.list[ 'arr' + arr.pitNum] = arr);
          teacher.pit = new Array(teacher.receptionNum);
        })
      })
    });
  }

  private _monthOfDays(d): number {
    let [y, m] = d.split('-');
    let m31 = ['01', '03', '05', '07', '08', '10', '12'];
    let m30 = ['04', '06', '09', '11'];
    return m31.includes(m) ? 31 : m30.includes(m) ? 30 : Number(y % 4) === 0 ? 29 : 28;
  }


}


interface AppointData {
  key: string;
  value: any[];
  days: any[]
}