const express = require('express');
const Board = require('../models/board');
const Comment = require('../models/comment');

const moment = require('moment');

const { isLoggedIn, commentOwnership } = require('../middleware');

const router = express.Router();

// create comment
router.post('/', isLoggedIn, async (req, res, next) => {
    const { text } = req.body;
    const author = {
        id: req.user._id,
        username: req.user.nickname,
    }
    const boardId = req.headers.referer.split('/')[4];
    try {
        const foundBoard = await Board.findById(boardId)
        const newComment = await Comment.create({
            text: text,
            boardId: boardId,
            author: author,
            moment,
        });
        await foundBoard.comments.push(newComment);
        await foundBoard.save();
        req.flash('success', 'Your comment has successfully created')
        return res.redirect(`/boards/${foundBoard._id}`);
    } catch (error) {
        req.flash('error', 'Unexpected error has occured with service')
        console.error(error);
        next(error);
    }
});

// update comment
router.put('/:comment_id', isLoggedIn, commentOwnership, async (req, res, next) => {
    try {
        req.body.updatedAt = Date.now();
        const boardId = req.headers.referer.split('/')[4];
        const upComment = await Comment.findOneAndUpdate({ _id: req.params.comment_id }, req.body, {runValidators:true});
        req.flash('success', 'Your comment has successfully updated')
        return res.redirect('/boards/' + boardId);
    } catch (error) {
        req.flash('error', 'Unexpected error has occured with service')
        console.error(error);
        next(error);
    }
});

// delete comment
router.delete('/:comment_id', isLoggedIn, commentOwnership, async (req, res, next) => {
    try {
        const boardId = req.headers.referer.split('/')[4];
        await Comment.findOneAndDelete({ _id: req.params.comment_id });
        req.flash('success', 'Your comment has successfully deleted')
        return res.redirect('/boards/' + boardId);
    } catch (error) {
        req.flash('error', 'Unexpected error has occured with service')
        console.error(error);
        next(error);
    }
})



module.exports = router;




