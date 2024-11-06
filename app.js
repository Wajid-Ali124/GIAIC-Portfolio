// Function to toggle visibility of resume sections
function toggleVisibility(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = section.style.display === "none" ? "block" : "none";
    }
}
// Event listener for toggling skills section visibility
document.getElementById("toggle-skills")?.addEventListener("click", () => toggleVisibility("skills"));
function updateResumeDisplay(data) {
    document.getElementById("name-display").textContent = data.name;
    document.getElementById("email-display").textContent = data.email;
    const educationList = document.getElementById("education-list");
    educationList.innerHTML = `<li>${data.education}</li>`;
    const workList = document.getElementById("work-list");
    workList.innerHTML = `<li>${data.work}</li>`;
    const profileImage = document.getElementById("profile-img");
    if (data.image) {
        profileImage.src = data.image;
    }
    const skillsList = document.getElementById("skills-list");
    skillsList.innerHTML = data.skills.map(skill => `<li>${skill.trim()}</li>`).join('');
}
// Event listener for the resume form submission
document.getElementById("resume-form")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const education = document.getElementById("education-field").value;
    const work = document.getElementById("work-field").value;
    const skills = document.getElementById("skills-field").value.split(',');
    const imageInput = document.getElementById("profile-image");
    let imageUrl = null;
    if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            imageUrl = e.target?.result;
            const resumeData = {
                name,
                email,
                education,
                work,
                skills,
                image: imageUrl
            };
            updateResumeDisplay(resumeData);
        };
        reader.readAsDataURL(file);
    }
});
// Function to get query parameters from the URL
function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        name: urlParams.get('name'),
        email: urlParams.get('email'),
        education: urlParams.get('education'),
        work: urlParams.get('work'),
        skills: urlParams.get('skills'),
        image: urlParams.get('image')
    };
}
// Function to update the resume display from URL parameters
function updateResumeDisplayFromUrl() {
    const params = getQueryParams();
    if (params.name) {
        document.getElementById("name-display").textContent = params.name;
    }
    if (params.email) {
        document.getElementById("email-display").textContent = params.email;
    }
    if (params.education) {
        const educationList = document.getElementById("education-list");
        educationList.innerHTML = `<li>${params.education}</li>`;
    }
    if (params.work) {
        const workList = document.getElementById("work-list");
        workList.innerHTML = `<li>${params.work}</li>`;
    }
    if (params.skills) {
        const skillsList = document.getElementById("skills-list");
        skillsList.innerHTML = params.skills.split(',').map(skill => `<li>${skill.trim()}</li>`).join('');
    }
    if (params.image) {
        const profileImage = document.getElementById("profile-img");
        profileImage.src = params.image;
    }
}
// Event listener to share resume as a URL when form is submitted
document.getElementById("resume-form")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const education = document.getElementById("education-field").value;
    const work = document.getElementById("work-field").value;
    const skills = document.getElementById("skills-field").value.split(',');
    const imageInput = document.getElementById("profile-image");
    let imageUrl = null;
    let shareableLink;
    if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            imageUrl = e.target?.result;
            shareableLink = `https://giaic-portfolio-pi.vercel.app/?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&education=${encodeURIComponent(education)}&work=${encodeURIComponent(work)}&skills=${encodeURIComponent(skills.join(','))}&image=${encodeURIComponent(imageUrl || '')}`;
            const resumeData = {
                name,
                email,
                education,
                work,
                skills,
                image: imageUrl
            };
            updateResumeDisplay(resumeData);
        };
        const shareLink = document.getElementById("shareLink");
        shareLink.innerHTML = `<a href="${shareableLink}">${shareableLink}</a>`;
        reader.readAsDataURL(file);
    }
    else {
        shareableLink = `https://giaic-portfolio-pi.vercel.app/?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&education=${encodeURIComponent(education)}&work=${encodeURIComponent(work)}&skills=${encodeURIComponent(skills.join(','))}&image=${encodeURIComponent(imageUrl || '')}`;
        const shareLink = document.getElementById("shareLink");
        shareLink.innerHTML = `<a href="${shareableLink}">${shareableLink}</a>`;
        const resumeData = {
            name,
            email,
            education,
            work,
            skills,
            image: null,
        };
        updateResumeDisplay(resumeData);
    }
});
// Event listener to download the resume as a PDF
document.getElementById("download-pdf")?.addEventListener("click", () => {
    const element = document.getElementById("resume");
    if (element) {
        // Get the buttons and hide them
        const buttons = document.querySelectorAll("#download-pdf, #toggle-skills");
        buttons.forEach(button => {
            button.style.display = "none";
        });
        // Use html2pdf to download the resume as a PDF
        html2pdf()
            .from(element)
            .save("resume.pdf")
            .then(() => {
            // After the PDF is saved, show the buttons again
            buttons.forEach(button => {
                button.style.display = "inline-block";
            });
        });
    }
});
// Call this function on page load to apply the data
window.onload = updateResumeDisplayFromUrl;
