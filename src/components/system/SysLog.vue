<template>
  <div>
    <h1>
      操作日志管理
    </h1>
    <el-table
      :data="records"
      style="width: 100%"
      tooltip-effect="dark">
      <el-table-column
        label="id"
        prop="id" align="left">
      </el-table-column>
      <el-table-column
        label="行为"
        prop="behavior" align="left">
      </el-table-column>
      <el-table-column
        label="操作人"
        prop="operator" align="left">
      </el-table-column>
      <el-table-column
        label="时间"
        prop="createTime" align="left">
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
        records: [],
        totals: 0,
        pageNum: 1,
        pageSize: 10
      }
    },
    mounted: function () {
      this.loadRecords();
      this.loadRecordsCount();
    },
    methods: {
      loadRecords() {
        var _this = this;
        this.getRequest("/system/record/findRecordListPage?pageNum="+_this.pageNum+"&pageSize="+_this.pageSize).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.records = data;
          }
        });
      },
      loadRecordsCount() {
        var _this = this;
        this.getRequest("/system/record/findRecordCount").then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.totals = data;
          }
        });
      },
      handleSizeChange(val) {
        var _this = this;
        _this.pageSize = val;
        this.loadRecordsCount();
        this.loadRecords();
      },
      handleCurrentChange(val) {
        var _this = this;
        _this.pageNum = val;
        this.loadRecordsCount();
        this.loadRecords();
      }
    }
  }
</script>
