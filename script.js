document.addEventListener('DOMContentLoaded', function() {
    const foodInput = document.getElementById('foodInput');
    const amountInput = document.getElementById('amountInput');
    const checkNutritionBtn = document.getElementById('checkNutritionBtn');
    const nutritionFacts = document.getElementById('nutritionFacts');
    const exerciseRecommendations = document.getElementById('exerciseRecommendations');
    const caloriesElement = document.getElementById('calories');
    const proteinElement = document.getElementById('protein');
    const carbsElement = document.getElementById('carbs');
    const fatElement = document.getElementById('fat');
    const fiberElement = document.getElementById('fiber');
    const sugarElement = document.getElementById('sugar');
    const exerciseList = document.getElementById('exerciseList');

    // Nutritionix API credentials
    const APP_ID = 'ab18fb15';
    const API_KEY = '413db1803e4c117b023991f9dcea88b4';

    checkNutritionBtn.addEventListener('click', performSearch);

    async function performSearch() {
        const food = foodInput.value.trim();
        const amount = amountInput.value.trim();
        if (food === '' || amount === '') {
            alert('Please enter both food and amount');
            return;
        }

        try {
            const nutritionData = await fetchNutritionData(`${amount} ${food}`);
            updateNutritionData(nutritionData);
            updateExerciseRecommendations(nutritionData.calories);
            nutritionFacts.style.display = 'grid';
            exerciseRecommendations.style.display = 'block';
        } catch (error) {
            console.error('Error fetching nutrition data:', error);
            alert('An error occurred while fetching nutrition data. Please try again.');
        }
    }

    async function fetchNutritionData(query) {
        const url = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-app-id': APP_ID,
                'x-app-key': API_KEY,
            },
            body: JSON.stringify({ query: query })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.foods.length === 0) {
            throw new Error('No food items found');
        }

        const item = data.foods[0];

        return {
            calories: Math.round(item.nf_calories),
            protein: Math.round(item.nf_protein),
            carbs: Math.round(item.nf_total_carbohydrate),
            fat: Math.round(item.nf_total_fat),
            fiber: Math.round(item.nf_dietary_fiber),
            sugar: Math.round(item.nf_sugars)
        };
    }

    function updateNutritionData(data) {
        caloriesElement.textContent = `${data.calories} kcal`;
        proteinElement.textContent = `${data.protein}g`;
        carbsElement.textContent = `${data.carbs}g`;
        fatElement.textContent = `${data.fat}g`;
        fiberElement.textContent = `${data.fiber}g`;
        sugarElement.textContent = `${data.sugar}g`;
    }

    function updateExerciseRecommendations(calories) {
        const exercises = [
            { name: 'Running', duration: Math.round(calories / 8.33), icon: '🏃' },
            { name: 'Brisk Walking', duration: Math.round(calories / 5.55), icon: '🚶' },
            { name: 'Swimming', duration: Math.round(calories / 12.5), icon: '🏊' },
            { name: 'Yoga', duration: Math.round(calories / 4.16), icon: '🧘' }
        ];

        exerciseList.innerHTML = '';
        exercises.forEach(exercise => {
            const div = document.createElement('div');
            div.className = 'exercise-item';
            div.innerHTML = `
                <span>${exercise.icon} ${exercise.name}</span>
                <span>${exercise.duration} mins</span>
            `;
            exerciseList.appendChild(div);
        });
    }
});