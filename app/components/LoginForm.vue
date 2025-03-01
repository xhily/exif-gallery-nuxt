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
  <Card class="mx-auto lt-sm:w-full sm:min-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        Login
      </CardTitle>
      <CardDescription>
        Login to manage photos
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form
        @submit.prevent="login"
      >
        <div class="grid gap-4">
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
            </div>
            <div class="relative max-w-sm w-full items-center">
              <Input
                v-model="password"
                type="password"
                autocomplete="on"
                required
                placeholder="Enter password"
                class="w-full ps-10"
              />
              <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                <div class="i-lucide-key text-6 text-muted-foreground" />
              </span>
            </div>
          </div>
          <Button
            type="submit"
            class="w-full"
            :disabled="!password || loading"
            :loading="loading"
          >
            Login
          </Button>
          <NuxtLink to="/">
            <Button variant="outline" class="w-full">
              Back to Gallery
            </Button>
          </NuxtLink>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
