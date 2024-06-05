export const readCookies = (name: string) => {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
  }

  return null
}

export const deleteCookies = (name: string) => {
  const domain = process.env.REACT_APP_COOKIE_DOMAIN
  document.cookie = name + '=; Path=/' + `; domain=.${domain}` + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT'
}

export const setCookie = (name: string, value: string, second: number) => {
  const now = new Date()
  const time = now.getTime()
  const expireTime = time + second * 1000
  now.setTime(expireTime)

  let domainString
  const domain = process.env.REACT_APP_COOKIE_DOMAIN
  if (domain) {
    domainString = `;domain=.${domain}`
  } else {
    domainString = ''
  }

  document.cookie = `${name}=${value};expires=${now.toUTCString()}${domainString};path=/`
}
