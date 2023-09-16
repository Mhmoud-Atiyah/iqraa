//---------------------------------------------------------
// App's All Constants
//---------------------------------------------------------
const main_view = document.getElementsByClassName("main_view");
const readerView = document.getElementById("readerView");
const top_bt = document.getElementsByClassName("top-option-bt");
const side_bt = document.getElementsByClassName("nav-link");
const readerEntry = document.getElementsByClassName("readerEntry");
const read_bt = document.getElementsByClassName("read_bt")[0];
const wantread_bt = document.getElementsByClassName("wantread_bt");
const book_rate_bt = document.getElementsByClassName("book_rate_bt");
const book_purchase_bt = document.getElementsByClassName("book_purchase_bt");
const Minor_book_purchase_bt = document.getElementsByClassName("Minor_book_purchase_bt");
const book_tag_bt = document.getElementsByClassName("book_tag_bt");
const opneInbrowser_bt = document.getElementsByClassName("opneInbrowser_bt");
const share_bt = document.getElementsByClassName("share_bt");
const setting_bt = document.getElementsByClassName("setting_bt");
const note_edit_bt = document.getElementsByClassName("note_edit_btn");
const search_bt = document.getElementsByClassName("input-group-text")[0];
const searchQuery = document.getElementById("panel-search-input_box");
const book_card = document.getElementsByClassName("book_card");
const store_book_card = document.getElementsByClassName("store_book_card");
const Search_book_card = document.getElementsByClassName("Search_book_card");
const searchResults = document.getElementById("panel-search-results");
const panel_date = document.getElementById("panel-date");
const panel_battery = document.getElementById("panel-battery");
const book_section = document.getElementsByClassName("main_view")[5];
const book_view = {
    view: document.getElementsByClassName("book_view")[0],
    cover: document.getElementById("book_view_cover"),
    title: document.getElementById("book_view_title"),
    pagesCount: document.getElementById("book_view_pagesCount"),
    pubDate: document.getElementById("book_view_pubDate"),
    rating: document.getElementById("book_view_rating"),
    readBt: document.getElementById("book_view_readBt"),
    readNowBt: document.getElementById("book_view_readNowBt"),
    wantreadBt: document.getElementById("book_view_wantreadBt"),
    noteBt: document.getElementById("book_view_noteBt"),
    purchaseBt: document.getElementById("book_view_purchaseBt"),
    authorName: document.getElementById("authorName"),
    authorProfile: document.getElementById("authorProfile"),
    authorBirth: document.getElementById("authorBirth"),
    authorInfo: document.getElementById("authorInfo"),
    bookAbout: document.getElementById("book_viewAbout"),
    bookTags: document.getElementsByClassName("book_tag_bt"),
}
const top_sell_main = document.getElementById("top-sell_main");
const store_view = {
    main: {
        cover: document.getElementById("top-sell_main_img"),
        author: document.getElementById("top-sell_main_author"),
        title: document.getElementById("top-sell_main_title"),
        about: document.getElementById("top-sell_main_about"),
        price: document.getElementById("top-sell_main_price"),
        purchaseBt: document.getElementById("top-sell_main_purchase")
    },
    minor: {
        minorView: document.getElementById("top-sell_minor"),
        cover: document.getElementsByClassName("top-sell_minor_img"),
        author: document.getElementsByClassName("top-sell_minor_author"),
        title: document.getElementsByClassName("top-sell_minor_title"),
        about: document.getElementsByClassName("top-sell_minor_about"),
        price: document.getElementsByClassName("top-sell_minor_price")
    }
}
const mainProgressBar = document.getElementsByClassName("progress-bar")[0];
const currentProgressBar = document.getElementsByClassName("progress-bar")[1];

// 16-bit flag
// 1 == 
// 2 == news
// 3 == store
// 4 == notes
// 5 == reader
var LoadedData = {
    flag: 0,
    getBit: function (position) {
        return (this.flag & (1 << position)) !== 0;
    },
    setBit: function (position) {
        this.flag |= (1 << position);
    },
    binary: function () {
        return this.flag.toString(2);
    }
};

