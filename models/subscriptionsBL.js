const Subscriptions = require('./subscriptionsModel');
const Movie = require('./moviesModel');
const moviesBL = require('./moviesBL');
const Member = require('./membersModel');
const membersBL = require('./membersBL2')
function getAllSubscriptions() {
    return new Promise((resolve, reject) => {
        Subscriptions.find({}, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    })
}

async function saveSub(MemberId, MemberName, movieId, date, movieName) {
    let allSubs = await getAllSubscriptions()
    let movieData = await moviesBL.getMovieById(movieId)
    let memberData = await membersBL.getMemberById(MemberId)
    let sub = allSubs.find(sub => String(sub.MemberId) === MemberId)
    let newSubscription = new Subscriptions({
        MemberId: MemberId,
        MemberName: MemberName,
        Movies: [{ movieId: movieId, date: date }]
    })
    if (sub !== undefined) {
        let isMovieExist = sub.Movies.find(movie => String(movie.movieId) === String(newSubscription.Movies[0].movieId))
        if (isMovieExist !== undefined) {
            console.log("Already subbed to that movie, doing nothing")
        } else {
            sub.Movies.push(newSubscription.Movies[0])
            Subscriptions.findByIdAndUpdate(sub._id,
                {
                    Movies: sub.Movies,
                }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('Updated Subscription');
                    }
                });
            let movieSubsArr = movieData.subsArr
            movieSubsArr.push(newSubscription)
            Movie.findByIdAndUpdate(movieId, {
                subsArr: movieSubsArr
            }, function (err) {
                if (err) {
                    console.log(err);
                }
            })
            let memberMoviesArr = memberData.MoviesArr
            memberMoviesArr.push({ movieName, date, movieId })
            Member.findByIdAndUpdate(MemberId, {
                MoviesArr: memberMoviesArr
            }, function (err) {
                if (err) {
                    console.log(err);
                }
            })
        }
    } else {
        newSubscription.save(function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Subscription Inserted Successfully")
            }
        })
        let movieSubsArr = movieData.subsArr
        movieSubsArr.push(newSubscription)
        Movie.findByIdAndUpdate(movieId, {
            subsArr: movieSubsArr
        }, function (err) {
            if (err) {
                console.log(err);
            }
        })
        let memberMoviesArr = memberData.MoviesArr
        memberMoviesArr.push({ movieName, date, movieId })
        Member.findByIdAndUpdate(MemberId, {
            MoviesArr: memberMoviesArr
        }, function (err) {
            if (err) {
                console.log(err);
            }
        })
    }
}

async function deleteInnerSingleSub(movieId, sub) {
    console.log(sub)
    let index = sub.Movies.findIndex(movie => String(movie.movieId) === movieId)
    sub.Movies.splice(index, 1)
    if (sub.Movies.length > 0) {
        Subscriptions.findByIdAndUpdate(sub._id,
            {
                Movies: sub.Movies,
            }, function (err) {

                if (err) {
                    console.log(err);

                }
                else {
                    console.log('Updated Subscription');
                }
            });
    } else {
        Subscriptions.findByIdAndRemove(sub._id, (err, record) => {
            if (err) console.log(err)
            else console.log("Subscription removed successfully")
        })
    }
}

async function editMemberName(prevMemberName, currentMemberName) {
    let allSubs = await getAllSubscriptions()
    let subToEdit = allSubs.find(sub => sub.MemberName === prevMemberName)
    Subscriptions.findByIdAndUpdate(String(subToEdit._id), {
        MemberName: currentMemberName
    }, function (err) {
        if (err) console.log(err)
        else console.log('Updated membername inside Subscription');
    })
}


async function deleteSubscription(memberName) {
    let allSubs = await getAllSubscriptions()
    let subToDelete = allSubs.find(sub=>sub.MemberName===memberName)
    Subscriptions.findByIdAndRemove(subToDelete._id, (err, record) => {
        if (err) console.log(err)
        else console.log("Subscription removed successfully")
    })
}
module.exports = { saveSub, getAllSubscriptions, deleteInnerSingleSub, editMemberName, deleteSubscription }