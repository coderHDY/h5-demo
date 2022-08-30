const inputWrapper = document.querySelector(".input-wrapper");
const searchContent = document.querySelector(".search-content");
const searchBtnWrapper = document.querySelector(".search-btn-wrapper");

const [toggleShow, search, isShow] = (() => {
    let isShow = true;
    const toggleShow = () => {
        isShow = !isShow;
        inputWrapper.classList.toggle("hidden");
    }
    const search = (val) => console.log(val);
    return [toggleShow, search, isShow];
})();

searchBtnWrapper.addEventListener("click", () => isShow && search(searchContent?.value));
searchBtnWrapper.addEventListener("click", toggleShow);