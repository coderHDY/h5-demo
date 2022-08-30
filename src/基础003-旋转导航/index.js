const page = document.querySelector(".page");
const open = document.querySelector(".open");
const close = document.querySelector(".close");
const navController = document.querySelector(".nav-controller");
const navSelector = document.querySelector(".nav");
const pageContent = document.querySelector(".page-content");
const articles = pageContent.querySelectorAll("section");

const nodeParser = (tag, attrs, children) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, val]) => node.setAttribute(key, val));
    if (Array.isArray(children)) {
        children.forEach(item => node.appendChild(nodeParser(item)))
    } else if (typeof children === "object" && children !== null) {
        node.appendChild(nodeParser(children));
    } else {
        node.innerHTML = children;
    }
    return node;
}
const init = (() => {
    articles.forEach((item, idx) => {
        const h1 = item.querySelector("h1");
        const title = h1.innerText;
        const node = nodeParser(
            "div",
            {
                "class": "nav-item",
                "data-num": idx + 1,
            },
            title
        );
        navSelector.appendChild(node)
    })
})();
const toggle = (() => {
    const proxy = new Proxy({ val: false }, {
        set(target, p, v) {
            page.classList.toggle("is-open");
            Reflect.set(target, p, v);
        }
    });
    const toggle = () => proxy.val = !proxy.val
    return toggle;
})();
const changeNav = ((defaultPage = 1) => {
    const len = articles.length;
    pageContent.innerHTML = "";
    pageContent.appendChild(articles[defaultPage - 1]);
    const proxy = new Proxy({ val: 1 }, {
        set(target, p, v) {
            if (v > len) return false;
            pageContent.innerHTML = "";
            pageContent.appendChild(articles[v - 1]);
            Reflect.set(target, p, v);
            toggle();
        }
    });
    return (num) => proxy.val = num;
})(1);

navController.addEventListener("click", toggle);
navSelector.addEventListener("click", e => {
    const num = e.target.getAttribute("data-num");
    if (!num) return;
    changeNav(num);
})
