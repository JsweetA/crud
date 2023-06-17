// import ref from 'vue';

const TokenKey = 'token';


export function getToken() {
  return localStorage.getItem(TokenKey);
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  return localStorage.removeItem(TokenKey);
}


const authorityKey= 'authority';

export function getAuthority () {
  return sessionStorage.getItem(authorityKey);
}

export function setAuthority(authority) {
  return sessionStorage.setItem(authorityKey, authority);
}

export function removeAuthority() {
  return sessionStorage.removeItem(authorityKey);
}