var active_side_bt = 1;
var top_bt_active = 1;
var darkMode = 0;

//---------------------------------------------------------
// Some Misc Functions
//---------------------------------------------------------
/**
 * Converts a number to its Arabic numeral representation.
 *
 * @param {number} number - The number to convert.
 * @returns {string} The Arabic numeral representation of the number.
 */
function convertToArabicNumeral(number) {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const numberString = number.toString();
    let arabicNumber = '';

    for (let i = 0; i < numberString.length; i++) {
        const char = numberString[i];
        if (char === '.') {
            arabicNumber += ',';
        } else {
            const digit = parseInt(char);
            arabicNumber += arabicNumerals[digit];
        }
    }

    return arabicNumber;
}
/**
 * Converts a date to Arabic format.
 *
 * @param {string|Date} date - The date to be converted. It can be a string representation of a date or a Date object.
 * @returns {string} - The formatted date in Arabic format.
 */
function convertToArabicDate(date) {
    const formattedDate = new Intl.DateTimeFormat('ar-EG',
        {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        }).format(new Date(date));
    return formattedDate;
}
/**
 * @brief Get the current time in the format "12 APR - 12:32 AM".
 *
 * @return {string} The current time formatted as "12 APR - 12:32 AM".
 */
function getCurrentTime() {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const date = new Date();

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let period = hours >= 12 ? 'م' : 'ص';

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const formattedTime = `${convertToArabicNumeral(hours)}:${convertToArabicNumeral(minutes)} ${period} | ${convertToArabicNumeral(date.getDate())} ${months[date.getMonth()]}`;

    return formattedTime;
}
/**
 * Adjusts the dimensions of various elements in the application based on the current window size.
 */
function appResize() {
    // some important variabls
    let document_height = window.innerHeight;
    let document_width = window.innerWidth;
    let window_height = window.outerHeight;
    let window_width = window.outerWidth;

    document.body.style.height = document_height + 'px';
    document.body.style.width = document_width + 'px';
    document.getElementById("progress-bar_").style.width = document_width - 280 + 'px';
    document.getElementById("top").style.width = document_width - 280 + 'px';
    document.getElementById("panel").style.height = document_height - 40 + 'px';
    document.getElementById("main").style.height = document_height - 90 + 'px';
    document.getElementById("main").style.width = document_width - 630 + 'px';
    document.getElementById("panel-search-results").style.height = document_height - 300 + 'px';
}
/**
 * @description Main Client Routine To Read Data saved local from server
 *  
 * @param {string} path word of data needed
 * @returns object of data
 */
