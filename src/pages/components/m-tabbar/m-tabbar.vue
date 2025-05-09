<template>
  <view class="m-tabbar-box" :style="tabbarBoxStyle">
    <view v-if="fill || native" :style="tabbarFillStyle"></view>
    <view id="m-tabbar" class="m-tabbar" :class="{ fixed: fixed || native }" :style="tabbarStyle">
      <view v-if="borderStyle === 'black'" class="m-tabbar__border"></view>
      <view class="m-tabbar__flex">
        <view
          v-for="(item, index) in tabbarList"
          :key="index"
          class="m-tabbar__item"
          :class="{
            'm-tabbar__item__active': index === currentIndex,
          }"
          @click="tabChange(index)"
        >
          <slot :name="`tabbar_index_${index}`">
            <image :src="currentIndex === index ? item.selectedIconPath : item.iconPath" class="m-tabbar__icon" />
            <view
              class="m-tabbar__label"
              :style="{ color: index === currentIndex ? tabbarConfig.selectedColor : tabbarConfig.color }"
            >
              {{ item.text }}
            </view>
          </slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const obj2strStyle = (obj) => {
  let style = '';
  for (let key in obj) {
    style += `${key}:${obj[key]};`;
  }
  return style;
};

const padFirstSymbol = (str, smb) => {
  if (str.startsWith(smb) || str.startsWith('http')) {
    return str;
  }
  return `/${str}`;
};

const replaceTabbarList = (list) => {
  if (!list.length > 0) {
    return [];
  }
  return list.map((item) => {
    if (item.iconPath) {
      item.iconPath = padFirstSymbol(item.iconPath, '/');
    }
    if (item.pagePath) {
      item.pagePath = padFirstSymbol(item.pagePath, '/');
    }
    if (item.selectedIconPath) {
      item.selectedIconPath = padFirstSymbol(item.selectedIconPath, '/');
    }
    return item;
  });
};

import PageConfig from '@/pages.json';
export default {
  props: {
    current: {
      type: [Number, String],
      default: 0,
    },
    tabbar: {
      type: Object,
      default() {
        return {};
      },
    },
    fixed: {
      type: Boolean,
      default: false,
    },
    fill: {
      type: Boolean,
      default: false,
    },
    zIndex: {
      type: [Number, String],
      default: 9999,
    },
    native: {
      type: Boolean,
      default: false,
    },
    safeBottom: {
      type: Boolean,
      default: true,
    },
    beforeChange: {
      type: Function,
      default: null,
    },
  },
  emits: ['change', 'click'],
  data() {
    return {
      safeAreaInsetsBottom: 0,
      currentIndex: 0,
      tabbarHeight: 0,
      beforeData: {},
    };
  },
  computed: {
    tabbarConfig() {
      const { native } = this;
      if (native) {
        const { tabBar } = PageConfig;
        if (!tabBar) {
          console.error('Native mode, Pages.json no tabbar config');
          return {
            borderStyle: 'black',
            list: [],
          };
        }
        return tabBar;
      }
      return this.tabbar;
    },
    tabbarList() {
      const { list } = this.tabbarConfig;
      if (list) {
        return replaceTabbarList(list);
      }
      console.error('No tabbar config');
      return [];
    },
    borderStyle() {
      const { borderStyle } = this.tabbarConfig;
      return borderStyle;
    },
    tabbarBoxStyle() {
      const { zIndex } = this;
      return obj2strStyle({
        'z-index': zIndex,
      });
    },
    tabbarFillStyle() {
      const { tabbarHeight, safeAreaInsetsBottom } = this;
      return obj2strStyle({
        height: `${tabbarHeight}rpx`,
        'padding-bottom': `${safeAreaInsetsBottom}rpx`,
        opacity: 0,
      });
    },
    tabbarStyle() {
      const { safeAreaInsetsBottom } = this;
      const { backgroundColor } = this.tabbarConfig;
      return obj2strStyle({
        'background-color': backgroundColor || '#fff',
        'padding-bottom': `${safeAreaInsetsBottom}rpx`,
      });
    },
    tabbarItemStyle() {
      const { currentIndex } = this;
      const { color, selectedColor } = this.tabbarConfig;
      return obj2strStyle({
        color: currentIndex ? selectedColor : color,
      });
    },
  },
  watch: {
    current(val) {
      this.currentIndex = Number(val);
    },
  },
  mounted() {
    const { current, safeBottom, fill, native, tabbarList } = this;
    // this.currentIndex = current * 1
    if (fill || native) {
      this.getTabbarHeight();
    }
    if (native) {
      const currentPage = getCurrentPages()[0].$page.fullPath;
      const currentIndex = tabbarList.findIndex((item) => item.pagePath === currentPage);
      this.currentIndex = currentIndex;
      if (tabbarList.length > 0) {
        uni.hideTabBar();
      }
    }
  },
  methods: {
    getTabbarHeight() {
      const { safeBottom, native } = this;
      const { windowWidth, safeAreaInsets } = uni.getSystemInfoSync();
      const ratio = 750 / windowWidth;
      if (safeBottom || native) {
        this.safeAreaInsetsBottom = safeAreaInsets.bottom * ratio;
      }
      let query = wx.createSelectorQuery().in(this);
      query
        .select('#m-tabbar')
        .boundingClientRect((rect) => {
          if (rect) {
            this.tabbarHeight = rect.height * ratio;
          }
        })
        .exec();
    },
    tabChange(index) {
      const { currentIndex } = this;
      this.$emit('click', index);
      if (index === currentIndex) {
        return;
      }
      this.beforeData = {
        newIndex: index,
        oldIndex: currentIndex,
        next: this.jumpPage,
      };
      if (this.beforeChange) {
        this.beforeChange(this.jumpPage);
      } else {
        this.jumpPage();
      }
    },
    jumpPage() {
      const { native, beforeData, tabbarList: list } = this;
      const { newIndex: index } = beforeData;
      if (list[index].pagePath) {
        if (native) {
          uni.switchTab({
            url: list[index].pagePath,
          });
        } else {
          this.currentIndex = index;
          uni.reLaunch({
            url: list[index].pagePath,
          });
        }
      }
      this.$emit('change', index);
    },
  },
};
</script>

<style lang="scss" scoped>
.m-tabbar-box {
  position: relative;
  z-index: 9999;
}

.m-tabbar {
  position: relative;
}

.m-tabbar.fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
}

.m-tabbar__flex {
  display: flex;
  flex-direction: row;
}

.m-tabbar__border {
  background-color: rgba(0, 0, 0, 0.33);
  width: 100%;
  height: 1rpx;
  transform: scaleY(0.5);
}

.m-tabbar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 4px 0 2px;
}

.m-tabbar__icon {
  display: block;
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 6rpx;
}

.m-tabbar__label {
  font-size: 24rpx;
}
</style>
