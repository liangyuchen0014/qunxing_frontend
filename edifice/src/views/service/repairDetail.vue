<template>
  <div>
    <div class="inner-banner"
      :style="{ backgroundImage: 'url(' + img + ')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center' }">
    </div>

    <div class="desLeft" style="padding-bottom:20px;">
      <el-card>
        <template #header>
          <div class="card-header" style="margin-bottom:0px;">
            <span class="image-font" style="color:black;">报修信息</span>
            <el-button type="primary" @click="this.$router.go(-1)">返回</el-button>
          </div>
        </template>

        <el-descriptions :column="1" :size="large" border>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Discount />
                </el-icon>
                &nbsp;房间id
              </div>
            </template>
            {{ rid }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Setting />
                </el-icon>
                &nbsp;报修类型
              </div>
            </template>
            <div>{{ types[type - 1] }}</div>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Timer />
                </el-icon>
                &nbsp;提单时间
              </div>
            </template>
            {{ repair_time }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Timer />
                </el-icon>
                &nbsp;上门时间
              </div>
            </template>
            {{ maintain_time + ' ' + period }}
          </el-descriptions-item>

        </el-descriptions>

      </el-card>

      <el-card>
        <template #header>
          <div class="card-header" style="margin-bottom:0px;">
            <span class="image-font" style="color:black;">问题描述</span>
          </div>
        </template>
        <div class="card-description">{{ desc }}
        </div>
      </el-card>
    </div>


    <div class="desRight" style="padding-bottom:20px;">
      <el-card>
        <template #header>
          <div class="card-header" style="margin-bottom:0px;">
            <span class="image-font" style="color:black;font-size:16px;">申请人</span>
          </div>
        </template>
        <div>
          <div style="margin-top:-15px;">
            <p class="flexItem"> <el-icon>
                <User />
              </el-icon>&nbsp;姓名：{{ name }}</p>
            <p class="flexItem"> <el-icon>
                <Iphone />
              </el-icon>&nbsp;电话：{{ phone }}</p>
            <p class="flexItem" v-if="company"> <el-icon>
                <PriceTag />
              </el-icon>&nbsp;报修公司:{{ company }}</p>
          </div>
        </div>
      </el-card>

      <el-card>
        <div class="card-header" style="margin-bottom:0px;">
          <span class="image-font" style="color:black;font-size:16px;">处理报修</span>

          <!-- <el-button type="primary" v-if="status==0" @click="serciceBegin()" round>进行处理</el-button> -->
          <el-button type="success" v-if="status == 1" @click="visible = true">完成处理提交</el-button>
          <el-button type="info" v-else>已完成</el-button>
        </div>
      </el-card>
    </div>

    <el-dialog v-model="visible" title="报修记录提交" style="width: 40% !important; min-width: 100px !important;">
      <el-form label-position="right" label-width="120px" :model="form">
        <el-form-item label="解决人：">
          <el-input v-model="form.solver" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="解决时间：">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="解决办法：">
          <el-input type="textarea" v-model="form.solution" maxlength="100" resize="none" show-word-limit
            :autosize="{ minRows: 5 }"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="visible = false">取消</el-button>
          <el-button type="primary" @click="finishDeal()">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
  data() {
    return {
      img: require("@/assets/image/inner-banner6.png"),
      visible: false,
      rid: 0,
      wid: 0,
      name: "",
      username: "张洪源",
      repair_time: "",
      type: 1,
      types: ["水", "电", "机械", "其他"],
      phone: 18904672108,
      desc: "",
      value: "",
      company: "",
      status: 0,
      maintain_time: "",
      period: "",
      form: {
        //问题解决办法，解决时间，解决人
        solver: "",
        date1: "",
        date2: "",
        solution: ""
      }
    }
  },
  mounted() {
    this.wid = this.$route.params.wid;
    console.log(this.wid)
    this.init();
    this.form.solver = this.username
  },
  methods: {
    init() {
      var that = this;
      const formData = new FormData();
      formData.append('token', localStorage.getItem('token'))
      this.$axios({
        method: 'POST',
        url: '/get_user_info',
        data: formData
      })
        .then(function (request) {
          that.form.solver = request.data.data.name
        })
      const formData2 = new FormData();
      formData2.append('token', localStorage.getItem('token'))
      formData2.append('wid', this.wid)
      this.$axios({
        method: 'POST',
        url: '/repairDetail',
        data: formData2
      })
        .then(function (request) {
          var res = request.data.data;
          that.rid = res.rid;
          that.type = res.type;
          that.repair_time = res.repair_time
          that.status = res.status;
          that.desc = res.description;
          that.name = res.contact_name;
          that.phone = res.contact_phone;
          that.company = res.company_name;
          that.maintain_time = res.maintain_day;
          switch (res.period) {
            case 1:
              that.period = "8:00-10:00";
              break;
            case 2:
              that.period = "10:00-12:00";
              break;
            case 3:
              that.period = "14:00-16:00";
              break;
            case 4:
              that.period = "16:00-18:00";
              break;
            default:
              that.period = "8:00-9:59";
              break;
          }
        })

    },
    finishDeal() {
      //submit repair info
      if (this.form.solution && this.form.date1 && this.form.date2) {
        var ymd = new Date(this.form.date1).toLocaleDateString()
        var hms = new Date(this.form.date2).toLocaleTimeString()

        console.log(ymd.split("/").join("-") + ' ' + hms)
        var that = this;
        const formData = new FormData();
        formData.append('token', localStorage.getItem('token'))
        formData.append('wid', that.wid)
        formData.append('solve_time', ymd.replaceAll("/", "-") + ' ' + hms)
        formData.append('solution', that.form.solution)
        this.$axios({
          method: 'POST',
          url: '/repairComplete',
          data: formData
        })
          .then(function (request) {
            console.log(request.data)
            ElMessage({
              message: request.data.msg,
              type: 'success',
            })
            that.init()
            that.visible = false
          })
      }
      else {
        ElMessage({
          message: "请完善维修信息",
          type: 'warning',
        })
      }

    }
  }
}
</script>