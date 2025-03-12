<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const route = useRoute()
const localePath = useLocalePath()

const id = route.params.id?.[0]
if (!id) {
  navigateTo(localePath('/admin'))
  throw new Error('id is required')
}

const { photo, loading } = usePhoto(id)
const editedPhoto = ref<IPhoto | null>(null)
const isSaving = ref(false)

watch(photo, () => {
  if (photo.value) {
    editedPhoto.value = Object.fromEntries(Object.entries(photo.value))
  }
})

const photoItem = computed(() => ({
  ...photo.value,
  ...editedPhoto.value,
}))

async function saveChanges() {
  if (!editedPhoto.value)
    return

  try {
    isSaving.value = true
    await $fetch(`/api/photos/${id}`, {
      method: 'PUT',
      body: {
        id,
        ...Object.fromEntries(Object.entries(editedPhoto.value).filter(([_, value]) => !!value)),
      },
    })

    toast.success('Photo updated successfully')
    await navigateTo(localePath(`/admin`))
  }
  catch (error: any) {
    console.error(error)
    toast.error('Failed to update photo', {
      description: error?.data?.message || error?.message || 'An error occurred',
    })
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        {{ $t('edit_photo.title') }}
      </h1>
      <div class="flex gap-2">
        <Button variant="outline" @click="navigateTo(localePath('/admin'))">
          {{ $t('edit_photo.cancel') }}
        </Button>
        <Button
          :loading="isSaving"
          :disabled="loading || !editedPhoto"
          @click="saveChanges()"
        >
          {{ $t('edit_photo.save_changes') }}
        </Button>
      </div>
    </div>

    <div v-if="loading || !editedPhoto" class="space-y-4">
      <Skeleton class="aspect-[4/3] w-full" />
      <Skeleton class="h-10 w-full" />
      <Skeleton class="h-40 w-full" />
    </div>

    <div v-else>
      <section class="relative mb-4">
        <PhotoItem
          :photo="photoItem as Photo"
          :logged-in="true"
          mini
          image-class="edit-image"
          hide-action
        />
      </section>
      <Card class="p-4">
        <UploadPhotoForm v-model="editedPhoto" />
      </Card>
    </div>
  </div>
</template>

<style scoped>
.edit-image {
  view-transition-name: vtn-image;
}
</style>
