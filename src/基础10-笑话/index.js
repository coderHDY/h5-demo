const joke = document.querySelector(".joke");
const button = document.querySelector(".button");

const changeJoke = async () => {
  const config = {
    headers: {
      Accept: 'application/json',
    },
  }
  const jokeData = await (await fetch("https://icanhazdadjoke.com", config)).json();
  joke.innerText = jokeData.joke;
}
button.addEventListener("click", changeJoke);
changeJoke();