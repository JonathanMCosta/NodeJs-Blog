const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const categoriesController = require("./controllers/CategoriesController");
const articlesController = require("./controllers/ArticlesController");
const usersController = require("./controllers/UserController");

const Article = require("./models/Article");
const Category = require("./models/Category");
const User = require("./models/User");

const port = 80;

// View engine
app.set("view engine", "ejs");

// Sessions
app.use(
  session({
    secret: "qualquercoisa",
    cookie: {
      maxAge: 28800000, //Sessão de 8 horas
    },
  })
);

// Static
app.use(express.static("public"));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com sucesso");
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/session", (req, res) => {
  req.session.documentos = "Sistema nodeJS";
  req.session.ano = 2020;
  req.session.user = {
    username: "jonathan",
    email: "jonathan.marques.costa@outlook.com",
  };
  res.send("Sessão gerada");
});

app.get("/leitura", (req, res) => {
  res.json({
    documentos: req.session.documentos,
    ano: req.session.ano,
    usuario: req.session.user,
  });
});

app.get("/", (req, res) => {
  Article.findAll({
    order: [["id", "DESC"]],
    limit: 5,
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render("index", { articles, categories });
    });
  });
});

app.get("/:slug", (req, res) => {
  var slug = req.params.slug;
  Article.findOne({
    where: {
      slug: slug,
    },
  })
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render("article", { article, categories });
        });
      } else {
        res.rendirect("/");
      }
    })
    .catch((error) => {
      res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
  var slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        Category.findAll().then((categories) => {
          res.render("index", { articles: category.articles, categories });
        });
      } else {
        res.rendirect("/");
      }
    })
    .catch((error) => {
      res.redirect("/");
    });
});

app.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}`);
});
