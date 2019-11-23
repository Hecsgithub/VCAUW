<template>
  <section class="container" :loading="allLoading">

    <div v-if="studentInfo.studentId!=''">
      <div class="divbuju">
        <el-row :gutter="20">
          <el-col :span="15">欢迎登陆！恭喜您正式成为我院{{studentInfo.c.grade}}级{{studentInfo.sb.major}}专业{{studentInfo.c.name}}的学生
            请及时缴纳学杂费完成报到
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">您的学号：</el-col>
          <el-col :span="3">{{studentInfo.studentId}}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">您的宿舍：</el-col>
          <el-col :span="3">{{dormitoryInfo.dong}}{{dormitoryInfo.floor}}-{{dormitoryInfo.room}}</el-col>
        </el-row>
      </div>

      <el-row :gutter="20">

        <el-col :span="10">

          <div class="divbuju" v-if="headmasterInfo != null">
            班主任信息：
            <el-row>
              <el-col :span="12">姓名：{{headmasterInfo.name}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="12"><i class="el-icon-mobile-phone"></i>{{headmasterInfo.phone}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="12">邮箱：{{headmasterInfo.email}}</el-col>
            </el-row>
          </div>

          <div class="divbuju" v-else >
              班主任正在火速上任中！请稍候！
          </div>


        </el-col>

        <el-col :span="14">
          <div class="divbuju">
            <el-row>
              <el-col :span="4">班级通知：</el-col>

            </el-row>
            <hr/>
            <div v-for="cn in classnotice">
              <el-row>
                <el-col>{{cn.noticeWord}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12" :offset="12">{{cn.time}}</el-col>
              </el-row>
              <hr/>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
        初次登陆！正在排队临取学号！请稍后！
    </div>





  </section>
</template>

<script>
  export default {
    name: "Stustudent",
    created() {

    },
    mounted() {
      this.initstudent();
    },
    methods: {
      initstudent() {
        this.allLoading = true;
        var _this = this;
        this.postRequest('/student/status/initStudent').then(resp => {
          this.postRequest('/student/status/initStudent').then(resp => {
            this.studentInfo = resp.data[0];
            this.dormitoryInfo = resp.data[1];
            this.headmasterInfo = resp.data[2];
            this.classnotice=resp.data[3];
            this.allLoading=false;
            console.info(JSON.stringify(resp.data));

          });
        });
      },
    },
    data() {
      return {
        studentInfo: {
          id: "",
          basicId: "",
          studentId: "",
          classId: "",
          sb: {},
          c: {},
        },
        dormitoryInfo: {
          id: "",
          dong: "",
          floor: "",
          room: "",
          sex: "",
          number: "",
          rent: ""
        },
        headmasterInfo: {},

        allLoading: false,


        //班级通知
        classnotice:[],
      }
    }
  }
</script>

<style scoped>
  /*.container {*/
  /*  padding: 30px;*/
  /*  background: #fff;*/
  /*  border: 1px solid #ddd;*/
  /*  border-radius: 5px;*/
  /*  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);*/
  /*}*/
  /*.divbuju {*/
  /*  margin: 30px;*/
  /*  background: #fff;*/
  /*  border: 2px solid #ddd;*/
  /*  border-radius: 5px;*/
  /*  //box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);*/
  /*}*/
</style>
