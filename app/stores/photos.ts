export interface InfiniteState {
  photos: Ref<Photo[]>
  hasMore: Ref<boolean>
  loading: Ref<boolean>
}

export const usePhotosStore = defineStore('photos', () => {
  const photosStore = shallowRef<Map<string, InfiniteState>>(new Map())

  function updatePhoto(photo: Photo) {
    photosStore.value.forEach((state) => {
      const index = state.photos.value.findIndex(p => p.id === photo.id)
      if (index !== -1) {
        state.photos.value[index] = photo
      }
    })
  }

  return {
    photosStore,
    updatePhoto,
  }
})
