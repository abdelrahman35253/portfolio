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

            const ext = isDir ? "FOLDER" : (hasExt ? file.name.slice(dot + 1).toUpperCase() : "FILE");
            const base = hasExt ? file.name.slice(0, dot) : file.name;
            const title = base
                .replace(/^\d+[-_.\s]*/, "")
                .replace(/[-_]+/g, " ");

            const url = FOLDER + "/" + encodeURIComponent(file.name) + (isDir ? "/index.html" : "");

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

            const open = document.createElement("a");
            open.className = "project-link";
            open.href = url;
            open.target = "_blank";
            open.rel = "noopener";
            open.textContent = "Open";

            const second = document.createElement("a");
            second.className = "project-link";
            if (isDir) {
                second.href = file.html_url;
                second.target = "_blank";
                second.rel = "noopener";
                second.textContent = "Source code";
            } else {
                second.href = url;
                second.setAttribute("download", "");
                second.textContent = "Download";
            }

            links.append(open, second);
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
