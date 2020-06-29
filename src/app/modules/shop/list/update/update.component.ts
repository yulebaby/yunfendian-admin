import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzDrawerRef, NzMessageService } from 'ng-zorro-antd';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';
import { AbmComponent } from 'angular-baidu-maps';
declare const BMap: any;

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {
  @Input() info;

  shopTypeList: any[] =[{
    id: 1,
    text: '线下零售'
  },{
    id: 2,
    text: '餐饮'
  },{
    id: 3,
    text: '居民生活/商业服务'
  },{
    id: 4,
    text: '休闲娱乐'
  },{
    id: 5,
    text: '教育/医疗'
  },{
    id: 6,
    text: '其它'
  }];
  formGroup: FormGroup
  isVisible: boolean = false;
  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef<boolean>,
    private fb: FormBuilder = new FormBuilder(),
    private message: NzMessageService
  ) { 
    this.formGroup = this.fb.group({
      id: [],
      phone:[, [Validators.required, Validators.pattern(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)]],
      cascaderAddress: [],
      shopId:[],
      shopName:[],
      shopShortName:[],
      shopImg:[],
      province:[],
      city:[],
      district:[],
      latitude:[],
      longitude:[],
      shopPhone:[],
      wxNumber:[],
      wxQr:[],
      shopType:[],
      address: [],
    });
  }

  ngOnInit() {
    this.info.id = this.info.accountId;
    if(this.info.province && this.info.city){
      this.info.cascaderAddress = [this.info.province, this.info.city]
    }
    this.formGroup.patchValue(this.info);
    this.formGroup.controls['cascaderAddress'].valueChanges.subscribe(data => {
        this.formGroup.patchValue({ province: data[0] });
        this.formGroup.patchValue({ city: data[1] });
    });
    
  }

  @DrawerClose() close: () => void;

  saveLoading: boolean;
  save() {
    if (this.formGroup.invalid) {
      for (let i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    } else {
      this.saveLoading = true;
      let params = JSON.parse(JSON.stringify(this.formGroup.value));
      let sparams = {
        account:{
          id: params.id,
          phone: params.phone
        },
        shop: params
      }
      this.http.post(`/shop/saveShopAndAccount`, { paramJson: JSON.stringify(sparams) }).then(res => {
        this.saveLoading = false;
        this.drawerRef.close(true);
      }).catch(err => this.saveLoading = false);
    }
  }
  handleCancel(){
    this.isVisible = false;
  }


  
    /* ---------------- 默认回显坐标点 ---------------- */
    _mapMarkerInit() {
      if (this._map && this.formGroup.get('longitude').value) {
        let point = new BMap.Point(this.formGroup.get('longitude').value, this.formGroup.get('latitude').value)
        this._map.centerAndZoom(point, 16);
        this._map.addOverlay(new BMap.Marker(point));
      }
    }
  
    @ViewChild('map') mapComp: AbmComponent;
    mapReadLoading: boolean = true;
    private _map: any;
    mapGeocoder;
    _mapAutocomplete;
    onReady(map: any) {
      this.mapReadLoading = false;
      this._map = map;
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
      map.addControl(new BMap.MapTypeControl());
      map.setCurrentCity('北京');
      map.enableScrollWheelZoom(true);;
      map.addEventListener('click', this._mapClick.bind(this));
      this._mapMarkerInit();
      let _this_ = this;
      // 获取 地址/逆地理解析 方法
      let geoc = new BMap.Geocoder();
      this._shopAddressSearch = (text) => {
        // 删除地图覆盖物 （删除原有的点）
        map.clearOverlays();
        // 根据输入内容通过地理解析得到经纬度
        geoc.getPoint(text, function (point) {
          if (point) {
            // 将搜索到的经纬度复制给 form 表单
            _this_.formGroup.patchValue({ longitude: point.lng, latitude: point.lat });
            map.centerAndZoom(point, 16);
            map.addOverlay(new BMap.Marker(point));
          } else {
            _this_.message.warning('您选择地址没有解析到结果');
          }
        });
      }
      this._mapClickSearch = (point: any) => {
        // 将搜索到的经纬度复制给 form 表单
        _this_.formGroup.patchValue({ longitude: point.lng, latitude: point.lat });
        // 删除地图覆盖物 （删除原有的点）
        map.clearOverlays();
        map.centerAndZoom(point, 16);
        map.addOverlay(new BMap.Marker(point));
        // 根据地理解析得到的经纬度， 逆地理解析得到省市区
        geoc.getLocation(point, function (res) {
          _this_.formGroup.patchValue({ address: res.address });
        });
      }
  
    }
    /* --------- 根据输入的详细地址，进行地理、逆地理解析 得到经纬度和所在省市区 --------- */
    _shopAddressSearch: (text: string) => void;
    mapGeocoderSearch() {
      if (this.formGroup.get('address').value) {
        this._shopAddressSearch(this.formGroup.get('address').value);
      } else {
        this.message.warning('请输入门店详细地址');
      }
    }
  
    /* --------- 通过点击地图获取坐标，进行逆地理解析 得到经纬度和所在省市区和详细位置 --------- */
    _mapClickSearch: (point: object) => void;
    _mapClick(e: any) {
      this._mapClickSearch(e.point);
    }
  
  
    /* ------------------------- 省市区级联选择 ------------------------- */
    addressOptions: any[] = [];
    addressLoadData = (node: any, index: number) => {
      return new Promise((resolve) => {
        if (index < 0) {
          this.http.post('/shop/getProvince').then(res => {
            node.children = res.data;
            resolve();
          })
        } else if (index === 0) {
          this.http.post('/shop/getCity', { code: node.code }, false).then(res => {
            res.data.map(res => res.isLeaf = true);
            node.children = res.data;
            resolve();
          })
        } 
      });
    }
  

}
