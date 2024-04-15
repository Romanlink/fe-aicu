/**
 * 手机号格式校验
 * @param {string} mobile
 * @returns {Bollean} 手机号格式是否正确
 */
export function isMobile(val: string) {
    var reg1 = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
    // var reg2 = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
    if (reg1.test(val)) {
        return true
    } else {
        return false
    }
}

/**
 * 节流。减少执行次数，只执行一次。
 * @params fn 函数
 * @params wait 豪秒值
 **/
export function throttle(fn: any, wait: number = 500) {
    // 定时器
    let timer: any = null
    return function () {
        if (timer) return
        timer = setTimeout(() => {
            fn()
            timer = null // 做完之后重新关闭节点闸
        }, wait)
    }
}
