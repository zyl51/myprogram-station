<template>
  <section class="container" style="height: 100%;padding-top: 3.5rem;">
    <div class="card">
      <div class="card-body row">
        <div class="col-12">
          <ul class="nav nav-tabs">
              <li class="nav-item" style="font-weight: 900;" v-for="(item, index) in tabs" :key="index">
                <a class="nav-link" style="color: #502C6C;" :class="{ 'active': currentTab === item.component }" @click="currentTab = item.component" href="#">
                  {{ item.name }}
                  <span v-if="item.name == '举报信息' && report_total != 0" class="badge badge-warning ml-2">
                    {{ report_total }}
                  </span>
                </a>
              </li>
            </ul>

            <component :is="currentTab" :user_id="user_id" @delete_report="delete_report"></component>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import { useStore } from 'vuex';
import { ref } from 'vue';
import $ from 'jquery';

import ReportMessage from '@/components/ManagementCenter/ReportMessage.vue';
import UserManagement from '@/components/ManagementCenter/UserManagement.vue';
import PostManagement from '@/components/ManagementCenter/PostManagement.vue';


export default {
  name: "ManagementCenterView",
  components: {
    ReportMessage,
    UserManagement,
    PostManagement,
  },
  data() {
    return {
      currentTab: ReportMessage,
      tabs: [
        { name: '举报信息', component: ReportMessage },
        { name: '用户管理', component: UserManagement },
        { name: '帖子管理', component: PostManagement },
      ]
    }
  },
  setup() {
    const store = useStore();
    const report_total = ref(0);

    $.ajax({
      url: "https://" + store.getters.IP_PORT + "/api/report/get_total",
      type: "GET",
      data: {

      },
      dataType: "json",
      headers: {// jwt 验证方式，直接抄就对了
        "Authorization": "Bearer " + store.getters['user/getToken'],
      },
      success(resp) {
        report_total.value = resp;
      },
      error(textStatus, errorThrown) {
        console.error("get report total", textStatus, errorThrown);
      }
    });

    // 删除举报信息
    const delete_report = () => {
      report_total.value = report_total.value - 1;
    };

    return {
      report_total,
      delete_report,
    }
  }
}
</script>

<style scoped>
</style>