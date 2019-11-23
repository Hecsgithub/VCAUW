<template>
  <section :Loading="allLoading" v-show="isshow">
    <el-tabs type="border-card" style="margin-top: 20px">
      <el-tab-pane label="费用缴纳">

        <el-row style="border-radius: 4px">
          <el-col :span="6">
            <el-link :underline="false">该缴纳的费用：</el-link>
          </el-col>
          <el-col :span="18">
            <el-link :underline="false"> 缴费方式：</el-link>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-link :underline="false"> 学杂费：{{parseInt(dormitoryInfo.rent)+parseInt(studentInfo.c.m.price)}}</el-link>
          </el-col>
          <el-col :span="18" v-if="pay==null">
            <div v-if="apply==null">
              <el-button  type="primary" @click="zhifubao('学杂费',parseInt(dormitoryInfo.rent)+parseInt(studentInfo.c.m.price))">支付宝</el-button>
            </div>
            <div v-else>
              <el-link :underline="false">正在申请绿色通道</el-link>
            </div>

          </el-col>
          <el-col :span="18" v-else>
            <el-link :underline="false">{{pay.remarks}}</el-link>
          </el-col>
        </el-row>
        <!--           <span> {{{alipaydata}}}</span>-->

        <div v-html="alipaydata"></div>


      </el-tab-pane>

      <el-tab-pane label="绿色通道">
        <div class="divbuju">
        <el-link :underline="false"><h2>介绍</h2></el-link>

        <el-link :underline="false">
          “绿色通道”是为了确保大学录取的新生中因经济困难或突发原因无法缴纳学杂费用的学生能够正常入学的措施。<br/>
          开设“绿色通道”目的是保证所有学生不会因为经济困难而失学，是确保普通高校家庭经济困难新生顺利入学的最直接、最有效的措施。<br/>
          <h3>学生报到当天通过申请通过绿色通道方式入学，先进入学校学习， 然后学校帮助这部分学生通过申请国家助学贷款、勤工助学等方式来解决经济困难。</h3><br/>
          <hr/>
          广西大学行健文理学院每年通过绿色通道方式解决新生入学的后顾之忧，
          通过助学贷款解决学费为主，国家助学金补助生活，勤工助学锻炼能力，
          个性化、精准化资助慰问相结合的方式，通过搭建学生自主实践平台，将经济帮扶和能力帮扶相结，
          让学生能够通过实践解除经济压力并锻炼自身能力，收获更好的发展方向。
        </el-link>

        <el-row>
          <el-col :span="4" :offset="20" v-if="pay==null">
            <el-button type="success" @click="submitfile(10)" :disabled="isok">我要申请</el-button>
          </el-col>

          <el-col :span="4" :offset="20" v-else>
            已缴纳学费，无需申请
          </el-col>
        </el-row>
        </div>

        <div class="divbuju">
        <el-row>
          <el-col :span="4" >
              绿色通道申请追踪
          </el-col>
        </el-row>

        <el-row v-if="apply!=null">
          已提交绿色通道申请资料！<el-btton type="text" style="color: red" @click="showapplyfile">查看上传资料</el-btton>  申请状态：<span style="color: #8aff71">{{apply.state}}</span>
        </el-row>
        <el-row v-else>
            <h3>暂无绿色通道申请</h3>
        </el-row>
        </div>

      </el-tab-pane>
    </el-tabs>

<!--    申请绿色通道，提交材料-->
    <el-dialog title="提交材料" :visible.sync="submitfileVisible" :close-on-click-modal="false">

      <div>
        <em> 上传申请材料，可上传证件的图片或电子版文件，最多同时上传{{filenumber}}份</em>
        <el-upload
          action="http://127.0.0.1:8000/api/UploadFile/"
          list-type="picture-card"
          :auto-upload="false"
          accept=".jpg, .jpeg, .png, .bmp, .doc, .docx, .JPG, .JPEG, .PBG, .BMP，.docx,.DOCX,.doc,.DOC"
          :limit="filenumber"
          :on-change="OnChange"
          :on-remove="OnRemove"
          :on-preview="handlePictureCardPreview"
          :before-remove="beforeRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>

      <el-button @click="noapplyfiles">取消</el-button>
      <el-button type="primary" @click="addapplyfiles">提交资料</el-button>
    </el-dialog>

