import request from '@/utils/request'

/**
 * 分页查询
 * @param query
 */
export function fetchList() {
  return request({
    url: '/sys/menu/list',
    method: 'post'
  })
}

/**
 * 删除
 * @param id
 */
export function del(id) {
  return request({
    url: '/sys/user/del/' + id,
    method: 'post'
  })
}

/**
 * 新增
 * @param user
 */
export function create(user) {
  return request({
    url: '/sys/user/save',
    method: 'post',
    data: user
  })
}

/**
 * 修改
 * @param user
 */
export function update(user) {
  if (user.id == null) {
    return {
      code: 404
    }
  }
  return request({
    url: '/sys/user/update',
    method: 'post',
    data: user
  })
}
