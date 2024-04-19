import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import RecommendView from '@/views/RecommendView.vue';
import FollowView from '@/views/FollowView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import BlogView from '@/views/BlogView.vue';
import EditorView from '@/views/EditorView.vue';
import SearchView from '@/views/SearchView.vue';
import UserProfileView from '@/views/UserProfileView.vue';
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import UserProfilePersonalView from '@/views/UserProfilePersonalView.vue';
import ManagementCenterView from '@/views/ManagementCenterView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/recommend/:page/',
    name: 'recommend',
    component: RecommendView,
  },
  {
    path: '/follow/',
    name: 'follow',
    component: FollowView,
    props: route => ({
      user_id: route.query.user_id,
      page: route.query.page
    })
  },
  {
    path: '/login/',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register/',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/blog/:post_id/',
    name: 'blog',
    component: BlogView,
  },
  {
    path: '/editor/',
    name: 'editor',
    component: EditorView,
  },
  {
    path: '/search/',
    name: 'search',
    component: SearchView,
  },
  {
    path: '/userProfile/:user_id/',
    name: 'userProfile',
    component: UserProfileView,
  },
  {
    path: '/forgotPassword/',
    name: 'forgotPassword',
    component: ForgotPasswordView,
  },
  {
    path: '/userProfilePersonal/',
    name: 'userProfilePersonal',
    component: UserProfilePersonalView,
  },
  {
    path: '/managementCenter/',
    name :'managementCenter',
    component: ManagementCenterView,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
