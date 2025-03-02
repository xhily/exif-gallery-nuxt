<script setup lang="ts">
const { loggedIn } = useUserSession()
const route = useRoute()

function navigate() {
  navigateTo(route.query.redirect as string || '/admin')
}

if (loggedIn.value)
  navigate()
</script>

<template>
  <div class="h-80dvh flex items-center justify-center p-4">
    <LoginForm @logged-in="navigate()" />
  </div>
</template>

<style scoped>

</style>
