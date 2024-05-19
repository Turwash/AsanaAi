// Add an array to store added meals
var meals = [];

// Function to add a meal
function addMeal() {
    // Get the query value
    var query = document.getElementById('query').value;

    // Add the query to the meals array
    meals.push(query);

    // Display added meals in a table with remove buttons
    displayMeals();
}

// Function to remove a meal
function removeMeal(identifier) {
    // Remove the meal corresponding to the identifier
    meals.splice(identifier, 1);
    displayMeals(); // Re-render the table after removing the meal
}

// Function to display added meals
function displayMeals() {
    // Display added meals in a table with remove buttons
    var mealsTable = '<h3>Added Meals:</h3><table><tr><th>Meal</th><th>Calories</th><th>Action</th></tr>';
    meals.forEach(function (meal, index) {
        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/nutrition?query=' + meal,
            headers: { 'X-Api-Key': '/FCrN3MexHhGU3hh0b5hgQ==dGSlyDmxbUbtfY1i' },
            contentType: 'application/json',
            success: function (result) {
                // Update the table with meal, calories, and remove button
                var identifier = 'meal_' + index; // Generate a unique identifier for each row
                mealsTable += `<tr id="${identifier}"><td>${meal}</td><td>${result[0].calories}</td><td><button onclick="removeMeal(${index})">Remove</button></td></tr>`;
                // Update the mealsContainer with the updated table
                document.getElementById('mealsContainer').innerHTML = mealsTable;
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    });
}

// Function to find calories for all added meals
function findCalories() {
    var totalCalories = 0;
    var combinedNutritionalValues = {
        serving_size_g: 0,
        carbohydrates_total_g: 0,
        cholesterol_mg: 0,
        fat_saturated_g: 0,
        fat_total_g: 0,
        fiber_g: 0,
        potassium_mg: 0,
        protein_g: 0,
        sodium_mg: 0,
        sugar_g: 0
    };

    // Fetch API data for each meal in the meals array
    meals.forEach(function (meal) {
        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/nutrition?query=' + meal,
            headers: { 'X-Api-Key': '/FCrN3MexHhGU3hh0b5hgQ==dGSlyDmxbUbtfY1i' },
            contentType: 'application/json',
            success: function (result) {
                // Handle the API response and update the HTML content for each meal
                totalCalories += result[0].calories;

                // Aggregate nutritional values for all meals
                Object.keys(combinedNutritionalValues).forEach(function (key) {
                    combinedNutritionalValues[key] += result[0][key];
                });

                // Update HTML content with combined nutritional values
                updateHtmlWithApiData(totalCalories, combinedNutritionalValues);
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    });
}

// Function to update HTML content with combined API data for all meals
function updateHtmlWithApiData(totalCalories, combinedNutritionalValues) {
    // Update HTML content with combined nutritional values
    var combinedNutritionalValuesList = document.getElementById('nutritionalValuesList');
    combinedNutritionalValuesList.innerHTML = `
        <li class="servingsize">Total Serving Size: <span class="float-end">${combinedNutritionalValues.serving_size_g}</span></li>
        <li>Total Carbohydrates: <span class="float-end">${combinedNutritionalValues.carbohydrates_total_g}</span></li>
        <li>Total Cholesterol: <span class="float-end">${combinedNutritionalValues.cholesterol_mg}</span></li>
        <li>Total Saturated fat: <span class="float-end">${combinedNutritionalValues.fat_saturated_g}</span></li>
        <li>Total Fat: <span class="float-end">${combinedNutritionalValues.fat_total_g}</span></li>
        <li>Total Fiber Content: <span class="float-end">${combinedNutritionalValues.fiber_g}</span></li>
        <li>Total Potassium: <span class="float-end">${combinedNutritionalValues.potassium_mg}</span></li>
        <li>Total Protein: <span class="float-end">${combinedNutritionalValues.protein_g}</span></li>
        <li>Total Sodium: <span class="float-end">${combinedNutritionalValues.sodium_mg}</span></li>
        <li>Total Sugar: <span class="float-end">${combinedNutritionalValues.sugar_g}</span></li>
    `;

    // Update HTML content with total calories
    var caloriesBurn = document.getElementById('caloriesBurn');
    caloriesBurn.innerText = totalCalories;

    // Calculate exercises required to burn total calories
    var exercises = [
        { name: "Jog", time: Math.round(totalCalories / 378 * 60), image: "CalorieImages/running.png" },
        { name: "Do Power Yoga", time: Math.round(totalCalories / 223 * 60), image: "CalorieImages/yoga.png" },
        { name: "Get a Gym Workout", time: Math.round(totalCalories / 483 * 60), image: "CalorieImages/weightlifter.png" },
        { name: "Go for a Brisk Walk", time: Math.round(totalCalories / 294 * 60), image: "CalorieImages/walking.png" }
    ];

    // Update HTML content with exercises required
    var exerciseList = document.getElementById('exerciseList');
    exerciseList.innerHTML = '';
    exercises.forEach(exercise => {
        var exerciseDiv = document.createElement('div');
        exerciseDiv.classList.add('d-flex', 'align-items-center', 'mb-5');
        exerciseDiv.innerHTML = `
            <div class="flex-shrink-0">
                <img src="${exercise.image}" alt="${exercise.name}">
            </div>
            <div class="flex-grow-1 ms-3">
                <h5>${exercise.name}</h5>
                <p>You will have to ${exercise.name.toLowerCase()} for <strong>${exercise.time}</strong> Minutes</p>
            </div>
        `;
        exerciseList.appendChild(exerciseDiv);
    });
}
