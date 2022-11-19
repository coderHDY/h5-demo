const share = document.querySelector("#share");
const input = document.querySelector("#input");


const handleShare = () => {
    const val = input.value;
    const data = {
        title: document.title,
        text: '分享你个东西～',
        url: val,
    }
    navigator.share?.(data).then(res => console.log(res)).catch(err => console.log(err))
}
share.addEventListener("click", handleShare);