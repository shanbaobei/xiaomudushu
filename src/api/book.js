import request from '../utils/request'

// export function createBook(book) {   //创建一个createBook接口
//     return request ({
//         url:'/book/create',
//         methods:'post',
//         data:book
//         })
//     }
export function createBook(book) {
  return request({
    url: '/book/create',
    method: 'post',
    data: book
  })
}
export function updateBook(book) {
  return request({
    url: '/book/update',
    method: 'post',
    data: book
  })
}
export function getBook(fileName) {
  return request({
    url: '/book/get',
    method: 'get',
    params: { fileName }
  })
}
