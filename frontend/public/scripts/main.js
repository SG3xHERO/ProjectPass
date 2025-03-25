// Main JavaScript for Password Generator
// Configure API Base URL (will be replaced by actual URL or environment variable)
const API_BASE_URL = window.API_BASE_URL || 'https://api.yourdomain.com';

document.addEventListener("DOMContentLoaded", function () {
    // Initialize button position to ensure it's correct on page load
    initializeButtonPosition();

    // Set up event listeners
    document.getElementById("generate-btn").addEventListener("click", function () {
        setTimeout(generatePasswords, 500); // Adds a 500ms delay
    });
    
    // Make sure the number input accepts both typing and arrow keys
    const countInput = document.getElementById("count");
    countInput.addEventListener("input", function(e) {
        updateNameFields();
        enforceMaxLimit(this);
    });
    
    // Ensure the arrows still work
    countInput.addEventListener("change", function(e) {
        updateNameFields();
        enforceMaxLimit(this);
    });

    const moreOptionsButton = document.getElementById("more-options-toggle");
    if (moreOptionsButton) {
        moreOptionsButton.addEventListener("click", toggleMoreOptions);
    }

    document.getElementById("domain-code").addEventListener("input", updateDomainList);
    document.getElementById("email-domain").addEventListener("change", toggleCustomDomain);
    document.getElementById("email-toggle").addEventListener("change", toggleEmailOptions);

    updateDomainList(); // Ensures domains are loaded immediately on page load
});

// Toggle "Use Email Domains" Switch Visibility
function toggleEmailOptions() {
    const emailOptions = document.getElementById("email-options");
    const emailList = document.getElementById("email-list");
    const emailDomainSelect = document.getElementById("email-domain");
    const customDomainInput = document.getElementById("custom-domain");

    if (document.getElementById("email-toggle").checked) {
        emailOptions.classList.remove("hidden");
        updateDomainList(); // Restore dropdown options when re-enabled
        updateNameFields(); // Ensure name fields appear immediately
    } else {
        emailOptions.classList.add("hidden");

        // Clear all email-related fields when toggled off
        emailList.innerHTML = "";
        emailDomainSelect.innerHTML = ""; // Clear the domain dropdown
        customDomainInput.value = ""; // Clear custom domain input
        customDomainInput.classList.add("hidden"); // Hide custom domain field
    }
}

// Fetch Domains from Backend Based on Domain Code
function updateDomainList() {
    const codeInputElement = document.getElementById("domain-code");
    const codeInput = codeInputElement.value.trim().toLowerCase();
    const emailDomainSelect = document.getElementById("email-domain");

    // Clear the dropdown initially
    emailDomainSelect.innerHTML = "";

    // Show default options if the input is empty
    if (!codeInput) {
        console.log("Domain code is empty, showing default options.");
        showDefaultDomains(emailDomainSelect);
        return;
    }

    // Fetch domain suggestions only for valid codes
    fetch(`${API_BASE_URL}/get-domains`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput }),
    })
        .then((response) => response.json())
        .then((data) => {
            // Only populate the dropdown if valid domains are returned
            if (data.domains && data.domains.length > 0) {
                data.domains.forEach((domain) => {
                    const option = document.createElement("option");
                    option.value = domain;
                    option.textContent = domain;
                    emailDomainSelect.appendChild(option);
                });

                // Add "Custom Domain" option at the end
                const customOption = document.createElement("option");
                customOption.value = "custom";
                customOption.textContent = "Custom Domain";
                emailDomainSelect.appendChild(customOption);

                toggleCustomDomain(); // Ensure "Custom Domain" field visibility is correct
            } else {
                console.log("No valid domains found for code:", codeInput);
                emailDomainSelect.innerHTML = ""; // Clear dropdown
                showDefaultDomains(emailDomainSelect);
            }
        })
        .catch((error) => {
            console.error("Error fetching domains:", error);
            emailDomainSelect.innerHTML = ""; // Clear dropdown on error
            showDefaultDomains(emailDomainSelect);
        });
}

