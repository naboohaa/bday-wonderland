const enterButton = document.querySelector("#enter-button");
const entrance = document.querySelector(".entrance");
const rabbitHole = document.querySelector("#rabbit-hole");
const birthdayDetails = document.querySelector("#birthday-details");
const backButton = document.querySelector("#back-button");

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

let isTransitioning = false;

function revealInvitation() {
    rabbitHole.hidden = true;
    entrance.hidden = true;
    birthdayDetails.hidden = false;

    birthdayDetails.classList.add("is-revealing");
    document.body.classList.remove("is-falling");

    window.scrollTo({ top: 0, behavior: "instant" });
    birthdayDetails.focus({ preventScroll: true });

    enterButton.disabled = false;
    isTransitioning = false;
}

enterButton.addEventListener("click", () => {
    if (isTransitioning) {
        return;
    }

    isTransitioning = true;
    enterButton.disabled = true;

    // Skip the falling sequence for visitors who prefer less motion.
    if (reducedMotion.matches) {
        revealInvitation();
        return;
    }

    rabbitHole.hidden = false;
    document.body.classList.add("is-falling");

    window.setTimeout(revealInvitation, 3400);
});

backButton.addEventListener("click", () => {
    birthdayDetails.hidden = true;
    birthdayDetails.classList.remove("is-revealing");
    entrance.hidden = false;

    window.scrollTo({ top: 0, behavior: "instant" });
    enterButton.focus({ preventScroll: true });
});