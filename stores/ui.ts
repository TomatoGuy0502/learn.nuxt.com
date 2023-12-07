export const useUiState = defineStore('ui', () => {
  const isPanelDragging = ref(false)
  const panelTerminal = ref(30)

  const persistState = reactive(getLayoutDefaults())

  function getLayoutDefaults() {
    return {
      panelDocs: 30,
      panelEditor: 60,
      panelPreview: 40,
      panelFileTree: 20,
      showTerminal: false,
    }
  }

  function resetLayout() {
    Object.assign(persistState, getLayoutDefaults())
  }

  const stateCookie = useCookie<Partial<typeof persistState>>(
    'nuxt-playground-ui-state',
    { default: () => ({}), watch: true },
  )

  Object.assign(persistState, stateCookie.value)
  watch(persistState, () => {
    stateCookie.value = { ...persistState }
  })

  function toggleTerminal() {
    persistState.showTerminal = !persistState.showTerminal
    if (persistState.showTerminal) {
      persistState.panelEditor = persistState.panelEditor / 100 * (100 - panelTerminal.value)
      persistState.panelPreview = persistState.panelPreview / 100 * (100 - panelTerminal.value)
    }
    else {
      // Save the terminal size before hiding it
      panelTerminal.value = 100 - persistState.panelEditor - persistState.panelPreview
      const remaining = persistState.panelEditor + persistState.panelPreview
      persistState.panelEditor = persistState.panelEditor / remaining * 100
      persistState.panelPreview = persistState.panelPreview / remaining * 100
    }
  }

  return {
    isPanelDragging,
    toggleTerminal,
    resetLayout,
    ...toRefs(persistState),
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUiState, import.meta.hot))
