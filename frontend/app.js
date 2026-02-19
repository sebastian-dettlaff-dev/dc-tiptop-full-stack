
const host = window.location.hostname;
const openBtn  = document.querySelector("#menu-open-button");
const closeBtn  = document.querySelector("#menu-close-button");
const menu = document.querySelector(".nav-menu");
const navigation_Bar = document.querySelector(".nav-bar");
const overlay = document.querySelector(".menu-overlay");
//-------------------------------------
let interval_ID = null;
let hasTyped = false;
const  h1_Our_Servic_Title =document.querySelector("#our_service_title");

// ------------------------------------
// dark_Mode:
const dark_Mode_Btn = document.getElementById("toggle-dark");

const darkModeActivation = () => {
    document.body.classList.toggle("dark_Mode");
};

dark_Mode_Btn.addEventListener("click",darkModeActivation);
//  ------------------------------------
// Slider - 2ND SECTION
const slideList = [{
    img:"img/conopy-slider.svg",
    text: "Degreasing and full cleaning of kitchen extraction canopies to maintain safe and efficient airflow and prevent grease build-up and fire hazards."
},{
    img:"img/duct_extraction_slider.svg",
    text: "Complete internal cleaning of kitchen duct systems, including grills, access panels, and hard-to-reach ductwork — boosting air quality and airflow efficiency."
},{
    img:"img/kitchen-slider.svg",
    text: "Thorough cleaning of all kitchen surfaces, equipment, and hard-to-reach areas — ensuring hygiene, fire safety, and compliance with health standards."

},
{
img:"img/fan-image-slider.svg",
    text: "Professional cleaning of kitchen exhaust fans and motor units — enhancing performance, safety, and energy efficiency."
}];
if(document.body.dataset.page === "main-page"){
//slider function
const image_Slider = document.querySelector(".slider_container img");
const h2_Slider = document.querySelector(".slider_container h2 ");
const time = 5000;
let activeSlide = 0;

const changeSlide = () => {
    if( image_Slider && h2_Slider){
    activeSlide++;
    if(activeSlide === slideList.length){
       activeSlide = 0;
    }

    image_Slider.src =slideList[activeSlide].img;

    h2_Slider.textContent = slideList[activeSlide].text;
    } else {
        return;
    }
}
    setInterval(changeSlide,time);
}


// typing mechanism -function
if(document.body.dataset.page === "main-page" || document.body.dataset.page === "blog"){
const text_DescriptionOne = "Your Cleaning Needs, Our Expertise."
const text_Ttile_Blog = "The Clean Kitchen Chronicles: Insights on Ducts, Ventilation, and Deep Cleaning ";
let index_Text = 0;
const time_Typing = 70;
const addLetter = () => {
    h1_Our_Servic_Title.textContent += text_DescriptionOne[index_Text];

    index_Text++;
    if(index_Text === text_DescriptionOne.length){
        clearInterval(interval_ID)
    }
}
// interval_ID = setInterval(addLetter,time_Typing);
if(h1_Our_Servic_Title){
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasTyped) {
            hasTyped = true;
            h1_Our_Servic_Title.textContent = ""; // wyczyść nagłówek
            index_Text =0;
            interval_ID = setInterval(addLetter, time_Typing);
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.4
});
observer.observe(h1_Our_Servic_Title);
}else{
//typing after reaching exact section , calling typing function
console.warn("Element h1_Our_Servic_Title not found.")
}
}



const activate_Menu = () => {
    menu.classList.add("active");
}

openBtn.addEventListener("click", activate_Menu);

const disactivate_Menu = () => {
    menu.classList.remove("active");
}
closeBtn.addEventListener("click",disactivate_Menu);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    disactivate_Menu();
  }
});
//-------------------------------------
// qr-intesection function - fixed position scrolling
//VARIABLES:
if(document.body.dataset.page === "main-page"){
const  qr_Box = document.querySelector(".qr_Reviews");
const targetSection = document.querySelector(".testimonials");
//Function
if(qr_Box){
const observing_Fucnction = new IntersectionObserver(entries_Elements => {
    entries_Elements.forEach(entry => 
    {
        if(entry.isIntersecting){
             qr_Box.classList.add("visible");
             }else{
                qr_Box.classList.remove("visible");
             }
    }
)
},{threshold:0.1});
observing_Fucnction.observe(targetSection);
} else {
    console.warn("qr_Box has not been found!" )
}
}




