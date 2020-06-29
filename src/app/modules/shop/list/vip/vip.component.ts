import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, ViewChild,  Input } from '@angular/core';
import { NzDrawerRef, NzMessageService } from 'ng-zorro-antd';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';

@Component({
  selector: 'app-vip',
  templateUrl: './vip.component.html',
  styleUrls: ['./vip.component.less']
})
export class VipComponent implements OnInit {
  @Input() info;
  salePlanList: any[];
  formGroup: FormGroup
  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef<boolean>,
    private fb: FormBuilder = new FormBuilder(),
    private message: NzMessageService
  ) {
    this.formGroup = this.fb.group({
      shopId: [],
      shopAccountId:[],
      salePlanId:[, [Validators.required]],
      planPeriod:[],
      planFee:[, [Validators.required]],
      freePeriod:[, [Validators.required]],
      actualFee:[, [Validators.required]],
      comment:[, [Validators.required]],
      phone: [, [Validators.required]],
      shopName: [, [Validators.required]],
    });
   }

  ngOnInit() {
    this.info.freePeriod = 0;
    this.info.shopAccountId = this.info.accountId;
    this.formGroup.patchValue(this.info);
    this.formGroup.controls['salePlanId'].valueChanges.subscribe(res=>{
      const item = this.salePlanList.filter(item => item.id == res );
      if(item[0]){
        this.formGroup.patchValue({ planFee: item[0].fee, actualFee:item[0].fee , planPeriod:item[0].period  });
      }
    })
    this.http.post(`/shop/listSalePlan`).then(res => this.salePlanList = res.data);
  }
  @DrawerClose() close: () => void;

  saveLoading: boolean;
  save() {
    console.log(this.formGroup);
    if (this.formGroup.invalid) {
      for (let i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    } else {
      this.saveLoading = true;
      let params = JSON.parse(JSON.stringify(this.formGroup.value));
      this.http.post(`/shop/saveShopOrder`, { paramJson: JSON.stringify(params) }).then(res => {
        this.saveLoading = false;
        this.drawerRef.close(true);
      }).catch(err => this.saveLoading = false);
    }
  }

}
