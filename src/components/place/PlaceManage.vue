<template>
  <div>
    <h1>地点管理</h1>
    <el-input placeholder="请输入地点的中文名称" style="width:240px" v-model="searchParam" clearable></el-input>
    <el-select style="width: 130px" size="mini" placeholder="状态" v-model="state" @change="stateChange" clearable>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
    </el-select>
    <el-button type="primary" icon="el-icon-search" @click="searchFor">搜索</el-button>
      <el-table
        :data="places"
        style="width: 100%"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="英文名称">
                <span style="margin-left: 10px">{{ props.row.placeNameEn }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span style="margin-left: 10px">{{ props.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="更新时间">
                <span style="margin-left: 10px">{{ props.row.updateTime }}</span>
              </el-form-item>
              <el-form-item label="操作人">
                <span style="margin-left: 10px">{{ props.row.operator }}</span>
              </el-form-item>
              <el-tooltip content="待审核（-1）,审核通过（1）,审核不通过（0）" placement="bottom" effect="light">
              <el-form-item label="状态">
                <span style="margin-left: 10px">{{ props.row.yn }}</span>
              </el-form-item>
              </el-tooltip>
              <el-form-item label="描述">
                <span style="margin-left: 10px">{{ props.row.descr }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="地点 ID"
          prop="id">
        </el-table-column>
        <el-table-column
          label="地点名称"
          prop="placeNameCh">
        </el-table-column>
        <el-table-column
          label="别名"
          prop="alias">
        </el-table-column>
       <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)" style="margin-left: 10px">审核</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)" style="margin-left: 10px">删除</el-button>
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
  </div>
    </template>

    <style>
      .demo-table-expand {
        font-size: 0;
      }
      .demo-table-expand label{
        width: 90px;
        color: #99a9bf;
      }
      .demo-table-expand el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 80%;
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
            state: ""
          }
        },
        mounted: function () {
          this.loadPlaces();
          this.loadPlacesCount();
        },
        methods: {
          toggleSelection(rows) {
            if (rows) {
              rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
              });
            } else {
              this.$refs.multipleTable.clearSelection();
            }
          },
          handleSelectionChange(val) {
            this.multipleSelection = val;
          },
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
          }
        }
      }
    </script>