//ide all reviews

if (document.body.dataset.page === "main-page") {
const time_Review = 6000; // 6 sekund
const testimonials = document.querySelectorAll('.testimonial_Item');


let activeIndex = 0;


function showTestimonial(index) {
  testimonials.forEach((item, i) => {
    if(i === index){
        item.classList.add("active");
    }else {
        item.classList.remove("active");
    }
  });


}

// Przełącz na następną recenzję
function nextTestimonial() {
  activeIndex++;
  if(activeIndex >= testimonials.length) {
    activeIndex = 0;
  }
  showTestimonial(activeIndex);
}

// Pokaz pierwszą recenzję od razu
showTestimonial(activeIndex);

// Ustaw automatyczne przełączanie
setInterval(nextTestimonial, time_Review);
}




//   -------------------------------------------------
 //VALIDATION OF CONTACT FORM BOTH DYNAMIC AND STATIC / recaptcha:
 if (document.body.dataset.page === "main-page" || document.body.dataset.page === "contact-form") {
document.addEventListener("DOMContentLoaded", function () {
    // Pobieranie elementów
    const form = document.getElementById("validationForm");

    const companyInput = document.getElementById("company_Input");
    const postcodeInput = document.getElementById("postcode_Input");
    const phoneInput = document.getElementById("phone_Input");
    const emailInput = document.getElementById("email_Input");

    const messageCompanyError = "Field cannot stay empty and name must contain at least 2 characters.";
    const messageEmailError = "Invalid email address.";
    const messagePhoneError = "Invalid UK phone number.";
    const messagePostcodeError = "Invalid UK postcode.";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // WALIDACJA FORMULARZA
      if (!checkInputs()) {
        return;
      }

      grecaptcha.ready(function () {
        grecaptcha.execute("6LegSasrAAAAAPgD_kjhMQVN9BF1nty4s_F4bklL", { action: "submit" }).then(function (token) {
          const requestBody = {
            recaptchaToken: token,
            company: companyInput.value.trim(),
            postcode: postcodeInput.value.trim(),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            message: document.getElementById("message_Input").value.trim()
          };

          fetch("https://api.dctiptop.co.uk/send-message", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
          }).then(response => {
             const responseMessageDiv = document.getElementById("responseMessage");
            if (response.ok) {
            //   alert("Message sent. Thank you!");
             // Pokaż wiadomość sukcesu
             responseMessageDiv.style.display = "block";
             responseMessageDiv.style.opacity = "1"; // jeśli używasz przejścia opacity
   responseMessageDiv.style.position = "fixed";
responseMessageDiv.style.top = "50%";
responseMessageDiv.style.left = "50%";
responseMessageDiv.style.transform = "translate(-50%, -50%)";
responseMessageDiv.style.backgroundColor = "white"; // lub inny kolor tła
responseMessageDiv.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
responseMessageDiv.style.padding = "20px";
responseMessageDiv.style.borderRadius = "10px";
responseMessageDiv.style.zIndex = "999999";
responseMessageDiv.style.color = "green"; // lub "red" przy błędzie
responseMessageDiv.style.border = "2px solid green"; // lub red
responseMessageDiv.style.fontSize = "18px";
responseMessageDiv.style.textAlign = "center";
responseMessageDiv.style.maxWidth = "90%";
responseMessageDiv.style.width = "fit-content";
responseMessageDiv.textContent = "Message sent! Thank you! We respond as soon as possible.";
              form.reset();
              setTimeout(() => {
                responseMessageDiv.style.display = "none";
              },3000)
            } else {
              response.text().then(text => {
                console.error("Error response:", text);
                alert("Error during sending a message: " + text);
              });
            }
          }).catch(error => {
            const responseMessageDiv = document.getElementById("responseMessage");
            responseMessageDiv.style.display = "block";
            responseMessageDiv.style.opacity = "1"; // jeśli używasz przejścia opacity
responseMessageDiv.style.position = "fixed";
responseMessageDiv.style.top = "50%";
responseMessageDiv.style.left = "50%";
responseMessageDiv.style.transform = "translate(-50%, -50%)";
responseMessageDiv.style.backgroundColor = "white"; // lub inny kolor tła
responseMessageDiv.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
responseMessageDiv.style.padding = "20px";
responseMessageDiv.style.borderRadius = "10px";
responseMessageDiv.style.zIndex = "999999";
responseMessageDiv.style.color = "green"; // lub "red" przy błędzie
responseMessageDiv.style.border = "2px solid green"; // lub red
responseMessageDiv.style.fontSize = "18px";
responseMessageDiv.style.textAlign = "center";
responseMessageDiv.style.maxWidth = "90%";
responseMessageDiv.style.width = "fit-content";
responseMessageDiv.textContent = "Message sent! Thank you! We respond as soon as possible.";

            console.error("Error:", error);
            // alert("Connecting error!");
          });
        });
      });
    });

    // VALIDATION OF CONTACT FORM - WHEN CLICK SUBMIT
    function checkInputs() {
        let isValid = true;

        const companyName = companyInput.value.trim();
        const postcode = postcodeInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();

       

        // checking company field
        if (companyName.length < 2) {
            setErrorFor(companyInput, messageCompanyError);
            isValid = false;
        } else {
            setSuccessFor(companyInput);
        }

        // checking email field
        const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,}$/;
        if (!emailRegex.test(email)) {
            setErrorFor(emailInput, messageEmailError);
            isValid = false;
        } else {
            setSuccessFor(emailInput);
        }

        // checking uk phone number
        const phoneRegex = /^(?:\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
        if (!phoneRegex.test(phone)) {
            setErrorFor(phoneInput, messagePhoneError);
            isValid = false;
        } else {
            setSuccessFor(phoneInput);
        }

        // checking uk postcode
        const postcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})$/i;
        if (!postcodeRegex.test(postcode)) {
            setErrorFor(postcodeInput, messagePostcodeError);
            isValid = false;
        } else {
            setSuccessFor(postcodeInput);
        }

        return isValid;
    }
    //Dynamic validation of contact form FIELDS
    companyInput.addEventListener("input" , () => {
        
        if(companyInput.value.trim().length >= 2) {
            setSuccessFor(companyInput);
        }else {
            setErrorFor(companyInput , messageCompanyError)
        }
    });

    emailInput.addEventListener("input", () => {
        const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,}$/;
        if(emailRegex.test(emailInput.value.trim())){
            setSuccessFor(emailInput);
        }else{
            setErrorFor(emailInput ,messageEmailError);
        }
    });

    phoneInput.addEventListener("input", () => {
        const phoneRegex = /^(?:\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
        if(phoneRegex.test(phoneInput.value.trim())){
            setSuccessFor(phoneInput);
        } else {
            setErrorFor(phoneInput, messagePhoneError);
        }
    });
    postcodeInput.addEventListener("input", () => {
    const postcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})$/i;
    if (postcodeRegex.test(postcodeInput.value.trim())) {
        setSuccessFor(postcodeInput);
    } else {
        setErrorFor(postcodeInput, "Invalid UK postcode.");
    }
});

    // function showing error class
    function setErrorFor(input, message) {
        const formControl = input.parentElement;
        const small = formControl.querySelector("small");
        small.innerText = message;
        formControl.classList.add("error");
        formControl.classList.remove("success");
    }

    // function showing success class
    function setSuccessFor(input) {
        const formControl = input.parentElement;
        const small = formControl.querySelector("small");
        small.innerText = "";
        formControl.classList.remove("error");
        formControl.classList.add("success");
    }
});
 }
