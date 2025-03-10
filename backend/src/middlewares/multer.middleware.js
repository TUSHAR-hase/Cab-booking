import multer from "multer";
import { v4 as uuidv4 } from "uuid"; // Install this package using `npm install uuid`

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/assets/uploads");
    },
    filename: function (req, file, cb) {
        const uniqueName = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

export const upload = multer({ storage });
