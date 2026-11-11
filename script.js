const enterButton = document.querySelector("#enter-button");
const entranceMessage = document.querySelector("#entrance-message");

enterButton.addEventListener("click", () => {
    entranceMessage.textContent = "Down, down, down…";
});