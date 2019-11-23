<template>
  <div>
    <el-container class="home-container">
      <el-header class="home-header">
        <span class="home_title" style="font-size: 30px">行健迎新系统</span>
        <div style="display: flex;align-items: center;margin-right: 7px">
          <el-badge style="margin-right: 30px" >
            <i class="fa fa-bell-o"  style="cursor: pointer"></i>
          </el-badge>
          <el-dropdown @command="handleCommand">
  <span class="el-dropdown-link home_userinfo" style="display: flex;align-items: center;font-size: 18px">
    {{usertype}}:{{student.name}}{{teacher.name}}
  </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="showmy" divided>个人中心</el-dropdown-item>
              <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <el-drawer
          title="个人信息"
          :visible.sync="drawer"
          :direction="type"
          :close-on-press-escape="true"
        >
          <div v-if="usertype !=='新生'">
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">姓名</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple">{{teacher.name}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">职工号</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple">{{teacher.teacherId}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">密码</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple">{{teacher.password}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">性别</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple">{{teacher.sex}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">手机号码</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple">{{teacher.phone}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">邮箱</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple">{{teacher.email}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">地址</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple">{{teacher.adress}}</div></el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">姓名</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple">{{student.name}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">身份证号</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple">{{user.username}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">密码</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple">{{student.name}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">性别</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple">{{student.sex}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">手机号码</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple">{{student.phone}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">邮箱</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple">{{student.email}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">地址</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple">{{student.adress}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">专业</div></el-col>
              <el-col :span="16"><div class="grid-content bg-purple">{{student.major}}</div></el-col>
            </el-row>
          </div>

        </el-drawer>

      </el-header>
      <el-container>
        <el-aside width="180px" class="home-aside">
          <div style="display: flex;justify-content: flex-start;width: 180px;text-align: left; ">
            <el-menu style="background: #ececec;width: 180px;" unique-opened router>
              <template v-for="(item,index) in this.routes" v-if="!item.hidden">
                <el-submenu :key="index" :index="index+''">
                  <template slot="title">
                    <i :class="item.iconCls" style="color: #20a0ff;width: 14px;"></i>
                    <span slot="title" style="font-size: 18px">{{item.name}}</span>
                  </template>
                  <el-menu-item width="180px"
                                style="padding-left: 30px;padding-right:0px;margin-left: 0px;width: 170px;text-align: left;font-size: 18px"
                                v-for="child in item.children"
                                :index="child.path"
                                :key="child.path" >{{child.name}}
                  </el-menu-item>
                </el-submenu>
              </template>
            </el-menu>
          </div>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }" style="font-size: 18px">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-text="this.$router.currentRoute.name" style="font-size: 18px"></el-breadcrumb-item>
          </el-breadcrumb>
          <keep-alive>
            <router-view v-if="this.$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!this.$route.meta.keepAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import {Message} from 'element-ui'

  export default{
    mounted: function () {
//      this.devMsg();
     this.getuser();
    },
    components: {

    },
    methods: {


      // 根据用户基础信息获取用户详细信息
      getuser(){
        var _this = this;
        this.postRequest('/selectuserinfobyid', {}).then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data;
            if(data.msg=='新生'){
              _this.usertype="新生";
              _this.student=data.obj;
            }else{
              _this.usertype=data.msg;
              _this.teacher=data.obj;
            }
            console.info(data.obj)
          }
        });
      },

      handleCommand(cmd){
        var _this = this;
        if (cmd == 'logout') {
          this.$confirm('注销登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.getRequest("/logout");
            _this.$store.commit('logout');
            _this.$router.replace({path: '/'});
          }).catch(() => {
            _this.$message({
              type: 'info',
              message: '取消'
            });
          });
        }else if(cmd == 'showmy'){
          _this.drawer=true;
        }
      }
    },
    data(){
      return {
        type:"rtl",
        drawer:false ,
        usertype: '',
        student:{
          id:'',
          name:'',
          sex:'',
          birthday:'',
          phone:'',
          idNumber:'',
          email:'',
          parentPhone:'',
          adress:'',
          major:'',
          state:''
        },

        teacher:{
          id:'',
          teacherId:'',
          password:'',
          name:'',
          sex:'',
          phone:'',
          email:'',
          adress:''
        }
      }
    },
    computed: {
      user(){
        return this.$store.state.user;
      },
      routes(){
        return this.$store.state.routes
      }
    }
  }
</script>
<style>

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }

  .home-container {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }

  .home-header {
    background-color: #20a0ff;
    color: #333;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: content-box;
    padding: 0px;
  }

  .home-aside {
    background-color: #ECECEC;
  }

  .home-main {
    background-color: #fff;
    color: #000;
    text-align: center;
    margin: 0px;
    padding: 0px;;
  }

  .home_title {
    color: #fff;
    font-size: 22px;
    display: inline;
    margin-left: 8px;
  }

  .home_userinfo {
    color: #fff;
    cursor: pointer;
  }

  .home_userinfoContainer {
    display: inline;
    margin-right: 20px;
  }

  .el-submenu .el-menu-item {
    width: 180px;
    min-width: 175px;
  }
</style>
























<!--<template>-->
<!--  <el-container class="home_container">-->
<!--    <el-header>-->
<!--      <div class="home_title">当当迎新系统</div>-->
<!--      <div class="home_userinfoContainer">-->
<!--        <el-dropdown @command="handleCommand">-->
<!--  <span class="el-dropdown-link home_userinfo">-->
<!--    {{currentUserName}}<i class="el-icon-arrow-down el-icon&#45;&#45;right home_userinfo"></i>-->
<!--  </span>-->
<!--          <el-dropdown-menu slot="dropdown">-->
<!--            <el-dropdown-item command="sysMsg">系统消息</el-dropdown-item>-->
<!--            <el-dropdown-item command="MyArticle">我的文章</el-dropdown-item>-->
<!--            <el-dropdown-item command="MyHome">个人主页</el-dropdown-item>-->
<!--            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>-->
<!--          </el-dropdown-menu>-->
<!--        </el-dropdown>-->
<!--      </div>-->
<!--    </el-header>-->
<!--    <el-container>-->
<!--      <el-aside width="200px">-->
<!--        <el-menu-->
<!--          default-active="0"-->
<!--          class="el-menu-vertical-demo" style="background-color: #ECECEC" router>-->
<!--          <template v-for="(item,index) in this.$router.options.routes" v-if="!item.hidden">-->
<!--            <el-submenu :index="index+''" v-if="item.children.length>1" :key="index">-->
<!--              <template slot="title">-->
<!--                <i :class="item.iconCls"></i>-->
<!--                <span>{{item.name}}</span>-->
<!--              </template>-->
<!--              <el-menu-item v-for="child in item.children" v-if="!child.hidden" :index="child.path" :key="child.path">-->
<!--                {{child.name}}-->
<!--              </el-menu-item>-->
<!--            </el-submenu>-->
<!--            <template v-else>-->
<!--              <el-menu-item :index="item.children[0].path">-->
<!--                <i :class="item.children[0].iconCls"></i>-->
<!--                <span slot="title">{{item.children[0].name}}</span>-->
<!--              </el-menu-item>-->
<!--            </template>-->
<!--          </template>-->
<!--        </el-menu>-->
<!--      </el-aside>-->
<!--      <el-container>-->
<!--       <el-main>  &lt;!&ndash; 主体&ndash;&gt;-->
<!--          <el-breadcrumb separator-class="el-icon-arrow-right">-->
<!--            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>-->
<!--            <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>-->
<!--          </el-breadcrumb>-->
<!--          <keep-alive>-->
<!--            <router-view v-if="this.$route.meta.keepAlive"></router-view>-->
<!--          </keep-alive>-->
<!--          <router-view v-if="!this.$route.meta.keepAlive"></router-view>-->
<!--        </el-main>-->
<!--      </el-container>-->
<!--    </el-container>-->
<!--  </el-container>-->
<!--</template>-->

<!--<script>-->
<!--    export default {-->
<!--        name: "Home",-->

<!--      data(){-->
<!--        return {-->
<!--          currentUserName: ''-->
<!--        }-->
<!--      }-->


<!--    }-->
<!--</script>-->

<!--<style scoped>-->
<!--  .home_container {-->
<!--    height: 100%;-->
<!--    position: absolute;-->
<!--    top: 0px;-->
<!--    left: 0px;-->
<!--    width: 100%;-->
<!--  }-->

<!--  .el-header {-->
<!--    background-color: #20a0ff;-->
<!--    color: #333;-->
<!--    text-align: center;-->
<!--    display: flex;-->
<!--    align-items: center;-->
<!--    justify-content: space-between;-->
<!--  }-->

<!--  .el-aside {-->
<!--    background-color: #ECECEC;-->
<!--  }-->

<!--  .el-main {-->
<!--    background-color: #fff;-->
<!--    color: #000;-->
<!--    text-align: center;-->
<!--  }-->

<!--  .home_title {-->
<!--    color: #fff;-->
<!--    font-size: 22px;-->
<!--    display: inline;-->
<!--  }-->

<!--  .home_userinfo {-->
<!--    color: #fff;-->
<!--    cursor: pointer;-->
<!--  }-->

<!--  .home_userinfoContainer {-->
<!--    display: inline;-->
<!--    margin-right: 20px;-->
<!--  }-->
<!--</style>-->
