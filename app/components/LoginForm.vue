<script setup lang="ts">
const emit = defineEmits(['close'])
const { fetch: refreshSession } = useUserSession()
const password = ref('')
const loading = ref(false)

async function login() {
  if (loading.value || !password.value)
    return
  loading.value = true
  await $fetch('/api/auth', {
    method: 'POST',
    body: { password: password.value },
  })
    .then(async () => {
      await refreshSession()
      emit('close')
    })
    .catch((err) => {
      toast({
        title: `Error ${err.statusCode}`,
        description: `${err.data?.message || err.message}. Please try again`,
        color: 'red',
      })
    })
  loading.value = false
}
</script>

<template>
  <form
    class="relative min-w-[300px] flex flex-col items-center gap-4 p-4"
    @submit.prevent="login"
  >
    <h1 class="text-lg text-gray-300 font-medium">
      Login to upload images
    </h1>

    <div class="relative max-w-sm w-full items-center">
      <Input
        v-model="password"
        type="password"
        placeholder="Enter password"
        class="w-full ps-10"
      />
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <div class="i-lucide-key size-6 text-muted-foreground" />
      </span>
    </div>

    <Button
      type="submit"
      :disabled="!password || loading"
      class="w-full"
      variant="default"
    >
      <span v-if="loading" class="me-2">
        <div class="i-lucide-loader-2 animate-spin" />
      </span>
      Login
    </Button>

    <Button
      variant="ghost"
      size="icon"
      class="absolute right-2 top-2"
      @click="$emit('close')"
    >
      <div class="i-lucide-x h-4 w-4" />
    </Button>
  </form>
</template>
