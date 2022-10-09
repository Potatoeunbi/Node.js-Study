const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Post, Hashtag } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads"); //upload 폴더 생성
}

const upload = multer({
  //upload는 미들웨어를 만드는 객체
  storage: multer.diskStorage({
    //옵션으로 storage, limits
    destination(req, file, cb) {
      //storage에는 파일 저장 방식과 파일명 설정
      cb(null, "uploads/"); //저장 경로 설정
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext); //파일명은 기존 이름에 업로드 날짜값과 기존 확장자(ext) 추가, 업로드 날짜 추가 이유는 중복 방지
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, //최대 이미지 파일 용량 허용치, 현재 10MB
});

router.post("/img", isLoggedIn, upload.single("img"), (req, res) => {
  //single : 1개 이미지 업로드 시.이미지 하나는 req.file로 나머지 정보는 req.body
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer(); //게시글 업로드를 처리하는 라우터. 이미지 업로드했다면 이미지 주소도 req.body.url로 전송된다.
router.post("/", isLoggedIn, upload2.none(), async (req, res, next) => {
  //none : 이미지X, 데이터만. 모든 정보 req.body로    array, fields : 이미지들은 req.files로 나머지 정보는 req.body
  try {
    //none 쓴 이유 : 데이터 형식이 multipart긴 하지만, 이미지 데이터가 들어 있지 않으므로. 이미지 주소가 온 거지 데이터 자체가 온 게 아님.
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g); //게시글을 db에 저장 후, 게시글 내용에서 해시태그를 정규표현식으로 추출.
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      await post.addHashtags(result.map((r) => r[0])); //추출한 해시태그들을 db에 저장 후, post.addHashtags 메서드로 게시글과 해시태그의 관계를 PostHashtag테이블에 넣음.
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
