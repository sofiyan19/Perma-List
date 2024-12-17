import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import 'dotenv/config';

const app = express();
const port = 3000;

const db = new pg.Client({
  user : process.env.PG_USER,
  host : process.env.PG_HOST,
  database : process.env.PG_DATABASE,
  password : process.env.PG_PASSWORD,
  port : process.env.PG_PORT,

}
);
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items");
  const items = result.rows;
  //console.log(items);

  res.render("index.ejs", {
    listTitle: "What’s on Today’s List",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  //items.push({ title: result });
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
  
});

app.post("/edit", async (req, res) => {
  const result = req.body.updatedItemId;
  const a = req.body.updatedItemTitle;
  try {
    await db.query("UPDATE items SET title = $2 WHERE id = $1 ", [result, a]);
    res.redirect("/");
    
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const result = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [result]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }

});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
