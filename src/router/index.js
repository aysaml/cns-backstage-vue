import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Chat from '@/components/chat/Chat'
// import EmpAdv from '@/components/user/EmpAdv'
// import EmpBasic from '@/components/user/EmpBasic'
// import PerEc from '@/components/guide/PerEc'
// import PerEmp from '@/components/guide/PerEmp'
// import PerMv from '@/components/guide/PerMv'
// import PerSalary from '@/components/guide/PerSalary'
// import PerTrain from '@/components/guide/PerTrain'
// import SalMonth from '@/components/salary/SalMonth'
// import SalSearch from '@/components/salary/SalSearch'
// import SalSob from '@/components/salary/SalSob'
// import SalSobCfg from '@/components/salary/SalSobCfg'
// import SalTable from '@/components/salary/SalTable'
// import StaAll from '@/components/place/StaAll'
// import StaPers from '@/components/place/StaPers'
// import StaRecord from '@/components/place/StaRecord'
// import StaScore from '@/components/place/StaScore'
// import SysBasic from '@/components/system/SysBasic'
// import SysCfg from '@/components/system/SysCfg'
// import SysData from '@/components/system/SysData'
// import SysHr from '@/components/system/SysHr'
// import SysInit from '@/components/system/SysInit'
// import SysLog from '@/components/system/SysLog'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      hidden: true
    }, {
      path: '/home',
      name: '欢迎您进入校园导航系统后台！',
      component: Home,
      hidden: true,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '/chat',
          name: '消息',
          component: Chat,
          hidden: true,
          meta: {
            keepAlive: false,
            requireAuth: true
          }
        }
      ]
    }
  ]
})
