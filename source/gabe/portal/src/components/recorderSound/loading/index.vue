<template>
  <div class="loading">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<style lang="scss" scoped>
.loading,
.loading>div {
  position: relative;
  box-sizing: border-box;
}

.loading {
  display: block;
  font-size: 0;
  color: rgba(255, 255, 255, 0.9);
}

.loading>div {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}

.loading {
  width: 20px;
  height: 20px;
}

.loading>div {
  width: 3px;
  height: 20px;
  margin: 1px;
  margin-top: 0;
  margin-bottom: 0;
  border-radius: 0;
  animation: line-scale 1s infinite ease;
}

.loading>div:nth-child(1) {
  animation-delay: -1.2s;
}

.loading>div:nth-child(2) {
  animation-delay: -1.1s;
}

.loading>div:nth-child(3) {
  animation-delay: -1s;
}

.loading>div:nth-child(4) {
  animation-delay: -0.9s;
}

@keyframes line-scale {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
  }

  20% {
    transform: scaleY(1);
  }
}
</style>
