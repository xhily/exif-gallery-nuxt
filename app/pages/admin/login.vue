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
  <div class="h-80dvh flex flex-col items-center justify-center gap-4 p-4">
    <LoginForm @logged-in="navigate()" />
    <NuxtLinkLocale to="/admin/demo" class="text-sm op-50">
      {{ $t('login_form.demo') }}
    </NuxtLinkLocale>
  </div>
</template>

<style scoped>

</style>
