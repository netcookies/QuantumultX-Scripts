const cookieName = '微信开门'
const cookieKey = 'isulew_cookie_weekey'
const cookieAppKey = 'isulew_cookie_weekey_app'
const authUrlAppKey = 'isulew_auth_url_weekey_app'
const isulew = init()
if ($request.headers.Host == 's.weekey.cn') {
  const cookieVal = $request.headers['Cookie']
  if (cookieVal) {
    if (isulew.setdata(cookieVal, cookieAppKey)) {
      isulew.setdata(``, authUrlAppKey)
      isulew.msg(`${cookieName} (APP)`, '获取Cookie: 成功', '')
      isulew.log(`[${cookieName} (APP)] 获取Cookie: 成功, cookie: ${cookieVal}`)
    }
  }
} else if ($request.headers.Host == `s.weekey.cn` && $request.url.indexOf('accesskey') >= 0) {
  if (isulew.setdata($request.url, authUrlAppKey)) {
    isulew.setdata(``, cookieAppKey)
    isulew.msg(`${cookieName} (APP)`, '获取Cookie: 成功', '')
    isulew.log(`[${cookieName} (APP)] 获取Cookie: 成功, cookie: ${$request.url}`)
  }
} else {
  const cookieVal = $request.headers['Cookie']
  if (cookieVal) {
    if (isulew.setdata(cookieVal, cookieKey)) {
      isulew.msg(`${cookieName} (网页)`, '获取Cookie: 成功', '')
      isulew.log(`[${cookieName} (网页)] 获取Cookie: 成功, cookie: ${cookieVal}`)
    }
  }
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
isulew.done()
