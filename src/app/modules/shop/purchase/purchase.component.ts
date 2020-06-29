import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.less']
})
export class PurchaseComponent implements OnInit {
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
      label: '操作人',
      key: 'operator',
      type: 'select',
      optionsUrl: '/shop/listCustomerService',
      optionKey: { label: 'wxName', value: 'id' }
    },
    {
      label: '套餐类型',
      key: 'salePlanId',
      type: 'select',
      optionsUrl: '/shop/listSalePlan',
      optionKey: { label: 'name', value: 'id' }
    },
    {
      label: '创建日期',
      key: 'createTime',
      type: 'rangepicker',
      valueKey: ['createTimeStart', 'createTimeEnd']
    }
 
  ];

  tableNode = ['ID', '店铺全称', '店主手机', '套餐类型', '单价', '支付金额', '支付时间', '到期时间', '赠送天数', '使用时长', '支付渠道', '操作人', '备注'];
  checkedItems: any[];
  constructor(
    private drawer: NzDrawerService,
  ) { }

  ngOnInit() {
  }
  preview(){

  }


}
