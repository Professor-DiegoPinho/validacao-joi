import express, { json } from "express";
import joi from "joi";

const app = express();
app.use(json()); // body parser

const users = [{
  username: "prof. pinho",
  email: "diego.pinho@gmail.com",
  year: 1992,
  password: "senhasecretaesegura"
}];

app.get("/health", (req, res) => res.send("I'm ok!"));

app.get("/users", (req, res) => {
  res.send(users)
});

const userSchema = joi.object({
  username: joi.string().required(),
  email: joi.string().email().required(),
  year: joi.number().integer().min(1900).max(2024).required(),
  password: joi.string().min(6).required()
});

app.post("/users", (req, res) => {
  const validation = userSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const errors = validation.error.details.map(detail => detail.message);
    return res.status(422).send(errors);
  }

  users.push(req.body);
  return res.sendStatus(201);

});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is up and running on port: ${port}`));