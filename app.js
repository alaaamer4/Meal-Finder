const search = document.querySelector("#search"),
  form = document.querySelector(".form"),
  random = document.querySelector("#btn-random"),
  meals = document.querySelector("#meals"),
  singleMeal = document.querySelector("#single-meal"),
  resultHeading = document.querySelector("#result-heading");

//get meals by id
const getMealsById = async (id) => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();
  const meal = data.meals[0];
  console.log(meal);
  showMeal(meal);
};
// get random meals
const getRandom = async () => {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
  const data = await res.json();
  const meal = data.meals[0];
  console.log(meal);
  showMeal(meal);
};

// show meal in the DOM
const showMeal = (meal) => {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]}-${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  resultHeading.innerHTML = "";
  meals.innerHTML = "";
  singleMeal.innerHTML = `
  <div class = "single-meal" >
  <h1>${meal.strMeal}</h1>
  <img src="${meal.strMealThumb}" alt = "${meal.strMeal}"/>
  <div class = "single-meal-info">
  ${meal.strCategory ? `<p> Category :  ${meal.strCategory}</p>` : ""}
  ${meal.strArea ? `<p> Area : ${meal.strArea}</p>` : ""}
  </div>
  <div class="main">
  <p>${meal.strInstructions}</p>
  <h2>Ingredients : </h2>
  <ul>
  ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
  </ul>
  </div>
  </div>
  `;
};
// search meals
const getMeals = async (term) => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  const data = await res.json();
  resultHeading.innerHTML = `<h3>Search result for "${term}" :</h3>`;
  if (data.meals === null) {
    resultHeading.innerHTML = `<h3>there are no results for "${term}" </h3>`;
  } else {
    meals.innerHTML = data.meals.map(
      (meal) =>
        `<div class = "meal" >
      <img src = "${meal.strMealThumb}" alt = "${meal.strMeal}"/>
      <div class = "meal-info" data-mealId = "${meal.idMeal}">
      <h3>${meal.strMeal}</h3>
      </div>
      </div> `
    );
    // clear search
    search.value = "";
  }
  console.log(data);
};

// event listener
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // clear single meal
  singleMeal.innerHTML = "";
  // get the term
  const term = search.value;
  getMeals(term);
});

meals.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealId = mealInfo.getAttribute("data-mealId");
    getMealsById(mealId);
  }
});

random.addEventListener("click", getRandom);
