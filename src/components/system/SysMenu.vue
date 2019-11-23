<template>
  <div>



    <div class="table"> <!-- 页面表格begin -->
      <div class="container"><!-- 页面内容区begin -->

        <!--新增按钮      -->
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleParentAdd" size="mini" round>新增父菜单
              </el-button>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="grid-content bg-purple-light">
            </div>
          </el-col>
        </el-row>


        <div class="custom-tree-container">
          <div class="block">
            <el-tree   :data="treeData" :props="defaultProps"   node-key="id"    :expand-on-click-node="false" >
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{node.label}}
                           <i class="el-icon-plus" @click="() => append(node,'1')"></i>
                           <i class="el-icon-edit-outline" @click="() => append(node,'2')"></i>
                           <i class="el-icon-delete" @click="() => remove(node, data)"></i>
                           </span>
                        </span>
            </el-tree>
          </div>
        </div>
      </div><!-- 页面内容区end-->
    </div><!-- 页面表格end -->
    <!--新增界面-->
    <el-dialog title="新增or修改" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="组件" prop="component">
          <el-input v-model="addForm.component" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="地址权限" prop="url">
          <el-input v-model="addForm.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由" prop="path">
          <el-input v-model="addForm.path" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单图标" prop="iconcls">
          <el-input v-model="addForm.iconcls" auto-complete="off"></el-input>
        </el-form-item>


        <el-form-item label="登录访问" prop="requireauth">
          <el-select v-model="addForm.requireauth" placeholder="请选择" clearable>
            <el-option  v-for="item in isShowOptions"   :key="item.value"  :label="item.label"  :value="item.value" ></el-option>
          </el-select>
        </el-form-item>
<div v-if="this.parentname !='2'">
  <el-form-item label="父组件" prop="parentId">
    <el-input v-model="this.parentname" auto-complete="off" disabled="true"></el-input>
  </el-form-item>
</div>
   <div v-else>
     <el-form-item label="父组件" prop="parentId">
       <el-button @click="resourceVisible=true" type="text" size="small">{{resourcename}}</el-button>
     </el-form-item>
   </div>


        <el-form-item label="是否显示" prop="enabled">
          <el-select v-model="addForm.enabled" placeholder="请选择" clearable>
            <el-option  v-for="item in isShowOptions"   :key="item.value"  :label="item.label"  :value="item.value" ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="" prop="parentId">
					<el-input v-model="addForm.parentId" auto-complete="off"></el-input>
				</el-form-item> -->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible=false">取消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="组件" :visible.sync="resourceVisible" :close-on-click-modal="false">

      <el-tree :data="resourcetree" :props="defaultProps"  @node-click="handleNodeClick" v-model="addForm.parentid" ref="resourcetreeref"></el-tree>
    </el-dialog>

    <el-dialog title="填写父菜单名称" :visible.sync="handleParentAddVisible" :close-on-click-modal="false">

      <el-row>
          <el-col :span="8">
            父菜单名称：
          </el-col>
        <el-col :span="16">
          <el-input v-model="addparentname" ></el-input>
        </el-col>
      </el-row>


      <el-button @click="handleParentAddVisible=false">取消</el-button>
      <el-button type="primary" @click="addParentSubmit" >提交并立即新建改父菜单的子菜单</el-button>
    </el-dialog>


  </div>
</template>


