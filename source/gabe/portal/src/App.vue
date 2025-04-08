<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
#app {
  /* background: #f6f8ff; */
}
.content-container {
  margin: 20px;
}

.margin-top-20 {
  margin-top: 20px;
}

.text-align-right {
  text-align: right;
}

.text-align-center {
  text-align: center;
}

.uploadFile_delete_popover {
  padding: 16px 14px !important;
  border-radius: 10px !important;

  .delete_popover_content {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    white-space: nowrap;
  }

  .el-icon-warning {
    color: #ffc34c;
    font-size: 14px;
    margin-right: 8px;
  }

  .delete_popover_footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 13px 0 0 0;
  }

  .el-button {
    width: 56px;
    height: 24px;
    border-radius: 30px;
    font-size: 14px;
    font-family: MiSans, MiSans;
    font-weight: 400;
    line-height: 24px;
    padding: 0;
  }

  .el-button--default {
    color: rgba(0, 0, 0, 0.65);
  }

  .el-button--default:hover {
    border-color: #d0d0d0;
    color: rgba(0, 0, 0, 0.65);
    background-color: rgba(0, 0, 0, 0.05);
  }

  .el-button--primary {
    border-color: #00aea3;
    background-color: #00aea3;
  }
}

.el-button--primary:hover {
  border-color: #00a59b;
  background-color: #00a59b;
}

::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 1);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #d2eddf;
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 1);
}
.avatar-uploader {
  display: flex;
}
.el-upload-list--picture-card .el-upload-list__item {
  width: 80px;
  height: 80px;
}
.avatar-uploader .el-upload {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.hide-upload-btn .el-upload--picture-card {
  display: none !important;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.loading,
.loading > div {
  position: relative;
  box-sizing: border-box;
}

.loading {
  display: block;
  font-size: 0;
  font-color: #fff;
}

.loading.la-dark {
  font-color: #aaaaaa;
}

.loading > div {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}

.loading {
  width: 54px;
  height: 18px;
}

.loading > div {
  width: 8px;
  height: 8px;
  margin: 4px;
  border-radius: 100%;
  animation: ball-beat 0.7s -0.15s infinite linear;
}

.loading > div:nth-child(2n-1) {
  animation-delay: -0.5s;
}

@keyframes ball-beat {
  50% {
    opacity: 0.2;
    transform: scale(0.75);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.table-container {
  padding: 10px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: move;
  border: 1px solid rgba(28, 31, 35, 0.08);
}
.table-container:hover {
  /* border: 1px solid #00aea3; */
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
  outline: 2px solid #409eff;
}

.lf-tool-overlay .lf-text-input {
  display: none !important;
}
</style>