function showDefaultDomains(emailDomainSelect) {
    const defaultDomains = ["@example.com", "@gmail.com", "@outlook.com"];
    defaultDomains.forEach((domain) => {
        const option = document.createElement("option");
        option.value = domain;
        option.textContent = domain;
        emailDomainSelect.appendChild(option);
    });

    const customOption = document.createElement("option");
    customOption.value = "custom";
    customOption.textContent = "Custom Domain";
    emailDomainSelect.appendChild(customOption);
}

// Function to ensure the Generate Button is properly positioned on page load
function initializeButtonPosition() {
    const moreOptionsButton = document.getElementById("more-options-toggle");
    const generateButton = document.getElementById("generate-btn");
    
    if (moreOptionsButton && generateButton) {
        // On page load, always position the generate button after the more options button
        moreOptionsButton.after(generateButton);
        console.log("Button position initialized");
    }
}

// Update the toggleMoreOptions function to maintain button ordering
function toggleMoreOptions() {
    const moreOptions = document.getElementById("more-options");
    const generateButton = document.getElementById("generate-btn");
    const moreOptionsButton = document.getElementById("more-options-toggle");

    if (!moreOptions || !generateButton) {
        console.error("Error: 'more-options' or 'generate-btn' element not found.");
        return;
    }

    if (moreOptions.classList.contains("hidden")) {
        moreOptions.classList.remove("hidden");
        updateNameFields();
        
        // We'll insert the button after the more-options div
        moreOptions.after(generateButton);
    } else {
        moreOptions.classList.add("hidden");
        
        // Always place the generate button after the more-options-toggle when collapsed
        moreOptionsButton.after(generateButton);
    }
}

// Generate Passwords with Limited Count
function generatePasswords() {
    const count = parseInt(document.getElementById("count").value) || 1;

    if (count > 20) {
        alert('You can only generate up to 20 passwords at a time.');
        document.getElementById("count").value = 20;
        return;
    }

    const detailsContainer = document.getElementById("generated-details");
    detailsContainer.innerHTML = ""; // Clear previous results

    // Fetch actual passwords from API
    fetch(`${API_BASE_URL}/generate-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ count }),
    })
    .then(response => response.json())
    .then(data => {
        const allPasswords = []; // Store for bulk operations

        data.passwords.forEach((password, index) => {
            let email = "";
            const emailEntries = document.querySelectorAll(".email-entry");
            const emailDomain = document.getElementById("email-domain").value;
            const customDomain = document.getElementById("custom-domain").value.trim();
            const domain = emailDomain === "custom" ? customDomain : emailDomain;

            if (emailEntries.length > 0 && index < emailEntries.length && emailEntries[index].value.trim()) {const name = emailEntries[index].value.trim();
                const username = name.toLowerCase().replace(/\s+/g, ".");
                email = `${username}${domain}`;
            }

            const passwordData = email ? `Email: ${email}\nPassword: ${password}` : `Password: ${password}`;
            allPasswords.push(passwordData); // Add to bulk list

            const passwordEntry = createPasswordEntry(password, passwordData, email, index);
            detailsContainer.appendChild(passwordEntry);
        });

        // Add "Copy All" button if multiple passwords
        if (data.passwords.length > 1) {
            addBottomButtons(allPasswords, detailsContainer);
        }
    })
    .catch(error => {
        console.error("Error generating passwords:", error);
        alert("Error generating passwords. Please check your API.");
    });
}

// Create a password entry div
function createPasswordEntry(password, passwordData, email, index) {
    const passwordEntry = document.createElement("div");
    passwordEntry.classList.add("password-box");
    passwordEntry.innerHTML = `
        <div class="password-text" id="password-${index}">
            ${email ? `<span class="font-medium">Email:</span> ${email} <br>` : ""}
            <span class="font-medium">Password:</span> ${password}
        </div>
        <div class="password-buttons">
            <button class="copy-btn" title="Copy to clipboard" onclick="copyToClipboard(this, \`${passwordData}\`)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <button class="remove-btn" title="Remove Password" onclick="removePassword(this)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>`;
    return passwordEntry;
}

// Function to add "Copy All" button for multiple passwords
function addBottomButtons(allPasswords, container) {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "flex flex-col items-center gap-4 mt-6";

    // Copy All Button
    const copyAllButton = document.createElement("button");
    copyAllButton.textContent = "Copy All to Clipboard";
    copyAllButton.className = "copy-all-btn bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded transition duration-200 w-full max-w-sm";
    copyAllButton.onclick = function () {
        copyToClipboard(copyAllButton, allPasswords.join("\n\n"), true);
    };
    buttonContainer.appendChild(copyAllButton);

    container.appendChild(buttonContainer);
}

// Copy to Clipboard Function
function copyToClipboard(button, text, isAll = false) {
    if (!text) return;

    let textToCopy = text;

    // If it's multiline with both email and password
    if (!isAll) {
        if (text.includes("Email:") && text.includes("Password:")) {
            // Extract just the password part
            const passwordPart = text.split("Password:")[1].trim();
            textToCopy = passwordPart;
        } 
        // If it's just a password line
        else if (text.startsWith("Password:")) {
            textToCopy = text.replace("Password:", "").trim();
        }
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
        button.classList.add("copied");

        if (isAll) {
            button.textContent = "✅ Copied!";
            setTimeout(() => {
                button.classList.remove("copied");
                button.textContent = "Copy All to Clipboard";
            }, 1500);
        } else {
            const originalHTML = button.innerHTML;
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>`; // Check mark icon
            setTimeout(() => {
                button.innerHTML = originalHTML; // Restore original icon
                button.classList.remove("copied");
            }, 1500);
        }
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}

