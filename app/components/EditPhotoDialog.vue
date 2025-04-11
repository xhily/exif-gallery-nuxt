<script setup lang="ts">
const { photo } = defineProps<{
  photo: IPhoto | undefined
}>()

const open = defineModel<boolean>('open')

const { loggedIn } = useUserSession()
const pStore = usePhotosStore()

const editedPhoto = ref<IPhoto>()
const isSaving = ref(false)

watch(() => photo, (val) => {
  if (val) {
    editedPhoto.value = { ...val }
  }
}, { immediate: true })

watch(open, (val) => {
  if (val && photo) {
    editedPhoto.value = { ...photo }
  }
}, { immediate: true })

async function saveChanges() {
  if (!editedPhoto.value)
    return

  try {
    isSaving.value = true
    await $fetch(`/api/photos/${editedPhoto.value.id}`, {
      method: 'PUT',
      body: {
        id: editedPhoto.value.id,
        ...Object.fromEntries(Object.entries(editedPhoto.value).filter(([_, value]) => !!value)),
      },
    })

    pStore.updatePhoto(editedPhoto.value)

    toast.success('Photo updated successfully')

    open.value = false
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
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90dvh] max-w-[90dvw]">
      <DialogHeader>
        <DialogTitle>{{ $t('edit_photo.title') }}</DialogTitle>
      </DialogHeader>
      <div class="mx--6 overflow-y-auto px-6">
        <section class="relative mb-4">
          <PhotoItem
            v-if="editedPhoto"
            class="min-h-60"
            :photo="editedPhoto"
            :logged-in="true"
            mini
            hide-action
          />
        </section>
        <Card v-if="editedPhoto" :key="editedPhoto.id" class="p-4">
          <UploadPhotoForm v-model="editedPhoto" />
        </Card>
      </div>
      <DialogFooter class="flex flex-row items-center justify-center gap-4">
        <Button variant="outline" @click="open = false">
          {{ $t('edit_photo.cancel') }}
        </Button>
        <Button
          :loading="isSaving"
          :disabled="!loggedIn"
          @click="loggedIn && saveChanges()"
        >
          {{ $t('edit_photo.save_changes') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
</style>
