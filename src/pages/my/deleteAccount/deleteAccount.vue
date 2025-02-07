<template>
  <div style="padding: 8px">
    <div style="font-weight: bold; font-size: 36px; text-align: center; width: 100%">提醒</div>
    <p>尊敬的用户，</p>
    <p>感谢您一直以来对我们小程序 {{ mpName }} 的支持和使用。</p>
    <p>我们注意到您提交了注销账号的请求，并理解您对账号注销的决定。在注销您的账号之前，我们想提醒您以下几点：</p>
    <ol>
      <li>
        注销账号后，您将无法再使用
        {{ mpName }} 提供的各种功能和服务。您的个人信息、充电记录和设置等数据将被永久删除，不可恢复。
      </li>
      <li>
        请确保在注销账号之前备份和保存您需要保留的数据和信息，例如充电记录、举报记录等。一旦账号注销完成，我们将无法提供这些数据的恢复服务。
      </li>
      <li>如果您之后决定重新使用 {{ mpName }}，您需要重新注册一个新的账号，并重新进行相关设置和操作。</li>
    </ol>
    <p>
      如果您已经考虑清楚并确定要注销账号，请在下面确认您的决定。一旦我们收到您的确认，我们将立即处理您的注销请求，但请注意，因为我们已经删除了您的信息，注销成功后我们并不会通知您。
    </p>
    <p>如果您对账号注销有任何疑问或需要进一步的帮助，请随时与我们的客户支持团队联系。我们将竭诚为您提供协助和解答。</p>
    <p>再次感谢您一直以来的支持和信任。</p>
    <p>祝您一切顺利！</p>
    <p>
      最诚挚的问候，<br />
      {{ mpName }} 团队
    </p>
    <button type="warn" style="margin-top: 16px" @click="cancel">注销</button>
  </div>
</template>

<script lang="ts" setup>
import api from '@/api';
const mpName = '自强电动车';

const cancel = () => {
  uni.showModal({
    title: '提示',
    content: '您确定要注销账号吗？',
    success: (res: { confirm: any }) => {
      if (res.confirm) {
        uni.showLoading({
          title: '注销中',
        });
        api
          .deleteAccount()
          .then(() => {
            uni.hideLoading();
            uni.showToast({
              title: '注销成功',
              icon: 'success',
              duration: 2000,
            });
            uni.reLaunch();
          })
          .catch(() => {
            uni.hideLoading();
            uni.showToast({
              title: '注销失败',
              icon: 'error',
              duration: 2000,
            });
          });
      }
    },
  });
};
</script>
