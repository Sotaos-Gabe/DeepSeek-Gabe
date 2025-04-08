## 数智员工流式智能问答接口
### 接口说明
这是一个SSE事件流输出的数智员工智能问答接口。

### 接口前置要求获取token

#### 基本描述
|  接口说明  | 对应信息 |
|  ----   | ----  |
|  请求url   | https://dataai.harix.iamidata.com/robotgpt/api/token |
|  协议方法  | GET |

#### 请求参数
|  参数   | 类型 | 说明 |
| --- | --- | --- |
| key | string | API Key，url query参数 |
| secret | string |API Secret，header参数。|

#### 返回结果
| 类型 | 说明 |
| --- | --- |
|Token|根据API Key 生成的Authorization，有效期为一天。|

#### 样例，用curl在linux操作系统上进行Token获取（在mac或者windows上获取可能token后面会加一个%，请将%去掉。）
```
curl -H "secret: your_secret" 'https://openai.harix.iamidata.com/gen_token?key=your_key'
```
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjENjUwMjgxMjYsImtleSI6ImQwZjQxYjQxMWY1ZDQ2MzM5NzVhMWUyN2QxMWIzMTZkIn0.CSPlh-9u5ZRwHgx4GK7Rigm_ITZL1WrRxgDEpdjy6l0
```

### 接口数据传输与接收
#### 基本描述
|  接口说明  | 对应信息 |
|  ----   | ----  |
|  请求url   | https://dataai.harix.iamidata.com/robotgpt/api/query |
|  协议方法  | POST |
|  接口定义  | POST JSON returns JSON |

#### 请求头参数
|  参数   | 类型  | 说明 |
|  ----  | ----  | ----  |
|  Authorization  | string  | 请求认证参数，header 参数 |
|  ApiName   | string  | 服务名称，header 参数， robotGPTMMApi |

#### 请求参数
|  参数   | 类型  | 是否必填  | 说明 |
|  ----  | ----  | ----  | ----  |
|  query   |  string | 是 | 问答内容，比如：你好，1加2等于几 |
|  chat_type| int  | 是 | 4，AI问答（开放域问答） |
|  model_code | string  | 是 | 数智员工唯一模型编码 |
|  conversation_id | string  | 否 | 会话ID |
```
{
    "query": "你好，1加2等于几",
    "chat_type": 4,
    "conversation_id":"",
    "model_code": "your model_code"
}
```

#### 返回结果 
```
event:message
data:{"code":200,"msg":"ok","data":{"conversation_id":"Mdb3-Y8wAPYeUqVhgkLqD682P7Fw-F5D","message_id":"34506aa1-9b26-4547-a733-14c302c9668e","content":"1加2等于3。","intent":{"name":"","arguments":""}}}

event:message
data:{"code":200,"msg":"ok","data":{"conversation_id":"Mdb3-Y8wAPYeUqVhgkLqD682P7Fw-F5D","message_id":"34506aa1-9b26-4547-a733-14c302c9668e","content":"","intent":{"name":"","arguments":""}}}

event:stop
data:finish
```

#### 响应说明
该接口响应为流式响应，遵循Server-Sent Events协议，返回的内容类型为三类：
message：为正常响应内容
error：为错误
stop：为结束响应标识

### 调用示例
注: python Demo只是一个简单的调用示例，不适合直接放在复杂多变的生产环境使用
```
headers = {"Content-Type": "application/json"}
headers["ApiName"] = "robotGPTMMApi"
headers["Authorization"] = "your token"
json_data = {
    "query": "你好，1加2等于几",
    "chat_type": 4,
    "conversation_id":"",
    "model_code": "your model_code"
}

r_url = "https://dataai.harix.iamidata.com/robotgpt/api/query "
r = requests.post(url=r_url, headers=headers, json=json_data, stream=True)
for response in r:
    print(response)
    
```

