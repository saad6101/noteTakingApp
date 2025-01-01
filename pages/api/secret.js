export default function handler(req, res) {
    res.status(200).json({ secretKey: process.env.SECRET_KEY });
}
