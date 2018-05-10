
<template>
  <div>
    <h1>地点管理</h1>
    <el-input placeholder="请输入地点的中文名称" style="width:240px" v-model="searchParam"  size="small" clearable></el-input>
    <el-select style="width: 130px"  size="small" placeholder="状态" v-model="state" @change="stateChange" clearable>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
    </el-select>
    <el-button type="primary" icon="el-icon-search"  size="small" @click="searchFor">搜索</el-button>
      <el-table
        :data="places"
        style="width: 100%"
        tooltip-effect="dark">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="英文名称" align="left">
                <span>{{ props.row.placeNameEn }}</span>
              </el-form-item>
              <el-form-item label="创建时间" align="left">
                <span >{{ props.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="更新时间" align="left">
                <span >{{ props.row.updateTime }}</span>
              </el-form-item>
              <el-form-item label="操作人" align="left">
                <span >{{ props.row.operator }}</span>
              </el-form-item>
              <el-tooltip content="待审核（-1）,审核通过（1）,审核不通过（0）" placement="bottom" effect="light">
              <el-form-item label="状态" align="left">
                <span >{{ props.row.yn }}</span>
              </el-form-item>
              </el-tooltip>
              <el-form-item label="描述" align="left">
                <span >{{ props.row.descr }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="地点 ID"
          prop="id" align="left">
        </el-table-column>
        <el-table-column
          label="地点名称"
          prop="placeNameCh" align="left">
        </el-table-column>
        <el-table-column
          label="别名"
          prop="alias" align="left">
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
          title="地点审核"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogFormVisible"
          width="77%">
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="地点编号:" >
                  <el-input  v-model="form.id" size="mini" style="width: 150px"
                  disabled></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="中文名称:">
                  <el-input prefix-icon="el-icon-edit" v-model="form.placeNameCh" size="mini" style="width: 150px"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="英文名称:">
                  <el-input prefix-icon="el-icon-edit" v-model="form.placeNameEn" size="mini" style="width: 150px"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="地点别名:">
                  <el-input prefix-icon="el-icon-edit" v-model="form.alias" size="mini" style="width: 150px"></el-input>
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
              <el-form-item label="地点描述：">
                <textarea v-model="form.descr" style="width: 956px; height: 104px;"></textarea>
              </el-form-item>
            </div>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="updatePlace">确 定</el-button>
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
    </style>

    <script>
      export default {
        data() {
          return {
            places: [],
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
           multipleSelection: [],
            totals:0,
            pageNum : 1,
            pageSize : 10,
            searchParam : "",
            state: "",
            centerDialogVisible : false,
            dialogFormVisible : false,
          form : {
              id : "",
              placeNameCh : "",
              placeNameEn : "",
              alias : "",
              descr : "",
              createTime : "",
              updateTime : "",
              operator : "",
              yn : []
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
            this.getRequest("/place/manage/findPlaceListPage?pageNum=" + 1 + "&pageSize=10&placeNameCh="+""+"&yn="+ "").then(resp=> {
              if (resp && resp.status == 200) {
                var data = resp.data;
                _this.places = data;
              }
            });
          },
          loadPlacesCount(){
            var _this = this;
            this.getRequest("/place/manage/findPlaceCount?searchParam=" + "" +"&yn="+ "").then(resp=> {
              if (resp && resp.status == 200) {
                var data = resp.data;
                _this.totals = data;
              }
            });
          },
          handleSizeChange(val){
            var _this = this;
            _this.pageSize = val;
            this.getRequest("/place/manage/findPlaceListPage?pageNum=" + _this.pageNum + "&pageSize="+_this.pageSize+"&placeNameCh="+_this.searchParam+"&yn="+ _this.state).then(resp=> {
              if (resp && resp.status == 200) {
                var data = resp.data;
                _this.places = data;
              }
            });
            this.getRequest("/place/manage/findPlaceCount?searchParam=" + _this.searchParam +"&yn="+ _this.state).then(resp=> {
              if (resp && resp.status == 200) {
                var data = resp.data;
                _this.totals = data;
              }
            });
          },
          handleCurrentChange(val){
            var _this = this;
            _this.pageNum = val;
            this.getRequest("/place/manage/findPlaceListPage?pageNum=" + _this.pageNum + "&pageSize="+_this.pageSize+"&placeNameCh="+_this.searchParam+"&yn="+ _this.state).then(resp=> {
              if (resp && resp.status == 200) {
                var data = resp.data;
                _this.places = data;
              }
            });
            this.getRequest("/place/manage/findPlaceCount?searchParam=" + _this.searchParam +"&yn="+ _this.state).then(resp=> {
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
          searchFor() {
            var _this = this;
            this.getRequest("/place/manage/findPlaceListPage?pageNum=" + _this.pageNum + "&pageSize=" + _this.pageSize + "&placeNameCh=" + _this.searchParam + "&yn=" + _this.state).then(resp => {
              if (resp && resp.status == 200) {
                var data = resp.data;
                _this.places = data;
              }
            });
            this.getRequest("/place/manage/findPlaceCount?searchParam=" + _this.searchParam + "&yn=" + _this.state).then(resp => {
              if (resp && resp.status == 200) {
                var data = resp.data;
                _this.totals = data;
              }
            });
          },
          delPlace(row){
            this.$confirm('此操作将永久删除[' + row.placeNameCh + '], 是否继续?', '提示', {
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
            this.deleteRequest("/place/manage/delete?id=" + id).then(resp=> {
              if (resp.data == 0 && resp.status == 200) {
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
            _this.form.placeNameCh = row.placeNameCh;
            _this.form.placeNameEn = row.placeNameEn;
            _this.form.alias = row.alias;
            _this.form.descr = row.descr;
            _this.form.createTime = row.createTime;
            _this.form.updateTime = row.updateTime;
            _this.form.operator = row.operator;
            _this.form.yn = row.yn;
          },
          ynChange(val){
            var _this = this;
            _this.form.yn = val;
          },
          updatePlace(){
            var _this = this;
            var place = {
              id: _this.form.id,
              placeNameCh : _this.form.placeNameCh,
              placeNameEn : this.form.placeNameEn,
              alias : this.form.alias,
              descr : this.form.descr,
              createTime : this.form.createTime,
              updateTime : this.form.updateTime,
              operator : this.form.operator,
              yn : this.form.yn};
            this.postJson("/place/manage/update", JSON.stringify(place)).then(resp => {
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
              message: "地点审核操作成功！",
              type: 'success'
            });
          },
          failed(){
            this.$message.error('操作失败！');
          }
        }
      }
    </script>
