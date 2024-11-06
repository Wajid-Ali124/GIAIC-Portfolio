function toggleVisibility(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = section.style.display === "none" ? "block" : "none";
    }
}
document.getElementById("toggle-skills")?.addEventListener("click", () => toggleVisibility("skills"));
