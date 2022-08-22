//http 서버

const http = require("http");

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write("<h1>Hello Node!</h1>");
    res.end("<p>Hello Server!</p>");
  })
  .listen(8080, () => {
    // 서버 연결
    console.log("8080번 포트에서 서버 대기 중입니다!");
  });

//https 서버(서버 암호화)
// 암호화를 적용, 인증해줄 기관 필요하므로 지금 인증서 경로를 사용할 수 없다.
//http와 다른 점은 인자 2개를 받는다. 두 번째 인자는 http모듈과 같이 서버 로직이고, 첫 번째 인자는 인증서에 관련된 옵션 객체

const https = require("https");
const fs = require("fs");

https
  .createServer(
    {
      cert: fs.readFileSync("도메인 인증서 경로"),
      key: fs.readFileSync("도메인 비밀키 경로"),
      ca: [
        fs.readFileSync("상위 인증서 경로"),
        fs.readFileSync("상위 인증서 경로"),
      ],
    },
    (req, res) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.write("<h1>Hello Node!</h1>");
      res.end("<p>Hello Server!</p>");
    }
  )
  .listen(443, () => {
    console.log("443번 포트에서 서버 대기 중입니다!");
  });

//http2 서버
//SSL 암호화와 더불어 최신 HTTP 프로토콜인 http/2을 사용할 수 있게 해준다.
//요청 및 응답 방식이 http/1.1보다 개선되어 훨씬 효율적으로 요청을 보내고 웹의 속도도 많이 개선된다.

const http2 = require("http2");
const fs = require("fs");

http2
  .createSecureServer(
    {
      cert: fs.readFileSync("도메인 인증서 경로"),
      key: fs.readFileSync("도메인 비밀키 경로"),
      ca: [
        fs.readFileSync("상위 인증서 경로"),
        fs.readFileSync("상위 인증서 경로"),
      ],
    },
    (req, res) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.write("<h1>Hello Node!</h1>");
      res.end("<p>Hello Server!</p>");
    }
  )
  .listen(443, () => {
    console.log("443번 포트에서 서버 대기 중입니다!");
  });
