<template>
  <div class="valentine-page">
    <!-- 浪漫背景 -->
    <div class="background"></div>

    <!-- 主要内容 -->
    <div class="content">
      <!-- 标题 -->
      <header class="hero-section">
        <h1 class="title">亲爱的老婆</h1>
        <p class="subtitle">情人节快乐 ❤️</p>
      </header>

      <!-- 恋爱时间计时器 -->
      <section class="time-section">
        <div class="time-intro">我们已经相爱</div>
        <div class="time-display">
          <div class="time-item">
            <span class="time-value">{{ years }}</span>
            <span class="time-label">年</span>
          </div>
          <div class="time-item">
            <span class="time-value">{{ months }}</span>
            <span class="time-label">月</span>
          </div>
          <div class="time-item">
            <span class="time-value">{{ days }}</span>
            <span class="time-label">天</span>
          </div>
          <div class="time-item">
            <span class="time-value">{{ hours }}</span>
            <span class="time-label">时</span>
          </div>
          <div class="time-item">
            <span class="time-value">{{ minutes }}</span>
            <span class="time-label">分</span>
          </div>
          <div class="time-item">
            <span class="time-value">{{ seconds }}</span>
            <span class="time-label">秒</span>
          </div>
        </div>
      </section>

      <!-- 情话展示 -->
      <section class="message-section">
        <div class="message-display">
          <p class="message">{{ currentMessage }}</p>
        </div>
      </section>

      <!-- 照片展示 -->
      <section class="photo-section">
        <div class="artistic-photo-grid">
          <div
            v-for="(photo, index) in photos"
            :key="index"
            class="artistic-photo-item"
            :class="{
              large: index % 4 === 0,
              medium: index % 4 === 1,
              small: index % 4 === 2 || index % 4 === 3,
            }"
          >
            <img :src="photo" alt="回忆照片" />
            <div class="photo-overlay">
              <div class="photo-caption">美好回忆 {{ index + 1 }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 礼物展示 -->
      <section class="gift-section">
        <div class="gift-display">
          <p>点击打开礼物</p>
          <button @click="openGift" class="gift-button">🎁</button>
        </div>
      </section>
    </div>

    <!-- 礼物弹窗 -->
    <div v-if="giftOpened" class="gift-modal">
      <div class="gift-modal-content">
        <!-- 第一次打开 -->
        <div v-if="giftOpenCount === 1">
          <h3>嗯？</h3>
          <p>什么都没有... 再试一次吧 😜</p>
          <button @click="giftOpened = false" class="close-button">关闭</button>
        </div>

        <!-- 第二次及以后打开 -->
        <div v-else>
          <h3>惊喜礼物</h3>
          <p>我爱你，永远如初 ❤️</p>
          <p>愿我们的爱情如星辰般永恒</p>
          <p>你是我生命中最美好的遇见</p>
          <p>陪你走完这漫长的一生</p>
          <button @click="giftOpened = false" class="close-button">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";

// 恋爱开始时间（请修改为实际日期）
const loveStartDate = new Date("2020-02-14");

// 时间计算
const years = ref(0);
const months = ref(0);
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

// 情话列表
const loveMessages = [
  "从见到你的第一眼起，我就知道你是我要找的人",
  "和你在一起的每一天都是情人节",
  "你是我生命中最美丽的意外",
  "爱你不是一时冲动，而是一生的承诺",
  "有你在身边，再苦的日子也是甜的",
  "你是我的太阳，照亮我生命的每一个角落",
  "和你一起慢慢变老是我最幸福的事",
  "你是我心中永远的唯一",
  "爱你，直到时间的尽头",
  "你的笑容是我每天醒来的动力",
];

const currentMessage = ref(loveMessages[0]);
const messageIndex = ref(0);

// 照片列表（自动读取assets/photo文件夹中的所有图片）
const photos = ref<string[]>([]);

// 动态导入assets/photo文件夹中的所有图片
const loadPhotos = () => {
  try {
    // 使用import.meta.glob动态导入所有图片文件
    const imageModules = import.meta.glob("/src/assets/photo/*", {
      eager: true,
      import: "default",
    });
    const imagePaths: string[] = [];

    // 遍历所有导入的图片模块，提取图片路径
    for (const path in imageModules) {
      if (Object.prototype.hasOwnProperty.call(imageModules, path)) {
        imagePaths.push(path);
      }
    }

    photos.value = imagePaths;
  } catch (error) {
    console.error("加载照片失败:", error);
    // 如果加载失败，使用默认图片
    photos.value = [
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=romantic%20couple%20holding%20hands%20sunset%20beach%20love&image_size=portrait_4_3",
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=couple%20kissing%20under%20romantic%20lights%20valentine%27s%20day&image_size=portrait_4_3",
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20couple%20together%20in%20love%20romantic%20moment&image_size=portrait_4_3",
    ];
  }
};

// 加载照片
loadPhotos();

// 注意：请将照片文件放在 src/assets/photo/ 文件夹中，支持任意文件名

// 礼物状态
const giftOpened = ref(false);
const giftOpenCount = ref(0);

// 更新时间
const updateTime = () => {
  const now = new Date();
  const diff = now.getTime() - loveStartDate.getTime();

  // 计算时间差
  years.value = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  const remainingAfterYears = diff % (1000 * 60 * 60 * 24 * 365);
  months.value = Math.floor(remainingAfterYears / (1000 * 60 * 60 * 24 * 30));
  const remainingAfterMonths = remainingAfterYears % (1000 * 60 * 60 * 24 * 30);
  days.value = Math.floor(remainingAfterMonths / (1000 * 60 * 60 * 24));
  const remainingAfterDays = remainingAfterMonths % (1000 * 60 * 60 * 24);
  hours.value = Math.floor(remainingAfterDays / (1000 * 60 * 60));
  const remainingAfterHours = remainingAfterDays % (1000 * 60 * 60);
  minutes.value = Math.floor(remainingAfterHours / (1000 * 60));
  const remainingAfterMinutes = remainingAfterHours % (1000 * 60);
  seconds.value = Math.floor(remainingAfterMinutes / 1000);
};

// 切换情话
const switchMessage = () => {
  messageIndex.value = (messageIndex.value + 1) % loveMessages.length;
  currentMessage.value = loveMessages[messageIndex.value];
};

// 打开礼物
const openGift = () => {
  giftOpenCount.value++;
  giftOpened.value = true;
};

// 获取情话API
const fetchLoveMessage = () => {
  fetch("https://api.zxki.cn/api/twqh")
    .then((response) => response.text())
    .then((data) => {
      if (data) {
        currentMessage.value = data;
      }
    })
    .catch((error) => {
      console.error("获取情话失败:", error);
      // 如果API调用失败，使用本地情话
      switchMessage();
    });
};

// 定时器
let timeInterval: number;
let messageInterval: number;

onMounted(() => {
  updateTime();
  fetchLoveMessage();
  timeInterval = window.setInterval(updateTime, 1000);
  messageInterval = window.setInterval(fetchLoveMessage, 30000); // 每30秒更新一次情话
});

onUnmounted(() => {
  clearInterval(timeInterval);
  clearInterval(messageInterval);
});
</script>

<style scoped>
.valentine-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  z-index: -1;
}

