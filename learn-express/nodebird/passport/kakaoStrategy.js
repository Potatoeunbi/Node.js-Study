const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID, //clientID는 카카오에서 발급해주는 아이디. 노출되지 않아야 하므로 이렇게 설정. 나중에 발급받으면 .env 파일에 넣을 것.
        callbackURL: "http://localhost:8001/auth/kakao/callback", //카카오로부터 인증 결과를 받을 라우터 주소
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("kakao profile", profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });
          if (exUser) {
            done(null, exUser); //먼저 카카오로 로그인했었다면 done 함수 호출
          } else {
            const newUser = await User.create({
              //회원가입 진행.
              email: profile._json && profile._json.kakao_account_email, //카카오에서는 인증 후 callbackURL에 적힌 주소로 accessToken, refreshToken, profile을 보내줌. profile 객체에서 원하는 정보 사용하면 됨.
              nick: profile.displayName,
              snsId: profile.id,
              provider: "kakao",
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
