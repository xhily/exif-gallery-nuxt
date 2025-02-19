export default eventHandler(async (event) => {
  await requireUserSession(event)
  const { pathname } = event.context.params || {}

  if (!pathname) {
    throw createError({
      statusCode: 400,
      statusMessage: 'pathname is required',
    })
  }

  return hubBlob().del(pathname)
})
