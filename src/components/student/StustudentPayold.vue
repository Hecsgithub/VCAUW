<template>
    <section class="container" :Loading="allLoading">
      <el-tabs type="border-card">
        <el-tab-pane label="费用缴纳">

         <el-row style="border-radius: 4px">
            <el-col :span="6">
                该缴纳的费用：
            </el-col>
           <el-col :span="18">
             缴费方式：

           </el-col>
         </el-row>
          <el-row>
            <el-col :span="6">
              住宿费：{{dormitoryInfo.rent}}
            </el-col>
            <el-col :span="18">
              <el-button type="primary" @click="zhifubao('住宿费',dormitoryInfo.rent)">支付宝</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              学费：{{studentInfo.c.m.price}}
            </el-col>
            <el-col :span="18">
              <el-button type="primary" @click="zhifubao('学费',studentInfo.c.m.price)">支付宝</el-button>
            </el-col>
          </el-row>


<!--           <span> {{{alipaydata}}}</span>-->

          <div v-html="alipaydata"></div>




        </el-tab-pane>
        <el-tab-pane label="绿色通道">

          <el-row>
            <el-col :span="6" style=" border-radius: 4px">
              “绿色通道”是近年来为切实确保即对被录取入学、经济困难的新生，
              经审核对经济困难无法缴纳学杂费用的，批准暂缓缴纳学杂费，先进入学校学习，
              然后学校帮助这部分学生通过申请国家助学贷款、勤工助学等方式来解决经济困难的教育部
              规定各公办普通高等学校都必须建立的一种制度。
              “绿色通道”是确保普通高校家庭经济困难新生顺利入学的最直接、最有效的措施。
            </el-col>


            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="actionUrl"
                  :auto-upload="false"
                  :limit="10"
                  multiple
                  accept="application/pdf"
                  :before-upload="beforeUpload"
                  :before-remove="beforeRemove"
                  :on-remove="handleRemove"
                  :on-change="fileChange"
                  :file-list="fileList"
                  :drag="trueFlag">
                  <el-button size="small" type="primary">选取文件</el-button>
                  <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
                  <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过2M</div>
                </el-upload>
              </div>
              <el-button type="primary" @click="submitUpload">上传到服务器</el-button>
            </el-col>
          </el-row>





        </el-tab-pane>
      </el-tabs>

    </section>
</template>

<script>
    export default {
        name: "StustudentPay",
      created() {

      },
      mounted() {
        this.initData();
      },
      methods: {
            initData(){
              this.allLoading=true;
              this.postRequest('/student/studentpay/initdata').then(resp => {
                this.studentInfo = resp.data[0];
                this.dormitoryInfo = resp.data[1];
                this.allLoading=false;
                console.info(JSON.stringify(resp.data))
              })
            },
        zhifubao(type,number){
          // this.postRequest('/alipay/page/gotoPayPage').then(resp => {
          //     console.info(resp.data);
          //     this.alipaydata=resp.data;
          //   console.info("页面数据"+this.alipaydata);
          // })

          // window.location.href="/alipay/page/gotoPayPage?subject=学费&totalAmount=15000&body="+this.studentInfo.sb.name+"正在支付15000块学费";

          window.open("/alipay/page/gotoPayPage?subject="+type+"&totalAmount="+number+"&body="+this.studentInfo.sb.name+"正在支付"+number+"块"+type,"_blank");

        },


      },
      data(){
        return {
          studentInfo:{},
          dormitoryInfo:{},
          allLoading:false,

          alipaydata: "",
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
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  }
</style>
