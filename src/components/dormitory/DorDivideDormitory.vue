<template>
    <div class="container">
      <el-row style="margin-bottom: 0px">
        <el-col :span="3">
          <el-button type="success" @click="yjfp">一键分配</el-button>

        </el-col>

        <el-col :span="21">
          <el-switch
            style="display: block"
            v-model="sexboolean"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="男生寝室安排"
            inactive-text="女生寝室安排"
            @change="sexChang">
          </el-switch>
        </el-col>
      </el-row>


      <div class="divbuju">
        <div style="border-bottom:2px solid #ddd;">
          <el-row style="margin-bottom: 0px">

              <el-col :span="4" style="padding-top: 10px">选择宿舍楼层</el-col>
              <el-col :span="12">
                <el-form :inline="true" :model="dormitory">
                  <el-form-item >
                    选择楼栋：
                    <el-select v-model="dormitory.dong" placeholder="请选择学生楼" @change="dongChange"  size="mini">
                      <el-option v-for="item in donglist" :key="item" :label="item"
                                 :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item >
                    选择楼层：
                    <el-select v-model="dormitory.floor" placeholder="请选择楼层" @change="floorChange"  size="mini">
                      <el-option v-for="item in floorlist" :key="item" :label="item"
                                 :value="item"></el-option>
                    </el-select>

                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8" style="padding-top: 10px">
                已选择班级：{{mcname}}
              </el-col>

          </el-row>
        </div>

        <el-row>
          <el-col :span="6">
            <div class="divbuju" style="height: 580px; width: 250px;overflow-y: auto" >
                <div style="border-bottom:2px solid #ddd; height: 30px">
                      需安排的班级{{this.sexboolean? '男':'女'}}生人数，请选择
                </div>
                <div v-for="cls in classlist">
                  <el-button style="width: 250px" @click="clickclass(cls)">{{cls.c.m.name}}专业{{cls.c.name}}{{cls.lessnumber}}人</el-button>
                </div>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="divbuju" style="width: 900px; height: 580px; padding: auto">
              <div  v-for="dor in dormitorylist" @mouseover="mouseoverdiv(dor)" @mouseleave="mouseleavediv(dor)" style="height: 50px;width: 100px;float: left;margin: 10px;" >
                <el-row style="margin-bottom: 0px">
                  <el-col :span="20">
                    <div class="jichudiv" @click="clickdormitory(dor)" :class="{'jichudivred':dor.hasnumber==dor.number,'jichudivgreen':dor.hasnumber>0&&dor.hasnumber<dor.number}">
                      {{dor.roomname}}<br/>
                      {{dor.hasnumber}} / {{dor.number}}
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div v-show="dor.show">
                    <el-row style="margin-bottom: 0px">
                      <el-col>
                        <div style="width: 20px;height: 20px;background-color: #ff0705">
                          <i class="el-icon-refresh-left" @click="refreshdormitory(dor)"></i>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom: 0px">
                      <el-col>
                        <div style="width: 20px;height: 20px;background-color: #4bddb1;margin-top: 10px">
                          <i class="el-icon-search" @click="getstudent(dor)"></i>
                        </div>
                      </el-col>
                    </el-row>
                    </div>
                  </el-col>
                </el-row>

              </div>
            </div>
          </el-col>
        </el-row>

      </div>

      <el-row style="margin-bottom: 0px">
        <el-col :span="4" :offset="12">
          <div class="jichudivred" style="width: 80px;height: 50px; float: left"></div> ：满员宿舍
        </el-col>
          <el-col :span="4" >
          <div class="jichudivgreen" style="width: 80px;height: 50px ;float: left"></div> ：未满员宿舍
          </el-col>
            <el-col :span="4" >
          <div style="width: 80px;height: 50px;background-color: #b6f3ff;float: left" ></div>：空宿舍
        </el-col>
      </el-row>


      <!--  显示该宿舍分配情况-->
      <el-dialog title="分配到的班级及学生" :visible.sync="dormitoryShowInfoVisible" :close-on-click-modal="false"
                 >
        <div class="divbuju">


          <div class="divbuju">
            <el-row>
              <el-col :span="6"><h1>分配到的班级：</h1></el-col>
              <el-col :span="18"> <h1>{{dormitoryClass}}</h1></el-col>
            </el-row>
          </div>


          <div class="divbuju">
            <h1>已报到入住学生名单</h1>
            <template>
              <!--表格数据及操作-->
              <el-table :data="dormitoryStudent"
                        size="mini"
                        highlight-current-row border
                        class="el-tb-edit mgt20"
                        ref="multipleTable"
                        tooltip-effect="dark"
              >
                <!--索引-->
                <el-table-column type="index" :index="indexMethod">
                </el-table-column>
                <el-table-column label="专业" prop="c.m.name">
                </el-table-column>
                <el-table-column label="班级" prop="c.name">
                </el-table-column>
                <el-table-column label="姓名" prop="sb.name">
                </el-table-column>
                <el-table-column label="学号" prop="studentId">
                </el-table-column>
                <el-table-column label="性别" prop="sb.sex">
                </el-table-column>
                <el-table-column label="手机号码" prop="sb.phone">
                </el-table-column>
                <el-table-column label="邮箱" prop="sb.email">
                </el-table-column>

              </el-table>
            </template>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dormitoryShowInfoVisible=false">确定</el-button>
        </div>
      </el-dialog>



    </div>
