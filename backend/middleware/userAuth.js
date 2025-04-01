import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    try {
        // ✅ Fix: Extract token correctly
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Verify token
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id;
            next(); // Proceed if token is valid
        } else {
            return res.status(401).json({ success: false, message: "Invalid token payload" });
        }

    } catch (error) {
        // Handle JWT errors (expired, malformed, etc.)
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export default userAuth;