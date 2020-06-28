const Board = require('../models/board');
const Comment = require('../models/comment');

// for loggedin required route
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("/login");
    }
}

// for loggedin not required route
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}

exports.boardOwnership = async (req, res, next) => {
    try {
        const foundBoard = await Board.findById(req.params.id);
        if (req.user.id == foundBoard.author.id) {
            next();
        } else {
            return res.redirect(`/boards/${req.params.id}`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.commentOwnership = async (req, res, next) => {
    try {
        const boardId = req.headers.referer.split('/')[4];
        const foundComment = await Comment.findById(req.params.comment_id);
        if (req.user.id == foundComment.author.id) {
            next();
        } else {
            return res.redirect(`/boards/${boardId}`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}