const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: true,
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        provider: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: "local",
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    //1:N 관계일 때 hasMany를 사용하는데 User가 1인 입장이다.

    //같은 테이블끼리여도 N:M 관계를 가질 수 있다. 이를 팔로잉 기능에서 사용된다.
    //같은 테이블 간 N:M 관계에서는 모델 이름과 컬럼 이름을 따로 정해줘야 한다.
    db.User.belongsToMany(db.User, {
      foreignKey: "followingId",
      as: "Followers",
      through: "Follow", //through 옵션으로 생성할 모델 이름을 정해줬다.
    });

    //Follow 모델에서 사용자 아이디를 저장하는 컬럼 이름 모두 userid면 누가 팔로워고 누가 팔로잉 중인지 모르므로 foreignKey옵션에 컬럼 이름을 지정해준다.
    //as 옵션은 시퀄라이즈가 JOIN작업 시 사용되는 이름. 시퀄라이즈는 getFollowings, addFollowing과 같은 메소드를 자동으로 추가함.

    db.User.belongsToMany(db.User, {
      foreignKey: "followerId",
      as: "Followings",
      through: "Follow",
    });
  }
};
