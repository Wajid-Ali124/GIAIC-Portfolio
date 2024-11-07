function toggleVisibility(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = section.style.display === "none" ? "block" : "none";
    }
}
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
const CLOUDINARY_CLOUD_NAME = 'drvxekfod';
const CLOUDINARY_UPLOAD_PRESET = 'GIAIC-Portfolio';
async function uploadImageToCloudinary(file) {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const response = await fetch(url, {
        method: 'POST',
        body: formData,
    });
    const data = await response.json();
    if (data.secure_url) {
        return data.secure_url;
    }
    else {
        throw new Error('Image upload failed');
    }
}
document.getElementById("resume-form")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const education = document.getElementById("education-field").value;
    const work = document.getElementById("work-field").value;
    const skills = document.getElementById("skills-field").value.split(',');
    const imageInput = document.getElementById("profile-image");
    let imageUrl = null;
    let shareableLink = '';
    const submitButton = document.getElementById("generate-resume-btn");
    const loader = document.createElement("img");
    loader.src = "images/loader.gif";
    loader.alt = "Loading...";
    loader.style.width = "25px";
    submitButton.disabled = true;
    submitButton.style.backgroundColor = "#ffff";
    submitButton.innerHTML = `${loader.outerHTML}`;
    try {
        if (imageInput.files && imageInput.files[0]) {
            imageUrl = await uploadImageToCloudinary(imageInput.files[0]);
        }
    }
    catch (error) {
        console.error("Image upload error:", error);
    }
    shareableLink = `https://giaic-portfolio-pi.vercel.app/?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&education=${encodeURIComponent(education)}&work=${encodeURIComponent(work)}&skills=${encodeURIComponent(skills.join(','))}&image=${encodeURIComponent(imageUrl || '')}`;
    const shareLink = document.getElementById("shareLink");
    shareLink.innerHTML = `<a href="${shareableLink}" target="_blank">${shareableLink}</a>`;
    const resumeData = {
        name,
        email,
        education,
        work,
        skills,
        image: imageUrl,
    };
    updateResumeDisplay(resumeData);
    submitButton.disabled = false;
    submitButton.innerHTML = "Generate Resume";
    submitButton.style.backgroundColor = "#33cc99";
});
document.getElementById("download-pdf")?.addEventListener("click", () => {
    const element = document.getElementById("resume");
    if (element) {
        const buttons = document.querySelectorAll("#download-pdf, #toggle-skills");
        buttons.forEach(button => {
            button.style.display = "none";
        });
        html2pdf()
            .from(element)
            .save("resume.pdf")
            .then(() => {
            buttons.forEach(button => {
                button.style.display = "inline-block";
            });
        });
    }
});
window.onload = updateResumeDisplayFromUrl;
