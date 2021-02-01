# realtimeExcel

## 所用技术

 - [jexcel](https://github.com/jspreadsheet/jexcel) excel组件
 - [ws](https://github.com/websockets/ws) nodejs的websocket库

## 原理
通过jexcel的`oninsertrow`监听行插入, `onchange`监听表格内容修改, 当监听触发后, 将修改的内容, 坐标等信息通过websocket发送给后台, 后台通知其他连接的客户端, 客户端接收到修改后, 进行同步操作