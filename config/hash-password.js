// hash-password.js
const bcrypt = require("bcrypt");

async function hashPassword(plainPassword) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    console.log("Mật khẩu gốc:", plainPassword);
    console.log("Hash (lưu vào DB):", hash);
    return hash;
}

// THAY ĐỔI MẬT KHẨU DƯỚI ĐÂY
const myPassword = "1234"; // Thay bằng mật khẩu bạn muốn

hashPassword(myPassword).catch(console.error);