<template>
  <div>
    <h1>新闻管理</h1>
    <el-select style="width: 130px"  size="small" placeholder="新闻类型" v-model="state" @change="stateChange" clearable>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-button type="primary" icon="el-icon-circle-plus-outline"  size="small" @click="addNews">发布新闻</el-button>
    <el-table
      :data="places"
      style="width: 100%"
      tooltip-effect="dark">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="内容" align="left">
              <span>{{ props.row.content }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="ID"
        prop="id" align="left">
      </el-table-column>
      <el-table-column
        label="标题"
        prop="title" align="left">
      </el-table-column>
      <el-table-column
        label="作者"
        prop="author" align="left">
      </el-table-column>
      <el-table-column
        label="来源"
        prop="source" align="left">
      </el-table-column>
      <el-table-column
        label="类型"
        prop="type" align="left">
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime" align="left">
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="examine(scope.row)" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delPlace(scope.row)" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page= pageNum
      :page-sizes="[10, 20, 30, 40]"
      :page-size= pageSize
      layout="total, sizes, prev, pager, next, jumper"
      :total=totals>
    </el-pagination>
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
    <el-form :model="form" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          title="修改"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogFormVisible"
          width="77%">
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="编号:" >
                  <el-input  v-model="form.id" size="mini" style="width: 150px"
                             disabled></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="标题:">
                  <el-input prefix-icon="el-icon-edit" v-model="form.title" size="mini" style="width: 150px" clearable></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <div>
              <el-form-item label="新闻内容：">
                <textarea v-model="form.content" style="width: 956px; height: 104px;"></textarea>
              </el-form-item>
            </div>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="updatePlace">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div style="text-align: left">
        <el-dialog
          title="发布新闻"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="visible"
          width="77%">
          <el-row>
            新闻图片：
            <el-upload
              class="upload-demo"
              drag
              action="/upload"
              :before-upload="uploadFile"
              :on-success="uploadSuccess"
              :limit="1">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-col :span="6">
              <div>
                <el-form-item label="标题:" >
                  <el-input  prefix-icon="el-icon-edit" v-model="news.title" size="mini" style="width: 150px" clearable></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="作者:">
                  <el-input prefix-icon="el-icon-edit" v-model="news.author" size="mini" style="width: 150px"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="来源:">
                  <el-input prefix-icon="el-icon-edit" v-model="news.source" size="mini" style="width: 150px"></el-input>
                </el-form-item>
              </div>
            </el-col>
            类型：
              <el-select style="width: 130px"  size="small" placeholder="新闻类型" v-model="news.type" clearable>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-row>
          <el-row>
            <div>
              <el-form-item label="新闻梗概：">
                <textarea v-model="news.outline" style="width: 956px; height: 104px;"></textarea>
              </el-form-item>
            </div>
          </el-row>
          <el-row>
            <div>
              <el-form-item label="新闻内容：">
                <textarea v-model="news.content" style="width: 956px; height: 104px;"></textarea>
              </el-form-item>
            </div>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="add">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-left: 0;
    margin-bottom: auto;
    width: 40%;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<script>
  export default {
    data() {
      return {
        places: [],
        multipleSelection: [],
        options: [{
          value: '0',
          label: '校内新闻'
        }, {
          value: '1',
          label: '其他新闻'
        }],
        totals:0,
        pageNum : 1,
        pageSize : 10,
        state: "",
        centerDialogVisible : false,
        dialogFormVisible : false,
        visible : false,
        form : {
          id : "",
          title : "",
          content : ""
        },
        news : {
          title : "",
          outline : "",
          content : "",
          imgUrl : "",
          author : "",
          source : "",
          type : "",
        }
      }
    },
    mounted: function () {
      this.loadPlaces();
      this.loadPlacesCount();
    },
    methods: {
      loadPlaces(){
        var _this = this;
        this.getRequest("/news/getNewsList?pageNum=" + 1 + "&pageSize=10&type="+ 0).then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data.data;
            _this.places = data;
          }
        });
      },
      loadPlacesCount(){
        var _this = this;
        this.getRequest("/news/getNewsCount?type=" + 0).then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data.data;
            _this.totals = data;
          }
        });
      },
      handleSizeChange(val){
        var _this = this;
        _this.pageSize = val;
        this.getRequest("/news/getNewsList?pageNum=" + _this.pageNum + "&pageSize="+_this.pageSize+"&type="+ _this.state).then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data.data;
            _this.places = data;
          }
        });
        this.getRequest("/news/getNewsCount?type=" + _this.state).then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data.data;
            _this.totals = data;
          }
        });
      },
      handleCurrentChange(val){
        var _this = this;
        _this.pageNum = val;
        this.getRequest("/news/getNewsList?pageNum=" + _this.pageNum + "&pageSize="+_this.pageSize+"&type="+ _this.state).then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data.data;
            _this.places = data;
          }
        });
        this.getRequest("/news/getNewsCount?type=" + _this.state).then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data.data;
            _this.totals = data;
          }
        });
      },
      stateChange(val){
        if(val == "" || val == null){
          val = 0;
        }
        var _this = this;
        _this.state = val;
        /**根据类型获取列表*/
        this.getRequest("/news/getNewsList?pageNum=" + _this.pageNum + "&pageSize="+_this.pageSize+"&type="+ _this.state).then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data.data;
            _this.places = data;
          }
        });
        this.getRequest("/news/getNewsCount?type=" + _this.state).then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data.data;
            _this.totals = data;
          }
        });
      },
      delPlace(row){
        this.$confirm('此操作将永久删除[' + row.title + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doDelete(row.id);
        }).catch(() => {
        });
      },
      doDelete(id){
        var _this = this;
        this.deleteRequest("/news/manage/delete?id=" + id).then(resp=> {
          if (resp.data.state == 0 && resp.status == 200) {
            _this.centerDialogVisible = true;
            _this.loadPlaces();
            _this.loadPlacesCount();
          }
        });
      },
      examine(row){
        var _this = this;
        _this.dialogFormVisible = true;
        _this.form.id = row.id;
        _this.form.title = row.title;
        _this.form.content = row.content;
      },
      updatePlace(){
        var _this = this;
        var news = {
          id: _this.form.id,
          title : _this.form.title,
          content : _this.form.content};
        if(news.title == "" || news.title == null){
          this.$message.error('新闻标题不能为空');
          return;
        }

        if(news.content == "" || news.content == null){
          this.$message.error('新闻内容不能为空');
          return;
        }
        this.postJson("/news/manage/update", JSON.stringify(news)).then(resp => {
          if (resp && resp.status == 200) {
            if(resp.data == 0){
              _this.success();
              _this.loadPlaces();
              _this.loadPlacesCount();
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
          message: "操作成功！",
          type: 'success'
        });
      },
      failed(){
        this.$message.error('操作失败！');
      },
      addNews(){
        var _this = this;
        _this.visible = true;
      },
      add() {
        var _this = this;
        var news = {
          title: _this.news.title,
          outline: _this.news.outline,
          content: _this.news.content,
          imgUrl: _this.news.imgUrl,
          author: _this.news.author,
          source: _this.news.source,
          type: _this.news.type
        }
        if(news.title == "" || news.title == null){
          this.$message.error('新闻标题不能为空');
          return;
        }

        if(news.content == "" || news.content == null){
          this.$message.error('新闻内容不能为空');
          return;
        }
        this.postJson("/news/manage/add", JSON.stringify(news)).then(resp => {
          if (resp && resp.status == 200) {
            _this.success();
            _this.visible = false;
            _this.loadPlaces();
            _this.loadPlacesCount();
            _this.news.title = "";
            _this.news.outline = "";
             _this.news.content = "";
             _this.news.imgUrl = "";
            _this.news.author = "";
             _this.news.source = "";
            _this.news.type = "";
          }else{
            _this.failed();
          }
        });
      },
      uploadFile(file) {
        const isIMG = file.type === 'image/PNG';
        const isLt2M = file.size / 1024 < 500;

        if (isIMG) {
          this.$message.error('只能上传PNG图片文件！');
          return false;
        }

        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 500KB!');
          return false;
        }
      },
      uploadSuccess(res, file, fileList){
        if (res.state == 4000) {
          this.$message({
            message: "图片上传成功！",
            type: 'success'
          });
          this.news.imgUrl = res.data;
        } else {
          this.$message.error('图片上传失败！刷新页面重试！');
        }
      }
    }
  }
</script>