.background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50C60 30 70 40 80 50C70 60 60 70 50 50Z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E");
  background-size: 100px 100px;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 8px;
  position: relative;
  z-index: 1;
}

/* 标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.title {
  font-size: 2.8rem;
  color: #fff;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  font-family: "Arial Rounded MT Bold", "Helvetica Rounded", sans-serif;
}

.subtitle {
  font-size: 1.3rem;
  color: #fff;
  margin-bottom: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* 通用部分标题 */
.section-title {
  font-size: 1.6rem;
  color: #e91e63;
  text-align: center;
  margin-bottom: 1.2rem;
  font-family: "Arial Rounded MT Bold", "Helvetica Rounded", sans-serif;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #e91e63, #f48fb1);
  border-radius: 2px;
}

/* 时间展示 */
.time-section {
  margin-bottom: 3rem;
  overflow: hidden;
}

.time-intro {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  font-family: "Montserrat", "Poppins", "Roboto", sans-serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
  font-weight: 500;
}

.time-display {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: nowrap;
  gap: 0.5rem;
  padding: 1.2rem;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
}

.time-item {
  display: flex;
  align-items: baseline;
  justify-content: center;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 0;
  gap: 0.2rem;
}

.time-item:hover {
  transform: translateY(-2px);
}

.time-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  font-family: "Montserrat", "Poppins", "Roboto", sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.time-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-family: "Arial Rounded MT Bold", "Helvetica Rounded", sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1;
}

/* 情话展示 */
.message-section {
  margin-bottom: 3rem;
}

.message-display {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

.message-display::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.6s ease;
}

.message-display:hover {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.message-display:hover::before {
  left: 100%;
}

.message-display::after {
  content: '"';
  position: absolute;
  top: -15px;
  left: 4px;
  font-size: 4.5rem;
  color: rgba(255, 255, 255, 0.25);
  font-family: "Georgia", serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  z-index: 0;
}

.message {
  font-size: 1.4rem;
  line-height: 1.6;
  font-style: italic;
  margin: 0;
  font-family: "Playfair Display", "Georgia", "Times New Roman", serif;
  position: relative;
  z-index: 1;
  color: #fff;
  text-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.5),
    0 0 10px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.message-display:hover .message {
  transform: scale(1.02);
}

/* 照片展示 */
.photo-section {
  margin-bottom: 3rem;
}

.artistic-photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  grid-auto-rows: minmax(180px, auto);
  grid-gap: 1.8rem;
  grid-auto-flow: dense;
}

/* 增加更多不规则布局效果 */
.artistic-photo-item:nth-child(8n + 1) {
  grid-row: span 2;
  grid-column: span 1;
}

.artistic-photo-item:nth-child(8n + 3) {
  grid-row: span 1;
  grid-column: span 2;
}

.artistic-photo-item:nth-child(8n + 5) {
  grid-row: span 2;
  grid-column: span 2;
}

