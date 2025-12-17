// config/jwt.config.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const envPath = path.resolve(__dirname, "../.env");

const ensureJwtSecret = () => {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        const newSecret = crypto.randomBytes(32).toString("hex");
        console.log("Generating new JWT_SECRET...");

        let content = "";
        if (fs.existsSync(envPath)) {
            content = fs.readFileSync(envPath, "utf-8");
        }

        // Xóa dòng cũ nếu có
        content = content
            .split("\n")
            .filter(line => !line.trim().startsWith("JWT_SECRET"))
            .join("\n");

        // Thêm dòng mới
        content += `\nJWT_SECRET=${newSecret}\n`;

        fs.writeFileSync(envPath, content.trim() + "\n");
        process.env.JWT_SECRET = newSecret;

        console.log("JWT_SECRET saved to .env");
    } else {
        console.log("JWT_SECRET already exists");
    }
};

module.exports = { ensureJwtSecret };