function getData(path) {
    let obj = fetch(`http://localhost:1999/${path}`, {
        //TODO: Set some flags to gurantee Security
        method: 'GET',
        headers: {
            "Accept": "application/json"
        },
    }).then(response => response.json())
    return obj;
};
//---------------------------------------------------------
// Pre-start Routines
//---------------------------------------------------------
window.onresize = () => {
    appResize();
}
window.onload = () => {
    appResize();
    panel_date.innerText = getCurrentTime();
    //update Time every minute
    setInterval(() => {
        panel_date.innerText = getCurrentTime();
    }, 60000);
    // load Data
    getData("user").then(data => {
        document.getElementById("main-window-profile").src = data.account["profile"];
        document.getElementById("main-window-username").innerText = data.account["username"];
    });
    getData("config").then(data => {
        // Progress Bar Setting
        var progress;
        if (data.booksReadNr == 0) {
            progress = `
        <div class="progress" 
             role="progressbar">
        <div class="progress-bar bg-fail"
             style="width: ${100}%;font-size: 16px">
             سيظهر هنا عدد الكتب التي تقرأها</div>
      </div>`;
        } else {
            progress = `
            <div class="progress"
            role="progressbar">
        <div class="progress-bar bg-fail"
        style="width: ${((data.booksReadNr / data.booksNrYear) * 100)}%; font-size: 16px">
        قرأت ${convertToArabicNumeral(data.booksReadNr)} من ${convertToArabicNumeral(data.booksNrYear)} كتاب</div>
        </div>`;
        }
        document.getElementById("progress-bar_").innerHTML = progress;
        // Dark Mode Setting
        if (data.darkMode) {
            document.querySelector("body").setAttribute('data-bs-theme', "dark");
        }
        // Status bar
        if (data.status) {
            document.getElementById("panel-date").style.display = " "
        } else {
            document.getElementById("panel-date").style.display = "none"
        }
    });
    getData("bookList").then(data => {
        let read_section = data["read"];
        let current_section = data["current"];
        // load read books to main view
        for (const key in read_section) {
            let id = key;
            //TODO: retrieve json data from file
            getData(`openBookData/${id}`).then(data => {
                bookCard(main_view[0], data, "read");
            }).then(() => {
                let book_card = document.getElementsByClassName('read_book_card');
                for (let index = 0; index < book_card.length; index++) {
                    book_card[index].addEventListener('click', () => {
                        main_view[(active_side_bt - 1)].style.display = "none";
                        book_view.view.style.display = "";
                        let path = book_card[index].getAttribute("data-path");
                        getData(`openBookData/${path}`).then(data => {
                            loadBookDataPage(data);
                        });
                    });
                }
            });;
        };
        // load want books to side panel
        for (const key in current_section) {
            let id = key;
            //TODO: retrieve json data from file
            getData(`openBookData/${id}`).then(data => {
                CurrentBookBlock(document.getElementById("panel_current"), data);
            }).then(() => {
                let book_card = document.getElementsByClassName('current_book_card');
                for (let index = 0; index < book_card.length; index++) {
                    book_card[index].addEventListener('click', () => {
                        main_view[(active_side_bt - 1)].style.display = "none";
                        book_view.view.style.display = "";
                        let path = book_card[index].getAttribute("data-path");
                        getData(`openBookData/${path}`).then(data => {
                            loadBookDataPage(data);
                        });
                    });
                }
            });;
        };
    });
}
//---------------------------------------------------------
// Elements Event listener
//---------------------------------------------------------
// Top buttons
for (let index = 0; index < top_bt.length; index++) {
    top_bt[index].addEventListener('click', () => {
        if (top_bt_active > 0) {
            top_bt[(top_bt_active - 1)].className = "top-option-bt btn btn-outline-primary ms-1";
            main_view[(active_side_bt - 1)].style.display = "none";
        };
        top_bt[index].className = "top-option-bt btn btn-outline-primary ms-1 active";
        top_bt_active = index + 1;
        loadBookMainSection(index);
    })
};
// Side buttons
for (let index = 0; index < side_bt.length; index++) {
    side_bt[index].addEventListener('click', () => {
        if (active_side_bt > 0) {
            side_opt_on(index);
        };
    })
};
// General function applied to all Side buttons
function side_opt_on(index) {
    if (!index) {
        document.getElementById("top").style.display = "";
    } else {
        document.getElementById("top").style.display = "none";
    }
    book_view.view.style.display = "none";
    main_view[(active_side_bt - 1)].style.display = "none";
    main_view[index].style.display = "";
    side_bt[(active_side_bt - 1)].className = "nav-link link-body-emphasis";
    side_bt[index].className = "nav-link active";
    book_section.style.display = "none";
    active_side_bt = index + 1;
};
//---------------------------------------------------------
// HTML Elements Creator
//---------------------------------------------------------
/**
 * Creates a book card element and appends it to the specified element.
 *
 * @param {HTMLElement} elem - The element to which the book card will be appended.
 * @param {Object} bookData - The data object containing information about the book.
 * @param {string} bookData.linkSrc - The link source of the book.
 * @param {string} bookData.Img - The image source of the book.
 * @param {string} bookData.title - The title of the book.
 * @param {string} bookData.about - Information about the book.
 * @param {string} bookData.author - The author of the book.
 * @param {string} bookData.pubDate - The publication date of the book.
 */
