import request from '@/api/index.js'
import { fetchEventSource } from '@microsoft/fetch-event-source'

const controller = new AbortController()
const signal = controller.signal

//prompt列表
export const getPromptList = (data) => request({
    url: '/prompt/v1/yaovia/promptList',
    method: 'post',
    data
});

//prompt删除
export const delPrompt = (data) => request({
    url: '/prompt/v1/yaovia/deletePrompt',
    method: 'post',
    data
});

//prompt添加
export const insertPrompt = (data) => request({
    url: '/prompt/v1/yaovia/addPrompt',
    method: 'post',
    data
});

//prompt修改
export const editPrompt = (data) => request({
    url: '/prompt/v1/yaovia/addPrompt',
    method: 'post',
    data
});

//GPT请求接口
export const questionPrompt = (data) => request({
    url: '/prompt/v1/yaovia/getPrompt',
    method: 'get',
    data
});

//GPT-SSE流式请求
export const sseRequset = (data, successCallback, errCallback) => {
    fetchEventSource("/prompt/v1/yaovia/prompt/ask", {
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