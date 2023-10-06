const btnClean = document.querySelector(".btn--clear");
const btnSearch = document.querySelector(".btn--search");
const inputs = document.querySelectorAll("input");
const select = document.querySelector("#sorting");
const showMoreBtn = document.querySelector(".btn--showMore");
const showLessBtn = document.querySelector(".btn--showLess");
const btnContainer = document.querySelector(".btn__container");
const clearInputs = function () {
  inputs.forEach((el) => (el.value = ""));
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(function (checkbox) {
    checkbox.checked = false;
  });
  select.selectedIndex = 0;
  btnContainer.classList.add("hidden");
  details = document.querySelector(".details");
  details.innerHTML = "";
  totalEntries = document.querySelector(".results__totalEntries");
  results = document.querySelector(".results__cards");
  totalEntries.innerHTML = "";
  results.innerHTML = "";
};
const form = document.querySelector(".shop-form");
const checkRange = function () {
  const lower = document.querySelector("#lowerBound").value || 0;
  const upper = document.querySelector("#upperBound").value || Infinity;
  console.log(lower, upper);
  // console.log(lowerBound, upperBound);

  if (Number(lower) < 0 || Number(upper) < 0) {
    alert("A negative value was intered, please try again!");
    return;
  }

  Number(upper) < Number(lower) &&
    alert(
      "An invalid input with lower bound greater than upper bound was detected, please try again!"
    );
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  checkRange();

  const form = document.querySelector(".shop-form");
  const formData = new FormData(form);
  // console.log(formData);
  const formJson = Object.fromEntries(formData.entries());

  // formJson.lowerBound = Number(0);
  // formJson.upperBound = Number(100);
  if (formJson.lowerBound === "") delete formJson.lowerBound;
  if (formJson.upperBound === "") delete formJson.upperBound;
  // console.log(formJson);
  // Encode the JSON string for URL
  const queryString = Object.keys(formJson)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(formJson[key])}`
    )
    .join("&");

  // Specify the URL with the query string
  const url = `/data?${queryString}`;
  // console.log(url);

  // Make a GET request with the data in the URL
  // try {
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // body: formData,
  })
    .then((response) => response.json())
    .then((items) => {
      // console.log(items);
      // console.log(items)
      if (items[1].count === 0) updateNoResults();
      else {
        showLessBtn.classList.add("hidden");
        updateNumEntries(items[0]["key"], items[1]["count"]);
        cards = document.querySelector(".results__cards");
        cards.innerHTML = "";
        items[2].forEach((item) => appendCard(item));
        const resultsCards = document.querySelector(".results__cards");
        resultsCards.classList.add("show");

        showMoreBtn.classList.remove("hidden");
        addCardEvent();
        details = document.querySelector(".details");
        results = document.querySelector(".results");

        results.classList.remove("hidden");
        btnContainer.classList.remove("hidden");
        details.innerHTML = "";
      }
    });
  // .catch(() => updateNoResults());
  // } catch (error) {
  //   console.log(err);
  // }
});
btnClean.addEventListener("click", (e) => {
  e.preventDefault();
  clearInputs();
});
const updateNoResults = function () {
  totalEntries = document.querySelector(".results__totalEntries");
  details = document.querySelector(".details");
  details.innerHTML = "";
  totalEntries.innerHTML = `No Results found`;
  results = document.querySelector(".results");
  results.classList.remove("hidden");
  cards = document.querySelector(".results__cards");
  cards.innerHTML = "";
  showLessBtn.classList.add("hidden");
  showMoreBtn.classList.add("hidden");
};

const updateNumEntries = function (key, num) {
  totalEntries = document.querySelector(".results__totalEntries");
  console.log(totalEntries);
  totalEntries.innerHTML = `${num} Results found for ${key}<hr />`;
};

const appendCard = function (item) {
  cards = document.querySelector(".results__cards");
  cards.insertAdjacentHTML("beforeend", createCard(item));
};

const renderMoreLessBtn = function () {};

const createCard = function (item) {
  return `
    <div class="card" data-id="${item["itemId"]}">
      <div class="card__images">
        <img class="card__img" src=${
          item["gallary"] === "https://thumbs1.ebaystatic.com/ pict/04040_0.jpg"
            ? "images/ebay_default.jpg"
            : item["gallary"]
        } />
      </div>
      <div class="card__info">
        <p class="card__content bold">${item["title"]}</p>
        <p class="card__content align">
          Category:&nbsp;${item["category"]}
          <a target="_blank" href="${
            item["view"]
          }"><img class="card__redirect" src="images/redirect.png"/></a>
        </p>
        <p class="card__content align">
          Condition:&nbsp;${item["condition"]}&nbsp;
          ${
            item["topRate"] === "true"
              ? '<img class="card__topRate" src="images/topRatedImage.png" />'
              : ""
          }
        </p>
        <p class="card__content bold">Price:&nbsp;${item["price"]}</p>
      </div>
    </div>`;
};

renderDetails = function (data) {
  results = document.querySelector(".results");
  details = document.querySelector(".details");
  results.classList.add("hidden");
  btnContainer.classList.add("hidden");
  details.insertAdjacentHTML("beforeend", createDetails(data));
};

showMoreBtn.addEventListener("click", () => {
  showMoreBtn.classList.add("hidden");
  showLessBtn.classList.remove("hidden");
  results = document.querySelector(".results__cards");
  results.classList.remove("show");
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth",
  });
});

showLessBtn.addEventListener("click", () => {
  showMoreBtn.classList.remove("hidden");
  showLessBtn.classList.add("hidden");
  results = document.querySelector(".results__cards");
  results.classList.add("show");
  const target = document.querySelector(".results");
  target.scrollIntoView({
    behavior: "smooth",
  });
});

createDetails = function (data) {
  return `
  <p class="details__title">Item Details</p>
  <button class="btn btn--back">Back to seach results</button>
  <div class="details__body">
    <div class="details__row">
      <div class="details__row--key">Photo</div>
      <div class="details__row--value">
        <img src=${data["Photo"]}} />
      </div>
    </div>
    <div class="details__row">
      <div class="details__row--key">eBay Link</div>
      <div class="details__row--value"><a href="${
        data["Link"]
      }">eBay Product Link</a></div>
    </div>
    <div class="details__row">
      <div class="details__row--key">Title</div>
      <div class="details__row--value">${data["Title"]}</div>
    </div>
    ${
      data["SubTitle"] !== ""
        ? `<div class="details__row">
          <div class="details__row--key">SubTitle</div>
          <div class="details__row--value">${data["SubTitle"]}</div>
        </div>`
        : ""
    }
    <div class="details__row">
      <div class="details__row--key">Price</div>
      <div class="details__row--value">${data["Price"]}</div>
    </div>
    <div class="details__row">
      <div class="details__row--key">Location</div>
      <div class="details__row--value">${data["Location"]}</div>
    </div>
    <div class="details__row">
      <div class="details__row--key">Seller</div>
      <div class="details__row--value">${data["Seller"]}</div>
    </div>
    <div class="details__row">
      <div class="details__row--key">Return Policy(US)</div>
      <div class="details__row--value">${data["Return"]}</div>
    </div>
  </div>`;
};

renderSpecifics = function (specifics) {
  details = document.querySelector(".details__body");
  result = specifics.map((specific) => createSpecific(specific)).join("");
  // console.log(result);
  details.insertAdjacentHTML("beforeend", result);
};

createSpecific = function (specific) {
  const key = Object.keys(specific)[0];
  const value = specific[key];
  return `
  <div class="details__row">
    <div class="details__row--key">${key}</div>
    <div class="details__row--value">${value}</div>
  </div>`;
};

const addCardEvent = function () {
  const cards = document.querySelectorAll(".card");
  // cards.forEach((card) =>
  //   card.addEventListener("click", () => {
  //     renderDetails();
  //     addBackEvent();
  //   })
  // );
  // console.log(cards);

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      itemUrl = `/item?id=${card.dataset.id}`;
      fetch(itemUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          renderDetails(data);
          addBackEvent();
          // console.log(data);
          renderSpecifics(data["Specifics"]);
        });
    });
  });
};

const addBackEvent = function () {
  const back = document.querySelector(".btn--back");
  back.addEventListener("click", () => {
    results = document.querySelector(".results");
    details = document.querySelector(".details");
    results.classList.remove("hidden");
    details.innerHTML = "";
    btnContainer.classList.remove("hidden");
  });
};
