import request from '@/utils/request'
import axios from "axios";
import qs from 'qs';

let config = {};

axios.get("/conf/config.json").then((res) => {
  console.log(res.data);
  config = res.data;
});

export function login(data) {
  if (config.enable) {
    data["client_id"]=config.clientid
    data["grant_type"]="password"
    return axios.post(config.url,qs.stringify(data), 
      {headers: {'Content-Type':'application/x-www-form-urlencoded'}}
    ).then((response) => {
      console.log(response);
      const curTime = new Date()
      if ("data" in response){
        const expire = new Date(curTime.setMinutes(curTime.getMinutes() + response.data.expires_in/60))
        return {"token":response.data.access_token,"expire": expire,"refresh_token": response.data.refresh_token};
      }else{
        const expire = new Date(curTime.setMinutes(curTime.getMinutes() + response.expires_in/60))
        return {"token":response.access_token,"expire": expire,"refresh_token": response.refresh_token};
      }
    })
    .catch((error) => {
      console.log(error);
    });  
  } else {
    return request({
      url: '/tech/user/login',
      method: 'post',
      data
    });
  }
}

export function refreshToken(refresh_token) {
  if (config.enable) {
    let data = {};
    data["client_id"]=config.clientid
    data["grant_type"]="refresh_token"
    data["refresh_token"]=refresh_token
    return axios.post(config.url,qs.stringify(data), 
      {headers: {'Content-Type':'application/x-www-form-urlencoded'}}
    ).then((response) => {
      console.log(response);
      const curTime = new Date()
      if ("data" in response){
        const expire = new Date(curTime.setMinutes(curTime.getMinutes() + response.data.expires_in/60))
        return {"token":response.data.access_token,"expire": expire};
      }else{
        const expire = new Date(curTime.setMinutes(curTime.getMinutes() + response.expires_in/60))
        return {"token":response.access_token,"expire": expire};
      }
    })
    .catch((error) => {
      console.log(error);
    });  
  } else {
    return request({
      url: '/tech/user/refresh_token',
      method: 'get'
    });
  }
}

export function getInfo(token) {
  return request({
    url: '/tech/amp/userinfo',
    method: 'get',
    // params: { token }
  })
}

export function resetPassword(data) {
  return request({
    url: '/tech/amp/user/resetPassword',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/v1/user/logout',
    method: 'post'
  })
}

export function getUserList(params) {
  return request({
    url: '/tech/operatorapi/userlist',
    method: 'get',
    params
  })
}

export function updateUser(data) {
  return request({
   url: '/tech/operatorapi/updateuser',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/tech/operatorapi/deleteuser',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/tech/operatorapi/createuser',
    method: 'post',
    data
  })
}

export function getRoleList(params) {
  return request({
    url: '/tech/operatorapi/rolelist',
    method: 'get',
    params
  })
}

export function getTenantList(params) {
  return request({
    url: '/tech/operatorapi/tenantlist',
    method: 'get',
    params
  })
}

export function addTenant(data) {
  return request({
    url: '/tech/operatorapi/createtenant',
    method: 'post',
    data
  })
}

export function deleteTenant(data) {
  return request({
    url: '/tech/operatorapi/deletetenant',
    method: 'post',
    data
  })
}

export function updateTenant(data) {
  return request({
    url: '/tech/operatorapi/updatetenant',
    method: 'post',
    data
  })
}