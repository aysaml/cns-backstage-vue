<template>
  <div>
    <h1>
      导游管理
    </h1>
    <div>
      <el-input
        placeholder="输入导游姓名查找..."
        prefix-icon="el-icon-search"
        size="small"
        style="width: 400px;margin-right: 10px"
        v-model="userName" clearable>
      </el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <div style="display: flex;justify-content: space-around;flex-wrap: wrap;text-align: left;margin-top: 20px;">
      <el-card style="width: 350px;margin-bottom: 20px" shadow="hover" v-for="(item, index) in guides" :key="item.id" v-loading="cardLoading[index]">
        <div slot="header" class="clearfix">
          <span>{{item.name}}</span>
        </div>
        <div>
          <div style="width: 100%;display: flex;justify-content: center">
            <img :src="item.imgUrl" alt="item.name" style="width: 70px;height: 70px;border-radius: 70px">
          </div>
          <div style="margin-top: 20px">
            <div><span class="user-info">用户名:{{item.userName}}</span></div>
            <div><span class="user-info">专业:{{item.major}}</span></div>
            <div><span class="user-info">手机号码:{{item.phone}}</span></div>
            <div><span class="user-info">籍贯:{{item.nativePlace}}</span></div>
            <div class="user-info" style="display: flex;align-items: center;margin-bottom: 3px">
              用户状态:
              <el-switch
                style="display: inline;margin-left: 5px"
                v-model="item.yn"
                active-color="#13ce66"
                inactive-color="#aaaaaa"
                active-text="启用"
                :key="item.id"
                @change="stateChange(item.yn,item,index)"
                inactive-text="禁用">
              </el-switch>
            </div>
            <div><span class="user-info">负责地点:{{item.placeNameCh}}</span></div>
            <div><span class="user-info">导游宣言:{{item.remark}}</span></div>
          </div>
        </div>
      </el-card>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page= pageNum
      :page-sizes="[9, 27, 36,45]"
      :page-size= pageSize
      layout="total, sizes, prev, pager, next, jumper"
      :total=totals>
    </el-pagination>
    <div>
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <span>操作成功！</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        guides : [],
        cardLoading : [],
        userName : "",
        placeName : "",
        state: "",
        totals:0,
        pageNum : 1,
        pageSize : 9,
        centerDialogVisible : false,
        dialogFormVisible : false,
        picDialogVisible : false,
        minIsActive: true,
        maxIsActive: false
      }
    },
    mounted:function () {
      this.loadGuideCount();
      this.loadGuides();
    },
    methods : {
      loadGuides(){
        var _this = this;
        this.getRequest("/guide/manage/findGuideListPage?pageNum=" + 1 + "&pageSize=9&userName="+""+"&placeName="+ "").then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.guides = data;
          }
        });
      },
      loadGuideCount(){
        var _this = this;
        this.getRequest("/guide/manage/findGuideCount?userName="+""+"&placeName="+ "").then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.totals = data;
          }
        });
      },
      handleSizeChange(val){
        var _this = this;
        _this.pageSize = val;
        this.getRequest("/guide/manage/findGuideListPage?pageNum=" + _this.pageNum + "&pageSize="+_this.pageSize+"&userName="+_this.userName+"&placeName="+ "").then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.guides = data;
          }
        });
        this.getRequest("/guide/manage/findGuideCount?userName=" + _this.userName +"&placeName="+ "").then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.totals = data;
          }
        });
      },
      handleCurrentChange(val){
        var _this = this;
        _this.pageNum = val;
        this.getRequest("/gudie/manage/findGuideListPage?pageNum=" + _this.pageNum + "&pageSize="+_this.pageSize+"&userName="+_this.userName+"&placeName="+ "").then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.guides = data;
          }
        });
        this.getRequest("/guide/manage/findGuideCount?picName=" + _this.userName +"&placeName="+ "").then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.totals = data;
          }
        });
      },
      stateChange(val,item,index){
        var _this = this;
        if(val){
          val = 1;
        }else{
          val = 0;
        }
        this.putRequest("/guide/manage/updateYn", {
          userId: item.userId,
          placeId: item.placeId,
          yn: val
        }).then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.state = val;
            _this.success();
          } else {
            _this.failed();
          }
        })
      },
      search(){
        var _this = this;
        this.getRequest("/guide/manage/findGuideListPage?pageNum=" + _this.pageNum + "&pageSize="+_this.pageSize+"&userName="+_this.userName+"&placeName="+ "").then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.guides = data;
          }
        });
        this.getRequest("/guide/manage/findGuideCount?userName=" + _this.userName +"&placeName="+ "").then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.totals = data;
            if(_this.totals == 0){
              this.$notify({
                title: '未查询到相关导游信息',
                type : 'info',
                message: '请您尝试更换一个检索词！',
                position: 'bottom-right'
              });
            }
          }
        });
      },
      success(){
        this.$message({
          message: "导游状态修改操作成功！",
          type: 'success'
        });
      },
      failed(){
        this.$message.error('操作失败！');
      }
    }
  }

</script>

<style scoped>
  .user-info {
    font-size: 13px;
    margin: auto;
    color: #20a0ff;
  }

  .pName{
    font-size: 13px;
    color: #666;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
