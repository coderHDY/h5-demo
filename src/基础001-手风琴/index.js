// (() => {
//   const ACTIVE_CLASS = "active";
//   const setActive = (() => {
//     let currentActive = null;
//     return (el) => {
//       if (currentActive !== null) {
//         currentActive.classList.remove(ACTIVE_CLASS);
//       }
//       el.classList.add(ACTIVE_CLASS);
//       currentActive = el;
//     }
//   })();
//   const wrapper = document.querySelector('.wrapper');
//   setActive(wrapper.children[0]);
//   wrapper.addEventListener('click', (e) => {
//     if (e.target.tagName !== "IMG") return;
//     setActive(e.target.parentNode);
//   })
// })();

const wrapper = document.querySelector('.wrapper');
window.onload = () => {
  const ACTIVE_CLASS = "active";
  const setActive = (() => {
    let currentActive = null;
    return (el) => {
      if (currentActive !== null) {
        currentActive.classList.remove(ACTIVE_CLASS);
      }
      el.classList.add(ACTIVE_CLASS);
      currentActive = el;
    }
  })();
  setActive(wrapper.children[0]);
  wrapper.addEventListener('click', (e) => {
    if (e.target.tagName !== "IMG") return;
    setActive(e.target.parentNode);
  })
}

console.log("---");