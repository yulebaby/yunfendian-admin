import { HttpService } from './../../../ng-relax/services/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { AdjustmentComponent } from '../public/adjustment/adjustment.component';
import { DetailComponent } from './../public/detail/detail.component';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.less']
})
export class TimetableComponent implements OnInit {

  week: number = 1;
  listClass: any[] = [];
  dateIndex: any = 0;
  startDate: string;
  endDate: string;
  isOkLoading: any = false;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  dataList: any[] = [];
  classId: number;
  courseDayList: any[] = [];
  listWeek: any[] = [{ status: false }, { status: false }, { status: false }, { status: false }, { status: false }, { status: false }, { status: false }];
  scrollHeight: number = 0;
  constructor(
    private http: HttpService,
    private drawer: NzDrawerService
  ) {
  }
  ngOnInit() {
    this.scrollHeight = window.innerHeight -300;
    this.http.post('/message/listClassMessage', {}, false).then(res => { this.listClass = res.data.list; this.classId = res.data.list[0].id; this.getCourseDayConfig();     this.getData();    });
    
    this.nowDate();
  }
  getCourseDayConfig() {
    this.listWeek = [{ status: false }, { status: false }, { status: false }, { status: false }, { status: false }, { status: false }, { status: false }];
    this.http.post('/courseConfig/queryCourseDayConfig', {
      classId: this.classId,
      startDate: this.startDate,
      endDate: this.endDate
    }, false).then(res => {
      res.data.list.map((item, index) => {
        if(item.courses){
        item.courses = item.courses.substring(1, item.courses.length - 1);
        item.coursesList = item.courses.split(',');
        let arr = [];
        item.coursesList.map((umm, eqs) => {
          let ummlist = umm.split(':');
          let json = {
            template: ummlist[0],
            cid: ummlist[1]
          };
          this.courseInfo(ummlist[1], index, eqs)
          arr.push(json);
        })
        if (item.configDate == this.startDate) { this.listWeek[0].status = true; }
        if (item.configDate == this.Tuesday) { this.listWeek[1].status = true; }
        if (item.configDate == this.Wednesday) { this.listWeek[2].status = true; }
        if (item.configDate == this.Thursday) { this.listWeek[3].status = true; }
        if (item.configDate == this.Friday) { this.listWeek[4].status = true; }
        if (item.configDate == this.Saturday) { this.listWeek[5].status = true; }
        if (item.configDate == this.endDate) { this.listWeek[6].status = true; }

        item.courseList = arr;
      }else{
        res.data.list.splice(index,1);
      }
      })
      this.courseDayList = res.data.list;

      this.listWeek.map(item => {
        if (item.status) {
          item.num = 1;
        }
      })
      for (let i = this.listWeek.length - 1; i >= 0; i--) {
        this.listWeek[i].index = i;
        if (this.listWeek[i - 1] && this.listWeek[i - 1].status) {
          this.listWeek[i].isOverflow = true;
        }
        if (this.listWeek[i + 1] && this.listWeek[i + 1].status) {
          this.listWeek[i].num = this.listWeek[i].num + this.listWeek[i + 1].num;
        }
      }
    });

  }
  courseInfo(id, index, eqs) {
    this.http.post('/course/getCourseInfo', {
      id: id
    }, false).then(res => {
      this.courseDayList[index].courseList[eqs].data = res.data;
    });
  }
  getData() {
    this.http.post('/courseConfig/getCourseDayTemplate', { classId: this.classId }, false).then(res => {
      this.dataList = res.data.list;
    });
  }
  selectClass(id) {
    this.classId = id;
    this.getCourseDayConfig();
    this.getData();
  }
  nowDate() {
    this.dateIndex = 0;
    this.datefun(0);
  }
  nextDate() {
    this.dateIndex++;
    this.datefun(this.dateIndex * 7);
  }
  prveDate() {
    this.dateIndex--;
    this.datefun(this.dateIndex * 7);
  }
  classDetail(info = {}){
       this.drawer.create({
        nzWidth: 720,
        nzTitle: '课程详情',
        nzContent: DetailComponent,
        nzContentParams: { info }
      });
   
  }
  datefun(index) {
    let now: any = new Date();
    let nowDayOfWeek = now.getDay();
    nowDayOfWeek = nowDayOfWeek == 0 ? 7 : nowDayOfWeek;
    this.startDate = this.showWeekFirstDay(1 - nowDayOfWeek + index);
    this.Tuesday = this.showWeekFirstDay(2 - nowDayOfWeek + index);;
    this.Wednesday = this.showWeekFirstDay(3 - nowDayOfWeek + index);;
    this.Thursday = this.showWeekFirstDay(4 - nowDayOfWeek + index);;
    this.Friday = this.showWeekFirstDay(5 - nowDayOfWeek + index);;
    this.Saturday = this.showWeekFirstDay(6 - nowDayOfWeek + index);;
    this.endDate = this.showWeekFirstDay(7 - nowDayOfWeek + index);
    if (this.classId) {
      this.getCourseDayConfig();
    }
  };
  addCustomer() {
    const drawer = this.drawer.create({
      nzWidth: 1200,
      nzTitle: '排课/调整',
      nzContent: AdjustmentComponent,
      nzContentParams: {
        classId: this.classId,
        startDate: this.startDate,
        endDate: this.endDate,
        Tuesday: this.Tuesday,
        Wednesday: this.Wednesday,
        Thursday: this.Thursday,
        Friday: this.Friday,
        Saturday: this.Saturday
      }
    });
    drawer.afterClose.subscribe(res => {
      this.getCourseDayConfig();
    });
  }
  showWeekFirstDay(i) {
    var day3 = new Date();
    day3.setTime(day3.getTime() + i * 24 * 60 * 60 * 1000);
    let Month = (day3.getMonth() + 1) < 10 ? '0' + (day3.getMonth() + 1) : (day3.getMonth() + 1);
    let dayDate = (day3.getDate()) < 10 ? '0' + (day3.getDate()) : (day3.getDate());
    var s3 = day3.getFullYear() + "-" + Month + "-" + dayDate;
    return s3;
  }
  //打印
  print() {
    //获取打印的页面内容
    let subOutputRankPrint = document.getElementById('print-div');
    let newContent = subOutputRankPrint.innerHTML;
    let oldContent = document.body.innerHTML;
    document.body.innerHTML = newContent;
    //页面打印缩放比例设置
    document.getElementsByTagName('body')[0].style.zoom = '0.4';
    window.print();
    window.location.reload();
    //将原有页面还原到页面
    document.body.innerHTML = oldContent;
    document.getElementsByTagName('body')[0].style.zoom = '1';
    return false;
  }




}
