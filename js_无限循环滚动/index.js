const infiniteList = document.querySelector('.infinite-list');
const infiniteListContainer = document.getElementById('infiniteList');
let itemCount = 0;

// 函数：加载更多数据
function loadMoreItems() {
    for (let i = 0; i < 10; i++) {
        const item = document.createElement('div');
        item.className = 'infinite-list-item';
        item.textContent = `Item ${itemCount++}`;
        infiniteList.appendChild(item);
    }
}

// 初始加载
loadMoreItems();

// 监听滚动事件
infiniteListContainer.addEventListener('scroll', () => {
    if (infiniteListContainer.scrollLeft + infiniteListContainer.clientWidth >= infiniteList.scrollWidth) {
        loadMoreItems(); // 当滚动到达右侧时加载更多
    }
});