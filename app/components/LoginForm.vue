<script setup lang="ts">
const emit = defineEmits<{
  loggedIn: []
}>()
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
      emit('loggedIn')
    })
    .catch((err) => {
      toast.error(`Error ${err.statusCode}`, {
        description: `${err.data?.message || err.message}. Please try again`,
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
              <IInput
                id="password"
                v-model="password"
                type="password"
                autocomplete="on"
                required
                placeholder="Enter password"
                class="w-full ps-8"
              />
              <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                <div class="i-lucide-lock-keyhole text-muted-foreground" />
              </span>
            </div>
          </div>
          <InteractiveHoverButton
            text="Login"
            class="w-full"
            :disabled="!password || loading"
            :loading="loading"
            left="38%"
          />
          <NuxtLink to="/">
            <Button variant="ghost" class="group w-full">
              <div class="i-lucide-chevron-left transition-transform group-hover:translate-x--2" />
              <span>Back to Gallery</span>
            </Button>
          </NuxtLink>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
