<template>
  <section class="container">
    <div>消息</div>
  </section>
</template>


<script>

export default {
  name: "UserProfileMessages",
  props: {
		user_id: {
			type: Number,
			required: true,
		}
	},
  components: {

  }
}
</script>

<style scoped>
</style>