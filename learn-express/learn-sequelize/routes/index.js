var express = require("express");
const { User } = require("../models");
var router = express.Router();

//GET /로 접속했을 때의 라우터. User.findAll 메서드로 모든 사용자를 찾은 후, sequlize.pug를 렌더링할 때 결괏값인 users를 넣어줍니다.
//시퀄라이즈는 프로미스를 기보적으로 지원하므로 성공 시와 실패 시의 정보를 얻을 수 있다. 이렇게 미리 db에서 데이터를 조회한 후 템플릿 렌더링에 사용할 수 있다.
router.get("/", function (req, res, next) {
  User.findAll()
    .then((users) => {
      res.render("sequelize", { users });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

/*
//async/await 문법!
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.render('sequelize', { users });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
*/

/*
//GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

module.exports = router;
