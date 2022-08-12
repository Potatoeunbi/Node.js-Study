/* 양방향 암호화 : 암호화된 문자열을 복호화
cipher.update(문자열, 인코딩, 출력 인코딩)
crypto.createDecipher(알고리즘, 키)
decipher.update(문자열, 인코딩, 출력 인코딩)
*/

const crypto = require("crypto");

const cipher = crypto.createCipher("aes-256-cbc", "열쇠");
let result = cipher.update("암호화할 문장", "utf8", "base64");
result += cipher.final("base64");
console.log("암호화 : ", result);

const decipher = crypto.createDecipher("aes-256-cbc", "열쇠");
let result2 = decipher.update(result, "base64", "utf8");
result2 += decipher.final("utf8");
console.log("복호화 : ", result2);
