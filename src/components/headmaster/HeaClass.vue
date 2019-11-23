<template>
    <section class="container">
      <div class="divbuju">
    <el-row>
        <el-col :span="4">
          <div class="divbuju" style="height: 600px">
            <el-row>
              <el-col :span="16">
                正在管理的班级
              </el-col>
            </el-row>
            <el-tree   :data="treeData" :props="defaultProps"   node-key="id"    :expand-on-click-node="false" >
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>
                              <i @click="getStudent(node)">{{node.label}}</i>
                           </span>
                        </span>
            </el-tree>
          </div>
        </el-col>

      <el-col :span="20">
        <div v-if="this.studentList.length!=0" class="divbuju" style="height: 600px; overflow-y: auto" >
          <el-row>
            <el-col :span="6">
              <el-button type="success" icon="el-icon-download" @click="beforeexportExcel()" size="mini" round>
                导出{{classsname}}学生信息
              </el-button>
            </el-col>
          </el-row>
          <template>
            <!--表格数据及操作-->
            <el-table :data="studentList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                      size="mini"
                      highlight-current-row border
                      class="el-tb-edit mgt20"
                      ref="multipleTable"
                      tooltip-effect="dark"
                      v-loading="studentLoading"
                      >
              <!--索引-->
              <el-table-column type="index" :index="indexMethod" width="35">
              </el-table-column>
              <el-table-column label="姓名" prop="sb.name" width="80">
              </el-table-column>
              <el-table-column label="学号" prop="studentId" width="100">
              </el-table-column>
              <el-table-column label="性别" prop="sb.sex" width="45">
              </el-table-column>
              <el-table-column label="手机号码" prop="sb.phone" width="100">
              </el-table-column>
              <el-table-column label="邮箱" prop="sb.email" width="100">
              </el-table-column>
              <el-table-column label="身份证号" prop="sb.idNumber" width="100">
              </el-table-column>
              <el-table-column label="监护人联系号码" prop="sb.parentPhone" width="100">
              </el-table-column>
              <el-table-column label="地址" prop="sb.adress" width="100">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="200">
                <template slot-scope="scope">  <!-- -->
                  <el-button plain size="small" @click="showdormitory(scope.row)">查看宿舍</el-button>

                </template>
              </el-table-column>
            </el-table>
          </template>
          <br>
          <br>
          <!-- 分页 -->
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="currentPage"
                         :page-sizes="[5, 10, 20, 40]"
                         :page-size="pagesize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="studentList.length">
          </el-pagination>
        </div>
        <div v-else class="divbuju" style="height: 600px; overflow-y: auto" >
          <h1>请选择班级</h1>
        </div>
        </el-col>
    </el-row>


       <el-row>
          <el-col :span="12">
            <div class="divbuju">
              <h1>{{classsname}}新生国内分布图 本班新生共{{numbersum}}人</h1>
              <div :style="{height:'400px',width:'100%'}" id="myEchart"></div>
            </div>
          </el-col>

         <el-col :span="12">
           <div class="divbuju">
             <h1>{{classsname}}新生报到统计图 本班新生共{{numbersum}}人 <el-button type="text" style="color: #9bff23" @click="shownoresportstudent">查看未报到</el-button></h1>
             <div :style="{height:'400px',width:'100%'}" id="myRingEchart"></div>
           </div>
         </el-col>
       </el-row>






      </div>




      <!--  显示该学生宿舍信息-->
      <el-dialog title="学生宿舍" :visible.sync="dormitoryFormVisible" :close-on-click-modal="false" v-loading="dormitoryFormLoading">
        <div>
          <div>
            <template>
              <!--表格数据及操作-->
              <el-table :data="dormitory"
                        size="mini"
                        highlight-current-row border
                        class="el-tb-edit mgt20"
                        ref="multipleTable"
                        tooltip-effect="dark"
                        v-loading="dormitoryFormLoading">

                <el-table-column label="栋" prop="dong">
                </el-table-column>
                <el-table-column label="层" prop="floor">
                </el-table-column>
                <el-table-column label="房间" prop="room">
                </el-table-column>
                <el-table-column label="性别" prop="sex">
                </el-table-column>
                <el-table-column label="几人间" prop="number" :formatter="formatnumber" sortable>
                </el-table-column>
                <el-table-column label="费用/人/年）" prop="rent">
                </el-table-column>

              </el-table>
            </template>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dormitoryFormVisible=false">确定</el-button>
        </div>
      </el-dialog>


      <!--  显示未报到学生信息-->
      <el-dialog title="未报到学生" :visible.sync="noresportstudentFromVisible" :close-on-click-modal="false" v-loading="dormitoryFormLoading">
        <div>
          <div>
            <template>
              <!--表格数据及操作-->
              <el-table :data="noresportstudent"
                        size="mini"
                        highlight-current-row border
                        class="el-tb-edit mgt20"
                        ref="multipleTable"
                        tooltip-effect="dark"
                        >
                <el-table-column type="index" >
                </el-table-column>
                <el-table-column label="姓名" prop="sb.name">
                </el-table-column>
                <el-table-column label="性别" prop="sb.sex">
                </el-table-column>
                <el-table-column label="手机号码" prop="sb.phone">
                </el-table-column>
                <el-table-column label="身份证" prop="sb.idNumber">
                </el-table-column>
                <el-table-column label="邮箱" prop="sb.email">
                </el-table-column>
                <el-table-column label="家长手机" prop="sb.parentPhone">
                </el-table-column>
                <el-table-column label="地址" prop="sb.adress">
                </el-table-column>

              </el-table>
            </template>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="noresportstudentFromVisible=false">确定</el-button>
        </div>
      </el-dialog>

      <!--  提示填写导出文件名-->
      <el-dialog title="填写文件名" :visible.sync="exportFormVisible" :close-on-click-modal="false">
        <el-input v-model="exportname" placeholder="文件名" style="width:100px; heght:30px;"
                  size="mini"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="exportFormVisible=false">取消</el-button>
          <el-button type="primary" @click="exportExcel" >提交</el-button>
        </div>
      </el-dialog>


    </section>
