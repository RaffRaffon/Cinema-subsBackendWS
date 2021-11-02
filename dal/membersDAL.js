const axios = require('axios')

exports.getMembers = function()
{
    return axios.get("http://jsonplaceholder.typicode.com/users")
};