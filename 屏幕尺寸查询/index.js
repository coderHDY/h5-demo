const showScreenSize = () => {
  const screenSizeDiv = document.querySelector(".screen-size");
  screenSizeDiv.innerHTML = "";
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const availWidth = window.screen.availWidth;
  const availHeight = window.screen.availHeight;

  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;

  const offsetWidth = document.documentElement.offsetWidth;
  const offsetHeight = document.documentElement.offsetHeight;

  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  const outerWidth = window.outerWidth;
  const outerHeight = window.outerHeight;
  
  const devicePixelRatio = window.devicePixelRatio;

  screenSizeDiv.innerHTML = `
    <p>screenWidth: ${screenWidth}</p>
    <p>screenHeight: ${screenHeight}</p>
    </br>
    <p>availWidth: ${availWidth}</p>
    <p>availHeight: ${availHeight}</p>
    </br>
    <p>clientWidth: ${clientWidth}</p>
    <p>clientHeight: ${clientHeight}</p>
    </br>
    <p>offsetWidth: ${offsetWidth}</p>
    <p>offsetHeight: ${offsetHeight}</p>
    </br>
    <p>innerWidth: ${innerWidth}</p>
    <p>innerHeight: ${innerHeight}</p>
    </br>
    <p>outerWidth: ${outerWidth}</p>
    <p>outerHeight: ${outerHeight}</p>
    </br>
    <p>devicePixelRatio: ${devicePixelRatio}</p>
  `;
};

showScreenSize();

window.onresize = showScreenSize;
