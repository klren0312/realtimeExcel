const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 23333 });
let cacheData = []
wss.on('connection', (ws, req) => {
  ws.on('message', msg => {
    try {
      const data = JSON.parse(msg)
      if (data.type === 'checkalive') { // 心跳
        ws.send(JSON.stringify({type: 'checkalive'}))
      } else if (data.type === 'excelChange') { // 表格修改
        cacheData = data.total
        wss.clients.forEach(function each(client) {
          // 通知除了当前客户端的其他客户端
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(msg)
          }
        })
      } else if (data.type === 'new') { // 新打开页面加载历史数据
        const newObj = {
          type: 'history',
          has: cacheData.length === 0 ? false : true,
          data: cacheData
        }

        console.log(cacheData)
        ws.send(JSON.stringify(newObj))
      } else {
        console.log(msg)
      }
    } catch (error) {

    }
  })
})
