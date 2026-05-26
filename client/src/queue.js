// queue.js — action buffer for offline/slow server support
// To add new todo actions in future, just add a new case to executeAction()

const RETRY_INTERVAL = 3000 // ms between retry attempts
const MAX_RETRIES = 20      // give up after this many attempts

let queue = []
let isProcessing = false
let listeners = []

// Subscribe to queue state changes (for UI indicators)
export function subscribeToQueue(fn) {
  listeners.push(fn)
  return () => { listeners = listeners.filter(l => l !== fn) }
}

function notify() {
  const state = getQueueState()
  listeners.forEach(l => l(state))
}

export function getQueueState() {
  if (queue.length === 0) return 'synced'
  if (isProcessing) return 'syncing'
  return 'pending'
}

// Add an action to the queue and start processing
export function enqueue(action) {
  queue.push({ ...action, retries: 0 })
  notify()
  processQueue()
}

async function processQueue() {
  if (isProcessing || queue.length === 0) return
  isProcessing = true
  notify()

  while (queue.length > 0) {
    const action = queue[0]
    try {
      await executeAction(action)
      queue.shift() // remove completed action
      notify()
    } catch (err) {
      action.retries++
      if (action.retries >= MAX_RETRIES) {
        console.error('Action failed after max retries, dropping:', action)
        queue.shift()
        notify()
      } else {
        // Wait before retrying
        await new Promise(r => setTimeout(r, RETRY_INTERVAL))
      }
    }
  }

  isProcessing = false
  notify()
}

// ── Add new action types here as the app grows ──────────────────
async function executeAction(action) {
  const { api } = await import('./api')

  switch (action.type) {
    case 'CREATE_TODO':
      await api.createTodo(action.text)
      action.onSuccess?.()
      break
    case 'TOGGLE_TODO':
      await api.toggleTodo(action.id, action.done)
      action.onSuccess?.()
      break
    case 'DELETE_TODO':
      await api.deleteTodo(action.id)
      action.onSuccess?.()
      break
    default:
      console.warn('Unknown action type:', action.type)
  }
}