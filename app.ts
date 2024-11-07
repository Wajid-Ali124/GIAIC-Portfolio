declare var html2pdf: any;


function toggleVisibility(sectionId: string): void {
  const section = document.getElementById(sectionId);
  if (section) {
    section.style.display = section.style.display === "none" ? "block" : "none";
  }
}

document.getElementById("toggle-skills")?.addEventListener("click", () => toggleVisibility("skills"));


type ResumeData = {
  name: string;
  email: string;
  education: string;
  work: string;
  skills: string[];
  image: string | null;
};

function updateResumeDisplay(data: ResumeData) {
  (document.getElementById("name-display") as HTMLElement).textContent = data.name;
  (document.getElementById("email-display") as HTMLElement).textContent = data.email;

  const educationList = document.getElementById("education-list") as HTMLElement;
  educationList.innerHTML = `<li>${data.education}</li>`;

  const workList = document.getElementById("work-list") as HTMLElement;
  workList.innerHTML = `<li>${data.work}</li>`;

  const profileImage = document.getElementById("profile-img") as HTMLImageElement;
  if (data.image) {
      profileImage.src = data.image;
  }

  const skillsList = document.getElementById("skills-list") as HTMLElement;
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
    (document.getElementById("name-display") as HTMLElement).textContent = params.name;
  }
  if (params.email) {
    (document.getElementById("email-display") as HTMLElement).textContent = params.email;
  }
  if (params.education) {
    const educationList = document.getElementById("education-list") as HTMLElement;
    educationList.innerHTML = `<li>${params.education}</li>`;
  }
  if (params.work) {
    const workList = document.getElementById("work-list") as HTMLElement;
    workList.innerHTML = `<li>${params.work}</li>`;
  }
  if (params.skills) {
    const skillsList = document.getElementById("skills-list") as HTMLElement;
    skillsList.innerHTML = params.skills.split(',').map(skill => `<li>${skill.trim()}</li>`).join('');
  }
  if (params.image) {
    const profileImage = document.getElementById("profile-img") as HTMLImageElement;
    profileImage.src = params.image;
  }
}



const CLOUDINARY_CLOUD_NAME = 'drvxekfod';
const CLOUDINARY_UPLOAD_PRESET = 'GIAIC-Portfolio';

async function uploadImageToCloudinary(file:any) {
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
  } else {
    throw new Error('Image upload failed');
  }
}

document.getElementById("resume-form")?.addEventListener("submit", async function (event: Event) {
    event.preventDefault();

    const name = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const education = (document.getElementById("education-field") as HTMLInputElement).value;
    const work = (document.getElementById("work-field") as HTMLInputElement).value;
    const skills = (document.getElementById("skills-field") as HTMLInputElement).value.split(',');

    const imageInput = document.getElementById("profile-image") as HTMLInputElement;
    let imageUrl: string | null = null;
    let shareableLink = '';

    const submitButton = document.getElementById("generate-resume-btn") as HTMLButtonElement;
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
    } catch (error) {
        console.error("Image upload error:", error);
    }

    shareableLink = `https://giaic-portfolio-pi.vercel.app/?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&education=${encodeURIComponent(education)}&work=${encodeURIComponent(work)}&skills=${encodeURIComponent(skills.join(','))}&image=${encodeURIComponent(imageUrl || '')}`;
    
    const shareLink = document.getElementById("shareLink") as HTMLElement;
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
      (button as HTMLElement).style.display = "none";
    });

    html2pdf()
      .from(element)
      .save("resume.pdf")
      .then(() => {
        buttons.forEach(button => {
          (button as HTMLElement).style.display = "inline-block";
        });
      });
  }
});


window.onload = updateResumeDisplayFromUrl;
