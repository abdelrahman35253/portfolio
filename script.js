```javascript
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
```

