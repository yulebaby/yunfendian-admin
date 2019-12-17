import { HttpService } from './../../../ng-relax/services/http.service';
import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { Component, OnInit, ViewChild ,  } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { ListPageSimpComponent } from './../../../ng-relax/components/list-page-simp/list-page.component';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { DetailComponent } from './../public/detail/detail.component';
import { $ } from 'protractor';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.less']
})
export class PlanComponent implements OnInit {
  @ViewChild('listPage') listPage: ListPageSimpComponent;
  @ViewChild('mainScreen') elementView: ElementRef;

  queryNode: QueryNode[] = [
    {
      label: '课程名称',
      key: 'className',
      type: 'input'
    },
    {
      label: '班级',
      key: 'classId',
      type: 'select',
      optionKey   : { label: 'className', value: 'id' },
      optionsUrl  : '/message/listClassMessage'
    }
  ];
  pageNum: number = 1;
  pageSize: number = 40;
  totalPage: number = 0;
  param: any;
  typeId: number = 0;
  imgurl : string = 'https://gw.alipayobjects.com/zos/rmsportal/LFooOLwmxGLsltmUjTAP.svg';
  loading: boolean;
  listClass:any[] = [];
  courseList: any[] = [];
  classStatusIndex: number = 0;
  listCourseType: any[];
  margin: number;
  listWidth:number;
  constructor(
    private http: HttpService,
    private drawer: NzDrawerService,
  ) { 
    this.querys({});
  }

  ngOnInit() {
  
    this.http.post('/course/listCourseType', { }, false).then(res => { res.data.list.unshift({ name: '全部' , id : 0 }); this.listCourseType = res.data.list;  })

  }
  querys(data){
    this.param = JSON.parse(JSON.stringify(data));
    if(this.typeId != 0){
      data.typeId = this.typeId;
    }else{
      delete data['typeId'];
    }
    this.http.post('/course/queryCourse', { paramJson: JSON.stringify(data), pageNum: this.pageNum , pageSize: this.pageSize }, false).then(res => { 
      this.courseList = res.data.list;  
      this.totalPage = res.data.totalPage;
      let swidth: number = Number(this.elementView.nativeElement.offsetWidth);
      if(swidth){
      let slen:any = Math.floor(swidth / 200);
      let padd = swidth % 200 ;
      this.margin = padd/slen/2;
      // this.listWidth = (swidth/5)-20;
      // this.listWidth = this.listWidth>=200 ?  this.listWidth : 200;
    }else{
      setTimeout(res=>{
        swidth = Number(this.elementView.nativeElement.offsetWidth);
        let slen:any = Math.floor(swidth / 200);
        let padd = swidth % 200 ;
        this.margin = padd/slen/2;
        if(!swidth){
          setTimeout(res=>{
            swidth = Number(this.elementView.nativeElement.offsetWidth);
            let slen:any = Math.floor(swidth / 200);
            let padd = swidth % 200 ;
            this.margin = padd/slen/2;
          },3000);
        }

      },3000);
    }
    })
  }

  delete(classId) {
    this.http.post('/classmanager/deleteClassById', { classId }, true).then(res => this.listPage.eaTable._request())
  }
 
  selectclass(id){
    this.typeId = id;
    this.pageNum = 1;
    this.querys(this.param);
  }
  submitQuerys(e){
    this.pageNum = 1;
    this.querys(e);
  }
  pageChange(){
    this.querys(this.param);
  }
  pagesizeChange(){
    this.pageNum = 1;
    this.querys(this.param);
  }
  openDetail(info = {}){
    const drawer = this.drawer.create({
      nzWidth: 720,
      nzTitle: '课程详情',
      nzContent: DetailComponent,
      nzContentParams: { info }
    });
  }

}
