const contents = document.querySelectorAll(".content");
const page = document.querySelector(".page");

const checkShow = () => {
    contents.forEach(item => {
        const client = item.getBoundingClientRect();
        const distance = client.top;
        const limit = window.innerHeight - client.height * 3 / 4;
        if (distance < limit) {
            item.classList.add("visible");
        } else {
            item.classList.remove("visible");
        }
    })
}
page.addEventListener("scroll", checkShow);


// page.addEventListener("scroll", (e) => {
//     contents.forEach(item => {
//         if (item.offsetTop < page.scrollTop + page.clientHeight - 150) {
//             item.classList.add("visible");
//         } else {
//             item.classList.remove("visible");
//         }
//     })
// })