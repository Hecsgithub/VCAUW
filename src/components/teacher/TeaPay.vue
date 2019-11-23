<template>
    <div class="container">
        <el-row>
          <el-col >
            <div class="divbuju">
              <el-row style="margin-bottom: 0px">
                <el-col>
                  <div class="divbuju" style="height: 50px">
                    <el-row :gutter="20">
                      <el-form :inline="true" :model="ddmForm">

                        <el-col :span="6">
                          <el-form-item>
                            部门：
                            <el-select ref="dept" v-model="ddmForm.dept" placeholder="请选择" @change="deptChange" clearable size="mini">
                              <el-option v-for="item in deptList" :key="item.id" :label="item.name"
                                         :value="item.deptId"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>

                        <el-col :span="6">
                          <el-form-item>
                            系：
                            <el-select ref="department" v-model="ddmForm.department" placeholder="请选择" @change="departmentChange" clearable
                                       size="mini">
                              <el-option v-for="item in departmentList" :key="item.id" :label="item.name"
                                         :value="item.departmentId"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>

                        <el-col :span="6">
                          <el-form-item>
                            专业：
                            <el-select ref="major" v-model="ddmForm.major" placeholder="请选择" @change="majorChange" clearable
                                       size="mini">
                              <el-option v-for="item in majorList" :key="item.id" :label="item.name"
                                         :value="item.majorId"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item>
                            班级：
                            <el-select ref="class" v-model="ddmForm.class" placeholder="请选择" @change="getStudent" clearable size="mini">
                              <el-option v-for="item in classList" :key="item.id" :label="item.name"
                                         :value="item.classId"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-form>

                    </el-row>
                  </div>
                </el-col>
              </el-row>

              <el-row style="margin-bottom: 0px">
                <el-col>
                  <div class="divbuju" style="height: 50px;padding-top: 20px">
                    <i id="etitle">{{echartstitle}}缴费统计图</i>
                  </div>
                </el-col>
              </el-row>

              <el-row style="margin-bottom: 0px">
                <el-col>
                  <div id="mycharts" class="divbuju" style="height: 500px">
                    将显示的图片
                  </div>
                </el-col>
              </el-row>


            </div>
          </el-col>
        </el-row>
    </div>
</template>

<script>
  import echarts from "echarts";
    export default {
        name: "TeaPay",
      created() {

      },
      mounted() {
        this.initDept();
        this.getDate();
      },
      methods: {
        // 获取部门信息
        initDept() {
          this.postRequest('/teacher/teacherclass/getDept', {}).then(resp => {
            if (resp && resp.status == 200) {
              var data = resp.data;
              this.deptList = data;
              console.info("dept--------->" + JSON.stringify(data));
            }
          });
        },

        //部门改变事件
        deptChange(val) {
          this.echartstitle="全院新生";
          this.deptname="";
          this.departmentname="";
          this.majorname="";
          this.classname="";

          //获取选到的文字
          let obj = {};
          obj = this.deptList.find((item)=>{
            return item.deptId === val;
          });
          this.deptname = obj.name;


          this.departmentList = [];
          this.postRequest('/teacher/teacherclass/getDepartmentByDeptId', {
            deptId: this.ddmForm.dept
          }).then(resp => {
            if (resp && resp.status == 200) {
              var data = resp.data;
              this.departmentList = data;
              this.getDate();
            }
          });
        },

        //系改变事件
        departmentChange(val) {
          this.departmentname="";
          this.majorname="";
          this.classname="";

          //获取选到的文字
          let obj = {};
          obj = this.departmentList.find((item)=>{
            return item.departmentId === val;
          });
          this.departmentname = obj.name;

          this.majorList = [],
            this.postRequest('/teacher/teacherclass/getMajorByDepartmentId', {
              departmentId: this.ddmForm.department
            }).then(resp => {
              if (resp && resp.status == 200) {
                var data = resp.data;
                this.majorList = data;
                this.getDate();
              }
            });
        },

        //专业改变事件
        majorChange(val) {
          this.majorname="";
          this.classname="";
          //获取选到的文字
          let obj = {};
          obj = this.majorList.find((item)=>{
            return item.majorId === val;
          });
          this.majorname = obj.name;


          this.classList = [],
            this.postRequest('/teacher/teacherclass/getClassByMajorId', {
              majorId: this.ddmForm.major
            }).then(resp => {
              if (resp && resp.status == 200) {
                var data = resp.data;
                this.classList = data;
                this.getDate();
                console.info("班级信息" + JSON.stringify(this.classList))
              }
            });
        },


        //班级改变事件&&根据参数获取学生信息
        getStudent(val) {

          this.classname="";
          //获取选到的文字
          let obj = {};
          obj = this.classList.find((item)=>{
            return item.classId === val;
          });
          this.classname = obj.name;
          this.getDate();
        },

        //环形报道统计图
        ringConfigure() {
          // console.log(this.userJson)document.getElementById('myEchart')this.$refs.myEchart
          let myChart = echarts.init(document.getElementById('mycharts')); //这里是为了获得容器所在位置
          window.onresize = myChart.resize;
          var option = {
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              data:['已缴费','未缴费','绿色通道']
            },
            series: [
              {
                name:'缴费情况',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data:this.payinfo
              }
            ]
          };

          myChart.setOption(option);
        },

        //请求后台获取数据
        getDate(){
          let word="";
          if(this.deptname!=""){

              word+=this.deptname;
          }
          if(this.departmentname!=""){
            word+=this.departmentname;
          }
          if(this.majorname!=""){
            word+=this.majorname;
          }
          if(this.classname!=""){
            word+=this.classname;
          }
          if(word!=""){
            this.echartstitle=word;
          }
          this.postRequest('/teacher/teacherpay/getPayInfo', {
            deptId: this.ddmForm.dept,
            departmentId: this.ddmForm.department,
            majorId: this.ddmForm.major,
            classId: this.ddmForm.class
          }).then(resp => {
            if (resp && resp.status == 200) {
              var data = resp.data;
              this.payinfo = data;
              this.ringConfigure();
            }
          });
        },

      },
      data(){
        return {
          //显示的文字
          echartstitle:"全院新生",
          ddmForm: {

            class: "",
            major: "",
            department: "",
            dept: "",

          },
          //班级信息
          classList: [],
          classname:"",

          //专业信息
          majorList: [],
          majorname:"",
          //系信息
          departmentList: [],
          departmentname:"",
          //部门信息
          deptList: [],
          deptname:[],

          //缴费情况
          payinfo:[],
        }
      }
    }
</script>

<style scoped>
#etitle{
  /*font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;*/
  color: #37a0dd;
}
</style>
