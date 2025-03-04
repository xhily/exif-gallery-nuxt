interface InfiniteState {
  photos: Ref<Photo[]>
  hasMore: Ref<boolean>
  loading: Ref<boolean>
}

export function usePhotosInfinite(params?: {
  hidden?: boolean
  orderBy?: string
  order?: string
}, limit = 12): {
    photos: Ref<Photo[]>
    hasMore: Ref<boolean>
    loadMore: () => Promise<void>
    loading: Ref<boolean>
    error: Ref<unknown>
  } {
  const photosStore = useState<Map<string, InfiniteState>>(
    'infiniteData',
    () => shallowRef(new Map()),
  )
  const key = JSON.stringify(params)

  if (!photosStore.value.has(key)) {
    photosStore.value.set(key, {
      photos: ref([]),
      hasMore: ref(true),
      loading: ref(false),
    })
  }

  const state = photosStore.value.get(key)!

  const error = ref()

  const loadMore = async () => {
    if (state.loading.value || !state.hasMore.value)
      return

    error.value = undefined

    try {
      state.loading.value = true
      const response = await $fetch('/api/photos', {
        params: {
          ...params,
          limit,
          offset: state.photos.value.length,
        },
      })

      if (response.data.length < limit) {
        state.hasMore.value = false
      }

      state.photos.value.push(...response.data.map(deserializePhoto))
    }
    catch (err) {
      console.error(err)
      error.value = err
    }
    finally {
      state.loading.value = false
    }
  }

  return {
    photos: state.photos,
    hasMore: state.hasMore,
    loadMore,
    loading: state.loading,
    error,
  }
}

export function usePhoto(id: MaybeRef<string>) {
  const photo = ref<Photo | null>(null)
  const loading = ref(false)
  const error = ref<unknown>()

  async function fetchPhoto() {
    if (loading.value || !toValue(id))
      return

    error.value = undefined

    try {
      loading.value = true
      const response = await $fetch(`/api/photos/${toValue(id)}`)
      photo.value = deserializePhoto(response)
    }
    catch (err) {
      console.error(err)
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  watch(() => toValue(id), () => {
    fetchPhoto()
  }, { immediate: true })

  return {
    photo,
    loading,
    error,
    refresh: fetchPhoto,
  }
}
