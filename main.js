class Banner {
  bannerContainer;
  settingsMenu;
  settingsContent;
  settingsButton;
  settingsAccordions;
  rejectButtons;
  acceptButtons;
  settingsCloseButton;
  closeButton;
  pendingCookies;
  confirmButton;
  csvData;
  cookieCrumb;
  categorizedCookies;
  loadedScripts;

  constructor(data) {
    this.pendingCookies = [];
    this.categorizedCookies = {};
    this.loadedScripts = new Set();

    this.initialize();
    setTimeout(() => {
      this.bannerContainer = document.querySelector(
        "[data-item='js-banner-container']"
      );
      this.settingsMenu = document.querySelector(
        "[data-item='js-settings-container']"
      );
      this.settingsContent = document.querySelector(
        "[data-item='js-settings-content']"
      );
      this.settingsButton = document.querySelector(
        "[data-item='js-settings-button']"
      );
      this.settingsButton2 = document.querySelector(
        "[data-item='js-settings-button-2']"
      );
      this.rejectButtons = document.querySelectorAll(
        "[data-item='js-reject-button']"
      );
      this.acceptButtons = document.querySelectorAll(
        "[data-item='js-accept-button']"
      );
      this.settingsCloseButton = document.querySelector(
        "[data-item='js-settings-close-button']"
      );
      this.settingsAccordions = document.querySelectorAll(
        "[data-item='js-settings-accordion-head']"
      );
      this.confirmButton = document.querySelector(
        "[data-item='js-confirm-button']"
      );
      this.cookieCrumb = document.querySelector(
        "[data-item='js-cookie-container']"
      );

      this.csvData = data;

      this.categorizeCookies(data);
      this.initializeAccordions();
      this.closeButton = document.querySelector(
        "[data-item='js-close-button']"
      );
      this.createEventListeners();

      const userConsented = this.checkCookie();
      if (!userConsented) {
        this.blockCookies();
      } else {
        this.loadConsentedScripts();
      }
      this.syncTogglesToPreferences();
    }, 100);
  }

  initialize() {
    const containerNode = document.createElement("div");
    const settingsNode = document.createElement("div");
    const cookieNode = document.createElement("div");

    containerNode.classList.add("ofc-banner-container");
    containerNode.setAttribute("data-item", "js-banner-container");
    containerNode.style.width = "calc(100% - 17px)";

    cookieNode.classList.add("ofc-cookie-container");
    cookieNode.setAttribute("data-item", "js-cookie-container");

    settingsNode.classList.add("ofc-settings-container");
    settingsNode.setAttribute("data-item", "js-settings-container");

    const cookieCrumb = `
		  <div class='ofc-crumb-container'>
			<div class='ofc-crumb-image-wrapper'>
			<img src="https://raw.githubusercontent.com/JoshOpenform/cookieCDN/main/images/cookie_icon.svg">
			</div>
		  </div>`;

    const banner = `
		  <div class="cookiejar-container">
			<div class='ofc-message-container'>
				<h3>This website uses cookies</h3>
				<p>This website uses cookies to improve user experience. By using our website you consent to all cookies in accordance with our Cookie Policy.</p>
			</div>
			<div class='cookie-button-container'>
				<button data-item='js-accept-button' type='button' class='cookie-button'>ACCEPT</button>
				<button data-item='js-reject-button' type='button' class='cookie-button'>DECLINE</button>
			</div>
			<div class='ofc-close-container'>
				<button class='cookie-button ofc-close' data-item='js-close-button'><img src="https://raw.githubusercontent.com/JoshOpenform/cookieCDN/main/images/close_icon.svg" /></button>
			</div>
			<div class='settings'>
				<button data-item='js-settings-button' type='button' class='cookie-button'>Settings</button>
				<p>Powered by <span class='cookie-jar-link'>CookieJar</span></p>
			</div>
		  </div>
		  `;

    const settings = `
		<div class="cookiejar-container">
		  <div data-item='js-settings-content' class='ofc-settings-content'>
			<h2>This website uses cookies</h2>
			<div class="settings-content-container">
			<div class='ofc-settings-content-header'>
			  <p>PRIVACY PREFERENCE CENTER</p>
			  <button class='ofc-close ofc-popclose' data-item='js-settings-close-button'><img src="https://raw.githubusercontent.com/JoshOpenform/cookieCDN/main/images/close_icon.svg" /></button>
			</div>
			<div class="privacy-content-text">
				<p class="ofc-privacytext">Cookies are small text files that are placed on your computer by websites that you visit. Websites use cookies to help users navigate efficiently and perform certain functions. Cookies that are required for the website to operate properly are allowed to be set without your permission. All other cookies need to be approved before they can be set in the browser.</p> <br />
				<p>You can change your consent to cookie usage at any time on our Privacy Policy page.<br />
				We also use cookies to collect data for the purpose of personalizing and measuring the effectiveness of our advertising. <br />
				For more details, visit the <a href="https://policies.google.com/privacy" target=_blank>Google Privacy Policy</a>.</p>
				
			</div>
			<div class='ofc-settings'>
				<div class='ofc-accordion'>
				  <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
					  <p>Strictly necessary cookies</p>
					  <img class="lock-icon" src="https://raw.githubusercontent.com/JoshOpenform/cookieCDN/main/images/lock-locked_icon.svg" />
				  </div>            
				  <div class='ofc-accordion-body' style='display:none;'>
					  <p>These are essential cookies that are necessary for a website to function properly. 
					  They enable basic functions such as page navigation, access to secure areas, and ensuring that the website operates correctly. 
					  Strictly necessary cookies are typically set in response to user actions, such as logging in or filling out forms. 
					  They do not require user consent as they are crucial for the website's operation.</p>
				  </div>
				</div>
				<hr>
				<div class='ofc-accordion'>
				  <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
					  <p>Performance cookies</p>
					  <label class="ofc-toggle-switch" data-item="js-toggle-pC">
					  <input type="checkbox">
					  <span class="ofc-toggle-slider"></span>
					</label>
				  </div>       
				  <div class='ofc-accordion-body' style='display:none;'>
					<p>Performance cookies collect anonymous information about how visitors use a website. 
					They are used to improve website performance and provide a better user experience. 
					These cookies gather data about the pages visited, the time spent on the website, and any error messages encountered. 
					The information collected is aggregated and anonymised, and it helps website owners understand and analyse website traffic patterns.</p>
				  </div>
				</div>
				<hr>
				<div class='ofc-accordion'>
				  <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
					  <p>Marketing cookies</p>
					  <label class="ofc-toggle-switch" data-item="js-toggle-mC">
					  <input type="checkbox">
					  <span class="ofc-toggle-slider"></span>
					</label>
				  </div>       
				  <div class='ofc-accordion-body' style='display:none;'>
					<p>Marketing cookies are used to track users across websites and build a profile of their interests. 
					These cookies are often set by advertising networks or third-party advertisers. 
					They are used to deliver targeted advertisements and measure the effectiveness of marketing campaigns. 
					Marketing cookies may collect data such as browsing habits, visited websites, and interaction with ads. 
					Consent from the user is usually required for the use of marketing cookies.</p>
				  </div>
				</div>
				<hr>
				<div class='ofc-accordion'>
				  <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
					  <p>Functional cookies</p>
					  <label class="ofc-toggle-switch" data-item="js-toggle-fC">
					  <input type="checkbox">
					  <span class="ofc-toggle-slider"></span>
					</label>
				  </div>       
				  <div class='ofc-accordion-body' style='display:none;'>
					<p>Functional cookies enable enhanced functionality and customisation on a website. 
					They remember user preferences, such as language settings and personalised preferences, to provide a more personalised experience. 
					These cookies may also be used to remember changes made by the user, such as font size or layout preferences. 
					Functional cookies do not track or store personal information and are usually set in response to user actions.</p>
				  </div>
				</div>
				<hr>
				<div class='ofc-accordion'>
				  <div class="ofc-accordion-head" data-item="js-settings-accordion-head">
					  <p>Analytic cookies</p>
					  <label class="ofc-toggle-switch" data-item="js-toggle-aC">
					  <input type="checkbox">
					  <span class="ofc-toggle-slider"></span>
					</label>
				  </div>       
				  <div class='ofc-accordion-body' style='display:none;'>
					<p>Analytic cookies are similar to performance cookies as they collect information about how users interact with a website. However, 
					unlike performance cookies, analytic cookies provide more detailed and comprehensive data. 
					They track and analyse user behaviour, such as click patterns, mouse movements, and scroll depth, 
					to gain insights into user engagement and website performance. 
					Analytic cookies help website owners make data-driven decisions to optimize their websites.</p>
				  </div>
				</div>
				<hr>
			</div>
			</div>
			<div class="button-container">
			  <div class="left-buttons">
				<button class='ofc-popbutton' data-item='js-accept-button'>ACCEPT</button>
				<button class='ofc-popbutton' data-item='js-reject-button'>DECLINE</button>
			  </div>
			  <button class='ofc-popbutton' data-item='js-confirm-button'>SAVE & CLOSE</button>
			  <p class="powered-by">Powered by <span class='cookie-jar-link'>CookieJar</span></p>
			</div>
			</div>
		  </div>`;
    containerNode.innerHTML = banner;
    settingsNode.innerHTML = settings;
    cookieNode.innerHTML = cookieCrumb;

    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap";
    document.head.appendChild(fontLink);

    document.body.appendChild(containerNode);
    document.body.appendChild(settingsNode);
    document.body.appendChild(cookieNode);

    const button = document.querySelector('[data-item="js-reject-button"]');
    if (button) {
      button.textContent = "DECLINE";
    }
  }

  showElement(element) {
    if (element) element.classList.add("visible");
  }

  hideElement(element) {
    if (element) element.classList.remove("visible");
  }

  categorizeCookies(data) {
    let localCategorizedCookies = {};
    try {
      if (this.pendingCookies && this.pendingCookies.length > 0) {
        this.pendingCookies.forEach((cookie) => {
          let cookieName = cookie.split("=")[0].trim();
          let cookieEntry = data && data[cookieName];

          if (cookieEntry) {
            let category = cookieEntry["Category"];
            if (!localCategorizedCookies[category]) {
              localCategorizedCookies[category] = [];
            }
            localCategorizedCookies[category].push(cookie);
          } else if (cookieName) {
            if (!localCategorizedCookies["Other"]) {
              localCategorizedCookies["Other"] = [];
            }
            localCategorizedCookies["Other"].push(cookie);
          }
        });
      }
      this.categorizedCookies = localCategorizedCookies;
    } catch (e) {
      console.error("Error categorizing cookies:", e);
    }
  }

  createEventListeners() {
    if (this.settingsButton) {
      this.settingsButton.addEventListener("click", () => {
        this.syncTogglesToPreferences();
        this.showElement(this.settingsMenu);
      });
    }
    if (this.settingsButton2) {
      this.settingsButton2.addEventListener("click", () => {
        this.syncTogglesToPreferences();
        this.showElement(this.settingsMenu);
      });
    }
    if (this.settingsCloseButton) {
      this.settingsCloseButton.addEventListener("click", () => {
        this.hideElement(this.settingsMenu);
      });
    }
    if (this.closeButton) {
      this.closeButton.addEventListener("click", () => {
        this.hideElement(this.bannerContainer);
      });
    }

    this.acceptButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.handleConsent();
      });
    });

    this.rejectButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.handleRejection();
      });
    });

    if (this.confirmButton) {
      this.confirmButton.addEventListener("click", () => {
        this.updatePreference();
      });
    }
    if (this.cookieCrumb) {
      this.cookieCrumb.addEventListener("click", () => {
        this.syncTogglesToPreferences();
        this.showElement(this.settingsMenu);
      });
    }
  }

  initializeAccordions() {
    this.settingsAccordions.forEach(function (head) {
      head.addEventListener("click", function () {
        let accordionBody = head.nextElementSibling;
        if (accordionBody) {
          head.classList.toggle("active");
          accordionBody.style.display =
            accordionBody.style.display === "none" ? "block" : "none";
        }
      });
    });
  }

  blockCookies() {
    this.pendingCookies = document.cookie
      .split(";")
      .filter((c) => c.trim() !== "");
    for (let i = 0; i < this.pendingCookies.length; i++) {
      let cookieName = this.pendingCookies[i].split("=")[0].trim();
      if (cookieName) {
        const preservedCookies = [
          "ofcPer",
          "Strictly",
          "Performance",
          "Analytics",
          "Marketing",
          "Functional",
        ];
        if (cookieName === "ofcPer") {
        } else if (!preservedCookies.includes(cookieName)) {
          this.setCookie(cookieName, "", -1);
        }
      }
    }
    this.categorizeCookies(this.csvData);
  }

  getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  setCookie(name, value, days) {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
      name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  }

  getToggleInputs() {
    return {
      sNC: null,
      pC: document.querySelector("[data-item='js-toggle-pC'] input"),
      aC: document.querySelector("[data-item='js-toggle-aC'] input"),
      mC: document.querySelector("[data-item='js-toggle-mC'] input"),
      fC: document.querySelector("[data-item='js-toggle-fC'] input"),
    };
  }

  updateAllTogglesState(isAccepted) {
    const toggles = this.getToggleInputs();
    if (toggles.pC) toggles.pC.checked = isAccepted;
    if (toggles.aC) toggles.aC.checked = isAccepted;
    if (toggles.mC) toggles.mC.checked = isAccepted;
    if (toggles.fC) toggles.fC.checked = isAccepted;
  }

  syncTogglesToPreferences() {
    const toggles = this.getToggleInputs();

    if (toggles.pC)
      toggles.pC.checked = this.getCookie("Performance") === "true";
    if (toggles.aC) toggles.aC.checked = this.getCookie("Analytics") === "true";
    if (toggles.mC) toggles.mC.checked = this.getCookie("Marketing") === "true";
    if (toggles.fC)
      toggles.fC.checked = this.getCookie("Functional") === "true";
  }

  handleConsent() {
    this.setCookie("ofcPer", "yes", 7);
    this.setPrefCookie("Strictly", true, 7);
    this.setPrefCookie("Performance", true, 7);
    this.setPrefCookie("Analytics", true, 7);
    this.setPrefCookie("Marketing", true, 7);
    this.setPrefCookie("Functional", true, 7);
    this.updateAllTogglesState(true);
    this.hideElement(this.bannerContainer);
    this.hideElement(this.settingsMenu);
    this.showElement(this.cookieCrumb);
    this.loadConsentedScripts();
  }

  handleRejection() {
    this.setCookie("ofcPer", "no", 7);

    this.setPrefCookie("Strictly", true, 7);
    this.setPrefCookie("Performance", false, 7);
    this.setPrefCookie("Analytics", false, 7);
    this.setPrefCookie("Marketing", false, 7);
    this.setPrefCookie("Functional", false, 7);

    this.updateAllTogglesState(false);

    const currentCookies = document.cookie
      .split(";")
      .filter((c) => c.trim() !== "");
    const preservedCookieNames = [
      "ofcPer",
      "Strictly",
      "Performance",
      "Analytics",
      "Marketing",
      "Functional",
    ];

    for (const cookieStr of currentCookies) {
      const cookieName = cookieStr.split("=")[0].trim();
      if (cookieName && !preservedCookieNames.includes(cookieName)) {
        this.setCookie(cookieName, "", -1);
      }
    }
    this.pendingCookies = [];

    this.hideElement(this.bannerContainer);
    this.hideElement(this.settingsMenu);
    this.hideElement(this.cookieCrumb);
  }

  checkCookie() {
    let consent = this.getCookie("ofcPer");
    if (consent === "yes") {
      this.hideElement(this.bannerContainer);
      this.showElement(this.cookieCrumb);
      this.syncTogglesToPreferences();
      return true;
    } else if (consent === "no") {
      this.hideElement(this.bannerContainer);
      this.hideElement(this.cookieCrumb);
      this.syncTogglesToPreferences();
      return false;
    } else {
      this.showElement(this.bannerContainer);
      this.hideElement(this.cookieCrumb);
      return false;
    }
  }

  setPrefCookie(categoryName, agreed, days = 7, setAllMode = false) {
    this.setCookie(categoryName, String(agreed), days);
  }

  updatePreference() {
    this.blockCookies();
    this.setCookie("ofcPer", "yes", 7);
    const toggles = this.getToggleInputs();

    this.setPrefCookie("Strictly", true, 7);
    if (toggles.pC) this.setPrefCookie("Performance", toggles.pC.checked, 7);
    if (toggles.aC) this.setPrefCookie("Analytics", toggles.aC.checked, 7);
    if (toggles.mC) this.setPrefCookie("Marketing", toggles.mC.checked, 7);
    if (toggles.fC) this.setPrefCookie("Functional", toggles.fC.checked, 7);

    this.loadConsentedScripts();

    let approvedCookiesToSet = [];
    const strictlyCategoryName = "Strictly necessary cookies";
    if (this.categorizedCookies[strictlyCategoryName]) {
      approvedCookiesToSet.push(
        ...this.categorizedCookies[strictlyCategoryName]
      );
    }
    if (
      toggles.pC &&
      toggles.pC.checked &&
      this.categorizedCookies["Performance cookies"]
    ) {
      approvedCookiesToSet.push(
        ...this.categorizedCookies["Performance cookies"]
      );
    }
    if (
      toggles.aC &&
      toggles.aC.checked &&
      this.categorizedCookies["Analytic cookies"]
    ) {
      approvedCookiesToSet.push(...this.categorizedCookies["Analytic cookies"]);
    }
    if (
      toggles.mC &&
      toggles.mC.checked &&
      this.categorizedCookies["Marketing cookies"]
    ) {
      approvedCookiesToSet.push(
        ...this.categorizedCookies["Marketing cookies"]
      );
    }
    if (
      toggles.fC &&
      toggles.fC.checked &&
      this.categorizedCookies["Functional cookies"]
    ) {
      approvedCookiesToSet.push(
        ...this.categorizedCookies["Functional cookies"]
      );
    }

    approvedCookiesToSet.forEach((cookieString) => {
      const parts = cookieString.split("=");
      const name = parts[0] ? parts[0].trim() : null;
      const value = parts.slice(1).join("=").trim();
      if (name) {
        this.setCookie(name, value, 7);
      }
    });

    this.hideElement(this.bannerContainer);
    this.hideElement(this.settingsMenu);
    this.showElement(this.cookieCrumb);
  }

  /**
   * FINAL VERSION: Dynamically loads and executes scripts based on user's consent preferences.
   */
  loadConsentedScripts() {
    const consentedCategories = [];
    // FINAL DATA FIX: Ensure these strings match your CSV data.
    if (this.getCookie("Performance") === "true")
      consentedCategories.push("Performance");
    if (this.getCookie("Analytics") === "true")
      consentedCategories.push("Analytics"); // Corrected from "Analytic"
    if (this.getCookie("Marketing") === "true")
      consentedCategories.push("Marketing");
    if (this.getCookie("Functional") === "true")
      consentedCategories.push("Functional");

    if (!this.csvData || Object.keys(this.csvData).length === 0) {
      return; // No data to process
    }

    const lowerCaseConsentedCategories = consentedCategories.map((c) =>
      c.toLowerCase()
    );

    for (const key in this.csvData) {
      const cookieInfo = this.csvData[key];
      const categoryFromCSV = cookieInfo.Category
        ? cookieInfo.Category.toLowerCase()
        : "";

      if (lowerCaseConsentedCategories.includes(categoryFromCSV)) {
        // Load script from URL if available and not already loaded
        if (
          cookieInfo.ScriptURL &&
          !this.loadedScripts.has(cookieInfo.ScriptURL)
        ) {
          console.log(
            `Loading script for ${cookieInfo.Category}: ${cookieInfo.ScriptURL}`
          );
          const scriptElement = document.createElement("script");
          scriptElement.src = cookieInfo.ScriptURL;
          scriptElement.async = true;
          document.head.appendChild(scriptElement);
          this.loadedScripts.add(cookieInfo.ScriptURL);
        }

        // Execute inline script if available
        if (
          cookieInfo.InlineScript &&
          !this.loadedScripts.has(cookieInfo.InlineScript)
        ) {
          console.log(`Executing inline script for ${cookieInfo.Category}`);
          const inlineScriptElement = document.createElement("script");
          inlineScriptElement.textContent = cookieInfo.InlineScript;
          document.head.appendChild(inlineScriptElement);
          this.loadedScripts.add(cookieInfo.InlineScript);
        }
      }
    }
  }
}

