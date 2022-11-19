const share = document.querySelector("#share");
const data = {
    title: document.title,
    text: 'Hello World',
    url: 'https://developer.mozilla.org',
}

share.addEventListener("click", () => navigator.share().then(res => console.log(res)).catch(err => console.log(err)));