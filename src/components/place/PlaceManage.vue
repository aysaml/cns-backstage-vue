<template>
  <div>
    <h1>地点管理</h1>
    <el-input v-model="searchParam" placeholder="请输入地点的中文名称" style="width:240px"></el-input>
    <el-select v-model="yn" style="width: 130px" size="mini" placeholder="状态">
      <el-option
        key="placeYn"
        label="待审核"
        value="-1">
      </el-option>
      <el-option
        key="placeYn"
        label="审核通过"
        value="1">
      </el-option>
      <el-option
        key="placeYn"
        label="审核不通过"
        value="0">
      </el-option>
    </el-select>
    <el-button type="primary" @click="doFilter">搜索</el-button>
    <el-table
      :data="tableDataEnd"
      border
      style="width: 100%">
      <el-table-column
        prop="placeNameCh"
        label="中文名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="placeNameEn"
        label="英文名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="alias"
        label="别名">
      </el-table-column>
      <el-table-column
        prop="desc"
        label="描述"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="operator"
        label="操作人"
        width="180">
      </el-table-column>
      <el-table-column
        prop="yn"
        label="状态"
        width="180">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
        width="180">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalItems">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tableDataBegin: [
          {
            date: "2016-05-01",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1517 弄"
          },
          {
            date: "2016-05-03",
            name: "王二虎",
            address: "上海市普陀区金沙江路 1519 弄"
          },
          {
            date: "2016-05-04",
            name: "王二虎",
            address: "上海市普陀区金沙江路 1516 弄"
          },
          {
            date: "2016-05-05",
            name: "王三虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-06",
            name: "王三虎",
            address: "上海市普陀区金沙江路 1517 弄"
          },
          {
            date: "2016-05-07",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1519 弄"
          },
          {
            date: "2016-05-08",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄"
          }
        ],
        searchParam: "",
        tableDataEnd: [],
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        filterTableDataEnd: [],
        flag: false
      };
    },
    created() {
      this.totalItems = this.tableDataBegin.length;
      if (this.totalItems > this.pageSize) {
        for (let index = 0; index < this.pageSize; index++) {
          this.tableDataEnd.push(this.tableDataBegin[index]);
        }
      } else {
        this.tableDataEnd = this.tableDataBegin;
      }
    },
    mounted: function () {
      this.initDate();
    },
    methods: {
      //前端搜索功能需要区分是否检索,因为对应的字段的索引不同
      //用两个变量接收currentChangePage函数的参数
      doFilter() {
        if (this.searchParam == "") {
          this.$message.warning("查询条件不能为空！");
          return;
        }
        this.tableDataEnd = []
        //每次手动将数据置空,因为会出现多次点击搜索情况
        this.filterTableDataEnd = []
        this.tableDataBegin.forEach((value, index) => {
          if (value.name) {
            if (value.name.indexOf(this.searchParam) >= 0) {
              this.filterTableDataEnd.push(value)
            }
          }
        });
        //页面数据改变重新统计数据数量和当前页
        this.currentPage = 1
        this.totalItems = this.filterTableDataEnd.length
        //渲染表格,根据值
        this.currentChangePage(this.filterTableDataEnd)
        //页面初始化数据需要判断是否检索过
        this.flag = true
      },
      openData() {
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.handleCurrentChange(this.currentPage);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        //需要判断是否检索
        if (!this.flag) {
          this.currentChangePage(this.tableDataEnd)
        } else {
          this.currentChangePage(this.filterTableDataEnd)
        }
      }, //组件自带监控当前页码
      currentChangePage(list) {
        let from = (this.currentPage - 1) * this.pageSize;
        let to = this.currentPage * this.pageSize;
        this.tableDataEnd = [];
        for (; from < to; from++) {
          if (list[from]) {
            this.tableDataEnd.push(list[from]);
          }
        }
      },
      initData() {
        this.putRequest("/place/manage/findPlaceCount", this.searchParam).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            this.totalItems = data;
          }
        })
      }
    }
  };
</script>
