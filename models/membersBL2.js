const Member = require('./membersModel');
const membersDAL = require('../dal/membersDAL')
function getAllMembers() {
    return new Promise((resolve, reject) => {
        Member.find({}, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    })
}

async function saveAllMembersInDB() {
    let membersArray = await getAllMembers()
    if (membersArray.length === 0) {
        let response = await membersDAL.getMembers()
        let allMembers = response.data
        allMembers.forEach(member => {
            let newMember = new Member({
                Name: member.name,
                Email: member.email,
                City: member.address.city,
                MoviesArr: []
            })
            newMember.save(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Members Inserted successfully")
                }
            })
        })
    }
}

function updateMember(memberObj) {
    Member.findByIdAndUpdate(String(memberObj._id),
        {
            Name: memberObj.Name,
            Email: memberObj.Email,
            City: memberObj.City
        }, function (err) {

            if (err) {
                console.log(err);

            }
            else {
                console.log('Updated member');
            }

        })
}


function addMember(memberObj) {
    let newMember = new Member({
        Name: memberObj.Name,
        Email: memberObj.Email,
        City: memberObj.City
    })
    newMember.save(function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Member inserted successfully")
        }
    })
}
function deleteMember(memberId) {
    Member.findByIdAndDelete(memberId, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Deleted : ", docs);
        }
    });
}

function getMemberById(memberId) {
    return new Promise((resolve, reject) => {
        Member.findById(memberId, function (err, data) {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

async function deleteMovieFromSubArray(movieName,memberId) {
    let memberData = await getMemberById(memberId)
    let updatedMoviesArr=[...memberData.MoviesArr]
    let index=updatedMoviesArr.findIndex(movie=>movie.movieName===String(movieName))
    updatedMoviesArr.splice(index,1)
    Member.findByIdAndUpdate(String(memberId), {
        MoviesArr: updatedMoviesArr
    }, function (err) {
        if (err) {
            console.log(err);

        }
        else {
            console.log('Updated member');
        }

    })
}
module.exports = { getAllMembers, saveAllMembersInDB, updateMember, addMember, deleteMember, getMemberById, deleteMovieFromSubArray }