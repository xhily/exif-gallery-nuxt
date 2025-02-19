export function usePhotos(query?: {
  uploading?: boolean
  hidden?: boolean
}) {
  const { data, error, status } = useFetch('/api/photos', {
    query,
  })

  const photos = computed<Photo[] | undefined>(() => data.value?.map(p => ({
    ...p,
    fileModified: p.fileModified ? new Date(p.fileModified) : null,
    takenAt: p.takenAt ? new Date(p.takenAt) : null,
    createdAt: p.createdAt ? new Date(p.createdAt) : null,
    updatedAt: p.updatedAt ? new Date(p.updatedAt) : null,
  })))

  return {
    photos,
    error,
    status,
  }
}
