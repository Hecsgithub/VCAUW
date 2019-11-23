<template>
    <section>
      <el-row>
        <el-col :span="4">
          <div class="divbuju" style="height: 600px">
          <el-row>
            <el-col :span="16">
              正在管理的班级
            </el-col>
          </el-row>
          <el-tree  :data="treeData" :props="defaultProps"   node-key="id"    :expand-on-click-node="false" >
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>
                              <i @click="getclassnotice(node)">{{node.label}}</i>
                           </span>
                        </span>
          </el-tree>
          </div>
        </el-col>
        <el-col :span="20">
            <div class="divbuju" style="height: 600px; overflow-y: auto" >
              <div v-if="this.sgincn.classId!=''">
            <el-row>
                <el-col :span="6">
                  <el-button  type="success" icon="el-icon-circle-plus-outline"  round @click="iauclassnotice(null,'insert')">新增通知</el-button>
                </el-col>
                <el-col :span="6">
                  <el-button type="danger" icon="el-icon-delete" round @click="deleteclassnotice(null,'all')">全部删除</el-button>
                </el-col>
            </el-row>

            <div v-if="classnotice.length!=0">
              <div class="divbuju"  v-for="cn in classnotice">
                <el-row>
                  <el-col :span="20">
                    <el-row>
                      <el-col>{{cn.noticeWord}}</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" :offset="18">{{cn.time}}</el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="4">
                    <el-row>
                      <el-col><el-button type="primary" icon="el-icon-edit" circle @click="iauclassnotice(cn,'update')"></el-button></el-col>
                    </el-row>
                    <el-row>
                      <el-col> <el-button type="danger" icon="el-icon-delete" circle @click="deleteclassnotice(cn,'sgin')"></el-button></el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </div>

              <div v-else>
                <h1>该班级暂无通知，请点击上方新增通知！</h1>
              </div>
              </div>
            </div>
        </el-col>

      </el-row>

      <!-- 新增或修改通知 -->
      <el-dialog title="新增或修改通知" :visible.sync="classnoticeFromVisible" :close-on-click-modal="false">
        <el-form :model="sgincn" label-width="80px" ref="sgincn" :inline="true">
          <el-form-item label="通知" prop="noticeWord">
            <el-input type="textarea" style="width: 600px" :rows="3" placeholder="请输入内容" v-model="sgincn.noticeWord" auto-complete="off" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="classnoticeFromVisible = false">取消</el-button>
          <el-button @click="submitiauclassnotice">提交</el-button>
        </div>
      </el-dialog>



    </section>
</template>

<script>
    export default {
        name: "HeaClassNotice",
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
        //获取该班级通知
        getclassnotice(node){
          this.tempnone=node;
          if(node.data.classId !=undefined){
            let nowclassId="";
            if(node==null){
              nowclassId=this.sgincn.classId;
            }else{
              nowclassId=node.data.classId;
            }
            this.sgincn.classId=nowclassId;
            this.postRequest('/headmaster/getClassNotice',{
              classId:nowclassId
            }).then(resp => {
              if(resp && resp.status == 200){
                this.classnotice=resp.data;
              }
            })
          }else{
            this.sgincn.classId="";
          }

        },

        //新增与修改窗口
        iauclassnotice(cn,type){
          if(this.sgincn.classId!=""){
            this.type=type;
            if(type=='update'){
              this.sgincn.id=cn.id;
              this.sgincn.noticeWord=cn.noticeWord;
            }
            this.classnoticeFromVisible=true;
          }else{
            this.$message({
              message: "请先选择班级！",
              type: "warning"
            });
          }
        },

        //删除方法
        deleteclassnotice(cn,type){

          if(this.sgincn.classId!=""){
          let id = "";
          if(type==='sgin'){//单独删除
            id=cn.id;
          }else{
            for (let i = 0; i < this.classnotice.length; i++) {
              id += this.classnotice[i].id + ",";
            }
            //去掉结尾,
            id = id.substring(0, id.length - 1);
          }
          this.$confirm("确认删除该通知吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.postRequest('/headmaster/deletelistclassnotice', {
              id: id
            }).then(resp => {
              if (resp && resp.status == 200) {
                this.getclassnotice(this.tempnone);
              }
            });
          })
            .catch(() => {
            });
          }else{
            this.$message({
              message: "请先选择班级！",
              type: "warning"
            });
          }
        },

        //新增或修改提交
        submitiauclassnotice(){
          this.postRequest('/headmaster/iauClassNotice', {
            id: this.sgincn.id,
            noticeWord:this.sgincn.noticeWord,
            classId:this.sgincn.classId,
            type: this.type
          }).then(resp => {
            if (resp && resp.status == 200) {
              this.classnoticeFromVisible=false;
              this.sgincn.noticeWord="";
              this.getclassnotice(this.tempnone);
            }
          });
        },

      },
      data(){
        return {
          treeData: [],
          defaultProps: {
            children: 'children',
            label: 'name'
          },
          classnotice:[],

          type:"",
          //打开新增或修改的窗口
          classnoticeFromVisible:false,


          //存放修改或删除的数据
          sgincn:{
            id:"",
            classId:"",
            noticeWord:"",
          },

          // 存放临时班级变量
          tempnone:{},
        }
      }
    }
</script>

<style scoped>

</style>
