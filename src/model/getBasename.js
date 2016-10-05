export default function getBasename(p) {
  let idx = p.lastIndexOf('/')
  if (idx > -1) {
    return p.slice(idx+1)
  } else {
    return p
  }
}
