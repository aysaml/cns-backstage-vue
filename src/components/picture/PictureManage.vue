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
      <div style="display: flex;justify-content: space-around;flex-wrap: wrap;text-align: left;margin-top: 20px;">
          <el-card style="width: 350px;margin-bottom: 20px" shadow="hover" v-for="(item, index) in pictures" :key="item.id">
            <el-button type="text"
                       style="color: #f6061b;margin: 0px;float: right; padding: 3px 0;width: 15px;height:15px"
                       icon="el-icon-delete" @click="delPicture(item.id,item.picName)"></el-button>
            <img :src="item.url" v-bind:class="{min : minIsActive,max : maxIsActive}" @click="toggleClass(item.url)">
            <div style="padding: 14px;">
              <span>{{item.picName}}</span><br/>
              <span class="pName el-icon-location-outline">{{item.placeName}}</span>
              <div class="bottom clearfix">
                <time class="time el-icon-date">{{item.createTime}}</time><br/>
                <el-button type="text" class="button" @click="preview(item)">审核</el-button>
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
      <div>
        <el-form :model="form" style="margin: 0px;padding: 0px;">
          <div style="text-align: left">
            <el-dialog
              title="图片审核"
              style="padding: 0px;"
              :close-on-click-modal="false"
              :visible.sync="dialogFormVisible"
              width="77%">
              <el-row>
                <el-col :span="6">
                  <div>
                    <el-form-item label="图片编号:" >
                      <el-input  v-model="form.id" size="mini" style="width: 150px"
                                 disabled></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-form-item label="图片地址:" >
                      <el-input  v-model="form.url" size="mini" style="width: 150px"
                                 disabled></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-form-item label="图片名称:">
                      <el-input prefix-icon="el-icon-edit" v-model="form.picName" size="mini" style="width: 150px"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-form-item label="地点名称:">
                      <el-input prefix-icon="el-icon-edit" v-model="form.placeName" size="mini" style="width: 150px"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <div>
                    <el-form-item label="创建日期:" >
                      <el-date-picker
                        v-model="form.createTime"
                        size="mini"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width: 150px"
                        type="date"
                        placeholder="创建日期">
                      </el-date-picker>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-form-item label="更新日期:">
                      <el-date-picker
                        v-model="form.updateTime"
                        size="mini"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width: 150px"
                        type="date"
                        placeholder="更新日期">
                      </el-date-picker>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-form-item label="审核人员:" >
                      <el-input prefix-icon="el-icon-edit" v-model="form.operator" size="mini" style="width: 150px" placeholder="请填写管理账号Id"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-form-item label="审核状态:">
                      <el-select v-model="form.yn" style="width: 150px" size="mini" placeholder="状态" @change="ynChange" clearable>
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <div>
                  <el-form-item label="图片描述：">
                    <textarea v-model="form.remark" style="width: 956px; height: 104px;"></textarea>
                  </el-form-item>
                </div>
              </el-row>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updatePicture">确 定</el-button>
              </div>
            </el-dialog>
          </div>
        </el-form>
      </div>
      <div>
        <el-dialog
          title="图片预览"
          :visible.sync="picDialogVisible"
          fullscreen>
          <img :src="imgUrl" class="max">
          <el-button type="primary" @click="picDialogVisible = false">确 定</el-button>
        </el-dialog>
      </div>
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
          pageSize : 9,
          centerDialogVisible : false,
          dialogFormVisible : false,
          picDialogVisible : false,
          minIsActive: true,
          maxIsActive: false,
          imgUrl : "",
          form : {
            id : "",
            url : "",
            picName : "",
            placeName : "",
            remark : "",
            createTime : "",
            updateTime : "",
            operator : "",
            yn : ""
          }
        }
      },
      mounted:function () {
        this.loadPictureCount();
        this.loadPictures();
      },
      methods : {
        loadPictures(){
          var _this = this;
          this.getRequest("/picture/manage/findPictureListPage?pageNum=" + 1 + "&pageSize=9&picName="+""+"&yn="+ "").then(resp=> {
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
        ynChange(val){
          var _this = this;
          _this.form.yn = val;
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
        },
        delPicture(id,picName){
          this.$confirm('此操作将永久删除[' + picName + '], 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doDelete(id);
          }).catch(() => {
          });
        },
        doDelete(id){
          var _this = this;
          this.deleteRequest("/picture/manage/delete?id=" + id).then(resp=> {
            if (resp.data == 0 && resp.status == 200) {
              _this.centerDialogVisible = true;
              _this.loadPictures();
              _this.loadPictureCount();
            }
          });
        },
        preview(item){
          this.form.id = item.id;
            this.form.url = item.url;
            this.form.picName = item.picName;
            this.form.placeName = item.placeName;
            this.form.remark = item.remark;
            this.form.createTime = item.createTime;
            this.form.updateTime = item.updateTime;
            this.form.operator = item.operator;
            this.form.yn = item.yn;
          this.dialogFormVisible = true;
        },
        toggleClass(url){
          this.imgUrl = url;
          this.picDialogVisible = true;
        },
        updatePicture(){
          var _this = this;
          var picture = {
            id : _this.form.id,
          url : encodeURIComponent(_this.form.url),
          picName : _this.form.picName,
          placeName : _this.form.placeName,
          remark : _this.form.remark,
          createTime : _this.form.createTime,
          updateTime : _this.form.updateTime,
          operator : _this.form.operator,
          yn : _this.form.yn
          };
          this.postJson("/picture/manage/update",JSON.stringify(picture)).then(resp => {
            if (resp && resp.status == 200) {
              if(resp.data == 0){
                _this.success();
                _this.loadPictures();
                _this.loadPictureCount();
              }else {
                _this.failed();
              }
            }else{
              _this.failed();
            }
          });
          _this.dialogFormVisible = false;
        },
        success(){
          this.$message({
            message: "图片审核操作成功！",
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
  .max{width:100%;height:auto;}
  .min{width: 70px;height: 70px;border-radius: 70px}

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
