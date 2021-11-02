const express = require('express');
const router = express.Router();
const membersBL = require('../models/membersBL');
const subsBL = require('../models/subscriptionsBL')
const moviesBL = require ('../models/moviesBL')
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
router.route('/getAllMembersData')
    .get(auth, async (req, resp) => {
        let data = await membersBL.getAllMembers();
        return resp.json(data);
    })
router.route('/getAllSubs')
    .get(auth, async (req, resp) => {
        let data = await subsBL.getAllSubscriptions();
        return resp.json(data);
    })
router.route('/editSub')
    .put(auth, (req, resp) => {
        subsBL.saveSub(req.body.data.MemberId, req.body.data.MemberName, req.body.data.movieId, req.body.data.date, req.body.data.movieName)
    })
router.route('/deleteInnerSingleSub')
    .delete(auth, (req, resp) => {
        subsBL.deleteInnerSingleSub(req.body.movieId,req.body.sub)
    })
router.route('/deleteMovieFromSubArray')
    .delete(auth, (req, resp) => {
        membersBL.deleteMovieFromSubArray(req.body.movieName, req.body.MemberId)
    })
router.route('/editMember')
    .put(auth, (req, resp) => {
        membersBL.updateMember(req.body.data.memberObj)
        moviesBL.updateMemberName(req.body.data.prevMemberName,req.body.data.memberObj.Name)
        subsBL.editMemberName(req.body.data.prevMemberName,req.body.data.memberObj.Name)
    })
router.route('/addMember')
    .post(auth, (req, resp) => {
        membersBL.addMember(req.body.data.memberObj)
    })
router.route('/deleteMember')
    .delete(auth, (req, resp) => {
        membersBL.deleteMember(req.body.memberId)
    })
router.route('/deleteSubscription')
    .delete(auth,(req,resp)=>{
        subsBL.deleteSubscription(req.body.memberName)
    })