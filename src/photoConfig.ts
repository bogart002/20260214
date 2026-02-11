// 图片配置文件
// 在这里列出所有可用的照片路径
// 照片应该放在 public/photos 文件夹中
// 
// 使用方法：
// 1. 将照片文件放入 public/photos 文件夹
// 2. 在下面的数组中添加照片的路径
// 3. 支持的格式：.jpg, .jpeg, .png, .gif, .webp
//
// 示例：
// 如果你有 photo1.jpg, photo2.png, photo3.jpg 三个文件
// 就配置为：['/photos/photo1.jpg', '/photos/photo2.png', '/photos/photo3.jpg']
//
// 注意：路径必须以 /photos/ 开头

export const photoList = [
  '/photos/photo1.jpg',
  '/photos/photo2.jpg',
  '/photos/photo3.jpg',
  '/photos/photo4.jpg',
  '/photos/photo5.jpg',
  '/photos/photo6.jpg',
];

// 如果没有配置照片，使用默认图片
export const defaultPhoto = '/vite.svg';