const pwd = document.querySelector(".pwd");
const copy = document.querySelector(".copy");
const conItem = document.querySelectorAll(".con-item input");
const generator = document.querySelector(".generator");
const tips = document.querySelector(".tips");

const conditions = {
    length: 8,
    upper: true,
    lowwer: true,
    number: true,
    symbol: false,
    get allowFns() {
        return ["upper", "lowwer", "number", "symbol"].filter(item => this[item]).map(item => {
            switch (item) {
                case "upper": return genFns.genUpper;
                case "lowwer": return genFns.genLowwer;
                case "number": return genFns.genNumber;
                case "symbol": return genFns.genSymbol;
            }
        });
    },
    get pwd() {
        const gens = this.allowFns;
        let password = new Array(this.length).fill().map(() => {
            return gens[Math.floor(Math.random() * gens.length)]();
        }).join("");
        return password;
    }
};

const genFns = {
    genUpper: () => String.fromCharCode(Math.floor(Math.random() * 26) + 65),
    genLowwer: () => String.fromCharCode(Math.floor(Math.random() * 26) + 97),
    genNumber: () => Math.floor(Math.random() * 10),
    genSymbol: () => "`~!@#$%^&*()_+-=[]{};':\",./<>?\\|"[Math.floor(Math.random() * 32)],
}

const tip = (str) => {
    const tip = document.createElement("div");
    tip.setAttribute("class", "tip");
    tip.innerText = str;
    tips.appendChild(tip);
    setTimeout(() => tips.removeChild(tip), 1000);

}
const handleCopy = () => {
    if (pwd.innerText.trim() === "") return tip("请先制作密码！");
    navigator.clipboard.writeText(pwd.innerText);
    tip("复制成功");
};
const handleGenerator = () => pwd.innerText = conditions.pwd;
const handleConditionChange = (type) => e => conditions[type] = type === "length" ? +e.target.value : e.target.checked;

copy.addEventListener("click", handleCopy);
generator.addEventListener("click", handleGenerator);
Array.prototype.forEach.call(conItem, (item => item.addEventListener("change", handleConditionChange(item.getAttribute("name")))))
