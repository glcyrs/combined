const downloads = [
  'assets/grades_form_1.pdf',
  'assets/grades_form_2.pdf'
];

document.querySelectorAll('.grade-card').forEach((card, index) => {
  card.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = downloads[index];
    link.download = downloads[index].split('/').pop();
    link.click();
  });
});

// ====== Map pages to step index ======
const pageToStep = {
  "index.html": 0,
  "readfirst.html": 1,
  "confirmation.html": 2,
  "aap.html": 3,
  "personal.html": 4,
  "educattach.html": 5,
  "programs.html": 6,
  "form.html": 7,
  "submit.html": 8,
};

// ====== Get current page ======
const currentPage = window.location.pathname.split("/").pop();

// ====== Load progress safely ======
let savedStep = parseInt(localStorage.getItem("currentStep"));
let currentStep = pageToStep[currentPage] !== undefined ? pageToStep[currentPage] : (savedStep || 5);
let maxUnlockedStep = parseInt(localStorage.getItem("maxUnlockedStep")) || currentStep;

document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");

  // ====== Update step UI ======
  function updateSteps() {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);

      if (index <= maxUnlockedStep) {
        step.classList.add("clickable");
        step.style.pointerEvents = "auto";
        step.style.opacity = "1";
      } else {
        step.classList.remove("clickable");
        step.style.pointerEvents = "none";
        step.style.opacity = "1";
      }
    });

    localStorage.setItem("currentStep", currentStep);
    localStorage.setItem("maxUnlockedStep", maxUnlockedStep);
  }

  // ====== Step click navigation ======
  steps.forEach((step, index) => {
    step.addEventListener("click", () => {
      if (index > maxUnlockedStep) return;

      currentStep = index;
      updateSteps();

      if (typeof showSection === "function") showSection(currentStep);

      switch (index) {
        case 0: window.location.href = "index.html"; break;
        case 1: window.location.href = "readfirst.html"; break;
        case 2: window.location.href = "confirmation.html"; break;
        case 3: window.location.href = "aap.html"; break;
        case 4: window.location.href = "personal.html"; break;
        case 5: window.location.href = "educattach.html"; break;
        case 6: window.location.href = "programs.html"; break;
        case 7: window.location.href = "form.html"; break;
        case 8: window.location.href = "submit.html"; break;
      }
    });
  });

  // ====== POPULATE FORM FROM LOCALSTORAGE ======
  function populateForm() {
    try {
      // Get all stored data from localStorage
      const personalData = JSON.parse(localStorage.getItem('personalData') || '{}');
      const educationData = JSON.parse(localStorage.getItem('educationData') || '{}');
      const gradesData = JSON.parse(localStorage.getItem('gradesData') || '{}');
      const programData = JSON.parse(localStorage.getItem('programData') || '{}');
      const parentalData = JSON.parse(localStorage.getItem('parentalData') || '{}');
      const siblingData = JSON.parse(localStorage.getItem('siblingData') || '{}');

      // PERSONAL INFORMATION
      if (document.getElementById('userEmail')) {
        document.getElementById('userEmail').textContent = personalData.email || 'user@gmail.com';
      }
      if (document.getElementById('surname')) {
        document.getElementById('surname').textContent = personalData.surname || '';
      }
      if (document.getElementById('firstName')) {
        document.getElementById('firstName').textContent = personalData.firstName || '';
      }
      if (document.getElementById('middleName')) {
        document.getElementById('middleName').textContent = personalData.middleName || '';
      }
      if (document.getElementById('address')) {
        document.getElementById('address').textContent = personalData.address || '';
      }
      if (document.getElementById('zipCode')) {
        document.getElementById('zipCode').textContent = personalData.zipCode || '';
      }
      if (document.getElementById('dateOfBirth')) {
        document.getElementById('dateOfBirth').textContent = personalData.dateOfBirth || '';
      }
      if (document.getElementById('sex')) {
        document.getElementById('sex').textContent = personalData.sex || '';
      }
      if (document.getElementById('age')) {
        document.getElementById('age').textContent = personalData.age || '';
      }
      if (document.getElementById('religion')) {
        document.getElementById('religion').textContent = personalData.religion || '';
      }
      if (document.getElementById('nationality')) {
        document.getElementById('nationality').textContent = personalData.nationality || '';
      }
      if (document.getElementById('contactPerson')) {
        document.getElementById('contactPerson').textContent = personalData.contactPerson || '';
      }
      if (document.getElementById('mobileNumber')) {
        document.getElementById('mobileNumber').textContent = personalData.mobileNumber || '';
      }
      if (document.getElementById('landlineNumber')) {
        document.getElementById('landlineNumber').textContent = personalData.landlineNumber || 'N/A';
      }
      if (document.getElementById('email')) {
        document.getElementById('email').textContent = personalData.email || '';
      }

      // EDUCATIONAL INFORMATION
      if (document.getElementById('seniorHighSchool')) {
        document.getElementById('seniorHighSchool').textContent = educationData.seniorHighSchool || '';
      }
      if (document.getElementById('track')) {
        document.getElementById('track').textContent = educationData.track || '';
      }
      if (document.getElementById('specialization')) {
        document.getElementById('specialization').textContent = educationData.specialization || 'N/A';
      }

      // GRADES - Update the table cells
      const gradeTable = document.querySelector('.form-section table tbody');
      if (gradeTable && gradesData) {
        const rows = gradeTable.querySelectorAll('tr');
        
        // English row
        if (rows[0]) {
          const cells = rows[0].querySelectorAll('td');
          if (cells[1]) cells[1].textContent = gradesData.englishGrade10 || '';
          if (cells[2]) cells[2].textContent = gradesData.englishGrade11_1st || '';
          if (cells[3]) cells[3].textContent = gradesData.englishGrade11_2nd || '';
        }
        
        // Mathematics row
        if (rows[1]) {
          const cells = rows[1].querySelectorAll('td');
          if (cells[1]) cells[1].textContent = gradesData.mathGrade10 || '';
          if (cells[2]) cells[2].textContent = gradesData.mathGrade11_1st || '';
          if (cells[3]) cells[3].textContent = gradesData.mathGrade11_2nd || '';
        }
        
        // Science row
        if (rows[2]) {
          const cells = rows[2].querySelectorAll('td');
          if (cells[1]) cells[1].textContent = gradesData.scienceGrade10 || '';
          if (cells[2]) cells[2].textContent = gradesData.scienceGrade11_1st || '';
          if (cells[3]) cells[3].textContent = gradesData.scienceGrade11_2nd || '';
        }
      }

      // PROGRAM CHOICES - Update the table
      const programTable = document.querySelectorAll('.form-section table')[1];
      if (programTable && programData) {
        const tbody = programTable.querySelector('tbody');
        if (tbody) {
          const rows = tbody.querySelectorAll('tr');
          
          // 1st Choice
          if (rows[0]) {
            const cells = rows[0].querySelectorAll('td');
            if (cells[1]) cells[1].textContent = programData.firstChoice || '';
            if (cells[2]) cells[2].textContent = programData.firstCampus || '';
          }
          
          // 2nd Choice
          if (rows[1]) {
            const cells = rows[1].querySelectorAll('td');
            if (cells[1]) cells[1].textContent = programData.secondChoice || '';
            if (cells[2]) cells[2].textContent = programData.secondCampus || '';
          }
          
          // 3rd Choice
          if (rows[2]) {
            const cells = rows[2].querySelectorAll('td');
            if (cells[1]) cells[1].textContent = programData.thirdChoice || '';
            if (cells[2]) cells[2].textContent = programData.thirdCampus || '';
          }
        }
      }

      // PARENTAL INFORMATION - Update the table
      const parentalTable = document.querySelectorAll('.form-section table')[2];
      if (parentalTable && parentalData) {
        const tbody = parentalTable.querySelector('tbody');
        if (tbody) {
          const rows = tbody.querySelectorAll('tr');
          
          // Mother's info
          if (rows[0]) {
            const cells = rows[0].querySelectorAll('td');
            if (cells[0]) cells[0].textContent = parentalData.motherName || '';
            if (cells[1]) cells[1].textContent = parentalData.motherAge || '';
            if (cells[2]) cells[2].textContent = parentalData.motherOccupation || '';
            if (cells[3]) cells[3].textContent = parentalData.motherContact || '';
          }
          
          // Father's info
          if (rows[2]) {
            const cells = rows[2].querySelectorAll('td');
            if (cells[0]) cells[0].textContent = parentalData.fatherName || '';
            if (cells[1]) cells[1].textContent = parentalData.fatherAge || '';
            if (cells[2]) cells[2].textContent = parentalData.fatherOccupation || '';
            if (cells[3]) cells[3].textContent = parentalData.fatherContact || '';
          }
        }
      }

      console.log('Form populated successfully from localStorage');
    } catch (error) {
      console.error('Error populating form:', error);
    }
  }

  // Run on page load
  populateForm();

  // ====== Initial render ======
  updateSteps();
});