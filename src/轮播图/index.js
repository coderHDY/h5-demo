const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const swiperItem = document.querySelector('.swiper-item');
let swiper = document.querySelector('.swiper');
let itemNum = swiper.querySelectorAll('.swiper-item').length;
let swiperRect = swiper.getClientRects()[0];
let swiperItemRect = swiperItem.getClientRects()[0];
let itemWidth = parseInt(swiperItemRect.width);
let moving = false;
let showIdxProxy = new Proxy({ i: 0 }, {
    set(target, p, val) {
        if (val < 0) {
            val = itemNum - 1;
            swiper.style.left = `-${(itemNum - 1) * itemWidth}px`;
        } else if (val >= itemNum) {
            val = 0;
            swiper.style.left = '0px';
        } else {
            swiper.style.left = `-${Math.abs(val * itemWidth)}px`;
        }
        Reflect.set(target, p, val);
        return true;
    }
});
window.addEventListener('resize', (() => {
    let timer;
    return () => {
        if (timer) return;
        timer = setTimeout(() => {
            swiper = document.querySelector('.swiper');
            itemNum = swiper.querySelectorAll('.swiper-item').length;
            swiperItemRect = swiperItem.getClientRects()[0];
            itemWidth = parseInt(swiperItemRect.width);
        }, 20)
    }
})())

prev.addEventListener('click', () => {
    if (moving) return;
    moving = true;
    setTimeout(() => moving = false, 500);
    showIdxProxy.i = showIdxProxy.i <= 0 ? itemNum - 1 : showIdxProxy.i - 1;

})
next.addEventListener('click', () => {
    if (moving) return;
    moving = true;
    setTimeout(() => moving = false, 500);
    showIdxProxy.i = showIdxProxy.i >= itemNum - 1 ? 0 : showIdxProxy.i + 1;
});
