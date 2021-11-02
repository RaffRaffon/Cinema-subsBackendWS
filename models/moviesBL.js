const Movie = require('./moviesModel');
const moviesDAL = require('../dal/moviesDAL')

function getAllMovies() {
    return new Promise((resolve, reject) => {
        Movie.find({}, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    })
}

function getMovieById(movieId) {
    return new Promise((resolve, reject) => {
        Movie.findById(movieId, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

async function saveAllMoviesInDB() {
    let moviesArray = await getAllMovies()
    if (moviesArray.length === 0) {
        let response = await moviesDAL.getMovies()
        let allMovies = []
        for (let i = 0; i < 10; i++) {
            allMovies.push(response.data[i])
        }
        allMovies.forEach(movie => {
            let newMovie = new Movie({
                Name: movie.name,
                Genres: movie.genres,
                Image: movie.image.medium,
                Premiered: movie.premiered,
                subsArr: []
            })
            newMovie.save(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Movies Inserted successfully")
                }
            })
        })
    }
}

function deleteMovie(movieId) {
    Movie.findByIdAndRemove(movieId, (err) => {
        if (err) console.log(err)
        else console.log("Movie removed successfully")
    })
}


async function checkIfMovieNameExist(movieName) {
    let allMovies = await getAllMovies()
    let isMovie = allMovies.find(movie => movie.Name === movieName)
    if (isMovie !== undefined) return false
    else return true
}
async function checkIfMovieNameExistForEditing(movieName, editingMovieId) {
    let allMovies = await getAllMovies()
    let movieData = allMovies.find(movie => String(movie._id) === String(editingMovieId))
    let isMovie = allMovies.find(movie => movie.Name === movieName)
    if (movieData.Name === movieName) return true
    if (isMovie !== undefined) return false
    else return true
}

function saveMovie(movieObj) {
    let newMovie = new Movie({
        Name: movieObj.Name,
        Genres: movieObj.Genres,
        Image: movieObj.ImageUrl,
        Premiered: movieObj.Premired
    })
    newMovie.save(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Movie Inserted successfully")
        }
    })
}

function updateMovie(movieObj) {
    if (typeof (movieObj.Genres) !== "string") {
        movieObj.Genres = movieObj.Genres.join()
    }

    Movie.findByIdAndUpdate(movieObj._id,
        {
            Genres: movieObj.Genres.split(","),
            Name: movieObj.Name,
            Image: movieObj.Image,
            Premiered: movieObj.Premiered
        }, function (err) {

            if (err) {
                console.log(err);

            }
            else {
                console.log('Updated movie query');
            }
        });
}


async function deleteSingleInnerSub(movieId, memberName) {
    let movieData = await getMovieById(movieId)
    let updatedSubsArr = [...movieData.subsArr]
    let index = updatedSubsArr.findIndex(sub => sub.MemberName === memberName)
    updatedSubsArr.splice(index, 1)
    Movie.findByIdAndUpdate(movieId,
        {
            subsArr: updatedSubsArr
        }, function (err) {

            if (err) {
                console.log(err);

            }
            else {
                console.log('Updated movie subscriptions array');
            }
        });
}

async function updateMemberName(prevMemberName, currentMemberName) {
    let allMovies = await getAllMovies()
    allMovies.forEach(movie => {
        let newMembersArr = movie.subsArr
        let index = movie.subsArr.findIndex(sub => sub.MemberName === prevMemberName)
        if (index !== -1) {
            newMembersArr[index].MemberName = currentMemberName
            Movie.findByIdAndUpdate(String(movie._id), {
                subsArr: newMembersArr
            }, function (err) {
                if (err) console.log(err)
                else console.log('Updated membername for movie subscription')
            })
        }
    })
}


module.exports = {
    getAllMovies, saveAllMoviesInDB, deleteMovie, saveMovie, updateMovie, updateMemberName,
    getMovieById, deleteSingleInnerSub, checkIfMovieNameExist, checkIfMovieNameExistForEditing
}