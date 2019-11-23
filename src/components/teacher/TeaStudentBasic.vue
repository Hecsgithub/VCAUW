<template>
  <section>
  <div class="table"> <!-- 页面表格begin -->
    <div class="container"><!-- 页面内容区begin -->
      <div class="handle-box"> <!-- 搜索区begin -->
        <div class="divbuju">
        <!--工具条-->
        <el-row :gutter="20">
          <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" style="height: 40px">
              <el-form-item>
                姓名：
                <el-input v-model="filters.name" placeholder="姓名" style="width:100px; heght:30px;"
                          size="mini"></el-input>
              </el-form-item>
              <el-form-item>
                身份证：
                <el-input v-model="filters.idNumber" placeholder="身份证" style="width:100px; heght:30px;"
                          size="mini"></el-input>
              </el-form-item>

              <el-form-item>
                性别：
                <el-select v-model="filters.sex" placeholder="请选择" clearable size="mini">
                  <el-option v-for="item in filters.sexOptions" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                专业：
                <el-select v-model="filters.major" placeholder="请选择" clearable size="mini">
                  <el-option v-for="item in majorOptions" :key="item.name" :label="item.name"
                             :value="item.name"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                分班记录：
                <el-select v-model="filters.state" placeholder="请选择" clearable size="mini">
                  <el-option v-for="item in filters.stateOptions" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleUserList()" size="mini">搜索</el-button>
              </el-form-item>

            </el-form>
          </el-col>

        </el-row>
      </div>

      </div> <!-- 搜索区end -->
      <!--新增按钮      -->
      <div class="divbuju" style="padding-top: 20px">
      <el-row>

        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-button type="success" icon="el-icon-upload2" @click="submit($event)" size="mini" round>Excel导入新生信息</el-button> <input type="file"  @change="getFile($event)">
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">
            <el-button type="success" icon="el-icon-download" @click="beforeexportExcel(0)" size="mini" round>新生基础信息导出Excel</el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">
            <el-button type="success" icon="el-icon-download" @click="beforeexportExcel(1)" size="mini" round>新生班级信息导出Excel</el-button>
          </div>
        </el-col>
      </el-row>
      </div>


      <div class="divbuju" style="padding-top: 10px">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleAdd" size="mini" round>新增</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="handleDeleteList" size="mini" round>删除</el-button>
          </div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">
          </div>
        </el-col>
      </el-row>

      <template>
        <!--表格数据及操作-->
        <el-table :data="userList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                  size="mini"
                  highlight-current-row border
                  class="el-tb-edit mgt20"
                  ref="multipleTable"
                  tooltip-effect="dark"
                  v-loading="listLoading"
                  @selection-change="selectChange">
          <!--勾选框-->
          <el-table-column type="selection" width="55">
          </el-table-column>
          <!--索引-->
          <el-table-column type="index" >
          </el-table-column>
          <el-table-column label="编号" prop="id">
          </el-table-column>
          <el-table-column label="姓名" prop="name">
          </el-table-column>
          <el-table-column label="性别" prop="sex">
          </el-table-column>
          <el-table-column label="出生年月" prop="birthday">
          </el-table-column>
          <el-table-column label="手机号码" prop="phone">
          </el-table-column>
          <el-table-column label="身份证" prop="idNumber">
          </el-table-column>
          <el-table-column label="邮箱" prop="email">
          </el-table-column>
          <el-table-column label="家长手机" prop="parentPhone">
          </el-table-column>
          <el-table-column label="地址" prop="adress">
          </el-table-column>
          <el-table-column label="专业" prop="major" >
          </el-table-column>
          <el-table-column label="分班" prop="state" :formatter="formatClass" sortable>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">  <!-- -->
              <el-button size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
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
                     :total="userList.length">
      </el-pagination>

      </div>

      <div class="divbuju">
        <h1>新生国内分布图 本届新生共{{numbersum}}人</h1>
        <div :style="{height:'400px',width:'100%'}" id="myEchart"></div>
      </div>
    </div><!-- 页面内容区end-->

  </div><!-- 页面表格end -->





    <!--新增or修改-->
    <el-dialog title="新增or修改" :visible.sync="addroupdatesbFormVisible" :close-on-click-modal="false">
      <el-form :model="addroupdatesb" label-width="80px"  ref="addroupdatesb">
        <el-form-item label="名字" prop="name">
          <el-input v-model="addroupdatesb.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="addroupdatesb.sex" placeholder="请选择" clearable size="mini">
            <el-option v-for="item in filters.sexOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker  v-model="addroupdatesb.birthday" type="date"  placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addroupdatesb.phone" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="addroupdatesb.idNumber" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addroupdatesb.email" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="父母号码" prop="parentPhone">
          <el-input v-model="addroupdatesb.parentPhone" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="地址" prop="adress">
        <el-input v-model="addroupdatesb.adress" auto-complete="off"></el-input>
      </el-form-item>

        <el-form-item label="专业" prop="major">

          <el-select v-model="addroupdatesb.major" placeholder="请选择" clearable>
            <el-option v-for="item in majorOptions" :key="item.name" :label="item.name"
                       :value="item.name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分班记录" prop="state">

          <el-select v-model="addroupdatesb.state" placeholder="请选择" clearable size="mini">
            <el-option v-for="item in filters.stateOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addroupdatesbFormVisible=false">取消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="addroupdatesbLoading">提交</el-button>
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
    name: "TeaStudentBasic",
    created() {
      this.selectmajors()
    },
    mounted() {
      this.handleUserList();


    },

    beforeDestroy() {
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    },
    methods: {
      // 初始页currentPage、初始每页数据数pagesize和数据data
      handleSizeChange: function (size) {
        this.pagesize = size;
        console.log(this.pagesize)  //每页下拉显示数据
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
        console.log(this.currentPage)  //点击第几页
      },
      handleUserList() {
        this.listLoading=true;
        var _this = this;
        console.info(JSON.stringify(this.filters))
        this.postRequest('/teacher/teacherstudentbasic/selectallstudentbasic', {
          name: this.filters.name,
          sex: this.filters.sex,
          idNumber: this.filters.idNumber,
          major: this.filters.major,
          state: this.filters.state
        }).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            console.info(JSON.stringify(data));
            _this.userList = data;
            //获取统计数据
            _this.getTJ();
            _this.listLoading=false;
          }
        });
      },
      //批量选中
      selectChange: function (val) {
        this.selectList = val;
      },
      //获取数据库中的专业名称
      selectmajors() {
        this.postRequest('/teacher/teacherstudentbasic/selectmajor', {}).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            console.info(JSON.stringify(data));
            this.majorOptions = data;
          }
        });
      },
      handleAdd(){
        this.addroupdatesbFormVisible=true;
      },
      handleEdit(index,row){
        this.addroupdatesb.update="update";
        this.addroupdatesb.id=row.id;
        this.addroupdatesb.name=row.name;
        this.addroupdatesb.sex=row.sex;
        this.addroupdatesb.birthday=row.birthday;
        this.addroupdatesb.phone=row.phone;
        this.addroupdatesb.idNumber=row.idNumber;
        this.addroupdatesb.email=row.email;
        this.addroupdatesb.parentPhone=row.parentPhone;
        this.addroupdatesb.adress=row.adress;
        this.addroupdatesb.major=row.major;
        this.addroupdatesb.state=row.state;
        this.addroupdatesbFormVisible=true;
      },
      addSubmit(){
        this.addroupdatesbLoading=true;
        this.postRequest('/teacher/teacherstudentbasic/addorupdatestudentbasic', {
          id:  this.addroupdatesb.id,
          name: this.addroupdatesb.name,
          sex: this.addroupdatesb.sex,
          birthday: this.addroupdatesb.birthday,
          phone:  this.addroupdatesb.phone,
          idNumber: this.addroupdatesb.idNumber,
          email: this.addroupdatesb.email,
          parentPhone: this.addroupdatesb.parentPhone,
          adress: this.addroupdatesb.adress,
          major: this.addroupdatesb.major,
          state: this.addroupdatesb.state,
          update: this.addroupdatesb.update,
        }).then(resp => {
          this.$refs["addroupdatesb"].resetFields();
            this.handleUserList();
        });
        this.addroupdatesbLoading=false;
        this.addroupdatesbFormVisible=false;
      },
      //批量删除
      handleDeleteList: function () {
        const length = this.selectList.length;
        let id = "";
        for (let i = 0; i < length; i++) {
          id += this.selectList[i].id + ",";
        }
        //去掉结尾,
        id = id.substring(0, id.length - 1);
        console.info(id);
        this.$confirm("确认删除该记录吗?", "提示", {
          type: "warning"
        }).then(() => {
          this.postRequest('/teacher/teacherstudentbasic/deletestudentbasic', {id:id}).then(resp => {
            this.handleUserList();
          });
        })
          .catch(() => {
          });
      },

      //excel导入开始
      getFile: function (event) {
        this.file = event.target.files[0];
        console.log(this.file);
      },
      submit: function (event) {
        if(this.file == null){
          this.$message({
              message: "请选择文件！",
              type: "error"
            });
          return ;
        }
        //阻止元素发生默认的行为
        event.preventDefault();
        let formData = new FormData();
        formData.append("file", this.file);
        this.uploadFileRequest('/teacher/teacherstudentbasic/addstudentbasic', formData).then(resp => {
          this.handleUserList();
        });

      },
        //excel导入结束
      //excel导出弹窗
      beforeexportExcel(id){
        if(id=="1"){
          this.$confirm("确认已划分班级了吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.exportid=id;
            this.exportFormVisible=true;
          });
        }else{
          this.exportid=id;
          this.exportFormVisible=true;
        }
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
        if(this.id=="0"){
          window.location="http://localhost:8081/teacher/teacherstudentbasic/exportdstudentbasic?exportname="+this.exportname;
        }else{
            window.location="http://localhost:8081/teacher/teacherstudentbasic/exportStudentStatusExcel?exportname="+this.exportname;
        }
        this.exportFormVisible=false;
      },


      //获取数据库统计
      getTJ(){
        this.postRequest('/teacher/teacherstudentbasic/selectallstudentbasicTJ').then(resp => {
          this.personnumberdata=resp.data[0];
          console.info(JSON.stringify(this.personnumberdata));
          this.numbersum=resp.data[1];
          this.chinaConfigure();
        });
      },

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


    },
    data() {
      return {
        currentPage: 1, //初始页
        pagesize: 10,    //    每页的数据
        userList: [],
        //搜索区域参数
        filters: {
          name: "",
          sex: "",
          //性别下拉框
          sexOptions: [
            {
              value: "男",
              label: "男"
            },
            {
              value: "女",
              label: "女"
            }
          ],
          idNumber: "",
          major: "",

          state: "0",
          //分班状态下拉框
          stateOptions: [
            {
              value: "1",
              label: "已分班"
            },
            {
              value: "0",
              label: "未分班"
            }
          ],
        },
      //专业下拉框
        majorOptions: [],
        listLoading: false,
        //批量选中data
        selectList: [],

        // 添加与修改使用的数据
        addroupdatesb: {
          id:"",
          name:"",
          sex:"",
          birthday:"",
          phone:"",
          idNumber:"",
          email:"",
          parentPhone:"",
          adress:"",
          major:"",
          state:"",
          update:"",
        },
        addroupdatesbFormVisible:false,
        addroupdatesbLoading:false,

        file:null,
        //分班状态显示转换:formatter="formatNationality" sortable
        formatClass: function(row, column) {
          return row.state == "0"
            ? "未分班"
            : row.state == "1" ? "已分班" : "有误！请注意！";
        },
        exportname:"",
        exportFormVisible:false,


        chart: null,

        //统计省人数数据
        personnumberdata:[],

        //总人数
        numbersum:"",

        //区别是班级信息--》1导出或基本信息--》0导出
        exportid:"",
      }

    },
  }
</script>

<style scoped>
  .container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  }
</style>
