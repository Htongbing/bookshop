<template>
  <el-table
    :data="tableData"
    border>
    <el-table-column
      prop="date"
      label="最新评论时间">
    </el-table-column>
    <el-table-column
      prop="name"
      label="图书名称">
    </el-table-column>
    <el-table-column
      prop="province"
      label="评论总数">
    </el-table-column>
    <el-table-column label="操作" width="200">
      <template slot-scope="scope">
        <el-button
          size="mini">查看详情</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    methods: {
      handleClick(row) {
        console.log(row);
      }
    },

    data() {
      return {
        tableData: [{
          date: '2018-2-23',
          name: '白金数据',
          province: "3"
        }, {
          date: '2018-3-2',
          name: '鬼吹灯全集',
          province: "1"
        }, {
          date: '2018-3-13',
          name: '岛上书店',
          province: "3"
        }]
      }
    }
  }
</script>

<style>
	.el-table{
		width: 1000px;
		margin: 0 auto;
	}
	.el-table__body td,
	.el-table th.is-leaf{
		text-align: center;
	}
</style>