</template>

<script>
    export default {
        name: "DorDivideDormitory",
      created() {

      },
      mounted() {
      this.initdonglistandclasslist();
      },
      methods: {

          //性别改变事件
        sexChang(){
          this.dormitory.dong="";
          this.dormitory.floor="";
          this.initdonglistandclasslist();
        },

        //初始化根据性别查询楼栋
        initdonglistandclasslist(){
          let sex=this.sexboolean? '男':'女';
          //查班级该性别数据
          this.postRequest('/dormitory/alldormitory/getIinsufficientClassDormitoryBySex', {
            sex: sex
          }).then(resp => {
            this.classlist=resp.data;
          });

          //该性别楼
          this.postRequest('/dormitory/alldormitory/getDormitoryDong', {
            sex: sex
          }).then(resp => {
            this.donglist=resp.data;
            if( this.dormitory.dong==""){
              this.dormitory.dong=this.donglist[0];
            }
            this.dongChange();
          });

        },


        //楼栋改变事件
        dongChange(){
          this.postRequest('/dormitory/alldormitory/getDormitoryFloor', {
            dong: this.dormitory.dong
          }).then(resp => {
            this.floorlist=resp.data;
            if(this.dormitory.floor==""){
              this.dormitory.floor=this.floorlist[0];
            }
            this.floorChange();
          });
        },

        //楼层改变事件
        floorChange(){
          // alert("当前选中的楼层是学生宿舍"+this.dormitory.dong+"栋"+this.dormitory.floor+"层");
          this.postRequest('/dormitory/alldormitory/getallDormitory', {
            dong: this.dormitory.dong,
            floor:this.dormitory.floor
          }).then(resp => {
            this.dormitorylist=resp.data;
            console.info(JSON.stringify(this.dormitorylist));
          });

        },
        //点击选中班级
        clickclass(cls){
          this.mcname=cls.c.m.name+"专业"+cls.c.name;
          this.classId=cls.c.classId;
          this.lessnumber=cls.lessnumber;
        },

        //点击宿舍
        clickdormitory(dor){
          if(this.lessnumber!=""){
              //该宿舍空余床位
              let surplusnumber=dor.number-dor.hasnumber;
              if(surplusnumber>0){
                //该班级获取该宿舍的床位数
                let mynumber=0;
                //人数大于床位，全部都要
                if(this.lessnumber>surplusnumber){
                  mynumber=surplusnumber;
                  this.lessnumber=this.lessnumber-surplusnumber;
                }else{  //人数小于床位，能要多少是多少
                  mynumber=this.lessnumber;
                  this.mcname="未选择，请点击左侧班级列表选择班级";
                  this.lessnumber="";
                }
                //传输参数，班级编号，宿舍编号，该班级获得床位数
                this.postRequest('/dormitory/alldormitory/divideDormitory', {
                  classId: this.classId,
                  dormitoryId:dor.id,
                  number: mynumber
                }).then(resp => {
                  this.initdonglistandclasslist();
                });

              } else{
                this.$message({
                  message:dor.roomname+"宿舍已满员，请重新选择！",
                  type:"warning"
                });
              }
          }else{
            this.$message({
              message:"请先选择左侧班级列表中的班级",
              type:"warning"
            });
          }

        },
        //一键分配宿舍
        yjfp(){
          this.$confirm("确认一键分配宿舍到班级吗?(此分配为全体学生，不分性别进行分配)", "提示", {
            type: "warning"
          }).then(() => {
            this.postRequest('/dormitory/alldormitory/dividedormitory', {}).then(resp => {
              if (resp && resp.status == 200) {
                this.initdonglistandclasslist();
              }
            });
          })
            .catch(() => {
            });
        },

        //鼠标进入
        mouseoverdiv(dor){
          dor.show=true;
        },
        //鼠标离开
        mouseleavediv(dor){
          dor.show=false;
        },

        //宿舍查看已入住学生
        getstudent(dor) {
          this.dormitoryShowInfoVisible = true;
          var _this = this;
          this.postRequest('/dormitory/alldormitory/getStudentByDormitoryId', {
            dormitoryId: dor.id
          }).then(resp => {
            if (resp && resp.status == 200) {
              console.info(JSON.stringify(resp.data))
              let cs = resp.data[0];
              let classname = "";
              if (cs.length > 0) {
                for (let i = 0; i < cs.length; i++) {
                  classname += cs[i].m.name + cs[i].name + "、"
                }
              }
              classname = classname.substring(0, classname.length - 1);
              this.dormitoryClass = classname;
              this.dormitoryStudent = resp.data[1];
              console.info(JSON.stringify(resp.data[0]) + JSON.stringify(resp.data[1]));

            }
          });
        },

        //重置宿舍
        refreshdormitory(dor){
          this.$confirm("确认重置这宿舍信息吗?这些同学将无宿舍分配哦！请尽快分配！", "提示", {
            type: "warning"
          }).then(() => {
            this.postRequest('dormitory/dividedormitory/deletelistDormitoryAllocation', {
              id: dor.id
            }).then(resp => {
              if (resp && resp.status == 200) {
                this.initdonglistandclasslist();
              }
            });
          })
            .catch(() => {
            });
        },
      },
      data(){
        return {

          //选择女寝 false   / 男寝 true
          sexboolean:true,
          //宿舍对象
          dormitory:{
            dong:"",
            floor:"",
            sex:"",
            number:"",
          },

          //宿舍楼栋数集合
          donglist:[],

        //宿舍楼层数集合
          floorlist:[],

          //宿舍楼集合
          dormitorylist:[],

          //班级缺床位集合
          classlist:[],

          //点击选中的班级名称,编号,要求床位
          mcname:"未选择，请点击左侧班级列表选择班级",
          classId:"",
          lessnumber:"",


          //宿舍人员
          dormitoryStudent: [],
          dormitoryClass: "",
          dormitoryShowInfoVisible: false,

        }
      }
    }
</script>

<style scoped>
  /*//定义宿舍图形宽高*/
  .jichudiv{
    width: 80px;
    height: 50px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    float: left;
    margin: 10px;
    background-color: #b6f3ff;
  }
  .jichudivred{
    background-color: #ff518a;
  }
  .jichudivgreen{
    background-color: #8bff56;
  }
</style>
