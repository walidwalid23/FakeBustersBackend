//PATH PACKAGE HELPS US TO GET THE EXTENTION FROM ANY NAME
const path = require('path');
const multer = require('multer');
const theStorage = multer.diskStorage({
    //CB MEANS CALLBACK
    destination: function (req, file, cb) {
        //YOU MUST HAVE A FOLDER WITH THIS NAME 'profile_images' IN THE PROJECTS FOLDER
        //cb(null,foldername)
        cb(null, 'profile_images/');
    },
    filename: function (req, file, cb) {

        //GETTING THE EXTENTION OF THE ORIGINAL FILE UPLOADED
        let ext = path.extname(file.originalname);
        //making filename unique to current date to never be repeated
        //ADDING THE CURRENT MILLISECONDS+FILE EXTENTION AS THE FILE NAME TO BE UNIQUE
        //cb(null,filename)
        cb(null, Date.now() + ext);
    },
});

const upload = multer({
    storage: theStorage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype == "image/jpg" ||
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpeg") {
            console.log("the coming file type :" + file.mimetype);
            cb(null, true);

        }
        else {
            console.log("the coming file name:" + file.originalname);
            console.log("the coming file path:" + file.path);
            console.log("THE FILE TYPE YOU UPLOADED IS NOT SUPPORTED");
            cb(null, false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

module.exports = upload;