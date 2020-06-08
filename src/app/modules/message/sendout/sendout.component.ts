import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { AppState } from 'src/app/core/reducers/reducers-config';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sendout',
  templateUrl: './sendout.component.html',
  styleUrls: ['./sendout.component.less']
})
export class SendoutComponent implements OnInit {

  domainEs = environment.domainEs;

  queryNode: QueryNode[] = [
    {
      label: '学员',
      key: 'studentId',
      type: 'search',
      placeholder: '根据学号、姓名、手机号查询',
      searchUrl: `${this.domainEs}/czg/fullQuery`
    },
    {
      label: '班级',
      key: 'classId',
      type: 'select',
      optionKey: { label: 'className', value: 'id' },
      optionsUrl: '/message/listClassMessage'
    },
    {
      label: '状态',
      key: 'cardStatus',
      type: 'select',
      optionKey: { label: 'name', value: 'id' },
      options: [
        { name: '待入学', id: 0 },
        { name: '已入学', id: 1 },
        { name: '已到店', id: 2 },
        { name: '未到店', id: 3 },
        { name: '未体验', id: 4 },
        { name: '无意向', id: 5 }
      ],
    },
    {
      label: '学员来源',
      key: 'memberFromid',
      type: 'select',
      optionKey: { label: 'fromName', value: 'memberFromId' },
      options: []
    }
  ]

  transferList: any[] = [];

  smsBalanceSurplus: number = 0;

  queryLoading: boolean;

  brandName: string;

  watchContent: any[] = ['【初之光】 退订回T'];

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private fb: FormBuilder = new FormBuilder(),
    private modal: NzModalService,
    private store: Store<AppState>
  ) {
    this.http.post('/sms/balance').then(res => this.smsBalanceSurplus = res.data);
    
    this.http.post('/smsTemplate/list', { paramJson: JSON.stringify({ "pageNum": 1, "pageSize": 1000 }) }).then(res => this.smsTemplateList = res.data.list);
    // this.http.post('/smsBalance/balance').then(res => this.smsBalance = res.result);
    this.http.post('/student/getStudentListQueryCondition').then(res => {
      this.queryNode[3].options = res.data.memberFromList;
    });
  }
  ngOnInit() {
    // this.store.select('userInfoState').subscribe(res => this.brandName = res.store.shopBrand.brandName || '初之光');
    this.brandName = '初之光'
    this.formGroup = this.fb.group({
      mobilePhones: [],
      type: [1],
      template: [],
      content: [, [Validators.required]]
    });
    /* ----------------------- 短信内容根据模板自动填充 ----------------------- */
    this.formGroup.get('template').valueChanges.subscribe(id => {
      this.smsTemplateList.map(item => item.id === id && this.formGroup.patchValue({ content: item.memo }));
    });
    this.formGroup.get('content').valueChanges.subscribe(val => {
      this.sendNum = this.selectList.length * (val && val.length + (this.brandName.length + 8) > 70 ? Math.ceil((val.length + (this.brandName.length + 8)) / 70) : 1);
      let watchContent = `【初之光】${val} 退订回T`;
      this.watchContent = [];
      let con = watchContent.length / 70;
      let mocon = watchContent.length % 70;
      if (con <= 1) {
        con = 1; mocon = 0;
      } else {
        if (mocon != 0) {
          con += 1;
        }
      }
      for (var i = 0; i < con; i++) {
        let text = watchContent.substring(i * 70, i * 70 + 70);
        if (text) {
          this.watchContent.push(text);
        }
      }


    });
  }

  query(params: any = {}) {
    if (!this.queryLoading) {
      this.queryLoading = true;
      params.pageSize = 10000;
      params.pageNum = 1;
      params.kindergartenId = 1;
      this.http.post('/student/getStudentList', { paramJson: JSON.stringify(params) }, false).then(res => {
        res.data.list.map(res => res.title = res.studentName + res.mobilePhone)
        this.transferList = res.data.list;
        this.queryLoading = false;
        this.selectList = [];

      }).catch(_ => {
        this.queryLoading = false;
      });
    }
  }

  selectList: any[] = [];
  change(map) {
    if (map.from == 'left') {
      map.list.map(item => this.selectList.push(item.mobilePhone));
    } else {
      map.list.map((item, idx) => this.selectList.indexOf(item.mobilePhone) != -1 && this.selectList.splice(this.selectList.indexOf(item.mobilePhone), 1));
    }
    let val = this.formGroup.value.content;
    this.sendNum = this.selectList.length * (val && val.length + (this.brandName.length + 8) > 70 ? Math.ceil((val.length + (this.brandName.length + 8)) / 70) : 1);

  }
  sendout() {
    if (!this.selectList.length) {
      this.message.warning('请选择需要发送的手机号码')
    } else {
      this.save();
    }
  }



  /* ------------- 短信发送 ------------- */
  formGroup: FormGroup;
  smsTemplateList: any[] = [];
  smsBalance = 0;
  sendNum = 0;
  saveLoading: boolean;
  save() {
    if (this.smsBalanceSurplus <= 0) {
      this.message.warning('短信剩余条数不足，请充值后发送');
    } else if (this.formGroup.invalid) {
      for (let control in this.formGroup.controls) {
        this.formGroup.controls[control].markAsDirty();
        this.formGroup.controls[control].updateValueAndValidity();
      }
    } else if (this.smsBalanceSurplus - this.sendNum < 0) {
      this.modal.confirm({
        nzTitle: '提示',
        nzContent: `短信剩余条数不足，公司已为您垫付<b>${this.smsBalanceSurplus - this.sendNum}</b>条短信费用！此次发送成功后，如不续购短信，则不可再次发送。`,
        nzOnOk: () => this._sendSms()
      })
    } else {
      this._sendSms();
    }
  }

  _sendSms() {
    this.saveLoading = true;
    this.formGroup.patchValue({ mobilePhones: this.selectList.join(','), })
    this.http.post('/sms/send', {
      paramJson: JSON.stringify(this.formGroup.value)
    }, true).then(res => {
      this.saveLoading = false;
    });
  }
}
