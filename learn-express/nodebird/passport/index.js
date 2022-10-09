const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

//()=>{} : (input)=>{logic}
module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //serializeUser는 req.session 객체에 어떤 데이터를 저장할지 선택. 매개변수로 user를 받아, done 함수에 두번째 인자로 user.id를 넘김
  //done 함수의 첫 번째 인자는 에러 발생 시 사용, 두 번째 인자는 세션에 사용자 정보 모두 저장 시 용량 커지므로 사용자 아이디만 저장하라고 명령.

  //passport.session() 미들웨어가 이 메서드 호출. serializeUser에서 세션에 저장했던 아이디를 받아 db에서 사용자 정보 조회.
  //그 정보를 req.user에 저장하므로 req.user를 통해 로그인한 사용자 정보 가져올 수 있음
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "nick"], //계속 attirbutes 지정하는 이유는 실수로 비밀번호를 조회하는 것을 방지하기 위해서이다.
          as: "Followers",
        },
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followings",
        },
      ],
    })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  //serializeUser는 사용자 정보 객체를 세션에 아이디로 저장, deserializeUser는 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러옴.

  //전체 과정 : 1 - 로그인 요청이 들어옴 => 2 - passport.authenticate 메서드 호출 => 3- 로그인 전략(=로그인 시의 동작) 수행 => 4 - 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출 => 5 - req.login 메서드가 passport.serializeUser 호출 => 6 - req.session에 사용자 아이디만 저장 => 로그인 완료!
  //로그인 이후 과정 : 1 - 모든 요청에 passport.session() 미들웨어가 passport.deserializeUser 메서드 호출 => 2 - req.session에 저장된 아이디로 db에서 사용자 조회 => 3 - 조회된 사용자 정보를 req.user에 저장 => 4 - 라우터에서 req.user 객체 사용 가능
  local();
  kakao();
};
