<template>
  <section class="container">
    <div class="row gap-y ">
				<div v-for="(post, index) in posts" :key="post.id" class="col-lg-12" data-aos="fade-up">
					<div class="card flex-md-row mb-4 box-shadow h-xl-300 post-hover">
						<!-- <img v-if="index % 2 == 0" class="card-img-right flex-auto d-none d-md-block" :src="post.cover_url"> -->
						<div class="card-body d-flex flex-column align-items-start">
							<strong v-if="index % 2 == 0" class="d-inline-block mb-2 text-purple">{{ post.user_name
								}}</strong>
							<strong v-if="index % 2 == 1" class="d-inline-block mb-2 text-success">{{ post.user_name
								}}</strong>
							<h3 class="mb-0">
								<router-link class="text-dark" :to="{ name: 'blog', params: { post_id: post.id } }">
									{{ post.title }}
								</router-link>
							</h3>
							<div class="mb-2 text-muted inline-block-class">
								发布时间：{{ post.release_time }}
							</div>
							<!-- <router-link class="card-text mb-auto posts" :to="{name: 'blog'}">
                  <VMarkdownView class="card-text mb-auto posts vmarkdown" :content="post.content"/>
                </router-link> -->
							<VMarkdownView class="card-text mb-auto posts vmarkdown" :content="post.content"
								style="font-size: 14px;" />
							<router-link class="text-gray" :to="{ name: 'blog', params: { post_id: post.id } }">
								Continue reading
							</router-link>
							
							<!-- <a class="text-gray" href="http://localhost:8080/blog">Continue reading</a> -->
						</div>
						<img class="card-img-right flex-auto d-none d-md-block" :src="post.cover_url">
					</div>
				</div>
        </div>
  </section>

  <MyPagination v-if="totalPages > 0" class="my-nav" :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage($event)" />
</template>


<script>
import $ from 'jquery';
import { ref } from 'vue';
import { VMarkdownView } from 'vue3-markdown';
import 'vue3-markdown/dist/style.css';

import MyPagination from '@/components/MyPagination.vue';
import { useStore } from 'vuex';

export default {
  name: "UserProfileCollects",
  components: {
    MyPagination,
    VMarkdownView
  },
  props: {
		user_id: {
			type: Number,
			required: true,
		}
	},
  setup(props) {
    const user_id = ref(props.user_id);
    const store = useStore();
		const posts = ref([]);
		const currentPage = ref(1);
		const totalPages = ref(1);

    const changePage = (page) => {
			// 在点击分页按钮时，获取关键词
			// console.log("changePage: ", page);
			currentPage.value = page;
			$.ajax({
				url: "https://localhost:8082/api/userprofile/collect_posts",
				type: "GET",
				data: {
					user_id: user_id.value,
					page: currentPage.value,
				},
				dataType: "json",
        headers: {// jwt 验证方式，直接抄就对了
          "Authorization": "Bearer " + store.getters['user/getToken'],
        },
				success(resp) {
					posts.value = resp;
				},
				error(textStatus, errorThrown) {
					console.error("changePage: get user profile collect posts", textStatus, errorThrown);
				}
			});
		};

    // 获取用户收藏帖子的总数量
    $.ajax({
      url: "https://127.0.0.1:8082/api/userprofile/totalnumbers_collect/" + user_id.value,
      type: "GET",
      data: {

      },
      dataType: "json",
      headers: {// jwt 验证方式，直接抄就对了
        "Authorization": "Bearer " + store.getters['user/getToken'],
      },
      success(resp) {
        totalPages.value = Math.ceil(resp / 10);
      },
      error(textStatus, errorThrown) {
				console.error("get user profile post collect numbers: ", textStatus, errorThrown);
			}
    });

    // 获取用户收藏的帖子
    $.ajax({
      url: "https://localhost:8082/api/userprofile/collect_posts",
      type: "GET",
      data: {
        user_id: user_id.value,
        page: 1,
      },
      dataType: "json",
      headers: {// jwt 验证方式，直接抄就对了
        "Authorization": "Bearer " + store.getters['user/getToken'],
      },
      success(resp) {
        posts.value = resp;
        console.log(posts.value);
      },
      error(textStatus, errorThrown) {
        console.error("changePage: get user profile collect posts", textStatus, errorThrown);
      }
    });

    return {
      posts,
      currentPage,
      totalPages,
      changePage,
    }
  }
}
</script>

<style scoped>
.my-nav {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  /* background-color: #f8f9fa; 可以根据需要设置底部导航的背景颜色 */
  padding: 10px;
}

.posts {
	display: -webkit-box;
	-webkit-line-clamp: 6;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.vmarkdown {
	box-sizing: border-box;
	width: 100%;
	/* 设置宽度为 100% */
	height: auto;
	/* 设置高度自动，保持原始的长宽比 */
	padding: 0px 0px 0px 10px;
}

.card-body {
	overflow: hidden;
	/* 隐藏溢出的内容 */
}
</style>