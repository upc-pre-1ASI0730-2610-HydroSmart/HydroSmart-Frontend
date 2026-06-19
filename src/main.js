import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
import './style.css'

// create the app as usual
const app = createApp(App).use(i18n).use(router)

// Simple global error handlers to surface runtime errors in production builds.
// This helps debugging a blank page (shows the error on screen) when console
// access isn't available (e.g. GitHub Pages). It is safe to keep in prod.
function showFatalError(message, url, line, column, error) {
  try {
	const existing = document.getElementById('runtime-error-overlay')
	if (existing) existing.remove()
	const el = document.createElement('div')
	el.id = 'runtime-error-overlay'
	el.style.position = 'fixed'
	el.style.left = '0'
	el.style.top = '0'
	el.style.right = '0'
	el.style.bottom = '0'
	el.style.background = 'rgba(255,255,255,0.98)'
	el.style.color = '#b91c1c'
	el.style.zIndex = '999999'
	el.style.padding = '24px'
	el.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial'
	el.innerHTML = `<h2 style="margin-top:0;color:#b91c1c">Error de ejecución</h2>
	  <pre style="white-space:pre-wrap;word-break:break-word">${String(message)}\n${url||''}:${line||''}:${column||''}</pre>
	  <p>Abre la consola del navegador para ver más detalles (F12).</p>`
	document.body.appendChild(el)
  } catch (err) {
	// ignore
  }
}

window.addEventListener('error', (ev) => {
  showFatalError(ev.message, ev.filename, ev.lineno, ev.colno, ev.error)
})
window.addEventListener('unhandledrejection', (ev) => {
  showFatalError(ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason))
})

app.mount('#app')

