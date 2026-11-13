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

const detailButtons = document.querySelectorAll("[data-dialog]");
const detailDialogs = document.querySelectorAll(".detail-dialog");

detailButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const dialogId = button.dataset.dialog;
        const dialog = document.getElementById(dialogId);

        dialog.showModal();
        document.body.classList.add("dialog-open");
    });
});

detailDialogs.forEach((dialog) => {
    const closeButton = dialog.querySelector(".dialog-close");

    closeButton.addEventListener("click", () => {
        dialog.close();
    });

    // Runs when closed with either the button or Escape.
    dialog.addEventListener("close", () => {
        document.body.classList.remove("dialog-open");
    });
});

const rsvpForm = document.querySelector("#rsvp-form");
const rsvpSubmit = document.querySelector("#rsvp-submit");
const rsvpStatus = document.querySelector("#rsvp-status");

let isSubmittingRsvp = false;

rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmittingRsvp) {
        return;
    }

    isSubmittingRsvp = true;
    rsvpSubmit.disabled = true;
    rsvpSubmit.textContent = "Sending…";

    rsvpForm.setAttribute("aria-busy", "true");
    rsvpStatus.dataset.state = "pending";
    rsvpStatus.textContent = "Delivering your reply to Wonderland…";

    const formData = new FormData(rsvpForm);
    const attendance = formData.get("attendance");

    try {
        const response = await fetch(rsvpForm.action, {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("RSVP submission failed.");
        }

        rsvpStatus.dataset.state = "success";

        rsvpStatus.textContent = attendance === "Yes"
            ? "Your RSVP has arrived! I can't wait to celebrate with you. ♥"
            : "Your RSVP has arrived. You'll be missed! ♥";

        rsvpForm.reset();
        rsvpForm.hidden = true;
    } catch (error) {
        rsvpStatus.dataset.state = "error";
        rsvpStatus.textContent =
            "We couldn't confirm your RSVP. Please try again shortly. " +
            "If this keeps happening, contact Nabiha directly.";
    } finally {
        isSubmittingRsvp = false;
        rsvpSubmit.disabled = false;
        rsvpSubmit.textContent = "Send my RSVP ♥";
        rsvpForm.removeAttribute("aria-busy");
    }
});