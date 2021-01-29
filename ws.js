const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 23333 });
let cacheData = []
wss.on('connection', (ws, req) => {
  ws.on('message', msg => {
    try {
      const data = JSON.parse(msg)
      switch (data.type) {
        case 'checkalive': // 心跳
          ws.send(JSON.stringify({type: 'checkalive'}))
          break
        case 'new': // 新打开页面加载历史数据
          const newObj = {
            type: 'history',
            has: cacheData.length === 0 ? false : true,
            data: cacheData
          }
          ws.send(JSON.stringify(newObj))
          break
        case 'excelChange': // 表格修改
          cacheData = data.total
          wss.clients.forEach(function each(client) {
            // 通知除了当前客户端的其他客户端
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(msg)
            }
          })
          break
        case 'excelInsert': // 表格插入
          cacheData = data.total
          wss.clients.forEach(client => {
            // 通知除了当前客户端的其他客户端
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(msg)
            }
          })
          break
      }
    } catch (error) {

    }
  })
})
