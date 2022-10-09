const Sequelize = require("sequelize");

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Post",
        tableName: "posts",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
    //1:N 관계일 때 belongsTo를 사용하는데 Post가 N인 입장이다.
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
    //Post와 Hashtag 모델에서 N:M 관계이다. 시퀄라이즈에서는 belongsToMany로 나타낸다.
  }
};