// --- Global Helper Functions (Unchanged) ---
function readCSVFile(fileUrl) {
  return fetch(fileUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} for ${fileUrl}`
        );
      }
      return response.text();
    })
    .then((csvData) => parseCSV(csvData));
}

function parseCSV(csvData) {
  if (csvData.charCodeAt(0) === 0xfeff) {
    csvData = csvData.substring(1);
  }

  let parsedData = {};
  let rows = csvData
    .replace(/\r/g, "")
    .split("\n")
    .filter((row) => row.trim() !== "");

  if (rows.length === 0) return parsedData;

  let headers = rows
    .shift()
    .split(";")
    .map((h) => h.trim());

  rows.forEach((row) => {
    let rowData = row.split(";");
    let cookieObj = {};
    let cookieNameKey = "";

    headers.forEach((header, index) => {
      try {
        const value = rowData[index] ? rowData[index].trim() : "";
        cookieObj[header] = value;
        if (header === "Cookie / Data Key name") {
          cookieNameKey = value;
        }
      } catch (error) {}
    });

    if (cookieNameKey) {
      parsedData[cookieNameKey] = cookieObj;
    }
  });
  return parsedData;
}

// --- Initialization (Unchanged) ---
readCSVFile(
  "https://raw.githubusercontent.com/OpenformDevs/cookieCDN-GDPR-Update/main/open-cookie-database.csv"
)
  .then((data) => {
    if (Object.keys(data).length === 0) {
      console.warn(
        "CSV data is empty or could not be parsed correctly. Banner might not categorize cookies effectively."
      );
    }
    const banner = new Banner(data);
  })
  .catch((error) => {
    console.error("Failed to initialize banner with CSV data:", error);
  });