</template>


<script>
  import echarts from "echarts";
  //   import '../../node_modules/echarts/map/js/world.js'
  import '../../assets/js/china.js' // 引入中国地图数据
    export default {
        name: "HeaClass",
      created() {

      },
      mounted() {
        this.inittreeDataByUsers();
      },
      methods: {
          inittreeDataByUsers(){
            this.getRequest('/headmaster/initTreeDataByHeadmaster')
              .then(resp => {
                  if(resp && resp.status == 200){
                    this.treeData=resp.data;
                  }
            })
          },
        //获取学生
        getStudent(node){
          this.classsid=node.data.classId;
            this.classsname=node.data.name;
          this.postRequest('/headmaster/getClassStudent',{
            classId:node.data.classId
          }).then(resp => {
              if(resp && resp.status == 200){
                this.studentList=resp.data;
                this.getTJ(node);
              }
            })
          },



        // 初始页currentPage、初始每页数据数pagesize和数据data
        handleSizeChange: function (size) {
          this.pagesize = size;
          console.log(this.pagesize)  //每页下拉显示数据
        },
        handleCurrentChange: function (currentPage) {
          this.currentPage = currentPage;
          console.log(this.currentPage)  //点击第几页
        },
        indexMethod(index) {
          return index + 1;
        },
        //查看宿舍
        showdormitory(row){
            this.dormitoryFormVisible=true;
            this.dormitoryFormLoading=true;
          this.postRequest('/headmaster/getStudentDormitory',{
            studentId:row.studentId
          }).then(resp => {
            if(resp && resp.status == 200){
              this.dormitory=resp.data;
              this.dormitoryFormLoading=false;
            }
          })
        },
        //获取数据库统计
        getTJ(node){
          this.postRequest('/headmaster/selectallstudentbasicTJ',{
            classId:node.data.classId
          }).then(resp => {
            this.personnumberdata=resp.data[0];
            this.numbersum=resp.data[1];
            this.report=resp.data[2];
            this.noresportstudent=resp.data[3];
            this.chinaConfigure();
            this.ringConfigure();
          });
        },

        //中国地图
        chinaConfigure() {
          // console.log(this.userJson)document.getElementById('myEchart')this.$refs.myEchart
          let myChart = echarts.init(document.getElementById('myEchart')); //这里是为了获得容器所在位置
          window.onresize = myChart.resize;
          var optionMap = { // 进行相关配置
            backgroundColor: "#02AFDB",
            tooltip: {// 鼠标移到图里面的浮动提示框
            },
            dataRange: {
              show: false,
              min: 0,
              max: 1000,
              text: ['High', 'Low'],
              realtime: true,
              calculable: true,
              color: ['orangered', 'yellow', 'lightskyblue']
            },
            geo: { // 这个是重点配置区
              map: 'china', // 表示中国地图
              roam: true,
              label: {
                normal: {
                  show: true, // 是否显示对应地名
                  textStyle: {
                    color: 'rgba(0,0,0,0.4)'
                  }
                }
              },
              itemStyle: {
                normal: {
                  borderColor: 'rgba(0, 0, 0, 0.2)'
                },
                emphasis: {
                  areaColor: null,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  shadowBlur: 20,
                  borderWidth: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            },
            series: [{
              type: 'scatter',
              coordinateSystem: 'geo' // 对应上方配置
            },
              {
                name: '学生人数', // 浮动框的标题
                type: 'map',
                geoIndex: 0,
                data: this.personnumberdata,
              }
            ]
          }

          myChart.setOption(optionMap);
        },

        //环形报道统计图
        ringConfigure() {
          // console.log(this.userJson)document.getElementById('myEchart')this.$refs.myEchart
          let myChart = echarts.init(document.getElementById('myRingEchart')); //这里是为了获得容器所在位置
          window.onresize = myChart.resize;
          var option = {
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              data:['已报到','未报到']
            },
            series: [
              {
                name:'报到情况',
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
                data:this.report
              }
            ]
          };

          myChart.setOption(option);
        },


        //打开未报到窗口
        shownoresportstudent(){
          this.noresportstudentFromVisible=true;
        },

        //excel导出弹窗
        beforeexportExcel(){
            this.exportFormVisible=true;
        },
        //excel导出
        exportExcel(){
          if(this.exportname==""){
            var myDate = new Date();
            var myYear = myDate.getYear();
            var myMonth = myDate.getMonth();
            var myHour= myDate.getHours();
            var myMinute = myDate.getMinutes();
            var mySecond = myDate.getSeconds();
            this.exportname = myYear+myMonth+myHour+myMinute+mySecond;
          }
            window.location="http://localhost:8081/teacher/teacherstudentbasic/exportStudentStatusExcel?exportname="+this.exportname+"&classId="+this.classsid;
          this.exportFormVisible=false;
        },



      },
      data(){
        return {
          treeData: [],
          defaultProps: {
            children: 'children',
            label: 'name'
          },
          // 显示学生表格参数
          studentList: [],
          studentLoading: false,

          currentPage: 1, //初始页
          pagesize: 5,    //    每页的数据

          dormitory:[],
          dormitoryFormLoading:false,
          dormitoryFormVisible:false,


          formatnumber: function (row, column) {
            return row.number == 2 ? "2人间"
              : row.number == 3 ? "3人间"
                :row.number == 4 ? "4人间"
                  : row.number == 5 ? "5人间"
                    : "未知";
          },


          //图数据

          //统计省人数数据
          personnumberdata:[],

          //总人数
          numbersum:"",

          //班级名称
          classsname:"",

          //班级编号
          classsid:"",

          //报道情况数据
          report:[],

          //未报到学生们的名单
          noresportstudent:[],

          noresportstudentFromVisible:false,

          //导出excel数据
          exportname:"",
          exportFormVisible:false,

        }
      }
    }
</script>

<style scoped>
  .container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
  }
</style>
