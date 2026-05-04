const polygonApiKey = "YWJIngLNVp5dfZDfEaRxR2bwkTLoFPmp";

var dogBreeds = [];
var stockChart;

function setupAudio() {
    if (annyang) {
        var commands = {
            "hello": function() {
                alert("Hello World");
            },

            "change the color to *color": function(color) {
                document.body.style.backgroundColor = color;
            },

            "navigate to *page": function(page) {
                page = page.toLowerCase();

                if (page === "home") {
                    window.location.href = "Assignment2-Home.html";
                }
                else if (page === "stocks") {
                    window.location.href = "Assignment2-Stocks.html";
                }
                else if (page === "dogs") {
                    window.location.href = "Assignment2-Dogs.html";
                }
            },

            "lookup *stock": function(stock) {
                if (document.getElementById("ticker")) {
                    document.getElementById("ticker").value = stock.toUpperCase();
                    getStockData(stock.toUpperCase(), 30);
                }
            },

            "load dog breed *breed": function(breed) {
                showDogBreed(breed);
            }
        };

        annyang.addCommands(commands);
    }
}

function turnOnAudio() {
    if (annyang) {
        annyang.start();
    }
}

function turnOffAudio() {
    if (annyang) {
        annyang.abort();
    }
}

function loadHomePage() {
    loadQuote();
}

function loadQuote() {
    fetch("https://dummyjson.com/quotes/random")
    .then(response => response.json())
    .then(data => {
        document.getElementById("quote").innerHTML = '"' + data.quote + '"';
        document.getElementById("quote-author").innerHTML = "- " + data.author;
    })
    .catch(error => {
        document.getElementById("quote").innerHTML = "Quote could not load.";
        document.getElementById("quote-author").innerHTML = "";
    });
}

function lookupStock() {
    var ticker = document.getElementById("ticker").value;
    var days = document.getElementById("days").value;

    getStockData(ticker.toUpperCase(), days);
}

function getStockData(ticker, days) {
    var endDate = new Date();
    var startDate = new Date();

    startDate.setDate(endDate.getDate() - days);

    var end = endDate.toISOString().split("T")[0];
    var start = startDate.toISOString().split("T")[0];

    var url = "https://api.polygon.io/v2/aggs/ticker/" + ticker +
              "/range/1/day/" + start + "/" + end +
              "?apiKey=" + polygonApiKey;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        var labels = [];
        var prices = [];

        if (!data.results) {
            alert("No stock data found. Try AAPL, MSFT, TSLA, or check your API key.");
            return;
        }

        for (var i = 0; i < data.results.length; i++) {
            var date = new Date(data.results[i].t);
            labels.push(date.toLocaleDateString());
            prices.push(data.results[i].c);
        }

        drawChart(labels, prices, ticker);
    });
}

function drawChart(labels, prices, ticker) {
    var ctx = document.getElementById("stockChart");

    if (stockChart) {
        stockChart.destroy();
    }

    stockChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: ticker + " Closing Price",
                data: prices
            }]
        }
    });
}

function loadTopStocks() {
    fetch("https://apewisdom.io/api/v1.0/filter/all-stocks/page/1")
    .then(response => response.json())
    .then(data => {
        var tableBody = document.getElementById("top-stocks-body");
        tableBody.innerHTML = "";

        for (var i = 0; i < 5; i++) {
            var stock = data.results[i];

            var icon = "";
            
            if (stock.upvotes > 1) {
                icon = "<img class='sentiment-img' src='https://t3.ftcdn.net/jpg/15/05/76/14/240_F_1505761476_6jqXCUZTjagQiK6j2rZAhLvJEMEnLtfs.jpg' alt='Bullish'>";
            }
                
            else {
                icon = "<img class='sentiment-img' src='https://t4.ftcdn.net/jpg/18/18/36/77/240_F_1818367741_oy9h8NUMHcBQMcn3Vb7HcfTkC9pnDwCV.jpg' alt='Bearish'>";
            }

            var row = "<tr>";
            row += "<td><a href='https://finance.yahoo.com/quote/" + stock.ticker + "' target='_blank'>" + stock.ticker + "</a></td>";
            row += "<td>" + stock.mentions + "</td>";
            row += "<td>" + icon + "</td>";
            row += "</tr>";

            tableBody.innerHTML += row;
        }
    });
}

function loadDogPage() {
    loadDogImages();
    loadDogBreeds();
}

function loadDogImages() {
    fetch("https://dog.ceo/api/breeds/image/random/10")
    .then(response => response.json())
    .then(data => {
        var dogImages = document.getElementById("dog-images");
        dogImages.innerHTML = "";

        for (var i = 0; i < data.message.length; i++) {
            var slide = document.createElement("div");
            slide.setAttribute("class", "swiper-slide");

            var img = document.createElement("img");
            img.setAttribute("src", data.message[i]);

            slide.appendChild(img);
            dogImages.appendChild(slide);
        }

        new Swiper(".dog-swiper", {
            loop: true,
            pagination: {
                el: ".swiper-pagination"
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            }
        });
    });
}

function loadDogBreeds() {
    fetch("https://dogapi.dog/api/v2/breeds")
    .then(response => response.json())
    .then(data => {
        dogBreeds = data.data;

        var buttonBox = document.getElementById("dog-buttons");
        buttonBox.innerHTML = "";

        for (var i = 0; i < dogBreeds.length && i < 12; i++) {
            var button = document.createElement("button");
            button.innerHTML = dogBreeds[i].attributes.name;
            button.setAttribute("class", "dog-button");
            button.setAttribute("onclick", "showDogBreed('" + dogBreeds[i].attributes.name.replace(/'/g, "\\'") + "')");

            buttonBox.appendChild(button);
        }
    });
}

function showDogBreed(breedName) {
    for (var i = 0; i < dogBreeds.length && i < 12; i++) {
        if (dogBreeds[i].attributes.name.toLowerCase() === breedName.toLowerCase()) {
            var breed = dogBreeds[i].attributes;

            document.getElementById("dog-info").style.display = "block";

            document.getElementById("dog-info").innerHTML =
                "<h2>Dog Breed Name: " + breed.name + "</h2>" +
                "<p><strong>Description:</strong> " + breed.description + "</p>" +
                "<p><strong>Min Life:</strong> " + breed.life.min + "</p>" +
                "<p><strong>Max Life:</strong> " + breed.life.max + "</p>";
        }
    }
}
