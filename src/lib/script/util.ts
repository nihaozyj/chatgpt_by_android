import Conversation from "./conversation";
import db from "./db";

/**
 * 创建对话
 * @param title 对话标题
 * @returns 新创建的对话
 */
export function createConversation(title: string = '新对话') {
  const conversation = new Conversation();
  conversation.title = title;

  try {
    db.upsertConversation(conversation);
  } catch (error) {
    console.error(error);
  }

  return conversation;
}


/**
 * 压缩图像文件到指定的最大宽度和高度。
 * @param { File } file - 要压缩的图像文件对象。
 * @param { number } [maxWidth = 1280] - 压缩后的最大宽度，默认为 1280 像素。
 * @param { number } [maxHeight = 720] - 压缩后的最大高度，默认为 720 像素。
 * @returns { Promise<File> } - 返回一个 Promise，解析为压缩后的图像文件。
 */
export async function compressImage(file: File, maxWidth: number = 1280, maxHeight: number = 720): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target!.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // 计算压缩后的宽高
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      // 绘制图像到 canvas
      ctx!.drawImage(img, 0, 0, width, height);
      // 将 canvas 转换为 Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type })); // 返回压缩后的文件
          } else {
            reject(new Error("压缩失败"));
          }
        },
        file.type,
        0.7,
      ); // 0.7 是压缩质量，范围 0-1
    };

    img.onerror = (error) => {
      reject(error);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file); // 读取文件为 Data URL
  });
}

/**
 * 将图片转换为 Base64 编码的 Data URL。
 * @param { File } file - 要转换的文件对象。
 * @returns { Promise<string> } - 返回一个 Promise，解析为 Base64 编码的 Data URL。
 */
export function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file); // 将文件读取为 Data URL
  });
}

/**
 * 添加长按事件监听器到指定元素，并支持子元素的事件委托。
 *
 * @param {HTMLElement} element - 目标元素，长按事件会在此元素上触发。
 * @param {string} childSelector - 子元素的选择器，以支持对子元素的长按事件委托。
 * @param {(target: HTMLElement) => void} callback - 当长按事件触发时执行的回调函数，参数为触发长按事件的DOM节点。
 * @param {number} [duration=400] - 长按的持续时间（毫秒），默认值为400毫秒。
 */
export function addLongPressListener(
  element: HTMLElement,
  childSelector: string,
  callback: (target: HTMLElement) => void,
  duration: number = 400
) {
  let timeout: number;
  let startX: number = 0;
  let startY: number = 0;
  const moveThreshold = 10; // 滑动的最大容忍距离，单位为像素

  let startElement: HTMLElement;
  let whetherToTriggerALongPressEvent = false;

  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    const target = event.target as HTMLElement;
    startElement = target;
    timeout = window.setTimeout(() => {
      callback(target);
      whetherToTriggerALongPressEvent = true;
      event.preventDefault();
    }, duration);
  };

  const handleTouchEnd = () => {
    clearTimeout(timeout);
  };

  const handleTouchMove = (event: TouchEvent) => {
    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - startX);
    const deltaY = Math.abs(touch.clientY - startY);
    if (deltaX > moveThreshold || deltaY > moveThreshold) {
      clearTimeout(timeout);
    }
  };

  element.addEventListener('touchstart', (event) => {
    const target = event.target as HTMLElement;
    if (target.matches(childSelector)) {
      handleTouchStart(event as TouchEvent);
    }
  });

  element.addEventListener('touchend', (event) => {
    const target = event.target as HTMLElement;
    if (target.matches(childSelector)) {
      if (startElement === target && whetherToTriggerALongPressEvent) {
        event.preventDefault();
        whetherToTriggerALongPressEvent = false;
      }
      handleTouchEnd();
    }
  });

  element.addEventListener('touchmove', (event) => {
    const target = event.target as HTMLElement;
    if (target.matches(childSelector)) {
      handleTouchMove(event as TouchEvent);
    }
  });

  element.addEventListener('touchcancel', handleTouchEnd);
}

/**
 * 打开一个提示弹窗，显示一段内容，并返回用户的确认
 * @param {string} title 弹窗标题
 * @param {string} content 弹窗内容
 * @returns {Promise<boolean>} 用户是否确认
 */
export async function openAlertDialog(title: string, content: string): Promise<boolean> {
  const id = `alert-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const template = `<div class="pop" id="${id}"> <div class="pop-content" id="pop-content"> <h2>${title}</h2> <p>${content}</p> <button id="confirm-btn">确定</button> </div> </div>`;

  document.body.insertAdjacentHTML('beforeend', template);

  return await new Promise<boolean>(resolve => {
    const pop = document.querySelector(`#${id}`) as HTMLElement;
    const popContent = pop.querySelector('.pop-content') as HTMLElement;
    const confirmBtn = pop.querySelector('#confirm-btn') as HTMLButtonElement;

    const close = () => {
      pop.remove();
      resolve(true);
    };

    // 处理.pop的点击事件
    pop.addEventListener('click', close);
    // 阻止.pop-content的点击事件冒泡
    popContent.addEventListener('click', (event) => {
      event.stopPropagation();
    });
    // 处理确定按钮点击事件
    confirmBtn.addEventListener('click', close);
  });
}
