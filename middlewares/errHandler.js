const errHandler = (err, req, res, next) => {
  switch (err.name) {
    case "Email Unique":
      res.status(400).json({ message: "email must be unique" });
      break;
    case "Username/Password Required":
      res.status(400).json({ message: "Username/Password cannot be empty" });
      break;
    case "Invalid Login":
      res.status(401).json({ message: "Invalid Email/Password" });
      break;
    case "No User Found":
      res.status(401).json({ message: "No User Found" });
      break;
    case "Login Validation":
      res.status(403).json({ message: "Not Login yet" });
      break;
    case "Password Invalid":
      res.status(400).json({ message: "Password Must between 5 and 8" });
      break;
    case "Bad Request":
      res.status(400).json({ message: `${err.field} cannot be empty` })
      break;

    case "Email Invalid":
      res.status(400).json({ message: `Paramter email tidak sesuai format` })
      break;

    default:
      console.log(err, "ini errornya");
      res.status(500).json({ message: "Internal Server Error" });
      break;
  }
};

module.exports = { errHandler };
