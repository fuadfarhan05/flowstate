const fs = require("fs");
const path = require("path"); 
// need to install the actual parsing called pdf-parsing 

const resumeparsing = async (req, res) => { 
    //TODO: 
    const ResumeFile = req.file; 
    //implement try and catch case 
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
    
      console.log(data); 

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

}  


module.exports = resumeparsing; 
