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
        {{ $t('login_form.title') }}
      </CardTitle>
      <CardDescription>
        {{ $t('login_form.description') }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form
        @submit.prevent="login"
      >
        <div class="grid gap-4">
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">{{ $t('login_form.password') }}</Label>
            </div>
            <div class="relative w-full items-center">
              <IInput
                id="password"
                v-model="password"
                type="password"
                autocomplete="on"
                required
                :placeholder="$t('login_form.password_placeholder')"
                class="w-full ps-8"
              />
              <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                <div class="i-lucide-lock-keyhole text-muted-foreground" />
              </span>
            </div>
          </div>
          <InteractiveHoverButton
            type="submit"
            :text="$t('login_form.login_button')"
            class="w-full"
            :disabled="!password || loading"
            :loading="loading"
            left="38%"
          />
          <NuxtLinkLocale to="/">
            <Button variant="ghost" class="group w-full">
              <div class="i-lucide-chevron-left transition-transform group-hover:translate-x--2" />
              <span>{{ $t('login_form.back_to_gallery') }}</span>
            </Button>
          </NuxtLinkLocale>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
