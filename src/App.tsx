import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { photoList, defaultPhoto } from './photoConfig';

export default defineComponent({
  name: 'ValentinePage',
  setup() {
    // 恋爱开始时间（请修改为实际日期）
    const loveStartDate = new Date("2020-03-01");

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

    // 照片列表（从配置文件读取）
    const photos = ref<string[]>([]);

    // 从配置文件加载图片
    const loadPhotos = () => {
      try {
        // 使用配置文件中的图片列表
        if (photoList.length > 0) {
          // 根据base配置添加前缀
          const base = '/20260214/';
          photos.value = photoList.map(path => {
            // 如果路径已经包含base前缀，直接使用
            if (path.startsWith(base)) {
              return path;
            }
            // 否则添加base前缀
            return base + path.replace(/^\//, '');
          });
        } else {
          // 如果配置为空，使用默认图片
          const base = '/20260214/';
          photos.value = [defaultPhoto.startsWith(base) ? defaultPhoto : base + defaultPhoto.replace(/^\//, '')];
        }
      } catch (error) {
        console.error("加载照片失败:", error);
        // 如果加载失败，使用默认图片
        photos.value = ['/20260214/vite.svg'];
      }
    };

    // 注意：请将照片文件放在 public/photos/ 文件夹中，支持任意文件名，命名格式为photo1.jpg, photo2.png等

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
      loadPhotos();
      timeInterval = window.setInterval(updateTime, 1000);
      messageInterval = window.setInterval(fetchLoveMessage, 30000); // 每30秒更新一次情话
    });

    onUnmounted(() => {
      clearInterval(timeInterval);
      clearInterval(messageInterval);
    });

    return {
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      currentMessage,
      photos,
      giftOpened,
      giftOpenCount,
      openGift,
    };
  },
  render() {
    return (
      <div class="valentine-page">
        {/* 浪漫背景 */}
        <div class="background"></div>

        {/* 主要内容 */}
        <div class="content">
          {/* 标题 */}
          <header class="hero-section">
            <h1 class="title">亲爱的老婆</h1>
            <p class="subtitle">情人节快乐 ❤️</p>
          </header>

          {/* 恋爱时间计时器 */}
          <section class="time-section">
            <div class="time-intro">我们已经相爱</div>
            <div class="time-display">
              <div class="time-item">
                <span class="time-value">{this.years}</span>
                <span class="time-label">年</span>
              </div>
              <div class="time-item">
                <span class="time-value">{this.months}</span>
                <span class="time-label">月</span>
              </div>
              <div class="time-item">
                <span class="time-value">{this.days}</span>
                <span class="time-label">天</span>
              </div>
              <div class="time-item">
                <span class="time-value">{this.hours}</span>
                <span class="time-label">时</span>
              </div>
              <div class="time-item">
                <span class="time-value">{this.minutes}</span>
                <span class="time-label">分</span>
              </div>
              <div class="time-item">
                <span class="time-value">{this.seconds}</span>
                <span class="time-label">秒</span>
              </div>
            </div>
          </section>

          {/* 情话展示 */}
          <section class="message-section">
            <div class="message-display">
              <p class="message">{this.currentMessage}</p>
            </div>
          </section>

          {/* 照片展示 */}
          <section class="photo-section">
            <div class="artistic-photo-grid">
              {this.photos.map((photo, index) => (
                <div
                  key={index}
                  class={`artistic-photo-item ${index % 4 === 0 ? 'large' : ''} ${index % 4 === 1 ? 'medium' : ''} ${index % 4 === 2 || index % 4 === 3 ? 'small' : ''}`}
                >
                  <img src={photo} alt="回忆照片" />
                  <div class="photo-overlay">
                    <div class="photo-caption">美好回忆 {index + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 礼物展示 */}
          <section class="gift-section">
            <div class="gift-display">
              <p>点击打开礼物</p>
              <button onClick={this.openGift} class="gift-button">🎁</button>
            </div>
          </section>
        </div>

        {/* 礼物弹窗 */}
        {this.giftOpened && (
          <div class="gift-modal">
            <div class="gift-modal-content">
              {/* 第一次打开 */}
              {this.giftOpenCount === 1 ? (
                <div>
                  <h3>嗯？</h3>
                  <p>什么都没有... 再试一次吧 😜</p>
                  <button onClick={() => { this.giftOpened = false }} class="close-button">关闭</button>
                </div>
              ) : (
                /* 第二次及以后打开 */
                <div>
                  <h3>惊喜礼物</h3>
                  <p>我爱你，永远如初 ❤️</p>
                  <p>愿我们的爱情如星辰般永恒</p>
                  <p>你是我生命中最美好的遇见</p>
                  <p>陪你走完这漫长的一生</p>
                  <button onClick={() => { this.giftOpened = false }} class="close-button">关闭</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
});