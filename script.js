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

const wardrobeLooks = {
    nabiha: {
        name: "Just me",
        description:
            "My everyday look, before a little Wonderland magic.",
        alt: "Nabiha wearing an olive hijab and floral maxi dress",
        background: "#dce0cd",
        accent: "#637251"
    },

    "mad-hatter": {
        name: "Mad Hatter",
        description:
            "Plaid, pinstripes, lace, and a little organised chaos. " +
            "Try a waistcoat, a patterned tie, or a curious hat.",
        alt: "Nabiha in a Mad Hatter look with a plum hijab, " +
            "top hat, waistcoat, and layered plaid skirt over trousers",
        background: "#e5d3c3",
        accent: "#77513f"
    },

    caterpillar: {
        name: "Caterpillar",
        description:
            "Teal lace, embroidered jeans, and a touch of magenta. " +
            "Mix soft textures with chunky shoes and gold details.",
        alt: "Nabiha in a teal hijab and lace top with " +
            "embroidered wide-leg jeans",
        background: "#cce0db",
        accent: "#39716e"
    },

    dormouse: {
        name: "Dormouse",
        description:
            "Cream knits, a burgundy lace-trimmed skirt, " +
            "and cosy leg warmers. Finish with a tiny tea-party charm.",
        alt: "Nabiha in a taupe hijab, cream cardigan, " +
            "long burgundy skirt, and knitted leg warmers",
        background: "#eadbcf",
        accent: "#89534d"
    },

    "march-hare": {
        name: "March Hare",
        description:
            "Earthy browns, ruffles, and vintage tailoring. " +
            "Layer a lace skirt over jeans and add a pocket-watch chain.",
        alt: "Nabiha in a brown hijab and rabbit ears, " +
            "waistcoat, and ruffled skirt layered over brown jeans",
        background: "#dfd5c1",
        accent: "#806341"
    },

    "white-rabbit": {
        name: "White Rabbit",
        description:
            "White lace, navy layers, and antique gold. " +
            "A tiered dress and waistcoat make a wonderfully curious pair.",
        alt: "Nabiha in a white hijab and rabbit ears, " +
            "navy waistcoat, and long tiered lace dress",
        background: "#dce3ed",
        accent: "#53627b"
    },

    "cheshire-cat": {
        name: "Cheshire Cat",
        description:
            "Purple plaid, pink stripes, lace, and silver chains. " +
            "Play with patterns and add a mischievous little accessory.",
        alt: "Nabiha in a striped pink-purple hijab, " +
            "purple waistcoat, and long plaid skirt with lace",
        background: "#e5d2e4",
        accent: "#85517f"
    },

    tweedle: {
        name: "Tweedle twins",
        description:
            "Stripes, red accents, and playful preppy layers. " +
            "Bring a friend and coordinate a bow, beret, or pair of suspenders.",
        alt: "Nabiha in a black hijab, red beret, striped top, " +
            "burgundy waistcoat, and black skirt over jeans",
        background: "#e8d5cd",
        accent: "#94454d"
    }
};

const wardrobeAvatar = document.querySelector("#wardrobe-avatar");
const wardrobeStage = document.querySelector("#wardrobe-stage");
const lookName = document.querySelector("#look-name");
const wardrobeStatus = document.querySelector("#wardrobe-status");
const characterButtons = document.querySelectorAll("[data-look]");
const surpriseButton = document.querySelector("#surprise-look");

let currentLook = "nabiha";
let latestLookRequest = 0;

async function changeOutfit(key) {
    if (key === currentLook) {
        return;
    }

    const look = wardrobeLooks[key];
    const requestId = ++latestLookRequest;
    const imagePath = `images/outfits/${key}.png`;

    wardrobeStatus.textContent = `Trying on ${look.name}…`;
    wardrobeStage.setAttribute("aria-busy", "true");

    // Load the new picture before replacing the visible one.
    const nextImage = new Image();
    nextImage.src = imagePath;

    try {
        await nextImage.decode();

        // Ignore an older request if another character was clicked.
        if (requestId !== latestLookRequest) {
            return;
        }

        wardrobeAvatar.classList.remove("is-changing");

        wardrobeAvatar.src = imagePath;
        wardrobeAvatar.alt = look.alt;

        lookName.textContent = look.name;

        wardrobeStage.style.setProperty(
            "--stage-colour",
            look.background
        );

        wardrobeStage.style.setProperty(
            "--stage-accent",
            look.accent
        );

        characterButtons.forEach((button) => {
            button.setAttribute(
                "aria-pressed",
                String(button.dataset.look === key)
            );
        });

        // Restart the reveal animation.
        void wardrobeAvatar.offsetWidth;
        wardrobeAvatar.classList.add("is-changing");

        currentLook = key;
        wardrobeStatus.textContent = `${look.name} look selected.`;
    } catch {
        if (requestId !== latestLookRequest) {
            return;
        }

        wardrobeStatus.textContent =
            "That outfit couldn't load. Please try another character.";
    } finally {
        if (requestId === latestLookRequest) {
            wardrobeStage.removeAttribute("aria-busy");
        }
    }
}

characterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        changeOutfit(button.dataset.look);
    });
});

surpriseButton.addEventListener("click", () => {
    const choices = Object.keys(wardrobeLooks).filter((key) => {
        return key !== "nabiha" && key !== currentLook;
    });

    const randomIndex = Math.floor(Math.random() * choices.length);
    changeOutfit(choices[randomIndex]);
});