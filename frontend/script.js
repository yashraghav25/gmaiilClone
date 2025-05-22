const mailList = document.getElementById("mail-list");
const typeButtons = document.querySelectorAll(".type-btn");
let allMails = []; // store fetched mails here
const typeCounters = {
  promotions: document.getElementById("promotions"),
  primary: document.getElementById("primary"),
  social: document.getElementById("social"),
  updates: document.getElementById("updates"),
};
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return ` ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
function updateCounts(mails) {
  const counts = { promotions: 0, primary: 0, social: 0, updates: 0 };
  mails.forEach((mail) => {
    const type = mail.type.toLowerCase();
    if (counts[type] !== undefined) counts[type]++;
  });

  Object.keys(counts).forEach((type) => {
    if (typeCounters[type]) {
      typeCounters[type].textContent = `${
        type.charAt(0).toUpperCase() + type.slice(1)
      }: ${counts[type]}`;
    }
  });
}
function displayMails(selectedType = "all") {
  mailList.innerHTML = "";
  const filteredMails =
    selectedType === "all"
      ? allMails
      : allMails.filter(
          (mail) => mail.type.toLowerCase() === selectedType.toLowerCase()
        );
  filteredMails.forEach((mail) => {
    const mailEl = document.createElement("div");
    mailEl.classList.add("mail-item");
    mailEl.classList.add(mail.status === "unseen" ? "unread" : "read");
    mailEl.innerHTML = `
      <div class="header-container">
      <img 
      src="./icons/${mail.starred ? "starredMail.png" : "unstarredMail.png"}" 
      class="star-toggle" 
      data-id="${mail._id}" 
      style="width: 20px; height: 20px; cursor: pointer;" 
    />      
      <h3>
      ${mail.sender}
      </h3>
      </div>    
      <div class="body-container">      
      ${
        mail.type.toLowerCase() !== "primary"
          ? `<span class="type ${mail.type}">${mail.type.toUpperCase()}</span>`
          : ""
      }     
     ${mail.subject ? `<p style="font-weight: bold;">${mail.subject}</p>` : ""}
     <p>${mail.body.slice(0, 80)}...</p></div>
      <div class="date-time">
        <span>${formatDateTime(mail.createdAt)}</span>
      </div>
    `;
    mailList.appendChild(mailEl);
    mailEl
      .querySelector(".star-toggle")
      .addEventListener("click", async (e) => {
        const mailId = e.target.dataset.id;
        try {
          const res = await fetch(
            `http://localhost:8000/api/mail/star/${mailId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (res.ok) {
            // Re-fetch mails to update star status
            fetchMails();
          }
        } catch (err) {
          console.error("Error toggling star:", err);
        }
      });
    // Handle Mark as Read
    mailEl.addEventListener("click", async (e) => {
      const mailId = e.target.dataset.id;
      mailEl.classList.toggle("read");
      try {
        const res = await fetch(
          `http://localhost:8000/api/mail/read/${mailId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok) {

          fetchMails(); // Refresh to update UI
        }
      } catch (err) {
        console.error("Error marking mail as read:", err);
      }
    });
  });
}
function setupTabs() {
  typeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove 'active' from all buttons
      typeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedType = btn.dataset.type;
      // console.log(selectedType);
      updateCounts(allMails);
      displayMails(selectedType);
    });
  });
}
async function fetchMails() {
  try {
    const response = await fetch("http://localhost:8000/api/mail/getAll");
    allMails = await response.json();
    updateCounts(allMails);
    displayMails("all"); // Default to showing primary mails
    // displayMails(); // default tab
    setupTabs(); // setup tab listeners
  } catch (error) {
    mailList.innerHTML = `<p>Error fetching mails: ${error.message}</p>`;
  }
}

fetchMails();
