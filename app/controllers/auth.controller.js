const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const SessionToken = db.sessionToken; 

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Método para salvar o token de sessão no banco de dados
function saveSessionToken(userId, token) {
  const expiresAt = new Date(Date.now() + 3600 * 1000); // Calcular a data de expiração
  return SessionToken.create({
    userId: userId,
    token: token,
    createdAt: new Date(),
    expiresAt: expiresAt
  });
}

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id },
        config.secret,
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          //expiresIn: 86400, // 24 hours
          expiresIn: 3600,
        });

      saveSessionToken(user.id, token); // Salvar o token de sessão no banco de dados

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


// Método para logout
exports.logout = (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // Obter o token do cabeçalho de autorização
  // Marcar o token como inválido no banco de dados
  SessionToken.update({ expiredAt: new Date() }, { where: { token: token } })
    .then(() => {
      res.status(200).send({ message: "Logout successful." });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
