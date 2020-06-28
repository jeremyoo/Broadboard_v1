const express = require('express');
const Board = require('../models/board');
const Comment = require('../models/comment');
const moment = require('moment');

const { isLoggedIn, isNotLoggedIn, boardOwnership } = require('../middleware');

const router = express.Router();

// render new board template
router.get('/new', isLoggedIn, (req, res, next) => {
    res.render('boards/new', {
        user: req.user,
    });
});

// creating new board
router.post('/', isLoggedIn, async (req, res, next) => {
    const { title, writing } = req.body;
    const author = {
        id: req.user._id,
        username: req.user.nickname,
    };
    try {
        const newBoard = await Board.create({
            title: title,
            writing: writing,
            author: author,
        });
        console.log(newBoard);
        req.flash('success', 'Your board has successfully created')
        return res.redirect('/boards');
    } catch (error) {
        req.flash('error', 'Unexpected error has occured with service')
        console.error(error);
        next(error);
    }
})

// show *boards (choose how many boards to show on each page);
router.get('/', async (req, res, next) => {
    try {
        let page = Math.max(1, parseInt(req.query.page));
        let limit = Math.max(1, parseInt(req.query.limit));
        page = !isNaN(page) ? page : 1;
        limit = !isNaN(limit) ? limit : 10;
        let skip = (page - 1) * limit;
        let count = await Board.countDocuments({});
        let maxPage = Math.ceil(count / limit);
        const boards = await Board.find({}).populate('author').sort({ numId: -1 }).skip(skip).limit(limit).exec();
        return res.render('boards/index', {
            user: req.user,
            boards: boards,
            currentPage: page,
            maxPage: maxPage,
            limit: limit,
            moment,
        });
    } catch (error) {
        console.error(error);
        next(error);
    };
});

// open requested board
router.get('/:id', async (req, res, next) => {
    try {
        const IdBoard = await Board.findById(req.params.id).populate('comments')
        IdBoard.views++
        IdBoard.save();
        return res.render('boards/show', {
            user: req.user,
            board: IdBoard,
            moment,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
})

// get update board page
router.get('/:id/edit', isLoggedIn, boardOwnership, async (req, res, next) => {
    try {
        const editBoard = await Board.findById(req.params.id)
        return res.render('boards/edit', {
            user: req.user,
            board: editBoard,
            moment,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
})

// update board
router.put('/:id', isLoggedIn, boardOwnership, async (req, res, next) => {
    try {
        req.body.updatedAt = Date.now();
        const upBoard = await Board.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true });
        req.flash('success', 'Your board has successfully created')
        return res.redirect('/boards/' + req.params.id);
    } catch (error) {
        req.flash('error', 'Unexpected error has occured with service')
        console.error(error);
        next(error);
    }
});


// delete board
router.delete('/:id', isLoggedIn, boardOwnership, async (req, res, next) => {
    try {
        await Board.findOneAndDelete({ _id: req.params.id })
        req.flash('success', 'Your board has successfully deleted')
        return res.redirect('/boards');
    } catch (error) {
        req.flash('error', 'Unexpected error has occured with service')
        console.error(error);
        next(error);
    }
})


module.exports = router;