function bookCard(elem, bookData, section) {
    let div = document.createElement("div");
    div.setAttribute("data-path", `${bookData.id}`);
    div.className = `book_card col ${section}_book_card`;
    div.innerHTML = `
        <div class="card shadow-sm">
          <img
            src="${bookData.coverSrc}"
            width="100%" height="225" aria-label="Placeholder: صورة مصغرة" title="${bookData.title}">
          <div class="card-body">
            <p class="card-text">${bookData.about}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
                <button type="button" class="btn btn-sm btn-outline-secondary">${bookData.author.name}</button>
              </div>
              <small class="text-body-secondary">${bookData.pubDate}</small>
            </div>
          </div>
        </div>
    `;
    elem.append(div);
};
/**
 * @function loadBookDataPage
 * @param {*} path the link contains the data of book
 * @description load the main book viewer with specific data
 */
function loadBookDataPage(bookData) {
    book_view.cover.src = bookData.coverSrc;
    book_view.title.innerHTML = bookData.title;
    //TODO: pubDate
    //book_view.pubDate.innerHTML = convertToArabicNumeral(bookData.pubDate)
    book_view.pagesCount.innerHTML = convertToArabicNumeral(bookData.pagesCount.split(" ")[0]) + " صفحة ";
    book_view.rating.innerHTML = " تقييم " + convertToArabicNumeral(bookData.rating);
    //---------------------------------------------------------
    // set button data
    //---------------------------------------------------------
    //1. Already read
    book_view.readBt.setAttribute("data-path", bookData.id);
    book_view.readBt.setAttribute("data-title", bookData.title);
    //2. Reader
    book_view.readNowBt.setAttribute("data-path", bookData.readPath);
    book_view.readNowBt.setAttribute("data-title", bookData.title);
    book_view.readNowBt.setAttribute("data-img", bookData.coverSrc);
    book_view.readNowBt.setAttribute("data-info", bookData.about.slice(0, 100));
    //3. Want to read
    book_view.wantreadBt.setAttribute("data-path", bookData.id);
    book_view.wantreadBt.setAttribute("data-title", bookData.title);
    //4. note
    book_view.noteBt.setAttribute("data-path", bookData.id);
    book_view.noteBt.setAttribute("data-title", bookData.title);
    //5. purchase
    book_view.purchaseBt.setAttribute("data-path", bookData.purchasePath);
    //set author data
    book_view.authorName.innerHTML = bookData.author.name;
    book_view.authorProfile.src = bookData.author.profile;
    book_view.authorBirth.innerHTML = bookData.author.birth;
    book_view.authorInfo.innerHTML = bookData.author.info;
    // set book about data
    book_view.bookAbout.innerHTML = bookData.about;
    // set tags
    for (let index = 0; index < book_view.bookTags.length; index++) {
        const element = book_view.bookTags[index];
        element.setAttribute("data-path", bookData.tags[index]);
        element.innerText = bookData.tags[index];
    }
}
function CurrentBookBlock(elem, bookData) {
    let div = document.createElement('div');
    div.id = "current-book";
    div.className = 'current_book_card';
    div.setAttribute("data-path", bookData.id);
    div.innerHTML = `
    <div class="panel-progress">
      <div class="progress" role="progressbar" aria-label="Reading progress" aria-valuenow="25" aria-valuemin="0"
        aria-valuemax="100">
        <div class="progress-bar bg-fail" style="width: ${66}%">قرأت %${convertToArabicNumeral(66)}</div>
      </div>
    </div>
    <div class="panel-current container">
      <div class="row align-items-center book_card">
        <img src="${bookData.coverSrc}" class="col mt-3 rounded" height="120" width="120">
        <div class="panel-current-data col pt-4">
          <p>${bookData.title}</p>
          <p>${bookData.author.name}</p>
          <p>${convertToArabicNumeral(bookData.rating)}</p>
        </div>
      </div>
    </div>
    <hr>
  `;
    elem.append(div);
};
function __loadBookMainSection(section) {
    main_view[0].innerHTML = " ";
    main_view[0].style.display = "";
    side_opt_on(0);
    getData("bookList").then(data => {
        let obj = data[`${section}`];
        // load read books to main view
        for (const key in obj) {
            let id = key;
            getData(`openBookData/${id}`)
                .then(data => {
                    bookCard(main_view[0], data, section);
                })
                .then(() => {
                    let book_card = document.getElementsByClassName(`${section}_book_card`)[0];
                    book_card.addEventListener('click', () => {
                        main_view[(active_side_bt - 1)].style.display = "none";
                        book_view.view.style.display = "";
                        let path = book_card.getAttribute("data-path");
                        getData(`openBookData/${path}`).then(data => {
                            loadBookDataPage(data);
                        });
                    });
                });
        };
    });
}
function loadBookMainSection(index) {
    switch (index) {
        case 0:
            __loadBookMainSection("read");
            break;
        case 1:
            __loadBookMainSection("want");
            break;
        case 2:
            __loadBookMainSection("best");
            break;
        default:
            break;
    }
}
function newsBlock(elem, newsElementData) {
    for (let index = 0; index < newsElementData.length; index++) {
        let box = `
        <div class="card-body">
        <div class="row gx-5">
      <div class="col-md-4 mb-2">
      <div class="bg-image hover-overlay ripple shadow-2-strong rounded-5" data-mdb-ripple-color="light">
          <img style="height: 250px;width: 300px;" src="${newsElementData[index].ImageSrc}" class="img-fluid rounded" />
        </div>
      </div>
      <div class="col-md-6 mb-4">
        <span class="badge bg-danger px-2 py-1 shadow-1-strong mb-3">${newsElementData[index].Date}</span>
        <h4><strong>${newsElementData[index].Title}</strong></h4>
        <p class="text-muted">${newsElementData[index].info}</p>
        <a href="${newsElementData[index].link}" target="__blank" class="btn btn-primary">أكمل القراءة</a>
      </div>
      </div>
      </div>
      `;
        let container = document.createElement("div");
        container.innerHTML = box;
        elem.append(container);
    }
};
function __laodStoreData(elem, bookData) {
    let div = document.createElement("div");
    div.className = "store_book_card col-md-3 col-sm-6";
    let __ = `
          <div class="product-grid">
            <div class="product-image">
              <a href="#" class="image" >
              <button type="button" class="Minor_book_purchase_bt btn btn-primary position-absolute top-0 start-0"
              data-path="${bookData.purchaseLink}">شراء</button>
              <img class="top-sell_minor_img"
              src="${bookData.ImageSrc}">
              </a>
            </div>
            <div class="product-content">
              <h3 class="title"><a href="#" class="top-sell_minor_title">${bookData.title}</a></h3>
              <h3 class="title"><a href="#" class="top-sell_minor_author">${bookData.author}</a></h3>
              <div style="text-align: center;" class="price">
                <span class="top-sell_minor_price">${convertToArabicNumeral(bookData.price)}</span>جم
              </div>
          </div>
        </div>
    `;
    div.innerHTML = __;
    elem.append(div);
}
function laodStoreData(elem, storeData) {
    for (var src in storeData) {
        if (storeData.hasOwnProperty(src)) {
            if (src == "main") {
                continue;
            }
            storeData[src].forEach(book => {
                __laodStoreData(elem, book);
            });
        }
    }
    // Add Event listener for Purchasing
    for (let index = 0; index < Minor_book_purchase_bt.length; index++) {
        Minor_book_purchase_bt[index].addEventListener('click', () => {
            window.open(Minor_book_purchase_bt[index].getAttribute("data-path"));
        });
    }
};
function noteCard(elem, noteData) {
    let _notes = document.createElement("div");
    _notes.className = "card-body";
    _notes.innerHTML = `
    <div class="row gx-5">
          <div class="col-md-4 mb-4">
            <div class="bg-image hover-overlay ripple shadow-2-strong rounded-5"
              data-mdb-ripple-color="light">
              <img style="height: 300px;width: 300px;" src="${noteData.cover}" class="img-fluid note_book_card" data-path="${noteData.id}"/>
            </div>
          </div>
          <div id="${noteData.id}" class="col-md-8 mb-4">
            <h4><strong>
            ${noteData.title}
            <span class="text-body-secondary">
            &nbsp;(${noteData.author})
            </span>
            </strong></h4>
          <!--Notes Here-->
          </div>
    </div>`;
    elem.append(_notes)
};
function __noteCard(elem, noteData, id) {
    let note = document.createElement("div");
    note.className = "card note_card text-right mb-2";
    note.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">
        ${noteData.quotation}
      <p class="card-text text-body-secondary pt-3 pb-2" style="font-size: 18px;">
      ${noteData.comment}
      </p>
      <a data-path="${id}" class="note_delte_bt btn btn-danger btn-sm">
      حذف
      &nbsp;<i class="fa-regular fa-trash-can"></i>
      </a>
      <a data-path="${id}" class="note_edit_btn btn btn-primary btn-sm float-start ms-2">
      تعديل
      &nbsp;<i class="fa-regular fa-pen-to-square"></i>
      </a>
      <a data-path="${id}" class="note_share_bt btn btn-primary btn-sm float-start ms-2">
      مشاركة
      &nbsp;<i class="fa-regular fa-share-from-square"></i>
      </a>
    </div>
    <div class="card-footer text-muted">
      اخر تعديل :${convertToArabicDate(noteData.lastEdit)}
      <div class="float-start">صفحة : ${convertToArabicNumeral(noteData.location)}</div>
    </div>
  `;
    elem.append(note);
};
function __readerEntry(elem, readerEntrytData) {
    let box = document.createElement("div");
    box.className = "readerEntry d-flex text-body-secondary pt-3"
    box.setAttribute("data-path", `${readerEntrytData.path}`);
    box.setAttribute("data-title", `${readerEntrytData.title}`);
    box.setAttribute("data-img", `${readerEntrytData.imgSrc}`);
    box.setAttribute("data-info", `${readerEntrytData.info}"`);
    box.innerHTML = `
    <img src="${readerEntrytData.imgSrc}"
    style="margin-left: 15px;cursor:pointer;" height="32" width="32"
    title="${readerEntrytData.title}"
    alt="${readerEntrytData.title}">
    <p class="small lh-sm border-bottom">
    <strong class="d-block text-gray-dark" style="cursor:pointer;">${readerEntrytData.title}</strong>
    ${readerEntrytData.info}
    </p>
    `;
    elem.append(box);
}
function search_query(elem, QueryBookData) {
    let query_container = document.createElement("div");
    let query_img = document.createElement("img");
    let query_info = document.createElement("p");
    let query_author = document.createElement("p");
    let query_info_ = document.createElement("strong");
    query_container.className = "Search_book_card d-flex text-body-secondary pt-2";
    query_container.dataset.path = QueryBookData["src"];
    query_info.className = "pb-3 mb-0 small lh-sm"
    query_author.className = "pb-3 mb-0 small lh-sm border-bottom text-success"
    query_info_.className = "d-block text-primary";
    query_img.src = QueryBookData["ImageSrc"];
    query_img.style.height = "64px";
    query_img.style.width = "64px";
    query_img.style.marginLeft = "10px"
    query_img.alt = QueryBookData["Title"];
    query_info_.innerText = QueryBookData["Author"];
    query_info.innerText += QueryBookData["Title"];
    query_author.innerText += QueryBookData["Author"];
    query_info.append(query_info_);
    query_info.append(query_author);
    query_container.append(query_img, query_info);
    elem.append(query_container);
}
//---------------------------------------------------------
// Main App Section Related Routines
//---------------------------------------------------------
// News Button
side_bt[1].addEventListener("click", () => {
    if (!LoadedData.getBit(2)) {
        getData("news").then(data => {
            newsBlock(main_view[1], data["youm-7"]);
            newsBlock(main_view[1], data["aawsat"]);
            LoadedData.setBit(2);
        });
    }
})
// Store Button
side_bt[2].addEventListener("click", () => {
    store_view.minor.minorView.innerHTML = " ";
    getData("store").then(data => {
        store_view.main.cover.src = `${data.main.ImageSrc}`;
        store_view.main.title.innerHTML = `${data.main.title}`;
        store_view.main.author.innerText = `${data.main.author}`;
        store_view.main.price.innerHTML = `${convertToArabicNumeral(data.main.price)}`;
        store_view.main.about.innerHTML = `${data.main.about}`;
        store_view.main.purchaseBt.setAttribute("data-path", `${data.main.purchaseLink}`);
        laodStoreData(store_view.minor.minorView, data);
    });
})
// Notes Button
side_bt[3].addEventListener("click", () => {
    if (!LoadedData.getBit(4)) {
        getData("noteTable").then(data => {
            for (const bookId in data) {
                getData(`readNote/${bookId}`).then(data => {
                    noteCard(main_view[3], data);
                    data["notes"].forEach(note => {
                        __noteCard(document.getElementById(`${data.id}`), note, data.id);
                    });
                    // set 4th bit "data laoded once"
                    LoadedData.setBit(4);
                }).then(() => {
                    let note_book_card = document.getElementsByClassName("note_book_card");
                    // Book Card Event Listener
                    for (let index = 0; index < note_book_card.length; index++) {
                        note_book_card[index].addEventListener('click', () => {
                            main_view[(active_side_bt - 1)].style.display = "none";
                            book_view.view.style.display = "";
                            let path = note_book_card[index].getAttribute("data-path");
                            getData(`openBookData/${path}`).then(data => {
                                loadBookDataPage(data);
                            })
                        });
                    }
                    //---------------------------------------------------------
                    // Top Buttons Event Listeners
                    //---------------------------------------------------------
                    // 1. Add Note
                    document.getElementsByClassName("note-option-add")[0].addEventListener("click", async () => {
                        const sendNoteid = await window.noteInterface.sendId(`1999|--|${book_view.noteBt.getAttribute("data-title")}`);
                    })
                    // 2. View

                    //---------------------------------------------------------
                    // Note's Buttons Event Listeners
                    //---------------------------------------------------------
                    //1. Delete Button
                    let note_delte_bt = document.getElementsByClassName("note_delte_bt");
                    for (let index = 0; index < note_delte_bt.length; index++) {
                        note_delte_bt[index].addEventListener('click', () => {
                            let id = note_delte_bt[index].getAttribute("data-path");
                            document.getElementsByClassName("note_card")[index].style.display = "none";
                            getData(`deleteNote/${id}/${index}`);
                        });
                    }
                    // TODO: note_share_btn
                    // the form of share window and all this related staff
                    //2. Share Button

                    //3. Edit Button
                    for (let index = 0; index < note_edit_bt.length; index++) {
                        note_edit_bt[index].addEventListener('click', async () => {
                            let id = note_edit_bt[index].getAttribute("data-path");
                            const sendNoteid = await window.noteInterface.sendId(`${index}|--|${id}`);
                        });
                    }
                });
            };
        })
    };
})
// Reader Button
side_bt[4].addEventListener("click", () => {
    readerView.innerHTML = "";
    getData("lastOpen").then(data => {
        for (let index = 0; index < data.length; index++) {
            __readerEntry(readerView, data[index]);
        }
    }).then(() => {
        // Add Event listener for reading
        for (let index = 0; index < readerEntry.length; index++) {
            readerEntry[index].addEventListener("click", () => {
                let path = readerEntry[index].getAttribute("data-path");
                let img = readerEntry[index].getAttribute("data-img");
                let title = readerEntry[index].getAttribute("data-title");
                let info = readerEntry[index].getAttribute("data-info");
                window.readerInterface.sendToReader([path, img, title, info]);
            });
        }
    }
    );
})
//---------------------------------------------------------
// Book View's Buttons Event Handlers
//---------------------------------------------------------
// 0. I've read the book
book_view.readBt.addEventListener("click", () => {
    getData(`editTable/read/${book_view.readBt.getAttribute("data-path")}/${book_view.readBt.getAttribute("data-title")}`);
})
// 2. Want to Read the book
book_view.wantreadBt.addEventListener("click", () => {
    getData(`editTable/want/${book_view.wantreadBt.getAttribute("data-path")}/${book_view.wantreadBt.getAttribute("data-title")}`);
})
// 3. comment on the the book
book_view.noteBt.addEventListener("click", () => {
    window.noteInterface.sendId(`${book_view.noteBt.getAttribute("data-path")}|--|${book_view.noteBt.getAttribute("data-title")}`);
})
// 4. purchase the the book
book_view.purchaseBt.addEventListener("click", () => {
    window.open(book_view.purchaseBt.getAttribute("data-path"));
})
// 5. Read the book now
book_view.readNowBt.addEventListener("click", () => {
    let path = book_view.readNowBt.getAttribute("data-path");
    let img = book_view.readNowBt.getAttribute("data-img");
    let title = book_view.readNowBt.getAttribute("data-title");
    let info = book_view.readNowBt.getAttribute("data-info");
    window.readerInterface.sendToReader([path, img, title, info]);
});

