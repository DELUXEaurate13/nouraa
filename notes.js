
"use strict";

const SUPABASE_URL = "https://qllbyzskcslkcloqmuwu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_86xGuowoC4gCNTqYLJLtAA_WLx4qc0g";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const noteForm = document.getElementById("note-form");
const nameInput = document.getElementById("note-name");
const messageInput = document.getElementById("note-message");
const characterCount = document.getElementById("character-count");
const notesWall = document.getElementById("notes-wall");
const emptyState = document.getElementById("empty-state");
const noteCount = document.getElementById("note-count");
const formStatus = document.getElementById("form-status");

const MAX_NOTES = 100;

let notes = [];
let isSubmitting = false;

function updateCharacterCount() {
    characterCount.textContent = `${messageInput.value.length} / 500`;
}

function formatDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Recently";
    }

    return date.toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function createNoteCard(note, index) {
    const card = document.createElement("article");
    card.className = "sticky-note";

    const rotations = [-1.5, 1.2, -0.7, 1.7, -1.1, 0.8];

    card.style.setProperty(
        "--note-rotation",
        `${rotations[index % rotations.length]}deg`
    );

    const top = document.createElement("div");
    top.className = "note-card-top";

    const number = document.createElement("span");
    number.className = "note-number";
    number.textContent = `NOTE / ${String(index + 1).padStart(2, "0")}`;

    const spark = document.createElement("span");
    spark.className = "note-spark";
    spark.setAttribute("aria-hidden", "true");
    spark.textContent = "✳";

    top.append(number, spark);

    const content = document.createElement("p");
    content.className = "note-content";
    content.textContent = note.message;

    const bottom = document.createElement("div");
    bottom.className = "note-card-bottom";

    const author = document.createElement("span");
    author.className = "note-author";
    author.textContent = `— ${note.name}`;

    const date = document.createElement("time");
    date.className = "note-date";
    date.dateTime = note.date;
    date.textContent = formatDate(note.date);

    bottom.append(author, date);
    card.append(top, content, bottom);

    return card;
}

function renderNotes() {
    notesWall.replaceChildren();

    emptyState.hidden = notes.length > 0;

    noteCount.textContent =
        `${String(notes.length).padStart(2, "0")} ` +
        `${notes.length === 1 ? "NOTE" : "NOTES"}`;

    notes.forEach((note, index) => {
        notesWall.appendChild(createNoteCard(note, index));
    });
}

async function loadNotes() {
    formStatus.textContent = "Loading notes...";

    const { data, error } = await db
        .from("visitor_notes")
        .select("id, name, message, created_at")
        .order("created_at", { ascending: false })
        .limit(MAX_NOTES);

    if (error) {
        console.error("Unable to load notes:", error);
        formStatus.textContent =
            "Couldn't load notes. Please refresh and try again.";
        return;
    }

    notes = data.map(note => ({
        id: note.id,
        name: note.name,
        message: note.message,
        date: note.created_at
    }));

    renderNotes();
    formStatus.textContent = "";
}

messageInput.addEventListener("input", updateCharacterCount);

noteForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (isSubmitting) return;

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
        formStatus.textContent =
            "Please fill in your name and message.";
        return;
    }

    if (name.length > 60 || message.length > 500) {
        formStatus.textContent =
            "Your message exceeds the allowed length.";
        return;
    }

    isSubmitting = true;

    const submitButton = noteForm.querySelector(
        'button[type="submit"], input[type="submit"]'
    );

    if (submitButton) submitButton.disabled = true;

    formStatus.textContent = "Sending your note...";

    try {
        const { error } = await db
            .from("visitor_notes")
            .insert([{ name, message }]);

        if (error) throw error;

        noteForm.reset();
        updateCharacterCount();

        await loadNotes();

        formStatus.textContent =
            "Your note has been added. Thank you for sharing!";

        notesWall.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } catch (error) {
        console.error("Unable to submit note:", error);

        formStatus.textContent =
            "Couldn't send your note. Please try again.";
    } finally {
        isSubmitting = false;

        if (submitButton) submitButton.disabled = false;
    }
});

updateCharacterCount();
renderNotes();
loadNotes();
