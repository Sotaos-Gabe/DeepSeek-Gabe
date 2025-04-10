const isString = val => typeof val === 'string'
const isBlob = val => val instanceof Blob

polyfill.call(typeof window === 'object' ? window : this || {})

function polyfill() {
  if (!('navigator' in this)) {
    this.navigator = {}
  }

  if (typeof this.navigator.sendBeacon !== 'function') {
    this.navigator.sendBeacon = sendBeacon.bind(this)
  }
}

export function sendBeacon(url, data) {
  const event = this.event && this.event.type
  const sync = event === 'unload' || event === 'beforeunload'

  const xhr = 'XMLHttpRequest' in this ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
  xhr.open('POST', url, !sync)
  xhr.withCredentials = true
  xhr.setRequestHeader('Accept', '*/*')

  if (isString(data)) {
    xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8')
    xhr.responseType = 'text'
  } else if (isBlob(data) && data.type) {
    xhr.setRequestHeader('Content-Type', data.type)
  }

  try {
    xhr.send(data)
  } catch (error) {
    return false
  }

  return true
}