<!-- 查看我的申请详情   -->
    <el-dialog title="我上传的文件" :visible.sync="trackapplyFromVisible" :close-on-click-modal="false">
      <div class="divbuju" v-for="af in applyfiles">
          <el-row>
            <el-col :span="12">{{af.filename}}</el-col>
            <el-col :span="6"><el-button type="primary" @click="downloadfile(af.fileurl)" round>下载查看</el-button></el-col>
            <el-col :span="6"><el-button type="primary" @click="submitfile(1,af.id)" round>重新上传此文件</el-button></el-col>
          </el-row>
          <el-row>
            <el-col>
             <span style="color: red">{{af.remarks}}</span>
            </el-col>
          </el-row>
      </div>
      <el-button @click="submitfile(10,0)">重新上传所有文件</el-button>
      <el-button @click="trackapplyFromVisible=false">确定</el-button>
    </el-dialog>


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
      initData() {
        this.allLoading = true;
        this.postRequest('/student/studentpay/initdata').then(resp => {
          if(!resp.data[0]){
            this.isshow==false;
              this.$message({
                message:"请稍后，等待领取学号宿舍，可在我的信息页查看！",
                type:"error"
              });
          }else{
            this.studentInfo = resp.data[0];
            this.dormitoryInfo = resp.data[1];
            this.pay = resp.data[2];
            this.apply = resp.data[3];
            if(this.apply==null){
              this.isok=false;
            }
            this.allLoading = false;

            console.info("返回资料" + JSON.stringify(resp.data))
          }
        })
      },
      zhifubao(type, number) {
        // this.postRequest('/alipay/page/gotoPayPage').then(resp => {
        //     console.info(resp.data);
        //     this.alipaydata=resp.data;
        //   console.info("页面数据"+this.alipaydata);
        // })

        // window.location.href="/alipay/page/gotoPayPage?subject=学费&totalAmount=15000&body="+this.studentInfo.sb.name+"正在支付15000块学费";

        window.open("/alipay/page/gotoPayPage?username=" + this.studentInfo.sb.idNumber + "&subject=" + type + "&totalAmount=" + number + "&body=" + this.studentInfo.sb.name + "正在支付" + number + "块" + type, "_blank");

      },
      submitfile(number,id) {
        this.filenumber=number;
        if(id==undefined){
          this.fileid="";
        }else{
          this.fileid=id;
        }
        this.submitfileVisible = true;
        // if(this.apply.state=="已审核"){
        //   this.$message({
        //     message:"已通过审核！无需再次操作！",
        //     type:"success"
        //   });
        // }else{
        //   this.filenumber=number;
        //   if(id==undefined){
        //     this.fileid="";
        //   }else{
        //     this.fileid=id;
        //   }
        //   this.submitfileVisible = true;
        // }
      },

      //下载文件
      downloadfile(fileurl){
        window.location="/student/studentpay/download?fileurl="+fileurl;
      },



      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        console.info(file.url);
        this.dialogVisible = true;
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      OnChange(file,fileList){
        this.fileList=fileList

      },
      OnRemove(file,fileList){
        this.fileList=fileList
      },

      fun(){
        console.log('------------------------')
        console.log(this.fileList)
      },
      noapplyfiles(){
        this.submitfileVisible=false;
        this.fileList=[];
      },


      addapplyfiles() {
        console.info("id"+this.fileid);
        for(let i=0;i<this.fileList.length;i++){
          console.info(JSON.stringify(this.fileList[i].raw));
          this.param.append("files",this.fileList[i].raw)
        }
        this.param.append("id",this.fileid);
        this.uploadFileRequest('/student/studentpay/upload',this.param).then(resp => {
          this.submitfileVisible=false;
          this.initData();
          this.fileList=[];
          this.fileid="";
          this.param=new FormData();
          this.trackapplyFromVisible=false;
        })
      },
      showapplyfile(){
        this.postRequest('/student/studentpay/getApplyfile',{
          studentId:this.studentInfo.studentId
        }).then(resp => {
          this.applyfiles=resp.data;
          console.info("返回文件" + JSON.stringify(resp.data))
        })
        this.trackapplyFromVisible=true;
      },
    },
    data() {
      return {
        //整个页面是否显示
        isshow:true,
        studentInfo: {},
        dormitoryInfo: {},
        allLoading: false,

        alipaydata: "",
        // 转账记录
        pay:{},

        submitfileVisible: false,

        uploadForm: new FormData(),

        param: new FormData(),
        form:{},
        count:0,
        fileList:[],
        dialogVisible:false,
        dialogImageUrl:'',

        //允许同时上传的文件数量
        filenumber :10,


        //申请的数据
        apply:{},

        //申请按钮是否可点击
        isok:true,

        //打开跟进界面
        trackapplyFromVisible:false,

        //重新上传文件id
        fileid:"",
        //显示当前用户下载的文件
        applyfiles:[],
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
