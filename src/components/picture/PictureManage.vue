<template>
    <div>
      <h1>
        图片管理
      </h1>
      <div>
      <el-input
        placeholder="输入图片名称获取更多图片信息..."
        prefix-icon="el-icon-search"
        size="small"
        style="width: 400px;margin-right: 10px"
        v-model="picName" clearable>
      </el-input>
      <el-select style="width: 130px" size="small" placeholder="状态" v-model="state" @change="stateChange" clearable>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>
      <div style="display: flex;justify-content: space-around;flex-wrap: wrap;text-align: left">
      <el-row style="margin-top: 30px;">
        <el-col :span="8" v-for="(item, index) in pictures" :key="item.id">
          <el-card style="width: 350px;margin-bottom: 20px" shadow="hover">
            <el-button type="text"
                       style="color: #f6061b;margin: 0px;float: right; padding: 3px 0;width: 15px;height:15px"
                       icon="el-icon-delete"></el-button>
            <img :src="item.url" class="image"  style="width: 70px;height: 70px;border-radius: 70px">
            <div style="padding: 14px;">
              <span>{{item.picName}}</span><br/>
              <span class="pName el-icon-location-outline">{{item.placeName}}</span>
              <div class="bottom clearfix">
                <time class="time el-icon-date">{{item.createTime}}</time><br/>
                <el-button type="text" class="button">审核</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
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
    </div>
</template>

<script>
    export default {
      data(){
        return{
          pictures : [],
          placeName : "",
          options: [{
            value: '-1',
            label: '待审核（-1）'
          }, {
            value: '1',
            label: '审核通过（1）'
          }, {
            value: '0',
            label: '审核不通过（0）'
          }],
          picName : "",
          state: "",
          totals:0,
          pageNum : 1,
          pageSize : 9
        }
      },
      mounted:function () {
        this.loadPictureCount();
        this.loadPictures();
      },
      methods : {
        loadPictures(){
          var _this = this;
          this.getRequest("/picture/manage/findPictureListPage?pageNum=" + 1 + "&pageSize=10&picName="+""+"&yn="+ "").then(resp=> {
            if (resp && resp.status == 200) {
              var data = resp.data;
              _this.pictures = data;
            }
          });
        },
        loadPictureCount(){
          var _this = this;
          this.getRequest("/picture/manage/findPictureCount?picName="+""+"&yn="+ "").then(resp=> {
            if (resp && resp.status == 200) {
              var data = resp.data;
              _this.totals = data;
            }
          });
        },
        handleSizeChange(val){
          var _this = this;
          _this.pageSize = val;
          this.getRequest("/picture/manage/findPictureListPage?pageNum=" + _this.pageNum + "&pageSize="+_this.pageSize+"&picName="+_this.picName+"&yn="+ _this.state).then(resp=> {
            if (resp && resp.status == 200) {
              var data = resp.data;
              _this.pictures = data;
            }
          });
          this.getRequest("/picture/manage/findPictureCount?picName=" + _this.picName +"&yn="+ _this.state).then(resp=> {
            if (resp && resp.status == 200) {
              var data = resp.data;
              _this.totals = data;
            }
          });
        },
        handleCurrentChange(val){
          var _this = this;
          _this.pageNum = val;
          this.getRequest("/picture/manage/findPictureListPage?pageNum=" + _this.pageNum + "&pageSize="+_this.pageSize+"&picName="+_this.picName+"&yn="+ _this.state).then(resp=> {
            if (resp && resp.status == 200) {
              var data = resp.data;
              _this.pictures = data;
            }
          });
          this.getRequest("/picture/manage/findPictureCount?picName=" + _this.picName +"&yn="+ _this.state).then(resp=> {
            if (resp && resp.status == 200) {
              var data = resp.data;
              _this.totals = data;
            }
          });
        },
        stateChange(val){
          var _this = this;
          _this.state = val;
        },
        search(){
          var _this = this;
          this.getRequest("/picture/manage/findPictureListPage?pageNum=" + _this.pageNum + "&pageSize="+_this.pageSize+"&picName="+_this.picName+"&yn="+ _this.state).then(resp=> {
            if (resp && resp.status == 200) {
              var data = resp.data;
              _this.pictures = data;
            }
          });
          this.getRequest("/picture/manage/findPictureCount?picName=" + _this.picName +"&yn="+ _this.state).then(resp=> {
            if (resp && resp.status == 200) {
              var data = resp.data;
              _this.totals = data;
              if(_this.totals == 0){
                this.$notify({
                  title: '未查询到相关图片',
                  type : 'info',
                  message: '请您尝试更换一个检索词！',
                  position: 'bottom-right'
                });
              }
            }
          });
        }
      }
    }
</script>

<style scoped>
  .time {
    font-size: 13px;
    margin: auto;
    color: #999;
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
