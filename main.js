const addBox = document.querySelector(".add-box");

const popupBox = document.querySelector(".popup-box");
const popupTitle = popupBox.querySelector("header p");

const closeIcon = popupBox.querySelector("header i");

const titleTag = popupBox.querySelector("input");
const descTag = popupBox.querySelector("textarea");

const addButton = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];

const notes = JSON.parse(localStorage.getItem("notes") || "[]");

let isUpdate = false, updateId;

addBox.addEventListener("click", () => {

    popupTitle.innerText = "Add new Note";
    addButton.innerText = "Add Note";

    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";

    if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {

    isUpdate = false;

    titleTag.value = descTag.value = "";

    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

function showNotes() {

    if (!notes) return;

    document.querySelectorAll(".note").forEach(li => li.remove());

    notes.forEach((note, id) => {

        let filterDesc = note.description.replaceAll("\n", '<br/>');

        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onClick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onClick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onClick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;

        addBox.insertAdjacentHTML("afterend", liTag);
    });
}

showNotes();

function showMenu(element) {

    element.parentElement.classList.add("show");

    document.addEventListener("click", event => {

        if (event.target.tagName != "I" || event.target != element) {

            element.parentElement.classList.remove("show");
        }
    });
}

function deleteNote(noteId) {

    if (!confirm("Are you sure you want to delete this note?")) return;

    notes.splice(noteId, 1);

    localStorage.setItem("notes", JSON.stringify(notes));

    showNotes();
}

function updateNote(noteId, title, filterDesc) {

    let description = filterDesc.replaceAll('<br/>', '\r\n');

    updateId = noteId;
    isUpdate = true;
    addBox.click();

    titleTag.value = title;
    descTag.value = description;

    popupTitle.innerText = "Update this Note";
    addButton.innerText = "Update Note";
}

addButton.addEventListener("click", event => {

    event.preventDefault();

    let title = titleTag.value.trim();
    let description = descTag.value.trim();

    if (title || description) {

        let currentDate = new Date();

        let month = months[currentDate.getMonth()];
        let day = currentDate.getDate();
        let year = currentDate.getFullYear();

        let noteInfo = { title, description, date: `${month} ${day}, ${year}` }

        if (!isUpdate) {

            notes.push(noteInfo);

        } else {

            isUpdate = false;
            notes[updateId] = noteInfo;
        }

        localStorage.setItem("notes", JSON.stringify(notes));

        showNotes();
        closeIcon.click();
    }
});