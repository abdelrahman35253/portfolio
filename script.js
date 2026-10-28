const yearElement = document.getElementById("year");
const topButton = document.getElementById("topButton");

yearElement.textContent = new Date().getFullYear();

window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
        topButton.classList.add("show");
    } else {
        topButton.classList.remove("show");
    }
});

topButton.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + entry.target.id
                );
            });
        }
    });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach(function (section) {
    observer.observe(section);
});

const REPO_OWNER = "abdelrahman35253";
const REPO_NAME = "portfolio";
const FOLDER = "assignments";

const FOLDER_BUTTONS = {
    "web assignment 2": {
        tag: "HTML",
        links: [
            { label: "Task 1", file: "index.html" },
            { label: "Task 2", file: "table.html" },
            { label: "Task 3", file: "task3.html" }
        ]
    }
};

function makeLink(label, href, newTab) {
    const a = document.createElement("a");
    a.className = "project-link";
    a.href = href;
    if (newTab) {
        a.target = "_blank";
        a.rel = "noopener";
    }
    a.textContent = label;
    return a;
}

function capitalize(text) {
    return text.replace(/\b[a-z]/g, function (c) {
        return c.toUpperCase();
    });
}

async function loadAssignments() {
    const grid = document.getElementById("assignments-grid");
    if (!grid) return;

    try {
        const res = await fetch(
            "https://api.github.com/repos/" + REPO_OWNER + "/" + REPO_NAME +
            "/contents/" + FOLDER
        );
        if (!res.ok) return;

        const items = (await res.json()).filter(function (f) {
            return (f.type === "file" || f.type === "dir") && !/^readme/i.test(f.name);
        });

        items.forEach(function (file) {
            const isDir = file.type === "dir";
            const dot = file.name.lastIndexOf(".");
            const hasExt = !isDir && dot > -1;
            const custom = isDir ? FOLDER_BUTTONS[file.name.toLowerCase()] : null;

            let ext = "FILE";
            if (isDir) ext = custom ? custom.tag : "FOLDER";
            else if (hasExt) ext = file.name.slice(dot + 1).toUpperCase();

            const base = hasExt ? file.name.slice(0, dot) : file.name;
            const title = capitalize(
                base.replace(/^\d+[-_.\s]*/, "").replace(/[-_]+/g, " ")
            );

            const folderUrl = FOLDER + "/" + encodeURIComponent(file.name);
            const url = isDir ? folderUrl + "/index.html" : folderUrl;

            const card = document.createElement("article");
            card.className = "project-card";

            const tags = document.createElement("div");
            tags.className = "tags";
            const tag = document.createElement("span");
            tag.textContent = ext;
            tags.appendChild(tag);

            const h3 = document.createElement("h3");
            h3.textContent = title;

            const links = document.createElement("div");
            links.className = "card-links";
            links.style.display = "flex";
            links.style.flexWrap = "wrap";
            links.style.rowGap = "10px";

            if (custom) {
                custom.links.forEach(function (item) {
                    links.appendChild(
                        makeLink(item.label, folderUrl + "/" + item.file, true)
                    );
                });
            } else if (isDir) {
                links.appendChild(makeLink("Open", url, true));
                links.appendChild(makeLink("Source code", file.html_url, true));
            } else {
                links.appendChild(makeLink("Open", url, true));
                const dl = makeLink("Download", url, false);
                dl.setAttribute("download", "");
                links.appendChild(dl);
            }

            card.append(tags, h3, links);
            grid.appendChild(card);
        });
    } catch (err) {
        console.error("Could not load assignments:", err);
    }
}

loadAssignments();

const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
    const dark = theme === "dark";
    if (dark) {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
    if (themeToggle) {
        themeToggle.textContent = dark ? "☀️" : "🌙";
        themeToggle.setAttribute(
            "aria-label",
            dark ? "Switch to light mode" : "Switch to dark mode"
        );
        themeToggle.title = dark ? "Light mode" : "Dark mode";
    }
}

applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
            localStorage.setItem("theme", next);
        } catch (e) {}
    });
}
