import request from '@/api/index.js'
import { getToken} from "@/utils/auth";
import { fetchEventSource } from '@microsoft/fetch-event-source'
const controller = new AbortController()
const signal = controller.signal

const token = getToken()
//知识库文档列表
export const knowledgeList = (data) => request({
    url: '/knowledgebase/mmue/api/qadock/list?lang=zh-CN',
    method: 'post',
    headers: {
        'Authorization': `Bearer ${token}`
    },
    data
});

//文件上传
export const uploadFile = (data) => request({
    url: '/tech/api/yao/resource/upload',
    method: 'post',
    headers: {
        'Authorization': `Bearer ${token}`
    },
    data
});

//知识库文档添加
export const addFile = (data) => request({
    url: '/knowledgebase/mmue/api/qadock/add',
    method: 'post',
    headers: {
        'Authorization': `Bearer ${token}`
    },
    data
});

//知识库文档删除
export const delFile = (data) => request({
    url: '/knowledgebase/mmue/api/qadock/del',
    method: 'post',
    headers: {
        'Authorization': `Bearer ${token}`
    },
    data
});

//获取推荐问题
export const suggestedQuestionRequest = (data) => request({
  url: '/tech/api/yao/ask/suggested',
  method: 'post',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  data
});


//GPT-SSE流式请求
export const reportSseRequset = (data, successCallback, errCallback) => {
    fetchEventSource("/ppt/v1/feishu/doc/ask", {
        method: 'POST',
        signal: signal,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        onmessage(msg) {
            successCallback(msg)
        },
        onerror(err) {
            // 必须抛出错误才会停止
            errCallback(err)
            throw err
        },
        openWhenHidden: true
    })
}
//GPT-SSE流式请求
export const shareChatSseRequset = (data, successCallback, errCallback) => {
    fetchEventSource("/tech/virtualStaff/shareChat", {
        method: 'POST',
        signal: signal,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        onmessage(msg) {
            successCallback(msg)
        },
        onerror(err) {
            // 必须抛出错误才会停止
            errCallback(err)
            throw err
        },
        openWhenHidden: true
    })
}
//GPT-SSE流式请求
export const shareMultiDocChatSseRequset = (data, successCallback, errCallback) => {
    fetchEventSource("/tech/virtualStaff/shareMultiDocChat", {
        method: 'POST',
        signal: signal,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        onmessage(msg) {
            successCallback(msg)
        },
        onerror(err) {
            // 必须抛出错误才会停止
            errCallback(err)
            throw err
        },
        openWhenHidden: true
    })
}
//GPT-SSE流式请求
export const chatSseRequset = (data, successCallback, ask_type, errCallback) => {
    fetchEventSource("/tech/api/yao/ask", {
        method: 'POST',
        signal: signal,
        headers: { Authorization: `Bearer ${getToken()}`,'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        onmessage(msg) {
            successCallback(msg, ask_type)
        },
        onerror(err) {
            // 必须抛出错误才会停止
            errCallback(err)
            throw err
        },
        openWhenHidden: true
    })
}
//GPT-SSE流式请求
export const yaoviaChatSseRequset = (data, successCallback, errCallback) => {
    fetchEventSource("/tech/amp/yaowei/chat", {
        method: 'POST',
        signal: signal,
        headers: { Authorization: `Bearer ${getToken()}`,'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        onmessage(msg) {
            successCallback(msg)
        },
        onerror(err) {
            // 必须抛出错误才会停止
            errCallback(err)
            throw err
        },
        openWhenHidden: true
    })
}
//GPT-SSE流式请求
export const multiDocChatSseRequset = (data, successCallback, errCallback) => {
    fetchEventSource("/tech/amp/virtualStaff/multiDocChat", {
        method: 'POST',
        signal: signal,
        headers: { Authorization: `Bearer ${getToken()}`,'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        onmessage(msg) {
            successCallback(msg)
        },
        onerror(err) {
            // 必须抛出错误才会停止
            errCallback(err)
            throw err
        },
        openWhenHidden: true
    })
}

//GPT-SSE流式请求
export const showTeachChatSseRequset = (data, successCallback, errCallback) => {
    fetchEventSource("/tech/amp/agent/showandteach", {
        method: 'POST',
        signal: signal,
        headers: { Authorization: `Bearer ${getToken()}`,'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        onmessage(msg) {
            successCallback(msg)
        },
        onerror(err) {
            // 必须抛出错误才会停止
            errCallback(err)
            throw err
        },
        openWhenHidden: true
    })
}

//GPT-SSE流式请求
export const previewChatSseRequset = (data, successCallback, errCallback) => {
    fetchEventSource("/tech/amp/agent/preview", {
        method: 'POST',
        signal: signal,
        headers: { Authorization: `Bearer ${getToken()}`,'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        onmessage(msg) {
            successCallback(msg)
        },
        onerror(err) {
            // 必须抛出错误才会停止
            errCallback(err)
            throw err
        },
        openWhenHidden: true
    })
}

//GPT-SSE流式请求
export const docContentHandlerSseRequset = (data, successCallback, errCallback) => {
    fetchEventSource("/ppt/v1/yaovia/docContentHandler", {
        method: 'POST',
        signal: signal,
        headers: { Authorization: `Bearer ${getToken()}`,'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        onmessage(msg) {
            successCallback(msg)
        },
        onerror(err) {
            // 必须抛出错误才会停止
            errCallback(err)
            throw err
        },
        openWhenHidden: true
    })
}

//GPT-SSE流式请求
export const promptAskSseRequset = (data, successCallback, errCallback) => {
    fetchEventSource("/prompt/v1/yaovia/prompt/ask", {
        method: 'POST',
        signal: signal,
        headers: { Authorization: `Bearer ${getToken()}`,'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        onmessage(msg) {
            successCallback(msg)
        },
        onerror(err) {
            // 必须抛出错误才会停止
            errCallback(err)
            throw err
        },
        openWhenHidden: true
    })
}
