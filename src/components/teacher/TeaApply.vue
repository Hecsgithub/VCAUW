<template>
    <section class="container">
        <el-row>
            <el-col :span="6">
                <div class="divbuju" style="height: 400px ;overflow-y:auto;">
                    <el-row>
                        <el-col>
                          申请状态：<el-select v-model="applystate" placeholder="请选择" @change="getApplyfilestate" clearable>
                            <el-option v-for="item in stateOptions"  :key="item.value" :label="item.label"
                                       :value="item.value"></el-option>
                          </el-select>
                        </el-col>
                    </el-row>
                  <el-row>
                    <el-col :span="8">
                        申请人名单
                    </el-col>
                  </el-row>

                  <div class="divbuju" v-infinite-scroll="load">
                    <div v-for="a in applys" style="margin-bottom: 10px">
                      <el-button type="info" style="width: 100%"  @click="getapplyfile(a)">{{a.ss.sb.name}}</el-button>
                    </div>

                  </div>
                </div>
            </el-col>
            <el-col :span="18">
              <div class="divbuju" style="height: 400px ;overflow-y:auto;">

                <div v-for="af in applyfiles" style="border-bottom:1px solid #000">
                <el-row>
                    <el-col :span="16">{{af.filename}}</el-col>
                    <el-col :span="8"><el-button type="primary" @click="downloadfile(af.fileurl)" round>下载查看</el-button></el-col>
                </el-row>
                  <el-row>
                    <el-col :span="16">对此文件审核意见：{{af.remarks}}</el-col>
                    <el-col :span="8" v-if="ap.state=='未审核'"><el-button type="primary" @click="addremarksFrom(af)" round>审核意见</el-button></el-col>
                  </el-row>
                </div>

                <el-row :gutter="50" v-if="ap.state=='未审核'">
                  <el-col :span="6" :offset="16"><el-button type="success" @click="adoptapply">初步审核通过</el-button></el-col>
                </el-row>

              </div>
            </el-col>
        </el-row>

      <!-- 审核意见 -->
      <el-dialog title="审核意见" :visible.sync="remarksFromVisible" :close-on-click-modal="false">
        <el-form :model="applyfile" label-width="80px" ref="sgincn" :inline="true">
          <el-form-item label="通知" prop="noticeWord">
            <el-input type="textarea" style="width: 600px" :rows="3" placeholder="请输入内容" v-model="applyfile.remarks" auto-complete="off" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="remarksFromVisible = false">取消</el-button>
          <el-button @click="submitremarks">提交</el-button>
        </div>
      </el-dialog>



    </section>
</template>

<script>
    export default {
        name: "TeaApply",
      created() {

      },
      mounted() {
          this.applystate="未审核";
          this.getApplyfilestate();
      },
      methods: {
          //改变事件
        getApplyfilestate(state){
          this.ap={},
          this.getapplys();
        },

        //获取申请
        getapplys(){
          this.applyfiles=[];
          this.postRequest('/teacher/teacherapply/getApply',{
            state:this.applystate
          }).then(resp => {
            this.applys=resp.data;
            console.info("返回申请" + JSON.stringify(resp.data))
          })
        },
        //获取该学生上传文件
        getapplyfile(a){
          this.ap=a;
          this.postRequest('/teacher/teacherapply/getApplyfile',{
            studentId:this.ap.ss.studentId
          }).then(resp => {
            this.applyfiles=resp.data;
            console.info("返回文件" + JSON.stringify(resp.data))
          })

        },

//下载文件
        downloadfile(fileurl){
          window.location="/student/studentpay/download?fileurl="+fileurl;
        },

      //添加意见
        addremarksFrom(af){
          if(af.state=="已审核"){
            this.$message({
              message:"已通过审核！无需再次操作！",
              type:"success"
            });
          }else{
            this.applyfile.id=af.id;
            this.applyfile.remarks=af.remarks;
            this.remarksFromVisible=true;
          }
        },

        //提交意见
        submitremarks(){
          if(this.applyfile.remarks!=""){
            this.postRequest('/teacher/teacherapply/addremarks',{
              id:this.applyfile.id,
              remarks:this.applyfile.remarks
            }).then(resp => {
              this.getapplyfile(this.ap);
              this.remarksFromVisible=false;
            })
          }else{
            this.$message({
              message:"不能提交空白意见！",
              type:"warning"
            });
          }
        },
        //通过审核
        adoptapply(){
          let newapply=this.ap;
          this.$confirm("确认该"+newapply.ss.sb.name+"同学材料检查完毕并可以通过初步申请吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.postRequest('/teacher/teacherapply/applyok',{
              id:newapply.id,
              studentId:newapply.studentId
            }).then(resp => {
              if(resp.status==200){
                this.getapplys();
              }
            })
          })
            .catch(() => {
            });
        },
      },
      data(){
        return {
          applystate:"",

          stateOptions: [
            {
              value: "未审核",
              label: "未审核"
            },
            {
              value: "已审核",
              label: "已审核"
            }
          ],

          //显示当前的申请
          applys:[],

          //存放临时申请
          ap:{},

          //某学生上传文件
          applyfiles:[],


          applyfile:{
            id:"",
            remarks:"",
          },

          //添加窗口
          remarksFromVisible:false,

        }
      }
    }
</script>

<style scoped>

</style>
