const protect = (req, res, next) => {
    const {user} = req.session

    if (!user) {
        return res.status(401).json({status: "fail", message: "unauthorized need login"});
    }

    req.user = user;

    next();
};

export { protect } 