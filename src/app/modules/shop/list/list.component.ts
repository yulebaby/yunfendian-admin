import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UpdateComponent } from './update/update.component';
import { VipComponent } from './vip/vip.component';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';
@Component({
  selector: 'ea-shoplist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
  @ViewChild('table') table: TableComponent
  queryNode: QueryNode[] = [
    {
      label: '手机号码',
      key: 'phone',
      type: 'input',
      placeholder: '请输入手机号码'
    },
    {
      label: '门店名称',
      key: 'shopName',
      type: 'input',
      placeholder: '请输入门店名称'
    },
    {
      label: '剩余天数',
      key: 'leftDate',
      type: 'input',
      placeholder: '请输入剩余天数'
    },
    {
      label: '门店类型',
      key: 'shopType',
      type: 'select',
      options:[{
          id: 1,
          name: '线下零售'
        },{
          id: 2,
          name: '餐饮'
        },{
          id: 3,
          name: '居民生活/商业服务'
        },{
          id: 4,
          name: '休闲娱乐'
        },{
          id: 5,
          name: '教育/医疗'
        },{
          id: 6,
          name: '其它'
      }]
    },
    {
      label: '所在地区',
      key: 'addressOptions',
      valueKey:['province','city'],
      type: 'cascader',
      optionKey: { label: 'name', value: 'code' }
    },
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
  
  checkedData: any[] = [];
  tableNode = ['ID', '店铺全称', '店铺简称', '所在地区', '店铺分类', '创建时间', '套餐类型', '到期日期', '剩余天数', '店主微信', '店主手机', '账户余额', '策划师'];
  checkedItems: any[]=[];
  constructor(
    private drawer: NzDrawerService,
    private message: NzMessageService,

  ) { }

  ngOnInit() {
  }
  preview(){

  }
  addCustomer(info = {}){
    const drawer = this.drawer.create({
      nzWidth: 720,
      nzTitle: '新增门店',
      nzContent: UpdateComponent,
      nzContentParams: { info }
    });
    drawer.afterClose.subscribe(res => {
     
      this.table && this.table._request();
    });
}
openVip(){
  if(!this.checkedData.length){
      this.message.warning('请选择一条数据');
      return false;
  }
  const info = this.checkedData[0];
  const drawer = this.drawer.create({
    nzWidth: 720,
    nzTitle: '开通会员',
    nzContent: VipComponent,
    nzContentParams: { info }
  });
  drawer.afterClose.subscribe(res => {
   this.table && this.table._request();
  });
}
}
