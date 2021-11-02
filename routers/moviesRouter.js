const express = require('express');
const router = express.Router();
const moviesBL = require('../models/moviesBL');
const membersBL = require('../models/membersBL')
const axios = require('axios');
const app = express()
let token
app.use(auth)
module.exports = router;

async function auth(req, resp, next) {
  
    let fetchParams = {
        headers: {
            "x-access-token": String(token)
        }
    }
    let response = await axios.get('http://localhost:8000/api/subs/authFrontEnd', fetchParams)
    if (response.status === 200) return next()
    if (response.status === 401) return resp.status(401).send({ auth: false, message: 'No token provided.' });
    if (response.status === 500) return resp.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
}

router.route('/initiateToken')
    .get((req, resp) => {
        token = req.headers['x-access-token']
    })
router.route('/getAllMoviesData')
    .get(auth,async (req, resp) => {
        let data = await moviesBL.getAllMovies();
        return resp.json(data);
    })
router.route('/deleteMovie')
    .delete(auth,(req, resp) => {
        moviesBL.deleteMovie(req.body.movieId)
    })
router.route('/addMovie')
    .post(auth,async (req, resp) => {
        let check = await moviesBL.checkIfMovieNameExist(req.body.data.movieObj.Name)
        if (check) {
            moviesBL.saveMovie(req.body.data.movieObj)
            return resp.json("Movie saved")
        }
        else return resp.json("A movie with the same name already exists")
    })
router.route('/editMovie')
    .put(auth,async (req, resp) => {
        let check = await moviesBL.checkIfMovieNameExistForEditing(req.body.data.movieObj.Name,req.body.data.movieObj._id)
        if (check){
            moviesBL.updateMovie(req.body.data.movieObj)
            membersBL.updateMovieName(req.body.data.prevMovieName,req.body.data.movieObj.Name)
            return resp.json("Movie edited")
        } else return resp.json("A movie with the same name already exists")
    })
router.route('/deleteSingleInnerSub')
    .delete(auth,(req, resp) => {
        moviesBL.deleteSingleInnerSub(req.body.movieId, req.body.memberName)
    })