// ------------------------------------------------------------------------
//gallery function
//run the function below only if ody has got data-page = "gallery":
if (document.body.dataset.page === "gallery"){
    //run the function after DOM elemensts has been loaded
window.addEventListener("DOMContentLoaded", () => {
    //exporting .selection_Unit class to operate on it 
    const filterItem = document.querySelector(".selection_Unit");
// if element filterItem exist on that subdomen:
    if (filterItem) {
        //exporting class active and imagecontainer to operate on it:
        // const currentActive = filterItem.querySelector(".active");
        const filterImages = document.querySelectorAll(".imagecontainer");
// Logic for function changeCategory:
        const changeCategory = (selectedItem) => {
            // localise element which has been clicked:
            let clicked = selectedItem.target;
// if localised element that has been clicked has a class item_selection:
            if (clicked.classList.contains("item_selection")) {
                const current = filterItem.querySelector(".active");
                if (current) current.classList.remove("active");
                clicked.classList.add("active");


                // -------------------------------------------------------------


//eporting content of clicked element and deleting empty spaces on beginning and end:
                let filterName = clicked.getAttribute("data-name");
                
                filterImages.forEach((image) => {
                    // exporting alt atribute and changing to lower case
                    let imgAlt = image.getAttribute("data-name");
                    if((imgAlt == filterName) || filterName == "all"){
                        image.classList.remove("hide");
                        image.classList.add("show");
                    }else {
                        image.classList.add("hide");
                        image.classList.remove("show");
                    }
                });
            }
           
        };
         for(let index = 0; index < filterImages.length; index++){
            
            filterImages[index].setAttribute("onclick","preview(this)")
            
            }
// calling function chnge Category when event - click:
        filterItem.addEventListener("click", changeCategory);
    } else {
        console.log("This is not main website - i can't use this method");
    }
});




//selecting all required elements from DOM
const previewBox = document.querySelector(".pre-box");
const previewImg = previewBox.querySelector("img");
const categoryName = previewBox.querySelector(".title-box p");
const closeIcon = previewBox.querySelector(".icon");
const shadow = document.querySelector(".shadow-box");




//fuction for fullscreen image view
function preview(element) {
    document.querySelector("body").style.overflow = "hidden";
    // getting  user image source and store in variable
    let selecetedPrevImg = element.querySelector("img").src;
    //GETTING USER CLICKED DATA-NAME VALUE
    let selectedCategory = element.getAttribute("data-name");
    //passing the data-name value to category name variable
    categoryName.textContent = selectedCategory;
    //passing the user clicked image source in the preview image source
    previewImg.src = selecetedPrevImg;
    //show the shadow background , when user select and click image.
    shadow.classList.add("show");
    //show the image bigger
    previewBox.classList.add("show");
    //function to hide image , when user click on it
    closeIcon.onclick =  () => {
    previewBox.classList.remove("show");
    shadow.classList.remove("show");
    document.querySelector("body").style.overflow = "scroll";
    }
}

}



