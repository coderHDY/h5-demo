const body = document.querySelector("body");
const slider = document.querySelector(".slider");
const left = document.querySelector(".left");
const right = document.querySelector(".right");

const imgs = [
    "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80",
    "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1934&q=80",
    "https://images.unsplash.com/photo-1495467033336-2effd8753d51?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80",
    "https://images.unsplash.com/photo-1522735338363-cc7313be0ae0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2689&q=80",
    "https://images.unsplash.com/photo-1559087867-ce4c91325525?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80",
];

let showIdx = 0;
const changeIdx = (idx) => {
    showIdx = idx > imgs.length - 1 ? 0 : (idx < 0 ? imgs.length - 1 : idx);
    body.setAttribute("style", `background-image:url('${imgs[showIdx]}');`);
    slider.setAttribute("style", `background-image:url('${imgs[showIdx]}');`);
}

left.addEventListener('click', () => changeIdx(showIdx - 1));
right.addEventListener('click', () => changeIdx(showIdx + 1));
changeIdx(0);
