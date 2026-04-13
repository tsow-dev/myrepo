async function searchBooks() {
    var bookInput = document.getElementById("bookName").value;
    var formattedBookName = bookInput.split(" ").join("+");

    document.getElementById("loading-message").innerHTML = "Please wait while we load the books";
    document.getElementById("results-table").style.display = "none";
    document.getElementById("results-body").innerHTML = "";

    var response = await fetch("https://openlibrary.org/search.json?title=" + formattedBookName);
    var data = await response.json();

    document.getElementById("loading-message").innerHTML = "";

    var tableBody = document.getElementById("results-body");

    for (var i = 0; i < data.docs.length && i < 10; i++){
        var title = data.docs[i].title;

        var author = "Unknown";
        if (data.docs[i].author_name) {
            author = data.docs[i].author_name[0];
        }

        var row = "<tr><td>" + title + "</td><td>" + author + "</td></tr>";
        tableBody.innerHTML += row;
    }

    document.getElementById("results-table").style.display = "table";
}