document.addEventListener("DOMContentLoaded", function () {
  const banner = document.getElementById("cookiePopUp");
  const acceptBtn = document.getElementById("acceptCookie");

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
      let c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  function showBanner() {
    if (!getCookie("cookiesAccepted")) {
      banner.style.display = "flex";
    } else {
      banner.style.display = "none";
    }
  }

  acceptBtn.addEventListener("click", acceptCookies);
  acceptBtn.addEventListener("touchstart", acceptCookies);

  function acceptCookies() {
    setCookie("cookiesAccepted", "true", 365);
    banner.style.display = "none";
  }

  showBanner();
});



// --------------------------------------------
// Go Up button function
console.log("back-to-top element:", document.querySelector(".back-to-top"));

document.addEventListener("DOMContentLoaded", function () {
    const toTopBtn = document.querySelector(".back-to-top");
    

    window.addEventListener("scroll", () => {
        console.log("scroll event fired", window.pageYOffset);
        if (toTopBtn) {
            console.log(toTopBtn);
            if (window.pageYOffset > 1000) {
                toTopBtn.classList.add("active");
            } else {
                toTopBtn.classList.remove("active");
                
            }
        }
    });

    if (toTopBtn) {
        toTopBtn.addEventListener("click", (event) => {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});
// faq dunction show answer
if (document.body.dataset.page === "faq") {
    document.addEventListener("DOMContentLoaded", function () {
        // downloading div with answer-question content:
        const arrayQuestions = document.querySelectorAll(".question-answer-faq");
        // iterating on each block:
        arrayQuestions.forEach(function (questionElement) {
            // downloading buttons to call addevenlistener:
            const btn = questionElement.querySelector(".btn-faq");
            btn.addEventListener("click", function () {
                // when click downloading block with answer and show 
                const answer = questionElement.querySelector(".answer-faq");
                answer.classList.toggle("show-answer");
                // downloading up and down icon and toggle them each time user click.

                const upIcon = questionElement.querySelector(".up-icon");
                const downIcon = questionElement.querySelector(".down-icon");

                upIcon.classList.toggle("show-answer");
                downIcon.classList.toggle("show-answer");
            });
        });
    });
}






// -----------------------------------------------------------------------------------LOGIC FOR BLOG:



document.addEventListener('DOMContentLoaded', function() {
  // --- Sprawdzenie strony ---
  const page = document.body.dataset.page;

  // ---Modal panel editioning) ---
  window.openEditArticleModal = function(articleId) {
    fetch(`https://api.dctiptop.co.uk/api/articles/${articleId}`)
      .then(res => {
        if (!res.ok) throw new Error("Error fetching article");
        return res.json();
      })
      .then(article => {
        document.getElementById('edit-article-title').value = article.title;
        document.getElementById('edit-article-content').value = article.content;
        document.getElementById('edit-article-summary').value = article.summary;
        document.getElementById('edit-article-id').value = article.id;
        document.getElementById('edit-article-modal').style.display = 'block';
      })
      .catch(err => {
        console.error(err);
        alert("We occured issue, tring to display available articles list.");
      });
  };

  if(page === "blog") {
    // --- Find elements ---
    const adminLoginModal = document.getElementById('admin-login-modal-blog');
    const adminPanel = document.getElementById('admin-panel');
    const openAdminLoginButton = document.getElementById('open-admin-login-blog');
    const closeModalButton = document.querySelector('.close-modal-blog');
    const loginForm = document.getElementById('admin-login-form-blog');
    const addArticleForm = document.getElementById('add-article-form');
    const logoutButton = document.getElementById('logout-button');
    const articlesContainer = document.getElementById('articles-container');
    const articlesList = document.getElementById('articles-list'); // do edycji
    const editArticleModal = document.getElementById('edit-article-modal');
    const editArticleForm = document.getElementById('edit-article-form');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');

    let currentPage = 0;
    const pageSize = 6;
    let isAdminLoggedIn = false;

    // First, Initialize TinyMCE article editor :
tinymce.init({
    selector: '#edit-article-content,#article-content',
    plugins:'lists link image code table emoticons charmap media',
       toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image | table | emoticons | charmap | media | code', 
});

    // --- Events ---







    // Log in modal
    openAdminLoginButton.addEventListener('click', () => {
      adminLoginModal.style.display = 'block';
    });

    // Close admin panel
    closeModalButton.addEventListener('click', () => {
      adminLoginModal.style.display = 'none';
    });

    // Close modal when click
    window.addEventListener('click', (event) => {
      if(event.target === adminLoginModal) adminLoginModal.style.display = 'none';
      if(event.target === editArticleModal) editArticleModal.style.display = 'none';
    });
    function showNotification(message, isSuccess) {
            const notification = document.getElementById('notification');
                notification.textContent = message;
                    notification.className = `notification ${isSuccess ? '' : 'error'}`;
                        notification.classList.remove('hidden');    
                        // Znikanie komunikatu po 3 sekundach    
                         setTimeout(() => {        notification.classList.add('hidden');    }, 3000);}

//    Admin Login
   loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
 const username = document.getElementById('username-blog').value;
      const password = document.getElementById('password-blog').value;
          fetch('https://api.dctiptop.co.uk/api/admin/login', { 
                  method: 'POST',        headers: { 'Content-Type': 'application/json' }, 
                   body: JSON.stringify({ username, password }),
                   credentials:'include'
                     })   
                     .then(res => { 
                      if (!res.ok) throw new Error('Login failed');
                               return res.json();    })
                                           .then(data => { 
                                         isAdminLoggedIn = true; 
         adminLoginModal.style.display = 'none'; 
                         adminPanel.style.display = 'block'
                           // Hide the regular blog view 
 if (document.querySelector('.container-blog')) { 
  document.querySelector('.container-blog').style.display = 'none';
                                           }  
                     articlesList.style.display = "block";        loadAdminArticles(); 
                         // Notification for login 
                          showNotification(data.message || "Logged in successfully!", true);   
                           })  
                           
                           .catch(err => {  
                                  console.error(err);  
                                        showNotification("Incorrect username or password!", false);
                                        });
                                    });

    // Funkcja do ładowania artykułów do edycji admina
    function loadAdminArticles() {
      if(!articlesList) return;
      fetch('https://api.dctiptop.co.uk/api/articles?page=0&size=100',{credentials:'include'})
        .then(res => res.json())
        .then(data => {
          articlesList.innerHTML = '';
          data.content.forEach(article => {
            const div = document.createElement('div');
            div.className = 'article-item';
            div.innerHTML = `
              <h3>${article.title}</h3>
              <button onclick="openEditArticleModal(${article.id})">Edit</button>
            `;
            articlesList.appendChild(div);
          });
        })
        .catch(err => console.error('Error during articles-list loading:', err));
    }

    // Obsługa formularza edycji artykułu
    editArticleForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const id = document.getElementById('edit-article-id').value;
      const title = document.getElementById('edit-article-title').value;
    //   const content = document.getElementById('edit-article-content').value;
      const summary = document.getElementById('edit-article-summary').value.trim();
      const imageFile = document.getElementById('edit-article-image').files[0];
      const content = tinymce.get('edit-article-content').getContent();
      

      if(summary.split(/\s+/).length > 80){
        alert("Your limit of characters in this section equals 80.Please adjuse content.");
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('summary', summary);
      if(imageFile) formData.append('image', imageFile);

      fetch(`https://api.dctiptop.co.uk/api/articles/${id}`, {
        method: 'PUT',
        body: formData,
        credentials:'include'
      })
      .then(res => {
        if(!res.ok) throw new Error('Error occured , during refreshing available list of articles.');
        return res.json();
      })
      .then(data => {
        alert("Article has been updated.");
        editArticleModal.style.display = 'none';
        loadAdminArticles();
      })
      .catch(err => {
        console.error(err);
        alert("We coudn't update article.Try again.");
      });
    });

    // Adding new article
    addArticleForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const title = document.getElementById('article-title').value;
    //   const content = document.getElementById('article-content').value;
      const summary = document.getElementById('article-summary').value.trim();
      const imageFile = document.getElementById('article-image').files[0];
      const content  = tinymce.get('article-content').getContent();

      if(summary.split(/\s+/).length > 80){
        alert("Limit of charachters for Summary section equals 80.");
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('summary', summary);
      if(imageFile) formData.append('image', imageFile);

      fetch('https://api.dctiptop.co.uk/api/articles', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })
      .then(res => {
        if(!res.ok) throw new Error('We could not add article. Try again.');
        return res.json();
      })
      .then(data => {
        alert("Article has been added succesfully.");
        addArticleForm.reset();
        loadAdminArticles();
      })
      .catch(err => {
        console.error(err);
        alert("Error during adding articles.");
      });
    });

    // Admin Logout
    logoutButton.addEventListener('click', () => {
            fetch('https://api.dctiptop.co.uk/api/admin/logout', {
                        method: 'POST',
                      credentials:'include'    })   
                         .then(res => { 
                           if (!res.ok) throw new Error('Error logout!');
                                   return res.json();    })
                                       .then(data => { 
                                           isAdminLoggedIn = false; 
                                                  adminPanel.style.display = 'none'; 
                                                  articlesList.style.display = "none"; 
                                                 // Notification for logout 
                                               showNotification(data.message || "Logged out successfully!", true);
                                            // Show the blog view
                                                    if (document.querySelector('.container-blog')) {
                                                document.querySelector('.container-blog').style.display = 'block';        } 
                                                   // Delay showing the login panel
                                                          setTimeout(() => {
                                                                      adminLoginModal.style.display = 'block'; 
                                                                      // Show login panel
                                                                              }, 2000); 
                                                                              // 1 second delay  
                                                                                })    .catch(err => { 
                                                                                  console.error(err);
                                                                                    showNotification("Failed to log out! Please try again.", false); 
                                                                                   });
                                                                                });

    // Loading new articles and pagination 
    function loadArticles(page) {
      fetch(`https://api.dctiptop.co.uk/api/articles?page=${page}&size=${pageSize}`)
        .then(res => {
          if(!res.ok) throw new Error("We couldn't load articles.");
          return res.json();
        })
        .then(data => {
          articlesContainer.innerHTML = '';
          if(data.content.length === 0) {
            articlesContainer.innerHTML = '<p>No articles to display.</p>';
          } else {
            data.content.forEach(article => {
              const div = document.createElement('div');
              div.className = 'article-card-blog';
              const transformedUrl = article.imageUrl.replace(
                '/upload/',
                '/upload/w_300,h_300,c_fill,f_auto,q_auto/'
              );
              div.innerHTML = `
                <img src="${transformedUrl}" alt="Article Image" class="article-img-blog" />
                <h2 class="article-title-blog">${article.title}</h2>
                <p class="article-date">${new Date(article.createdAt).toLocaleDateString()}</p>
                <p class="article-summary-blog">${article.summary}</p>
                
                <a href="article.html?id=${article.id}" class="read-more-blog">Read more</a>
              `;
              articlesContainer.appendChild(div);
            });
          }
          pageInfo.textContent = `Page ${page + 1}`;
          prevPageBtn.disabled = page === 0;
          nextPageBtn.disabled = data.last;
          nextPageBtn.textContent = data.last ? 'End' : 'Next';
        })
        .catch(err => {
          console.error(err);
          articlesContainer.innerHTML = '<p>Sorry, We could not load the articles.</p>';
        });
    }

    prevPageBtn.addEventListener('click', () => {
      if(currentPage > 0) {
        currentPage--;
        loadArticles(currentPage);
      }
    });

    nextPageBtn.addEventListener('click', () => {
      currentPage++;
      loadArticles(currentPage);
    });

    // Na start załaduj artykuły dla zwykłych użytkowników
    if(!isAdminLoggedIn) {
      loadArticles(currentPage);
    }else{
        // Do not show artciles-blog to admin
        articlesList.style.display = "none";
    }
  }

  if(page === "article") {
      window.prerenderReady = false;
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    fetch(`https://api.dctiptop.co.uk/api/articles/${articleId}`)
      .then(res => {
        if(!res.ok) throw new Error('Błąd ładowania artykułu');
        return res.json();
      })
      .then(article => {
        document.getElementById('article-title').textContent = article.title;
        document.getElementById('article-image').src = article.imageUrl;
        document.getElementById('article-content').innerHTML = article.content;
          // 1. Title strony
      document.title = article.title + " | Blog&News";

      // 2. Meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if(!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = article.summary || article.title;

      // 3. Open Graph
      function setMetaProperty(property, content) {
        let tag = document.querySelector(`meta[property='${property}']`);
        if(!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      }

      setMetaProperty('og:type', 'article');
      setMetaProperty('og:title', article.title);
      setMetaProperty('og:description', article.summary || article.title);
      setMetaProperty('og:url', window.location.href);
      setMetaProperty('og:image', article.imageUrl);
      setMetaProperty('og:image:alt', article.title);
      setMetaProperty('og:site_name', 'Twój Blog');
      window.prerenderReady = true;
      })
      .catch(err => {
        console.error(err);
        document.getElementById('article-content').innerHTML = 'Nie udało się załadować artykułu.';
        window.prerenderReady = true;
      });
  }
});




// typing mechanism for blog title:
const h1_blog_title = document.querySelector("#blog-title");
document.addEventListener('DOMContentLoaded', function() {
    // Ensure this code only runs on the blog page
    if (document.body.dataset.page === "blog") {

const text_Ttile_Blog = "The Clean Kitchen Chronicles: Insights on Ducts, Ventilation, and Deep Cleaning ";
let index_Text_Blog = 0;
const time_Typing_Blog = 100;
const addLetter = () => {
    h1_blog_title.textContent += text_Ttile_Blog[index_Text_Blog];

    index_Text_Blog++;
    if(index_Text_Blog === text_Ttile_Blog.length){
        clearInterval(interval_ID)
    }
}
// interval_ID = setInterval(addLetter,time_Typing);
if(h1_blog_title){
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasTyped) {
            hasTyped = true;
            h1_blog_title.textContent = ""; // wyczyść nagłówek
            index_Text = 0;
            interval_ID = setInterval(addLetter, time_Typing_Blog);
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.4
});
observer.observe(h1_blog_title);
}else{
//typing after reaching exact section , calling typing function
console.warn("Element h1_blog_title not found.")
}
    }
})