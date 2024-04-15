/**
 * 存缓存
 * @param key 缓存key
 * @param value 缓存值
 * @param expire 过期时间（单位秒）,不存在永久保存
 */
export function setStorage(key:string, value:string, expire?:number) {
    const obj = {
      data: value,
      time: Date.now() / 1000,
      expire: expire
    };
    localStorage.setItem(key, JSON.stringify(obj));
  }
  
  /**
   * 取缓存
   * @param key 缓存key
   */
  export function getStorage(key:string) {
    let val:any = localStorage.getItem(key);
    if (!val) {
      return null;
    }
    val = JSON.parse(val);
    if (Date.now() / 1000 - val.time > val.expire) {
      localStorage.removeItem(key);
      return null;
    }
    return val.data;
  }
  