// Update Name Input Fields Based on Password Count
function updateNameFields() {
    const emailList = document.getElementById("email-list");
    let countInput = document.getElementById("count");
    let count = parseInt(countInput.value) || 1;

    // Enforce max limit immediately
    if (count > 20) {
        count = 20;
        countInput.value = 20; // Reset input to max
    }

    // Completely remove all fields before updating
    while (emailList.firstChild) {
        emailList.removeChild(emailList.firstChild);
    }

    // Create exactly the allowed number of fields
    for (let i = 0; i < count; i++) {
        const newEmail = document.createElement("input");
        newEmail.type = "text";
        newEmail.placeholder = `Enter name #${i + 1}`;
        newEmail.className = "email-entry w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-pink-500 focus:outline-none mb-2";
        emailList.appendChild(newEmail);
    }

    // Ensure fields are visible when "Use Email Domains" is enabled
    if (document.getElementById("email-toggle").checked) {
        emailList.classList.remove("hidden");
    } else {
        emailList.classList.add("hidden");
    }
}

// Toggle Custom Domain Input
function toggleCustomDomain() {
    const emailDomain = document.getElementById("email-domain");
    const customDomainInput = document.getElementById("custom-domain");

    if (emailDomain && emailDomain.value === "custom") {
        customDomainInput.classList.remove("hidden"); // Show custom domain field
    } else {
        customDomainInput.classList.add("hidden"); // Hide custom domain field
    }
}

// Enforce Max Limit on Password Count
function enforceMaxLimit(input) {
    if (parseInt(input.value) > 20) {
        input.value = 20; // Immediately reset to 20 if they type anything higher
    } else if (parseInt(input.value) < 1 || isNaN(parseInt(input.value))) {
        input.value = 1; // Prevents blank or zero input
    }
}

// Remove Individual Password
function removePassword(button) {
    const passwordBox = button.closest(".password-box");
    if (passwordBox) {
        passwordBox.remove();
    }

    // Check if there are any remaining passwords
    const passwordBoxes = document.querySelectorAll(".password-box");
    
    // If only one or no passwords remain, remove the "Copy All" button
    if (passwordBoxes.length <= 1) {
        const bottomButtons = document.querySelector(".flex.flex-col.items-center");
        if (bottomButtons) {
            bottomButtons.remove();
        }
    }
}