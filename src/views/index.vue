<template>
  <div class="dashboard">
    <div class="dashboard-top">
      <!-- 待办/消息提醒 -->
      <div class="dashboard-card">
        <div class="dashboard-card-header">
          <span>待办信息</span>
          <el-badge :value="totalPage" class="badge" type="danger"></el-badge>
          <span class="dashboard-card-more" @click="handleMore('todo')">更多</span>
        </div>
        <el-divider></el-divider>
        <div class="dashboard-card-content">
          <div class="dashboard-card-item" v-for="(item, idx) in todoList" :key="idx" @click="handleClick(item)">
            <span class="dashboard-link pointer">{{ item.procDefName }}</span>
            <span class="dashboard-card-date">{{ item.createTime }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 常用菜单 -->
    <div class="dashboard-menu">
      <div class="dashboard-menu-title">常用菜单</div>
      <div class="dashboard-menu-list">
        <div v-for="(menu, idx) in menuList" :key="idx" :class="['dashboard-menu-item', { active: menu.active }]">
          <div class="dashboard-menu-icon">
            <i v-if="menu.icon" :class="menu.icon"></i>
            <span v-else>+</span>
          </div>
          <div class="dashboard-menu-label">{{ menu.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElBadge, ElDivider } from 'element-plus'
import { listTodoTask } from '@/api/bus/index'

// 路由
const router = useRouter()

// 待办数据
const todoList = ref([])
const totalPage = ref(0)

// 消息列表
const msgList = ref([
  { title: "您提交的审批表单【延期】被驳回", date: "2025-08-12 14:00:00" },
  { title: "您提交的审批表单【延期】被驳回", date: "2025-08-12 14:00:00" },
  { title: "您有一条禁用数据待审", date: "2025-08-12 14:00:00" }
])

// 菜单列表
const menuList = ref([
  { label: "采购申请", icon: "", active: false },
  { label: "采购入库", icon: "", active: true },
  { label: "采购入库凭票", icon: "", active: false },
  { label: "新增", icon: "", active: false }
])

// 获取待办列表
const getTodoList = async () => {
  try {
    const params = {
      pageNum: 1,
      pageSize: 10
    }
    const res = await listTodoTask(params)
    if (res.code === 200) {
      todoList.value = res.data.records || []
      totalPage.value = res.data.total
    }
  } catch (error) {
    console.error('获取待办列表失败:', error)
  }
}

// 点击待办项
const handleClick = (item) => {
  console.log(item, '======item')
  router.push({
    path: '/review',
    query: {
      item: JSON.stringify(item)
    }
  })
}

// 点击更多
const handleMore = (type) => {
  // 跳转更多
  console.log('更多', type)
}

// 生命周期钩子
onMounted(() => {
  getTodoList()
})
</script>

<style scoped lang="scss">
.dashboard {
  padding: 24px;
  background: #f6f6f6;
  min-height: 100vh;
  box-sizing: border-box;

  .dashboard-top {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;

    .dashboard-card {
      background: #fff;
      border-radius: 6px;
      flex: 1;
      padding: 20px 24px 16px 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
      min-width: 380px;

      .dashboard-card-header {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 500;

        .badge {
          margin-left: 6px;
        }

        .dashboard-card-more {
          margin-left: auto;
          color: #409EFF;
          font-size: 14px;
          cursor: pointer;
        }

        .dashboard-card-btn {
          margin-left: 12px;
        }
      }

      .dashboard-card-content {
        margin-top: 12px;

        .dashboard-card-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 0;

          .dashboard-link {
            text-decoration: none;
            font-size: 14px;

            &:hover {
              text-decoration: underline;
              color: #409EFF;
            }
          }

          .dashboard-card-date {
            color: #999;
            font-size: 12px;
            margin-left: 16px;
            white-space: nowrap;
          }
        }
      }
    }
  }

  .dashboard-menu {
    background: #fff;
    border-radius: 6px;
    padding: 24px;

    .dashboard-menu-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 24px;
    }

    .dashboard-menu-list {
      display: flex;
      gap: 48px;

      .dashboard-menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;

        .dashboard-menu-icon {
          width: 48px;
          height: 48px;
          background: #f2f2f2;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: #bbb;
          margin-bottom: 8px;
          border: 2px solid transparent;
        }

        &.active .dashboard-menu-icon {
          border-color: #409EFF;
          background: #fff;
        }

        .dashboard-menu-label {
          font-size: 14px;
          color: #333;
        }
      }
    }
  }
}
</style>