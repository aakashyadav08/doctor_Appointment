// authUser middleware example
const authUser = (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Attach user info to req.user
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};
