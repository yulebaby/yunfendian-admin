import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { UpdateComponent } from './update/update.component';
@Component({
  selector: 'ea-shoplist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {

  queryNode: QueryNode[] = [
    {
      label: '手机号码',
      key: 'keyWords',
      type: 'input',
      placeholder: '根据学号、姓名、手机号查询'
    },
    {
      label: '门店名称',
      key: 'keyWords',
      type: 'input',
      placeholder: '根据学号、姓名、手机号查询'
    },
    // {
    //   label: '剩余天数',
    //   key: 'followerId',
    //   type: 'select',
    //   optionsUrl: '/teacher/getGrowthConsultant',
    //   params: { code: 1004 }
    // },
    // {
    //   label: '门店类型',
    //   key: 'followerId',
    //   type: 'select',
    //   optionsUrl: '/teacher/getGrowthConsultant',
    //   params: { code: 1004 }
    // },
    // {
    //   label: '所在地区',
    //   key: 'followerId',
    //   type: 'select',
    //   optionsUrl: '/teacher/getGrowthConsultant',
    //   params: { code: 1004 }
    // },
    // {
    //   label: '门店分类',
    //   key: 'followerId',
    //   type: 'select',
    //   optionsUrl: '/teacher/getGrowthConsultant',
    //   params: { code: 1004 }
    // },
    {
      label: '策划师',
      key: 'memberFromId',
      type: 'select',
      optionsUrl: '/shop/listCustomerService',
      optionKey: { label: 'wxName', value: 'id' }
    },
    {
      label: '创建时间',
      key: 'createTime',
      type: 'rangepicker',
      valueKey: ['startCreateTime', 'endCreateTime']
    },
    {
      label: '到期时间',
      key: 'createTime',
      type: 'rangepicker',
      valueKey: ['startCreateTime', 'endCreateTime']
    },
 
  ];

  tableNode = ['ID', '店铺全称', '店铺简称', '所在地区', '店铺分类', '创建时间', '类型', '到期日期', '剩余天数', '店主微信', '店主手机', '账户余额', '策划师'];

  constructor(
    private drawer: NzDrawerService,
  ) { }

  ngOnInit() {
  }
  preview(){

  }
  addCustomer(info = {}){
    const drawer = this.drawer.create({
      nzWidth: 720,
      nzTitle: '2020年健康管理师报名注册系统',
      nzContent: UpdateComponent,
      nzContentParams: { info }
    });
    drawer.afterClose.subscribe(res => {
     
      // this.table && this.table._request();
    });
}
}
