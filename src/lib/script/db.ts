import type Conversation from "./conversation";

/**
 * 数据库类
 */
class DB {
  private dbName: string; // 数据库名称
  private storeName: string; // 存储名称
  private db: IDBDatabase | null = null; // 数据库实例

  /**
   * 构造函数
   * @param dbName - 数据库名称
   * @param storeName - 数据存储名称
   */
  constructor(dbName: string, storeName: string) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.initDB();
  }

  // 初始化数据库
  private initDB() {
    const request = indexedDB.open(this.dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore(this.storeName, { keyPath: 'id' }); // 使用 id 作为主键
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };

    request.onerror = (event) => {
      console.error("数据库打开失败:", (event.target as IDBRequest).error);
    };
  }

  /**
   * 添加/更新对话
   * @param conversation - 要添加或更新的对话对象
   */
  public async upsertConversation(conversation: Conversation) {
    if (!this.db) {
      throw new Error("数据库尚未初始化");
    }

    const transaction = this.db.transaction(this.storeName, "readwrite");
    const store = transaction.objectStore(this.storeName);
    store.put(conversation); // 添加或更新对话

    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  /**
   * 删除对话
   * @param id - 要删除的对话的 id
   */
  public async deleteConversation(id: string) {
    if (!this.db) {
      throw new Error("数据库尚未初始化");
    }

    const transaction = this.db.transaction(this.storeName, "readwrite");
    const store = transaction.objectStore(this.storeName);
    store.delete(id); // 删除对话

    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  /**
   * 获取所有对话
   * @returns 所有对话的数组，按 lastModifiedTime 降序排列
   */
  public async getAllConversations(): Promise<Conversation[]> {
    if (!this.db) {
      throw new Error("数据库尚未初始化");
    }

    const transaction = this.db.transaction(this.storeName, "readonly");
    const store = transaction.objectStore(this.storeName);
    const request = store.getAll(); // 获取所有对话

    return new Promise<Conversation[]>((resolve, reject) => {
      request.onsuccess = (event) => {
        const conversations: Conversation[] = (event.target as IDBRequest).result;
        // 按 lastModifiedTime 降序排列
        conversations.sort((a, b) => b.lastModifiedTime - a.lastModifiedTime);
        resolve(conversations);
      };
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  /**
   * 根据 id 获取指定对话
   * @param id - 对话的 id
   * @returns 指定对话对象
   */
  public async getConversationById(id: string): Promise<Conversation | null> {
    if (!this.db) {
      throw new Error("数据库尚未初始化");
    }

    const transaction = this.db.transaction(this.storeName, "readonly");
    const store = transaction.objectStore(this.storeName);
    const request = store.get(id); // 根据 id 获取对话

    return new Promise<Conversation | null>((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result as Conversation);
      };
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }
}

/**
 * 数据库实例
 */
const db = new DB("helper_android", "conversations");

export default db;
