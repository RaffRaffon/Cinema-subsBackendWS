const express = require('express');
const moviesRouter = require('./routers/moviesRouter');
const membersRouter = require('./routers/membersRouter')
const cors = require('cors');
const app = express();
const membersBL = require('./models/membersBL');
const moviesBL = require('./models/moviesBL');



app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended : false}));

require('./configs/database');

app.use('/api/movies', moviesRouter);
app.use('/api/members', membersRouter);

app.listen(8001);

membersBL.saveAllMembersInDB()
moviesBL.saveAllMoviesInDB()
