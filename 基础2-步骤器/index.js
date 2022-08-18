const steps = document.querySelector('.steps');
const stepsArr = steps.querySelectorAll('.step');
const prevEl = document.querySelector('.prev');
const nextEl = document.querySelector('.next');

const noTransition = (() => {
    let timer;
    return () => {
        if (timer) return;
        steps.classList.add('noTransition');
        timer = setTimeout(() => {
            steps.classList.remove('noTransition');
            timer = null;
        })
    }
})();

const useStep = (all = 1) => {
    const setActive = (val) => stepsArr.forEach((item, idx) => {
        const classList = item.classList;
        if (idx < val) {
            classList.add('active');
        } else {
            classList.remove('active');
        }
    })
    const stepProxy = new Proxy({ s: 1 }, {
        set(target, p, val) {
            if (val > all) {
                val = 1;
                noTransition();
            } else if (val < 1) {
                val = all;
                noTransition();
            } else if (Math.abs(val - target.s) > 1) {
                noTransition();
            }
            setActive(val);
            Reflect.set(target, p, val);
        }
    });
    const setStep = (val) => stepProxy.s = val;
    const prev = () => stepProxy.s--;
    const next = () => stepProxy.s++;
    const getVal = () => stepProxy.s;
    return [getVal, setStep, prev, next];
}

const [getVal, setStep, prev, next] = useStep(4);

prevEl.addEventListener('click', prev);
nextEl.addEventListener('click', next);
steps.addEventListener('click', (e) => {
    const val = e.target.getAttribute('data-val');
    if (!val || !e.target.classList.contains('number')) return;
    setStep(val);
})