//---------------------------------------------------------
// App's Setting buttons  Related Routines
//---------------------------------------------------------
// Dark mode
setting_bt[0].addEventListener('click', () => {
    if (setting_bt[0].firstElementChild.className.includes("fa-moon")) {
        setting_bt[0].firstElementChild.className = "fa-regular fa-sun"
        document.querySelector("body").setAttribute('data-bs-theme', "dark");
        getData(`configEdit|--|darkMode|--|true`);
        darkMode = 1;
    } else {
        setting_bt[0].firstElementChild.className = "fa-solid fa-moon"
        document.querySelector("body").setAttribute('data-bs-theme', "light");
        getData(`configEdit|--|darkMode|--|false`);
        darkMode = 0;
    }
}
);
// setting_bt
setting_bt[1].addEventListener("click", async () => {
    let data = "";
    const Open = await window.settingsInterface.Open(data);

}
);
// profile_bt
setting_bt[2].addEventListener("click", async () => {
    let data = "";
    const Open = await window.profileInterface.Open(data);
}
);
// Support_bt
setting_bt[3].addEventListener("click", () => {
});
//---------------------------------------------------------
// Gneral App's Buttons Handlers
//---------------------------------------------------------
// book_tag_bt
for (let index = 0; index < book_tag_bt.length; index++) {
    book_tag_bt[index].addEventListener('click', () => {
        //TODO: book_tag_bt book staff
    });
}
// Already read book button
read_bt.addEventListener('click', () => {
    let id = read_bt.getAttribute("data-path");
    let name = read_bt.getAttribute("data-title");

});
// want read book button
for (let index = 0; index < wantread_bt.length; index++) {
    wantread_bt[index].addEventListener('click', () => {
        //TODO: add this book to want to read
    });
}
//---------------------------------------------------------
// Searching Work
//---------------------------------------------------------
search_bt.addEventListener("click", () => {
    let query_seed = searchQuery.value;
    //    searchResults.innerText = "";
    document.getElementById("panel-search-results").style.display = "block";
    getData(`searchBook/${query_seed}`).then(data => {
        document.getElementById("Search-spinner").style.display = "none";
        document.getElementById("Search-spinner_").style.display = "none";
        const Data = data.querys; // Array of Objects contain data
        // Display search results entries
        for (let index = 0; index < Data.length; index++) {
            search_query(searchResults, Data[index]);
        };
        // entry event listener
        for (let index = 0; index < Search_book_card.length; index++) {
            Search_book_card[index].addEventListener('click', () => {
                main_view[(active_side_bt - 1)].style.display = "none";
                book_view.view.style.display = "";
                let bookLink = Search_book_card[index].getAttribute("data-path");
                getData(`retrieveBookData/${bookLink}|--|${query_seed}`).then((res) => {
                    getData(`openBookData/${res.id}`).then(data => {
                        loadBookDataPage(data, `${res.id}`);
                    });
                });
            });
        }
    })
});