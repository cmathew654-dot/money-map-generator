const assetBindingError = () =>
  new Response('Static asset binding unavailable', { status: 500 })

export default {
  fetch(request, env) {
    return env?.ASSETS?.fetch?.(request) ?? assetBindingError()
  },
}
