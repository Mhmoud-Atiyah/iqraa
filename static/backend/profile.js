const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const img_ = document.getElementById("profile-img");
const name_ = document.getElementById("profile-name");
const job = document.getElementById("profile-job");
const location_ = document.getElementById("profile-location");
const birth = document.getElementById("profile-birth");
const google = document.getElementById("profile-google");
const goodreads = document.getElementById("profile-goodreads");
const kindle = document.getElementById("profile-kindle");
const fullname = document.getElementById("profile-fullname");
const username = document.getElementById("profile-username");
const account = document.getElementById("profile-account");
const phone = document.getElementById("profile-phone");
const location2 = document.getElementById("profile-location-");
const interests = document.getElementById("profile-interests");
const favourite = document.getElementById("profile-favourite");
/**
 * @description Main Client Routine To Read Data saved local from server
 *  
 * @param {string} path word of data needed
 * @returns object of data
 */
//TODO: create Separate file for this function
function getData(path){
    let obj = fetch(`http://localhost:1999/${path}`,{
     //TODO: Set some flags to gurantee Security
     method: 'GET',
     headers: {
         "Accept": "application/json"
     },
    }).then(response => response.json())
    return obj;
}

window.onload = () => {
    const user = getData("user").then(data => {
        document.title = data[0]['account'].username;
        img_.src = data[0]["account"].profile;
        name_.innerText = data[0]["account"].username;
        location_.innerText = ( data[0]["location"].State+ " - "  +
                                data[0]["location"].Country);
        birth.innerText = data[0]["user"].dateOfbirth_day+ " "  + 
                            data[0]["user"].dateOfbirth_month+ " "  + 
                            data[0]["user"].dateOfbirth_year;
        fullname.innerText = data[0]['user'].firstName + " " +
                             data[0]['user'].lasttName;
        username.innerText = data[0]['account'].username;
        account.innerText = data[0]['account'].accountName;
        phone.innerText = data[0]['connection'].Number;
        location2.innerText = ( data[0]["location"].State+ " - "  +
                                data[0]["location"].Country);
        for (let index = 0; index < data[0]["user"].interests.length; index++) {
            let li = document.createElement("li");
            li.className = "list-group-item list-group-item-primary mb-2 rounded";
            li.style.textAlign = "center";
            li.innerText = `${data[0]["user"].interests[index]}`;
            interests.append(li)
        };
        for (let index = 0; index < data[0]["user"].booksWanted.length; index++) {
            let li = document.createElement("li");
            li.className = "list-group-item list-group-item-primary mb-2 rounded";
            li.style.textAlign = "center";
            li.innerText = `${data[0]["user"].booksWanted[index]}`;
            favourite.append(li)
        };
    })
    const config = getData("config").then(data => {
        if (data[0].darkMode) {
            document.querySelector("body").setAttribute('data-bs-theme', "dark");
        }
    });
}

editBtn.addEventListener("click",()=>{
    //TODO: edit staff to global var
    editBtn.style.display = "none";
    saveBtn.style.display = "";
})
saveBtn.addEventListener("click",()=>{
    // let data = window.globalVar;
    let data = "Data Edited";
    window.profileEditInterface.edit(data);
})