export const MenuConfig = [
  {
    title : '门店管理',
    brief : '门店',
    key   : '/home/shop',
    icon  : 'customer-service',
    children : [
      {
        title : '门店列表',
        key   : '/home/shop/list',
        isLeaf: true
      },
      {
        title : '购买列表',
        key   : '/home/shop/purchase',
        isLeaf: true
      }
    ]
  },
  {
    title : '首页',
    brief : '首页',
    key   : '/home/index',
    icon  : 'home',
    disabled: true,
    isLeaf: true
  },
  // {
  //   title : '预约管理',
  //   brief : '预约',
  //   key   : '/home/reserve',
  //   icon  : 'desktop',
  //   isLeaf: true
  // },
  // {
  //   title : '学员管理',
  //   brief : '学员',
  //   key   : '/home/customer',
  //   icon  : 'user',
  //   isLeaf: true
  // },

  // {
  //   title : '回访管理',
  //   brief : '回访',
  //   key   : '/home/visit',
  //   icon  : 'customer-service',
  //   children : [
  //     {
  //       title : '待回访',
  //       key   : '/home/visit/stay',
  //       isLeaf: true
  //     },
  //     {
  //       title : '已回访',
  //       key   : '/home/visit/already',
  //       isLeaf: true
  //     },
  //     {
  //       title : '无意向',
  //       key   : '/home/visit/nointention',
  //       isLeaf: true
  //     },
  //     {
  //       title : '全部线索',
  //       key   : '/home/visit/distribution',
  //       isLeaf: true
  //     }
  //   ]
  // },
  // {
  //   title : '事件管理',
  //   brief : '事件',
  //   key   : '/home/event',
  //   icon  : 'appstore',
  //   children : [
  //     {
  //       title : '审核事件',
  //       key   : '/home/event/examine',
  //       isLeaf: true
  //     },
  //     {
  //       title : '个人事件',
  //       key   : '/home/event/list',
  //       isLeaf: true
  //     }
  //   ]
  // }, 
  // {
  //   title : '短信管理',
  //   brief : '短信',
  //   key   : '/home/message',
  //   icon  : 'message',
  //   children : [
  //     {
  //       title : '发送短信', 
  //       key   : '/home/message/sendout',
  //       isLeaf: true
  //     },
  //     {
  //       title : '短信模板',
  //       key   : '/home/message/template',
  //       isLeaf: true
  //     },
  //     {
  //       title : '发送记录',
  //       key   : '/home/message/sendlog',
  //       isLeaf: true
  //     }
  //   ]
  // },        
  // {
  //   title : '教务管理',
  //   brief : '教务',
  //   key   : '/home/education',
  //   icon  : 'book',
  //   children : [
  //     {
  //       title : '课程教案',
  //       key   : '/home/education/plan',
  //       isLeaf: true
  //     },
  //     {
  //       title : '班级课表',
  //       key   : '/home/education/timetable',
  //       isLeaf: true
  //     },
  //     {
  //       title : '日程安排',
  //       key   : '/home/education/schedule',
  //       isLeaf: true
  //     },
  //     {
  //       title : '课程管理',
  //       key   : '/home/education/curriculum',
  //       isLeaf: true
  //     }
  //   ]
  // },
  // {
  //   title : '营养保健',
  //   brief : '营养',
  //   key   : '/home/nutrition',
  //   icon  : 'schedule',
  //   children : [
  //     {
  //       title : '膳食配餐',
  //       key   : '/home/nutrition/catering',
  //       isLeaf: true
  //     }
  //   ]
  // },

  // {
  //   title : '数据中心',
  //   brief : '数据',
  //   key   : '/home/analysis',
  //   icon  : 'database',
  //   children : [
  //     {
  //       title : '收入/退款',
  //       key   : '/home/analysis/management',
  //       isLeaf: true
  //     },
  //     {
  //       title : '全部学位',
  //       key   : '/home/analysis/list',
  //       isLeaf: true
  //     },
  //     {
  //       title : '班级学位',
  //       key   : '/home/analysis/class',
  //       isLeaf: true
  //     },
  //     {
  //       title : '老师服务',
  //       key   : '/home/analysis/teacher',
  //       isLeaf: true
  //     }
  //   ]
  // },
  // {
  //   title : '商品管理',
  //   brief : '商品',
  //   key   : '/home/commodity',
  //   icon  : 'shopping',
  //   children : [
  //     {
  //       title : '卡项',
  //       key   : '/home/commodity/card',
  //       isLeaf: true
  //     },
  //     {
  //       title : '服务',
  //       key   : '/home/commodity/service',
  //       isLeaf: true
  //     }
  //   ]
  // },
  // {
  //   title : '设置',
  //   brief : '设置',
  //   key   : '/home/setting',
  //   icon  : 'setting',
  //   children : [
  //     {
  //       title : '基础设置',
  //       key   : '/home/setting/config',
  //       isLeaf: true
  //     },
  //     {
  //       title : '角色设置',
  //       key   : '/home/setting/role',
  //       isLeaf: true
  //     },
  //     {
  //       title : '账号管理',
  //       key   : '/home/setting/account',
  //       isLeaf: true
  //     },
  //     {
  //       title : '员工管理',
  //       key   : '/home/setting/teacher',
  //       isLeaf: true
  //     },
  //     {
  //       title : '班级管理',
  //       key   : '/home/setting/class',
  //       isLeaf: true
  //     },
  //     {
  //       title : '公告设置',
  //       key   : '/home/setting/notice',
  //       isLeaf: true
  //     },
  //     {
  //       title : '监控管理',
  //       key   : '/home/setting/monitor',
  //       isLeaf: true
  //     },
  //     {
  //       title : '事件设置',
  //       key   : '/home/setting/list',
  //       isLeaf: true
  //     },
  
  //   ]
  // },
];