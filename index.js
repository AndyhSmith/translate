
let data = {
    books: [
        {
            name: "LOTR The Fellowship of The Ring",
            path: "lotr1.txt"
        },
        {
            name: "LOTR The Two Towers",
            path: "lotr2.txt"
        },
        {
            name: "LOTR The Return Of The King",
            path: "lotr3.txt"
        },
        {
            name: "Harry Potter Book 1",
            path: "hp1.txt"
        },
        {
            name: "Game Of Thrones",
            path: "got1.txt"
        },
        
    ]
}

languages = {
}

if (localStorage.getItem('languages') == undefined) {
    localStorage.setItem('languages', JSON.stringify(languages));
    console.log("Entered!")
}
else {
    languages = JSON.parse(localStorage.getItem('languages'));
    console.log("loaded save")
}

let url = "http://localhost:8000/texts/"

function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
};

function getText(text){
    // read text from URL location
    var request = new XMLHttpRequest();
    request.open('GET', url + text, true);
    request.send(null);
    request.onreadystatechange = function () {
        selectedText = request.response
        txtToArray()
        pageDOM()
    }
}


function txtToArray() {
    selectedText = selectedText.replace(/\n/g, "~");
    splitText = selectedText.split(/([^a-zA-Z])/g)
    for (let i in splitText) {
        splitText[i] = splitText[i].replace("~", "<br><br>")
    }
    paginator.numberOfPages = Math.floor(splitText.length / 1000)
    paginator.currentPage = 0
}


function pageDOM() {
    if (selDict == null) {
        document.getElementById("app-content").innerHTML = "Please select a dictionary or create a new one.";

        return
    }


    let content = ""
    
    let lastPageSize = splitText.length - (paginator.pageSize * paginator.numberOfPages);
    
    let size = paginator.pageSize
    if (paginator.currentPage == paginator.numberOfPages) {
        size = lastPageSize
        console.log(lastPageSize)
    }

    for (let i = 0; i < size; i++) {
        
        let word = splitText[i + paginator.currentPage * paginator.pageSize]
        let savedWord = splitText[i + paginator.currentPage * paginator.pageSize]
        // console.log(word)
        content += "<span class='"
        if(languages[selDict].hasOwnProperty(word.toLowerCase())) {          
            word = languages[selDict][word.toLowerCase()]
            content += "translated-word ht'>"
        } else {
            content += "english-word ht' onclick='clickedEnglishWord(\"" + word.toLowerCase() + "\")'>"
        }
        content += word 
        if(languages[selDict].hasOwnProperty(savedWord.toLowerCase())) {    
            content += " <span class='tooltip'  onclick='removeTranslatedWord(\"" + savedWord.toLowerCase() + "\")'>" + savedWord + "</span>"     
        } else {
            

        }
        content += " </span>"

    }

    document.getElementById("app-content").innerHTML = content;
    document.getElementById("paginator").innerHTML = "<button onclick='previousPage()'> Previous</button> " + paginator.currentPage + "/" + paginator.numberOfPages + " <button onclick='nextPage()'> Next</button>"; 
}

function nextPage() {
    if (paginator.currentPage < paginator.numberOfPages) {
        paginator.currentPage += 1
        pageDOM()
    }
}

function previousPage() {
    if (paginator.currentPage > 0) {
        paginator.currentPage -= 1
        pageDOM()
    }
    
}

function removeTranslatedWord(word) {
    if (confirm("Are you sure you want to remove the translation for '" + word + "'?")) {
        delete languages[selDict][word]; 
        pageDOM()
        localStorage.setItem('languages', JSON.stringify(languages));
    }
    
}

function clickedEnglishWord(word) {
    word = word.toLowerCase()
    translation = prompt("Translation for '" + word + "':")
    if (translation != null && translation != "") {
        languages[selDict][word] = translation
        pageDOM()
        localStorage.setItem('languages', JSON.stringify(languages));
    }
    
} 

function textOptionDOMS() {
    let content = ""
    for (let i in data.books) {
        content += "<button onclick='getText(\"" + data.books[i].path + "\")'>" + data.books[i].name + "</button>"
    }
    document.getElementById("text-options").innerHTML = content;
}

function goToTargetPage() {
    let targetPageUnverified = document.getElementById("target-page").value
    document.getElementById("target-page").value = ""
    if (targetPageUnverified <= paginator.numberOfPages) {
        paginator.currentPage = targetPageUnverified
        pageDOM()
    }
}

function selectDOM() {
    let content = ""
    content += '<select name="Language" id="language-select" onchange="selectLanguage()">'
    content += '<option value="">--Please choose an option--</option>'

    for (let i in languages) {
        console.log(i)
        content += '<option value="' + i + '">' + i + '</option>'
    }

    content += "</select>"
    document.getElementById("selector-container").innerHTML = content
}

function selectLanguage() {
    selDict = document.getElementById('language-select').value
    document.getElementById('selected-language').innerHTML = "Using " + selDict + " Dictionary."
    pageDOM()
}

function createDictionary() {
    let newDict = document.getElementById('new-dictionary-name').value
    if (newDict != "" && newDict != null) {
        document.getElementById('new-dictionary-name').value = ""
        
        languages[newDict] = {}
        selDict = null
        selectDOM()
        localStorage.setItem('languages', JSON.stringify(languages));
    } 
}

let selDict = null;
let selectedText = getText(data.books[0].path)

let splitText = []

paginator = {
    numberOfPages: 0,
    pageSize: 1000,
    currentPage: 0
}

selectDOM()
textOptionDOMS()


