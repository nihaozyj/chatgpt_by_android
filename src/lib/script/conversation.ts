/**
 * 对话类
 */
class Conversation {
  /** 对话标题 */
  title: string;
  /** id */
  id: string;
  /** 对话内容 */
  content: { content: string; role: string; time: number; }[] = [];
  /** 上次修改时间 */
  lastModifiedTime: number;

  private _proxy: Conversation;

  constructor() {
    this.lastModifiedTime = Date.now();
    this.id = this.lastModifiedTime.toString() + Math.random().toString(6);
  }

  static getProxy(self: Conversation): Conversation {
    if (!self._proxy) {
      self._proxy = new Proxy(self, {
        set: (target, key, value) => {
          target[key] = value;
          target.lastModifiedTime = Date.now();
          return true;
        }
      });
    }
    return self._proxy;
  }

  /**
   * 获取对话内容的条目数量
   * @returns 对话内容的总数
   */
  static contentSize(self: Conversation): number {
    return self.content.length;
  }

  /**
  * 计算给定时间戳与当前时间之间的时间差描述
  * @param pastTime - 需要计算的过去时间戳
  * @returns 时间差的描述字符串
  */
  static LastTime(self: Conversation): string {
    const pastTime = self.lastModifiedTime;
    // 获取当前时间戳
    const currentTime = Date.now();
    // 计算时间差，以毫秒为单位
    const diffInMs = currentTime - pastTime;
    // 转换为秒、分钟等单位
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);  // 假设每月30天
    const diffInYears = Math.floor(diffInDays / 365);  // 假设每年365天
    // 根据不同的时间范围返回合适的描述
    if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else if (diffInDays < 30) {
      return `${diffInDays}天前`;
    } else if (diffInDays < 365) {
      return `${diffInMonths}个月前`;
    } else {
      return `${diffInYears}年前`;
    }
  }
}

export default Conversation;
