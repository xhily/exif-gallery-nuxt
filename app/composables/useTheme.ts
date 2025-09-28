export function useTheme(init = false) {
  const theme = useLocalStorage('shadcn-theme', 'blue')
  const radius = useLocalStorage('shadcn-radius', '0.5')
  const disable3DCard = useLocalStorage('disable-3d-card', isTouchDevice)

  if (init && !import.meta.env.SSR) {
    watch(theme, (value) => {
      const oldClass = Array.from(document.body.classList).filter(className => className.startsWith('theme-'))
      if (oldClass.length)
        document.body.classList.remove(...oldClass)
      document.body.classList.add(`theme-${value}`)
    }, { immediate: true })

    watch(radius, (radius) => {
      document.body.style.setProperty('--radius', `${radius}rem`)
    }, { immediate: true })
  }

  return {
    theme,
    radius,
    disable3DCard,
  }
}
