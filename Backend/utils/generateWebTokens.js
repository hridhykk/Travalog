import jwt from 'jsonwebtoken';

const generateToken = (payload) => {
    const secretKey = process.env.JWT_SECRET_KEY;
    const accessTokenExpireTime = { expiresIn: '30m' };
    const refreshTokenExpireTime = { expiresIn: '30d' };

    const accessToken = jwt.sign(payload, secretKey, accessTokenExpireTime);
    const refreshToken = jwt.sign(payload, secretKey, refreshTokenExpireTime);

    return { accessToken, refreshToken };
};

export default generateToken;
