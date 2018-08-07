export enum Http_Method {POST = 'POST', GET = 'GET', PUT = 'PUT', DELETE = 'DELETE', PATCH = 'PATCH'}
//
// export function formatURL(url: string, ...arguments: string[]) {
//   if (arguments.length === 0) return url
//   const obj = arguments[0]
//   const s = url
//   for (const key in obj) {
//     url = s.replace(new RegExp('\\{\\{' + key + '\\}\\}', 'g'), obj[key])
//   }
//   return s
// }
