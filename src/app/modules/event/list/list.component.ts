import { UpdateComponent } from './update/update.component';
import { AddComponent } from './add/add.component';
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd';
import { HttpService } from './../../../ng-relax/services/http.service';
import { QueryComponent } from './../../../ng-relax/components/query/query.component';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { Component, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements AfterViewInit {

  @ViewChild('eaQuery') eaQuery: QueryComponent

  queryNode: QueryNode[] = [
    {
      label: '时间',
      type: 'datepicker',
      key: 'startTime'
    },
    {
      label: '孩子',
      type: 'select',
      key: 'studentId',
      options: [],
      optionKey: { label: 'studentName', value: 'id' },
    },
    {
      label : '班级',
      type: 'select',
      key: 'classId',
      optionKey: { label: 'className', value: 'id' },
      optionsUrl: '/message/listClassMessage'
    }
  ]

  loading: boolean;

  dataSet: any[] = [];

  eventList: any[] = [];

  checkAuth: number;

  constructor(
    private http: HttpService,
    private drawer: NzDrawerService,
    private message: NzMessageService
  ) { 
    this.http.post('/message/listEvent', {}, false).then(res => this.eventList = res.data.list);
    this.query();
  }

  ngAfterViewInit() {
    this.eaQuery._queryForm.get('classId').valueChanges.subscribe(classId => {
      if (classId) {
        this.http.post('/message/listStuByClassId', { classId }, false).then(res => {
          this.eaQuery.node.map(control => {
            control.key == 'studentId' && (control.options = res.data.list);
          })
        })
      } else {
        this.eaQuery.node.map(control => control.key == 'studentId' && (control.options = []));
      }
      this.eaQuery._queryForm.patchValue({ studentId: null });
    });
  }


  queryParams: any = {
    pageNo: 1,
    totalCount: 0
  };
  loadData(pi: number): void {
    this.queryParams.pageNo = pi;
    this.query();
  }
  querySubmit(params) {
    this.queryParams = Object.assign({ pageNo: 1, totalCount: this.queryParams.totalCount }, params);
    this.query();
  }
  query() {
    this.loading = true;
    this.http.post('/message/listEventByCondition', { paramJson: JSON.stringify(Object.assign(this.queryParams)) }, false).then(res => {
      this.loading = false;
      this.checkAuth = res.data.checkAuth;
      this.queryParams.totalCount = res.data.totalCount;
      res.data.list.map(item => {
        try {
          item.appContent = JSON.parse(item.appContent);
          item.appContent.content = item.appContent.content.split('|~!|').join('<i>|</i>');
        } catch (error) {
          item.appContent = { content: '', videoUrl: '', imgUrlList: [] };
        }
        return item;
      });
      this.dataSet = res.data.list;
    })
  }

  showEventList: boolean;
  addEvent(eventInfo) {
    if (this.eaQuery._queryForm.get('studentId').value) {
      this.showEventList = false;
      let studentInfo;
      this.eaQuery.node.map(control => {
        if (control.key == 'studentId') {
          control.options.map(res => res.id === this.eaQuery._queryForm.get('studentId').value && (studentInfo = res))
        }
      })
      const drawer = this.drawer.create({
        nzWidth: 400,
        nzTitle: `新增“${eventInfo.eventName}”事件`,
        nzContent: AddComponent,
        nzContentParams: { 
          eventInfo, 
          classId: this.eaQuery._queryForm.get('classId').value,
          studentInfo: studentInfo
        }
      });
      drawer.afterClose.subscribe(res => res && this.query());
    } else {
      this.message.warning('请选择一个孩子');
    }
  }

  update(eventInfo) {
    const drawer = this.drawer.create({
      nzWidth: 400,
      nzTitle: `编辑“${eventInfo.eventName}”事件`,
      nzContent: UpdateComponent,
      nzContentParams: { eventInfo }
    });
    drawer.afterClose.subscribe(res => res && this.query());
  }

  delete(ids) {
    this.http.post('/event_record/udpateEventAuditStatus', { paramJson: JSON.stringify({ ids: ids + '', deleteOrUpdate: '2' })}).then(res => this.query());
  }

  showExamine: boolean;
  examine() {
    let ids: any = [];
    this.dataSet.map(res => ids.push(res.id));
    ids = ids.join(',')
    this.http.post('event_record/udpateEventAuditStatus', { deleteOrUpdate: 1, ids}).then(res => this.query());
  }
  operExamine() {
    this.showExamine = true;
    this.dataSet.map(res => res.checked = false);
  }


  previewUrl(url) {
    window.open(url)
  }

  batchStatus(auditStatus) {
    let ids = [];
    this.dataSet.map(res => res.checked && ids.push(res.id));
    if (ids.length) {
      this.http.post('/event_record/udpateEventAuditStatus', {
        paramJson: JSON.stringify({
          ids: ids.join(','),
          deleteOrUpdate: '1',
          auditStatus
        })
      }).then(res => {
        this.showExamine = false;
        this.query();
      });
    } else {
      this.message.warning('请选择需要审核的数据');
    }
  }

}
