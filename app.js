/**
 * Justdial's Best Interior Designer Awards 2026 - Main Application JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initCategorySelection();
  initFormValidation();
  initFaqAccordion();
  initMobileMenu();
  initRealtimeInputRestrictions();
  initDualSubmissionModes();
});

// Single Selected Category state (One category per submission entry)
let selectedCategory = '';

// Submission Mode States
let projectPhotosMode = 'link'; // 'link' or 'file'
let brochureMode = 'link';      // 'link' or 'file'

/**
 * Handle Dual Submission Modes (Link vs Upload File)
 */
function initDualSubmissionModes() {
  // Photos Mode Toggle
  const photosModeRadios = document.querySelectorAll('input[name="projectPhotosMode"]');
  const photosLinkBox = document.getElementById('photosLinkBox');
  const photosFileBox = document.getElementById('photosFileBox');
  const tabPhotosLink = document.getElementById('tabPhotosLink');
  const tabPhotosFile = document.getElementById('tabPhotosFile');

  photosModeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      projectPhotosMode = radio.value;
      if (projectPhotosMode === 'link') {
        photosLinkBox.style.display = 'block';
        photosFileBox.style.display = 'none';
        tabPhotosLink.classList.add('active');
        tabPhotosFile.classList.remove('active');
      } else {
        photosLinkBox.style.display = 'none';
        photosFileBox.style.display = 'block';
        tabPhotosFile.classList.add('active');
        tabPhotosLink.classList.remove('active');
      }
    });
  });

  // Brochure Mode Toggle
  const brochureModeRadios = document.querySelectorAll('input[name="brochureMode"]');
  const brochureLinkBox = document.getElementById('brochureLinkBox');
  const brochureFileBox = document.getElementById('brochureFileBox');
  const tabBrochureLink = document.getElementById('tabBrochureLink');
  const tabBrochureFile = document.getElementById('tabBrochureFile');

  brochureModeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      brochureMode = radio.value;
      if (brochureMode === 'link') {
        brochureLinkBox.style.display = 'block';
        brochureFileBox.style.display = 'none';
        tabBrochureLink.classList.add('active');
        tabBrochureFile.classList.remove('active');
      } else {
        brochureLinkBox.style.display = 'none';
        brochureFileBox.style.display = 'block';
        tabBrochureFile.classList.add('active');
        tabBrochureLink.classList.remove('active');
      }
    });
  });

  // File Drop Zone Click Handlers
  const photosDropZone = document.getElementById('photosDropZone');
  const photosFileInput = document.getElementById('projectPhotosFiles');
  const photosFilePreview = document.getElementById('photosFilePreview');

  if (photosDropZone && photosFileInput) {
    photosDropZone.addEventListener('click', () => photosFileInput.click());
    photosFileInput.addEventListener('change', () => {
      const files = Array.from(photosFileInput.files);
      photosFilePreview.innerHTML = '';

      if (files.length === 0) {
        return;
      }

      const isValidCount = files.length >= 6;
      const countPill = document.createElement('span');
      countPill.className = `file-chip ${isValidCount ? 'valid-chip' : ''}`;
      countPill.innerHTML = `<strong>${files.length} Photos Selected</strong> ${isValidCount ? '✓ (Min 6 met)' : '⚠️ (Need min 6)'}`;
      photosFilePreview.appendChild(countPill);

      files.slice(0, 8).forEach(file => {
        const chip = document.createElement('span');
        chip.className = 'file-chip';
        chip.textContent = file.name;
        photosFilePreview.appendChild(chip);
      });

      if (files.length > 8) {
        const moreChip = document.createElement('span');
        moreChip.className = 'file-chip';
        moreChip.textContent = `+${files.length - 8} more photos`;
        photosFilePreview.appendChild(moreChip);
      }

      if (isValidCount) {
        document.getElementById('err-projectPhotosFiles').style.display = 'none';
      }
    });
  }

  // Brochure Drop Zone Click Handler
  const brochureDropZone = document.getElementById('brochureDropZone');
  const brochureFileInput = document.getElementById('brochurePdfFile');
  const brochureFilePreview = document.getElementById('brochureFilePreview');

  if (brochureDropZone && brochureFileInput) {
    brochureDropZone.addEventListener('click', () => brochureFileInput.click());
    brochureFileInput.addEventListener('change', () => {
      const file = brochureFileInput.files[0];
      brochureFilePreview.innerHTML = '';
      if (file) {
        const chip = document.createElement('span');
        chip.className = 'file-chip valid-chip';
        chip.innerHTML = `📄 <strong>${file.name}</strong> (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
        brochureFilePreview.appendChild(chip);
        document.getElementById('err-brochurePdfFile').style.display = 'none';
      }
    });
  }
}

/**
 * Realtime Input Restrictions:
 * - Prevent numbers/symbols in Full Name
 * - Prevent non-digits in Phone Number (max 10 digits)
 */
function initRealtimeInputRestrictions() {
  const fullNameInput = document.getElementById('fullName');
  const contactInput = document.getElementById('contactNumber');

  if (fullNameInput) {
    fullNameInput.addEventListener('input', function () {
      this.value = this.value.replace(/[^a-zA-Z\s'\-]/g, '');
    });
  }

  if (contactInput) {
    contactInput.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });
  }
}

/**
 * 1. Category Card & Radio Sync Logic
 */
function initCategorySelection() {
  const cards = document.querySelectorAll('.category-card');
  const formRadios = document.querySelectorAll('input[name="category"]');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const catName = card.getAttribute('data-category');
      selectedCategory = catName;

      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      syncFormRadios();

      const formSection = document.getElementById('apply');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  formRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        selectedCategory = radio.value;
        syncCategoryCards();
      }
    });
  });
}

function syncFormRadios() {
  const formRadios = document.querySelectorAll('input[name="category"]');
  formRadios.forEach(radio => {
    radio.checked = (radio.value === selectedCategory);
  });
  if (selectedCategory) {
    document.getElementById('err-categories').style.display = 'none';
  }
}

function syncCategoryCards() {
  const cards = document.querySelectorAll('.category-card');
  cards.forEach(card => {
    const catName = card.getAttribute('data-category');
    if (catName === selectedCategory) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
}

/**
 * 2. Form Validation & Submission
 */
function initFormValidation() {
  const form = document.getElementById('awardForm');
  const modal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalOkBtn = document.getElementById('modalOkBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;

    const checkRequired = (id, errId, minLen = 1) => {
      const field = document.getElementById(id);
      const val = field.value.trim();
      const parent = field.closest('.form-group');
      if (val.length < minLen) {
        if (parent) parent.classList.add('has-error');
        document.getElementById(errId).style.display = 'block';
        isValid = false;
      } else {
        if (parent) parent.classList.remove('has-error');
        document.getElementById(errId).style.display = 'none';
      }
      return val;
    };

    const checkRegex = (id, errId, regex) => {
      const field = document.getElementById(id);
      const val = field.value.trim();
      const parent = field.closest('.form-group');
      if (!regex.test(val)) {
        if (parent) parent.classList.add('has-error');
        document.getElementById(errId).style.display = 'block';
        isValid = false;
      } else {
        if (parent) parent.classList.remove('has-error');
        document.getElementById(errId).style.display = 'none';
      }
      return val;
    };

    const checkCheckbox = (id, errId) => {
      const cb = document.getElementById(id);
      if (!cb.checked) {
        document.getElementById(errId).style.display = 'block';
        isValid = false;
      } else {
        document.getElementById(errId).style.display = 'none';
      }
      return cb.checked;
    };

    // Category Check
    if (!selectedCategory) {
      document.getElementById('err-categories').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('err-categories').style.display = 'none';
    }

    // Input fields validation
    const fullName = checkRegex('fullName', 'err-fullName', /^[a-zA-Z\s'\-]{2,60}$/);
    const companyName = checkRequired('companyName', 'err-companyName');
    const contactNumber = checkRegex('contactNumber', 'err-contactNumber', /^[6789]\d{9}$/);
    const email = checkRegex('email', 'err-email', /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    const city = checkRequired('city', 'err-city');
    const state = checkRequired('state', 'err-state');
    const experience = checkRequired('experience', 'err-experience');
    const sqft = checkRequired('sqft', 'err-sqft');
    const projectDescription = checkRequired('projectDescription', 'err-projectDescription', 30);
    const uniqueFeature = checkRequired('uniqueFeature', 'err-uniqueFeature', 10);

    // Photos Submission Validation (Link OR File)
    let photosSummary = '';
    if (projectPhotosMode === 'link') {
      photosSummary = checkRegex('projectFolderLink', 'err-projectFolderLink', /^(https?:\/\/)?([\w\d.-]+)\.([a-z.]{2,6})(\/.*)?$/i);
    } else {
      const photosFileInput = document.getElementById('projectPhotosFiles');
      if (!photosFileInput.files || photosFileInput.files.length < 6) {
        document.getElementById('err-projectPhotosFiles').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('err-projectPhotosFiles').style.display = 'none';
        photosSummary = `${photosFileInput.files.length} Photo files uploaded`;
      }
    }

    // Brochure Submission Validation (Link OR File)
    let brochureSummary = '';
    if (brochureMode === 'link') {
      brochureSummary = checkRegex('brochureLink', 'err-brochureLink', /^(https?:\/\/)?([\w\d.-]+)\.([a-z.]{2,6})(\/.*)?$/i);
    } else {
      const brochureFileInput = document.getElementById('brochurePdfFile');
      if (!brochureFileInput.files || brochureFileInput.files.length === 0) {
        document.getElementById('err-brochurePdfFile').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('err-brochurePdfFile').style.display = 'none';
        brochureSummary = `Uploaded PDF: ${brochureFileInput.files[0].name}`;
      }
    }

    // Consent checkboxes
    checkCheckbox('declAccurate', 'err-declAccurate');
    checkCheckbox('declContact', 'err-declContact');
    checkCheckbox('declMediaPerm', 'err-declMediaPerm');
    checkCheckbox('declPrivacy', 'err-declPrivacy');

    if (!isValid) {
      const firstError = document.querySelector('.has-error, .error-msg[style*="display: block"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Build Payload Object
    const entryData = {
      applicant_name: fullName,
      company_name: companyName,
      contact_number: contactNumber,
      email: email,
      city: city,
      state: state,
      social_links: document.getElementById('socialLinks').value.trim(),
      experience_years: parseInt(experience, 10),
      sqft_covered: parseInt(sqft, 10),
      selected_category: selectedCategory,
      project_description: projectDescription,
      unique_features: uniqueFeature,
      project_photos_submission: photosSummary,
      brochure_submission: brochureSummary,
      declaration_accepted: true,
      submitted_at: new Date().toISOString()
    };

    // Store in LocalStorage
    try {
      const existingEntries = JSON.parse(localStorage.getItem('justdial_entries') || '[]');
      existingEntries.push(entryData);
      localStorage.setItem('justdial_entries', JSON.stringify(existingEntries));
    } catch (err) {
      console.log('LocalStorage storage fallback:', err);
    }

    // Fill Modal Information
    document.getElementById('modalApplicantName').textContent = fullName;
    document.getElementById('modalCompanyName').textContent = companyName;
    document.getElementById('modalContact').textContent = contactNumber;
    document.getElementById('modalEmail').textContent = email;
    document.getElementById('modalCategories').textContent = selectedCategory;
    document.getElementById('modalPhotosInfo').textContent = photosSummary;
    document.getElementById('modalBrochureInfo').textContent = brochureSummary;

    // Show Modal
    modal.classList.add('active');
  });

  const closeModal = () => modal.classList.remove('active');
  closeModalBtn.addEventListener('click', closeModal);
  modalOkBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/**
 * 3. FAQs Accordion Logic
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * 4. Mobile Navigation Menu Toggle
 */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.querySelector('.main-nav');

  if (btn && nav) {
    btn.addEventListener('click', () => {
      nav.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
      });
    });
  }
}
