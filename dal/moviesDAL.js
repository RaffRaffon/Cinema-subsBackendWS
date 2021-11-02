const axios = require('axios')

exports.getMovies = function()
{
    return axios.get("https://api.tvmaze.com/shows")
};