import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { NzDrawerRef, NzModalService } from 'ng-zorro-antd';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {


  formGroup: FormGroup
  isVisible: boolean = false;
  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef<boolean>,
    private fb: FormBuilder = new FormBuilder(),
    private modalService: NzModalService
  ) { 
    this.formGroup = this.fb.group({
      id: [],
      classImage: [],
      className: [, [Validators.required]],
      classSlogan: [],
      receptionNum: [, [Validators.required]],
      startMonth: [, [Validators.required]],
      endMonth: [, [Validators.required]],
    });
  }

  ngOnInit() {
  }

  @DrawerClose() close: () => void;

  saveLoading: boolean;
  save() {
    this.isVisible = true;
    this.modalService.success({
      nzTitle: '温馨提示',
      nzContent: '恭喜您注册成功！符合健康管理师报名标准,请尽快缴纳报名费完成报名'
    });
    return false;
    if (this.formGroup.invalid) {
      for (let i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    } else {
      this.saveLoading = true;
      let params = JSON.parse(JSON.stringify(this.formGroup.value));
      this.http.post(`/classmanager/saveClass`, { paramJson: JSON.stringify(params) }).then(res => {
        this.saveLoading = false;
        this.drawerRef.close(true);
      }).catch(err => this.saveLoading = false);
    }
  }
  handleCancel(){
    this.isVisible = false;
  }

}
