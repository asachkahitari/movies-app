
let thisPg = 1;
let thisInput = '';
const ratingsArray = [];
const api_key = 'ca28fdd';
// fun to fetch movies

async function fetchOMDBmovies(page, input){
    try{
        const response = await fetch(`http://www.omdbapi.com/?apikey=${api_key}&s=${input}&page=${page}`);
        // console.log(response);
        return await response.json();
    }
    catch(err){
        console.log(err);
        return;
    }
}

// search function
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const input = searchInput.value.trim();
    // console.log(input);
    thisPg = 1;
    thisInput = input;
    extractAndDisplay(thisPg, thisInput);
}


// display movies

function displayMovies(movies){
    const movieListDiv = document.getElementById('movieList');
    movieListDiv.innerHTML = ""
    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie-div');
        movieDiv.innerHTML = `
        <img src="${movie.Poster}">
        <p><strong>${movie.Title}</strong></p>`;
        movieDiv.addEventListener('click', () => displayDetails(movie.imdbID));
        // console.log(movieDiv);
        movieListDiv.appendChild(movieDiv);
    })
}
// display movie details
async function displayDetails(imdbID) {
    const movieDetailsDiv = document.getElementById('movieDetails');
    movieDetailsDiv.innerHTML = '';
    const url = `http://www.omdbapi.com/?apikey=${api_key}&i=${imdbID}`;
    try {
        const response = await fetch(url);
        const movie = await response.json();
        const movieDetails = `
        <h2>${movie.Title}</h2>
        <p>Year: ${movie.Year}</p>
        <p>Genre: ${movie.Genre}</p>
        <p>Director: ${movie.Director}</p>
        <p>Plot: ${movie.Plot}</p>
        <div class="rating-stars">
            <input type="radio" id="5stars" name="rating" value="5">
            <label for="5stars"></label>
            <input type="radio" id="4stars" name="rating" value="4">
            <label for="4stars"></label>
            <input type="radio" id="3stars" name="rating" value="3">
            <label for="3stars"></label>
            <input type="radio" id="2stars" name="rating" value="2">
            <label for="2stars"></label>
            <input type="radio" id="1star" name="rating" value="1">
            <label for="1star"></label>
        </div>
        <input id="ratinguser" placeholder = "Your Name">
        <textarea id="comment" placeholder="Leave a comment"></textarea>
        <button onclick="submitRating('${imdbID}')">Submit</button>
        `;
        // console.log(movieDetails);
        movieDetailsDiv.innerHTML = movieDetails;
        movieDetailsDiv.style.display = 'block';
        // console.log(movieDetails);
    } catch (error) {
        console.error('Error:', error);
    }
}


async function extractAndDisplay(page, input) {
    const data = await fetchOMDBmovies(page, input);
    if (data) {
        displayMovies(data.Search);
        setupPagination(data.totalResults);
    } else {
        const moviesLi = document.getElementById('movieList');
        moviesLi.innerHTML = '<p>No movies.</p>';
        rmpagination();
    }
}

// pagination fun -> if results found then it exists, else call remove paginat.
function setupPagination(total) {
    const paginationSection = document.getElementById('pagination');
    paginationSection.innerHTML = '';
    const totalPages = Math.ceil(total / 10);        // exact pages -> last page may be empty handle separate
    if (totalPages > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Previous';
        prevButton.addEventListener('click', () => {
        if (thisPg > 1) {
            thisPg--;
            extractAndDisplay(thisPg, thisInput);
        }
        });

        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.addEventListener('click', () => {
        if (thisPg < totalPages) {
            thisPg++;
            extractAndDisplay(thisPg, thisInput);
        }
        });

        paginationSection.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.addEventListener('click', () => {
            thisPg = i;
            extractAndDisplay(thisPg, thisInput);
        });
        paginationSection.appendChild(pageButton);
        }

        paginationSection.appendChild(nextButton);
    }
}

// function to remove pagination when there is no task
function rmpagination() {
    const paginationSection = document.getElementById('pagination');
    paginationSection.innerHTML = '';
}

// submi rating function
function submitRating(imdbID) {
    const ratingInputs = document.getElementsByName('rating');
    let ratingValue = null;
    for (const input of ratingInputs) {
        if (input.checked) {
        ratingValue = input.value;
        break;
        }
    }
    const username = document.getElementById('ratinguser');
    const commentInput = document.getElementById('comment');
    const comment = commentInput.value.trim();

    //   alert(`Rating: ${ratingValue}, Comment: ${comment}`);
    const currRating = {
        imdbId : imdbID,
        username : username,
        rating : ratingValue,
        comment : comment
    };
    ratingsArray.push(currRating);
    localStorage.setItem("userData", JSON.stringify(ratingsArray));

    ratingInputs.forEach((input) => input.checked = false);
    commentInput.value = '';
    username.value ="";
}

