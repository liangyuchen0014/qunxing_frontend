<template>
  <div>
    <!-- <div class="inner-banner" :style="{backgroundImage: 'url(' + img + ')', backgroundSize:'cover', backgroundRepeat: 'no-repeat',backgroundPosition:'center center'}">
      <div class="zz">
        <h2>维修任务</h2>
      </div>
    </div> -->
    

    <div class="serviceGrid">
      <el-row>
        <el-col :span="5" class="flexItem datahead">
          <el-icon><Histogram /></el-icon>
          <span>历史订单量&nbsp;{{ sumTask }}</span>
        </el-col>
        <el-col :span="6" class="flexItem datahead">
          <el-icon><List /></el-icon>
          <span>今日接单&nbsp;{{ todayTask }}</span>
        </el-col>
        <el-col :span="6" class="flexItem datahead">
          <el-icon><Finished /></el-icon>
          <span>今日完成&nbsp;{{ todayFinish }}</span>
        </el-col>
        <el-col :span="6" class="flexItem datahead">
          <el-icon><Odometer /></el-icon>
          <span>今日未完成&nbsp;{{ todayTask-todayFinish }}</span>
        </el-col>
        <el-col :span="1" class="flexItem datahead" style="cursor: pointer;">
          <el-icon @click="refresh()"><Refresh /></el-icon>
        </el-col>
      </el-row>
      <el-card>
        <template #header>
          <div class="card-header" style="margin:0px;">
            <span class="image-font">报修申请列表</span>
            <div v-if="!isfinished">
              <el-button class="button" type="text" @click="this.isfinished = true">查看已完成报修</el-button>
            </div>
            <div v-else>
              <el-button class="button" type="text" @click="this.isfinished = false">返回</el-button>
            </div>
          </div>
        </template>

        <el-table v-if="!isfinished" :data="table1" style="width: 100%">
          <el-table-column label="工单号" width="250">
            <template #default="scope">
              <span class="red"></span>
              <a @click="lookInfo(scope.row)" style="cursor: pointer;">
                {{ scope.row.wid }}
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="repair_time" label="申请时间" sortable column-key="repair_time">
          </el-table-column>
          <el-table-column prop="status" label="报修状态" width="150">
            <template #default="scope">
              <el-tag :type="buttonTypes[scope.row.status]" disable-transitions>{{ process[scope.row.status] }}</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <el-table v-else :data="table2.slice((currentPage-1)*10,currentPage*10)" style="width: 100%">
          <el-table-column label="序号" width="250">
            <template #default="scope">
              <a @click="lookInfo(scope.row)" style="cursor: pointer;">
                {{ scope.row.wid }}
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="repair_time" label="申请时间" sortable column-key="repair_time">
          </el-table-column>
          <el-table-column prop="status" label="报修状态" width="150">
            <el-tag type="success" disable-transitions>已完成</el-tag>
          </el-table-column>
        </el-table>
        <div class="flexItem" style="margin-top:20px;" v-if="isfinished">
          <el-pagination :align='center' 
            @current-change="handleCurrentChange"
            :current-page="currentPage" 
            :page-size="[10]"
            layout="total, prev, pager, next, jumper" 
            :total="table2.length"/>
        </div>

      </el-card>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
  data(){
    return{
        img:require("@/assets/image/inner-banner3.jpg"),
        isfinished: false,
        tool: [10,12,16,18],
        currentPage: 1,
        sumTask: 1,
        todayTask: 4,
        todayFinish: 3,
        rid:"",
        type:"",
        info:"",
        uid: "",
        process:["未处理","进行中"],
        buttonTypes:["info","warning"],
        table1: [],
        table2: [],
        repair:[
            {
                wid: "1",
                repair_time: "2023-6-16",
                maintain_time: "2023-6-20",
                status: 0,
            }
        ]
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    getNowFormatDate() {
      let date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month < 10) month = `0${month}`
      if (strDate < 10) strDate = `0${strDate}`
      return `${year}-${month}-${strDate}`
    },
    init() {      
      var that = this;
      that.table1=[];
      that.table2=[];
      const formData = new FormData();
      formData.append('token', localStorage.getItem('token'))

      this.$axios({
        method: 'POST',
        url: '/repairService',
        data: formData
      })
        .then(function (request) {
          that.repair=request.data.data.repair
          var temp=request.data.data.taskCount
          console.log(request.data.data)
          that.sumTask=temp.sum
          try {
            that.todayTask=eval(temp.today.join("+"));
          } catch (error) {
            console.error(error);
          }
          that.todayFinish=0;
          /*problem here */
          var tod=that.getNowFormatDate()
          for(let i=0;i<that.repair.length;i++)
          {
            if(that.repair[i].maintain_time===tod&&that.repair[i].status==2)
              that.todayFinish++;
            if(that.repair[i].status==2)
              that.table2.push(that.repair[i])
            else
              that.table1.push(that.repair[i])
          }
      })

    },
    lookInfo(index) {
      this.$router.push({
        name: '报修内容界面',
        params: {
          wid: index.wid,
        }
      })
    },
    refresh() {
      this.init()
      ElMessage({
                  message: "更新成功",
                  type: 'success',
                })
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  }
}
</script>

<style scoped>
.el-row{
  margin-bottom: 10px;
  background-color: rgb(254, 254, 254);
  height: 60px;
  box-shadow: 2px 2px 2px 2px rgba(0,0,0,.08);
}
.datahead{
  font-size: 15px;
}

.el-icon{
  font-size: 20px;
  margin-right: 10px;
}
</style>