.artistic-photo-item:nth-child(8n + 7) {
  grid-row: span 2;
  grid-column: span 1;
}

.artistic-photo-item {
  position: relative;
  overflow: hidden;
  border-radius: 0.8rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

/* 增加更多错落效果 */
.artistic-photo-item:nth-child(7n + 1) {
  transform: rotate(-2.5deg) translateY(-8px) translateX(3px) scale(0.95);
}

.artistic-photo-item:nth-child(7n + 2) {
  transform: rotate(2deg) translateY(5px) translateX(-4px) scale(1.02);
}

.artistic-photo-item:nth-child(7n + 3) {
  transform: rotate(-1.5deg) translateY(-3px) translateX(-2px) scale(0.98);
}

.artistic-photo-item:nth-child(7n + 4) {
  transform: rotate(3deg) translateY(7px) translateX(5px) scale(1.05);
}

.artistic-photo-item:nth-child(7n + 5) {
  transform: rotate(-0.8deg) translateY(-5px) translateX(1px) scale(0.97);
}

.artistic-photo-item:nth-child(7n + 6) {
  transform: rotate(1.2deg) translateY(3px) translateX(-3px) scale(1.03);
}

.artistic-photo-item:nth-child(7n + 7) {
  transform: rotate(-3deg) translateY(-6px) translateX(4px) scale(0.96);
}

.artistic-photo-item:hover {
  transform: rotate(0deg) scale(1.08);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  z-index: 10;
}

.artistic-photo-item.large {
  grid-row: span 2;
  grid-column: span 2;
}

.artistic-photo-item.medium {
  grid-row: span 1;
  grid-column: span 2;
}

.artistic-photo-item.small {
  grid-row: span 1;
  grid-column: span 1;
}

.artistic-photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.artistic-photo-item:hover img {
  transform: scale(1.1);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 20px;
}

.artistic-photo-item:hover .photo-overlay {
  opacity: 1;
}

.photo-caption {
  color: white;
  font-size: 1.1rem;
  font-family: "Playfair Display", serif;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.artistic-photo-item:hover .photo-caption {
  transform: translateY(0);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .artistic-photo-item.large,
  .artistic-photo-item.medium {
    grid-row: span 1;
    grid-column: span 1;
  }

  .artistic-photo-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-gap: 1rem;
  }
}

/* 礼物展示 */
.gift-section {
  margin-bottom: 3rem;
}

.gift-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  transition: all 0.3s ease;
}

.gift-display:hover {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.gift-display p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 1.5rem;
  font-family: "Arial Rounded MT Bold", "Helvetica Rounded", sans-serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.gift-button {
  font-size: 4rem;
  background: none;
  border: none;
  cursor: pointer;
  animation: pulse 2s infinite;
  transition: all 0.3s ease;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.gift-button:hover {
  transform: scale(1.1) rotate(5deg);
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* 礼物弹窗 */
.gift-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.gift-modal-content {
  background: #fff;
  padding: 3rem;
  border-radius: 1rem;
  text-align: center;
  max-width: 90%;
  width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalAppear 0.5s ease;
  position: relative;
  overflow: hidden;
}

.gift-modal-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #e91e63, #f48fb1);
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.gift-modal-content h3 {
  color: #e91e63;
  margin-bottom: 1rem;
  font-family: "Arial Rounded MT Bold", "Helvetica Rounded", sans-serif;
}

.gift-modal-content p {
  color: #333;
  margin-bottom: 1rem;
  font-family: "Georgia", "Times New Roman", serif;
}

.close-button {
  background: #e91e63;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  font-family: "Arial Rounded MT Bold", "Helvetica Rounded", sans-serif;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #c2185b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    padding: 1rem 8px;
  }

  .title {
    font-size: 2.2rem;
  }

  .section-title {
    font-size: 1.4rem;
  }

  .time-intro {
    font-size: 1rem;
    margin-bottom: 0.8rem;
  }

  .time-display {
    gap: 0.3rem;
    padding: 1rem;
  }

  .time-item {
    min-width: 45px;
  }

  .time-value {
    font-size: 2.2rem;
  }

  .time-label {
    font-size: 0.9rem;
    line-height: 1;
  }

  .message-display {
    padding: 1.5rem;
  }

  .message {
    font-size: 1.1rem;
  }

  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .photo-card img {
    height: 160px;
  }

  .gift-display {
    padding: 1.5rem;
  }

  .gift-button {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .time-intro {
    font-size: 0.9rem;
    margin-bottom: 0.6rem;
  }

  .time-display {
    gap: 0.2rem;
    padding: 0.8rem;
  }

  .time-item {
    min-width: 40px;
  }

  .time-value {
    font-size: 1.8rem;
  }

  .time-label {
    font-size: 0.8rem;
    line-height: 1;
  }

  .photo-grid {
    grid-template-columns: 1fr;
  }

  .photo-card img {
    height: 200px;
  }

  .message {
    font-size: 1.1rem;
  }

  .gift-modal-content {
    padding: 2rem;
  }
}
</style>
