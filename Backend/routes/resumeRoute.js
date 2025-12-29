const express = require("express");
const multer = require("multer");
const resumeRoute = express.Router();
const resumeparsing = require("../controllers/resumeparselogic.js");  

const upload = multer({
  dest: "uploads/", // right now this is local disk so it just creates a folder called uploads holding all folders we can transfer this to our database later.
});
//same dest

resumeRoute.post(
  "/Resumeparse",
  upload.single("upload"), 
  async (req, res) => {
    // we need to set up the body request of the user file here as such
    const ResumeFile = req.file;

    // implement a try and catch handling for error handling as such
    try {
      // if statement to check for the ResumeFile here as such
      if (!ResumeFile) {
        return res.status(404).json({
          message: "Error reading the file that was uploaded",
        });
      }

      // get the file path that the file is uploaded at as such
      const filePath = path.resolve(ResumeFile.path);
      // now we want to get that data here as such
      const data = await fs.promises.readFile(filePath, "utf-8");

      // finally we can send the response as such here
      res.json({
        message: "File upload was successful",
        Filename: ResumeFile.originalname,
        storedpathLocation: ResumeFile.path,
        filedata: data,
      });
    } catch (error) {
      res.status(500).json({
        errorMessage: "Error accessing and uploading file",
        details: error.message,
      });
    }
  },
);

module.exports = resumeRoute;
