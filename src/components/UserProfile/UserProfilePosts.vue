<template>
	<section >
		<div class="container">
			<div v-if="show_posts_status" class="alert"
			style="font-size: 2rem;font-weight: 900;background-color: aliceblue;">
				{{ posts_status }}
			</div>

			<!-- Featured -->
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
			<!-- End Featured -->
		</div>

	</section>

	<!-- 分页组件 -->
	<MyPagination v-if="totalPages > 0" class="my-nav" :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage($event)" />
</template>


<script>
import { VMarkdownView } from 'vue3-markdown';
import 'vue3-markdown/dist/style.css';
import { ref } from 'vue';
import $ from 'jquery';

import MyPagination from '@/components/MyPagination.vue';
// import { useRoute } from 'vue-router';
// import { useStore } from 'vuex';


export default {
	name: "UserProfilePosts",
	props: {
		user_id: {
			type: Number,
			required: true,
		}
	},
	components: {
		MyPagination,
		VMarkdownView,
	},
	setup(props) {
		const user_id = ref(props.user_id);
		// console.log(user_id.value);
		const posts = ref([]);
		const currentPage = ref(1);
		const totalPages = ref(1);
		const changePage = (page) => {
			// 在点击分页按钮时，获取关键词
			// console.log("changePage: ", page);
			currentPage.value = page;
			$.ajax({
				url: "https://localhost:8082/api/userprofile/posts",
				type: "GET",
				data: {
					user_id: user_id.value,
					page: currentPage.value,
				},
				dataType: "json",
				success(resp) {
					posts.value = resp;
				},
				error(textStatus, errorThrown) {
					console.error("changePage: get user profile posts", textStatus, errorThrown);
				}
			});

			// window.scrollTo({
      //   top: 0,
      //   // behavior: "smooth" // 平滑滚动到顶部
      // });
		}

		// 获取用户的帖子总数
		$.ajax({
			url: "https://localhost:8082/api/userprofile/totalnumbers/" + user_id.value,
			type: "GET",
			data: {

			},
			dataType: "json",
			success(resp) {
				// totalPages.value = resp.number;
				totalPages.value = Math.ceil(resp.number / 10);
				// console.log(resp);
			},
			error(textStatus, errorThrown) {
				console.error("get user profile post total numbers: ", textStatus, errorThrown);
			}
		});

		$.ajax({
			url: "https://localhost:8082/api/userprofile/posts",
			type: "GET",
			data: {
				user_id: user_id.value,
				page: currentPage.value,
			},
			dataType: "json",
			success(resp) {
				posts.value = resp;
				// console.log(resp.length);
				if (posts.value.length == 0) {
					show_posts_status.value = true;
					posts_status.value = "用户太懒了，没发表过帖子";
				} else {
					show_posts_status.value = false;
					posts_status.value = "";
				}
			},
			error(textStatus, errorThrown) {
				console.error("get user profile posts: ", textStatus, errorThrown);
			}
		});

		const show_posts_status = ref(false);
		const posts_status = ref('');
		console.log(posts.value.length);


		return {
			posts,
			currentPage,
			totalPages,
			changePage,
			show_posts_status,
			posts_status,
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

.card-body {
	overflow: hidden;
	/* 隐藏溢出的内容 */
}

.title-gradient {
	background: linear-gradient(to right, #00ff62, #0091ff);
	background-clip: text;
	color: transparent;
	font-weight: 900;
}

.posts {
	display: -webkit-box;
	-webkit-line-clamp: 6;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.inline-block-class {
	display: inline-block;
}

.post-hover:hover {
	box-shadow: 2px 2px 10px 4px rgb(203, 203, 203);
	/* text-shadow: 10px 10px 10px 10px black; */
	transform: scale(1.005);
	transition: 100ms;
}

.vmarkdown {
	box-sizing: border-box;
	width: 100%;
	/* 设置宽度为 100% */
	height: auto;
	/* 设置高度自动，保持原始的长宽比 */
	padding: 0px 0px 0px 10px;
}


.delete-btn {
	/* height: 10%; */
	/* width: 20%; */
	background-color: #DC3545;
	color: white;
	border-radius: 5px;
	border-color: white;
	border-width: 0px;
	/* border-style: none; */
}
</style>