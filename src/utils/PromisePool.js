// 用于处理高并发请求
export default class PromisePool {
  constructor(max, simulate, callback, success, error) {
    this.max = max // 最大并发数
    this.success = success // 任务队列全部成功后执行的回调
    this.error = error // 任务队列有失败时的回调
    this.simulate = simulate // 将任务列表中的任务包装成Promise的方法
    this.callback = callback // 每个任务成功时的回调
    this.list = [] // 任务列表
    this.pool = [] // Promise并发池
    this.allSuccess = true // 标记任务队列是否全部成功
  }
  start(list) {
    // 初始化任务列表
    this.list = list
    // 从任务列表中取出任务放入并发池中，直到最大限制或任务列表为空
    while (this.pool.length < this.max && this.list.length) {
      let item = this.list.shift()
      this.setTask(item)
    }
    // 监听并发池中的任务
    this.run(Promise.race(this.pool))
  }
  setTask(options) {
    // 将任务包装成Promise，即发送Ajax请求
    let task = this.simulate(options)
    // 塞入并发池中
    this.pool.push(task)
    task.then((data) => {
      this.callback(data, options)
      // 当一个任务结束后，将其从并发池中移除
      this.pool.splice(this.pool.indexOf(task), 1)
      if (this.pool.length == 0) {
        if (this.allSuccess) this.success()
        else this.error()
      }
    }).catch(() => {
      this.allSuccess = false
      // 当一个任务失败后，将其从并发池中移除
      this.pool.splice(this.pool.indexOf(task), 1)
      if (this.pool.length == 0) this.error()
    })
  }
  run(race) {
    // 当并发池中的任何一个任务完成后，再向并发池中加入一个新任务
    race.finally(() => {
        if (this.list.length) {
          let item = this.list.shift()
          this.setTask(item)
          this.run(Promise.race(this.pool))
        }
    })
}
}
