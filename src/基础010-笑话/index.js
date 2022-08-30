const joke = document.querySelector(".joke");
const jokeTrans = document.querySelector(".joke-trans");
const button = document.querySelector(".button");

const trans = async s => await (await fetch(`https://api.66mz8.com/api/translation.php?info=${s.replace(/[^\w\s]+/g, ".")}`)).json()
const changeJoke = async () => {
  const config = {
    headers: {
      Accept: 'application/json',
    },
  }
  const jokeData = await (await fetch("https://icanhazdadjoke.com", config)).json();
  joke.innerText = jokeData.joke;

  const joketrans = await trans(jokeData.joke);
  jokeTrans.innerText = joketrans.fanyi ?? "";
}
button.addEventListener("click", changeJoke);
changeJoke();