<script>
  export default {
    data() {
      return {
        treeData:[],
        resourcetree:[],
        addFormVisible:false,
        addLoading:false,
        resourceVisible:false,
        resourcename:"",
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        oldparentid:"",
        parentname:"",
        addForm:{},
        resoureTypeOptions:[{
          value: 'module',
          label: 'module'
        }, {
          value: 'url',
          label: 'url'
        }, {
          value: 'button',
          label: 'button'
        }],
        //输入框验证
        //  permission: "",
        //           resoureUrl: "" ,
        //           parentId:node.data.id
        formRules: {
          resoureName: [{ required: true, message: "请输入资源名称", trigger: "blur" }],
          resoureType: [
            { required: true, message: "请选择资源类型", trigger: "blur" }
          ],

        },
        isShowOptions:[
          {
            value:1,
            label:'true'
          },
          {
            value:0,
            label:'false'
          }
        ],

        //新增父节点数据
        handleParentAddVisible:false,
        addparentname:"",


      };
    },
    methods: {
      handleNodeClick(data) {
        console.log("修改父组件"+data);
        this.addForm.parentid=data.id;
        this.resourcename=data.name;
        this.resourceVisible=false;
      },
      getResult()
      {
        var _this = this;
        //this.listLoading = true;
        this.postRequest('/system/sysmenu/selectallmenu', {

        }).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            console.info(JSON.stringify(data));
            _this.treeData = data;
            _this.resourcetree=data;

          }
        });
      },
      //添加组织结构节点
      append(node,param) {
        var _this = this;
        if(param=='1')
        {
          //新增组织节点时获取当前节点的ID
          //this.addForm.parentId=node.data.id;
          //显示添加组织结构界面
          this.addFormVisible = true;
          this.parentname=node.label;
          this.addForm={
            url:"",
            path:"",
            component:"",
            name:"",
            iconcls:"",
            requireauth:1,
            parentid:node.data.id,
            enabled:1
          };
        }
        if(param=='2')
        {
          console.info("node----->"+node.data)
          this.parentname=param;
          this.resourcename=node.label;
          this.oldparentid=node.data.parentId;
          this.addForm={
            id:node.data.id,
            url:node.data.url,
            path:node.data.path,
            component:node.data.component,
            name:node.data.name,
            iconcls:node.data.iconcls,
            requireauth:node.data.meta.requireAuth,
            parentid:node.data.parentid,
            enabled:node.data.enabled
          };
          //显示添加组织结构界面
          this.addFormVisible = true;

        }

      },
      //删除
      remove(node, data) {
        console.info("deletenode---->"+JSON.stringify(node.data.id));
        this.$confirm("确认删除该记录吗?该删除会连带删除该记录的子记录，请谨慎删除！", "提示", {
          type: "warning"
        })
          .then(() => {
            this.postRequest('/system/sysmenu/deletemenu', {
                id:node.data.id
            }).then(resp => {
              if (resp && resp.status == 200) {
                this.getResult();
              }
            });
          })
          .catch(() => {});

      },
      //新增
      addSubmit: function() {
        var _this=this;
        console.info("addorupdateparam-------->>>"+JSON.stringify(this.addForm.parentid));
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              this.addLoading = true;
              let param = JSON.stringify(Object.assign({}, this.addForm));
              console.info("addorupdateparam-------->>>"+JSON.stringify(param))
              if(this.parentname !='2'){ //是新增
                this.postRequest('/system/sysmenu/insertmenu', {
                  url:_this.addForm.url,
                  path:_this.addForm.path,
                  component:_this.addForm.component,
                  name:_this.addForm.name,
                  iconcls:_this.addForm.iconcls,
                  requireauth:_this.addForm.requireauth,
                  parentid:_this.addForm.parentid,
                  enabled:_this.addForm.enabled
                }).then(resp => {
                  if (resp && resp.status == 200) {
                    this.getResult();
                  }
                });
              }else{
                this.postRequest('/system/sysmenu/updatemenu', {
                  id:_this.addForm.id,
                  url:_this.addForm.url,
                  path:_this.addForm.path,
                  component:_this.addForm.component,
                  name:_this.addForm.name,
                  iconcls:_this.addForm.iconcls,
                  requireauth:_this.addForm.requireauth,
                  parentid:_this.addForm.parentid,
                  enabled:_this.addForm.enabled
                }).then(resp => {
                  if (resp && resp.status == 200) {
                    this.getResult();
                  }
                });
              }
              this.addLoading = false;
              this.addFormVisible = false;
              //重新获取新增后的组织机构数据
              this.getResult();
            });
          }
        });
      },

      handleParentAdd(){
        this.handleParentAddVisible=true;
      },

      addParentSubmit(){
        if(this.addparentname!=""){
          this.postRequest('/system/sysmenu/insertmenu', {
            url:"/",
            path:"/home",
            component:"Home",
            name:this.addparentname,
            iconcls:"fa fa-user-circle-o",
            requireauth:"1",
            parentid:"1",
            enabled:"1"
          }).then(resp => {
            if (resp && resp.status == 200) {
              this.handleParentAddVisible=false;

              //取得刚插入的父菜单的id
              this.addFormVisible = true;
              this.parentname=this.addparentname;
              this.addForm={
                url:"",
                path:"",
                component:"",
                name:"",
                iconcls:"",
                requireauth:1,
                parentid:resp.data.obj.id,
                enabled:1
              };
            }
          });
        }else{
          this.$message({
            message:'父组件名称不能为空',
            type:'error'
          });
        }
      },

    },
    mounted() {
      //获取列表
      this.getResult();

    }
  };
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
