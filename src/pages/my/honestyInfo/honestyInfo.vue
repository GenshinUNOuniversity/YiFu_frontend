<template>
  <div class="header">
    <p style="font-size: 2rem; color: white;">信用分计算规则</p>
  </div>
  <div class="rules">
    <p>1. 信用分上限为10分，初始值为10分。</p>
    <p>2. 在电动车充电完成后，如果因未挪车（不论是由车主本人、管理员还是下一位使用者实施）影响后续使用，将会依据超时时间长度扣除车主的信用分。</p>
    <p>3. 充电桩的下一位使用者如果遇到充电桩被已完成充电的车辆占用的情况，可以联系车主或管理员挪车，也可以自行挪车。如果选择自行挪车，需要上传电瓶车被挪动后的新位置，如果没有上传新的位置，将扣除信用分。</p>
    <p>4. 如果用户的信用分低于一定水平，将会被禁用充电权限。</p>
    <p>5. 当用户的信用分未达到上限且在一周内没有出现任何违规事件时，信用分将会回复1分。</p>
  </div>
  <span>此处显示违规记录</span>
</template>

<script lang="ts">
export default {
  name: 'honestyInfo'
}
</script>

<style scoped lang="less">
.header {
  height: 40px;
  width: 100vw;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  background-color: green;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rules {
  padding-left: 20px;
  padding-right: 20px;
  row-gap: 5px;
}
</style>