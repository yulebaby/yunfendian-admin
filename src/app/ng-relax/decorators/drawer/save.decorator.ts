import { FormControl } from '@angular/forms';
/**
 * @method 动态添加抽屉组件，点击保存回调方法
 * @param requestPath 请求地址
 * @author phuhoang
 */

export function DrawerSave(requestPath) {
  return function (target, propertyKey) {
    target[propertyKey] = function () {
      if (this.formGroup.invalid) {
        Object.values(this.formGroup.controls).map((control: FormControl) => { control.markAsDirty(); control.updateValueAndValidity() });
      } else {
        this.saveLoading = true;
        Object.keys(this.formGroup.value).map(res => {
          if (this.formGroup.value[res] instanceof Date) {
            this.formGroup.value[res] = formatTime(this.formGroup.value[res]);
          }
        });
        let params = JSON.parse(JSON.stringify(this.formGroup.value));
        this.http.post(requestPath, {
          paramJson: JSON.stringify(params)
        }, true).then(res => {
          this.saveLoading = false;
          this.drawerRef.close(true);
        }).catch(err => this.saveLoading = false);
      }
    }
  }
}

const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join('-');
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
