const controlBt = document.getElementsByClassName("form-control");
const selectBt = document.getElementsByClassName("form-select");
const configSwitch = document.getElementsByClassName("form-check-input");
const socialBt = document.getElementsByClassName("social-btn");

// SOME SPEICAL DEFINE
const max = 1000; // maximum number of users
const min = 1;// minimum number of users

var user_Data =
{
    "id": "",
    "account": {
        "username": "",
        "accountName": "",
        "profile": "",
        "password": ""
    },
    "user": {
        "firstName": "",
        "lasttName": "",
        "dateOfbirth_day": "",
        "dateOfbirth_month": "",
        "dateOfbirth_year": "",
        "gender": "",
        "about": "",
        "interests": [],
        "favouriteBooks": [],
    },
    "location": {
        "City": "",
        "State": "",
        "Country": ""
    },
    "connection": {
        "google": "",
        "goodreads": "",
        "kindle": "",
        "Number": 0,
    },
    "privacy": {

    },
    "purchase": {

    },
    "booksData": {
        "read": {

        }
    }

};
var user_Config = {
    "darkMode": false,
    "status": true,
    "language": "",
    "booksReadNr": "",
    "booksNrYear": ""
};
// help function
function getSelectValues(select) {
    var selected = [];
    for (var option of select.options) {
        if (option.selected) {
            selected.push(option.value);
        }
    }
    return selected;
}
// Load Data
window.onload = () => {
    fetch('backend/installData.json')
        .then(response => response.json())
        .then(data => {
            let location = data["location"];
            let genres = data["genres"];
            let interests = data["interests"];
            Object.keys(location).forEach(country => {
                let opt = document.createElement("option");
                opt.innerText = country;
                selectBt[4].append(opt);
            });
            selectBt[4].addEventListener("input", () => {
                selectBt[5].innerHTML = ""
                Object.entries(location).forEach(([country_key, city]) => {
                    if (country_key === selectBt[4].value) {
                        for (let index = 0; index < city.length; index++) {
                            let opt = document.createElement("option");
                            opt.innerText = city[index];
                            selectBt[5].append(opt);
                        }
                    }
                });
            })
            for (let index = 0; index < genres.length; index++) {
                let opt = document.createElement("option");
                opt.innerText = genres[index];
                selectBt[6].append(opt);
            }
            for (let index = 0; index < interests.length; index++) {
                let opt = document.createElement("option");
                opt.innerText = interests[index];
                selectBt[7].append(opt);
            }
        })
        .catch(error => {
            console.error(error);
        });
}
// Assure Two passwords identical
controlBt[5].addEventListener('change', () => {
    if (controlBt[5].value !== controlBt[4].value) {
        controlBt[4].style.border = controlBt[5].style.border = "solid red 1px";
        controlBt[4].title = controlBt[5].title = "كلمات المرور غير متطابقة"
    } else {
        controlBt[4].style.border = controlBt[5].style.border = "";
    };
});
// Assure only phone numbers accepted
controlBt[7].addEventListener('change', () => {
    controlBt[7].style.direction = "ltr";
    const phoneRegex = /^\d{11}$/; // Regex pattern for a 10-digit phone number

    if (phoneRegex.test(controlBt[7].value)) {
        controlBt[7].style.border = "";
    } else {
        controlBt[7].style.border = "solid red 1px";
        controlBt[7].title = "البيانات غير صحيحة"
    }
});
//TODO: Fill user config by data
document.getElementById("login-window").addEventListener('click', async () => {
    // check if required values exist
    if (controlBt[0].value === "" // firstName
        || controlBt[1].value === "" // lastName
        || controlBt[2].value === "" // username
        || controlBt[3].value === "" // profile
        || controlBt[4].value === "" // password
        || selectBt[0].value === "" // day
        || selectBt[1].value === "" // month
        || selectBt[2].value === "" // year
        || selectBt[3].value === "" // gender
    ) {
        window.alert("\nاملاء البيانات المطلوبة أولاً \n")
        return;
    }
    user_Data.id = `${Math.floor(Math.random() * (max - min) + min)}`;
    // first name
    user_Data.user.firstName = controlBt[0].value;
    // last name
    user_Data.user.lasttName = controlBt[1].value;
    // day
    user_Data.user.dateOfbirth_day = selectBt[0].value;
    // month
    user_Data.user.dateOfbirth_month = selectBt[1].value;
    // year
    user_Data.user.dateOfbirth_year = selectBt[2].value;
    // gender
    user_Data.user.gender = selectBt[3].value;
    // username
    user_Data.account.username = controlBt[2].value;
    // profile
    user_Data.account.profile = controlBt[3].files[0].path;
    // account
    if (controlBt[6].value === "") {
        user_Data.account.accountName = controlBt[2].value + "@iqraa.com";
    } else {
        user_Data.account.accountName = controlBt[6].value;
    }
    // password
    user_Data.account.password = controlBt[4].value;
    /**
     * connections
    */
    // google
    //user_Data.connection.google = socialBt[1].value;
    user_Data.connection.google = "Future!";
    // goodreads
    //user_Data.connection.goodreads = socialBt[0].value;
    user_Data.connection.goodreads = "Future!";
    // kindle
    //user_Data.connection.kindle = socialBt[2].value;
    user_Data.connection.kindle = "Future!";
    // phone
    user_Data.connection.Number = "Future!";
    /**
     * location
    */
    // Country
    user_Data.location.Country = selectBt[4].value;
    // State
    user_Data.location.State = selectBt[5].value;
    // about
    user_Data.user.about = controlBt[8].value;
    // favourite genres
    user_Data.user.favouriteBooks = getSelectValues(selectBt[6]);
    // interests
    user_Data.user.interests = getSelectValues(selectBt[7]);

    // purchase options ==> Future Plan!

    // Dark Mode Option
    user_Config.darkMode = configSwitch[0].checked;
    // status Option
    user_Config.status = configSwitch[1].checked;
    // Language Option
    user_Config.language = selectBt[8].value;
    // booksNrYear option
    user_Config.booksNrYear = controlBt[9].value;

    let data = [user_Data, user_Config];
    const CloseWindow = await window.installInterface.closeWindow(data);
})