const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", //첫번째 인자는 전략에 관한 설정을 하는 곳
        passwordField: "password", //usernameField와 passwordField에는 일치하는 req.body의 속성명을 적어주면 된다.
      },
      async (email, password, done) => {
        //async가 실제 전략을 수행 하는 곳. 위에서 넣어준 email과 password는 async 함수의 첫 번째와 두 번째 매개변수가 된다.

        //세 번째 매개변수인 done 함수는 passport.authenticate의 콜백 함수
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
