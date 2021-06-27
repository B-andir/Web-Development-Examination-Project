var navHidden = true;

function navButton() {
    if (document.getElementById("mobileNav").classList.contains("Hidden")) {
        document.getElementById("mobileNav").classList.remove("Hidden");
        document.getElementById("mobileNav").classList.add("Inline");
        document.getElementById("mobileNavButton").classList.add("Active");
    } else {
        document.getElementById("mobileNav").classList.remove("Inline");
        document.getElementById("mobileNav").classList.add("Hidden");
        document.getElementById("mobileNavButton").classList.remove("Active");
    }
}