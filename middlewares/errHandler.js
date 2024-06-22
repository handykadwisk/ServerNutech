const errHandler = (err, req, res, next) => {
  switch (err.name) {
    case "Email Unique":
      res.status(400).json({ message: "email must be unique" });
      break;
    case "Username/Password Required":
      res.status(400).json({ message: "Username/Password cannot be empty" });
      break;
    case "Invalid Login":
      res.status(401).json({ status: 103, message: "Username atau password salah", data: null });
      break;
    case "Password Invalid":
      res.status(400).json({ message: "Password harus lebih dari 8 karakter" });
      break;
    case "Bad Request":
      res.status(400).json({ message: `${err.field} cannot be empty` })
      break;
    case "Email Invalid":
      res.status(400).json({ status: 102, message: `Paramter email tidak sesuai format`, data: null })
      break;
    case "FileTypeError":
      res.status(400).json({ status: 102, message: `Format Image tidak sesuai`, data: null })
      break;
    case "Invalid Token":
      res.status(401).json({ status: 108, message: `Token tidak valid atau kadaluwarsa`, data: null })
      break;
    case "invalid amount":
      res.status(400).json({ status: 102, message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0', data: null })
      break;
    case "invalid service_code":
      res.status(400).json({ status: 102, message: 'Service ataus Layanan tidak ditemukan', data: null })
      break;
    default:
      // console.log(err.message, "<<<<<<< ini errornya");
      if (err.message === "jwt expired" || "invalid token") {
        res.status(401).json({ status: 108, message: `Token tidak valid atau kadaluwarsa`, data: null })
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;
  }
};

module.exports = { errHandler };
