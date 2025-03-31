const audit = require("../db/models/audit");
const catchAsync = require("../utils/catchAsync");

const insertAction= catchAsync(async (req, res, next)=>{

    try {
        const originalEnd = res.end;

  res.end = async function (chunk, encoding) {
    // Log the HTTP method, URL, and response status code
    //console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
    console.log(res)
    const auditData = {
      userId: req.user?.id || 0,
      action: `${req.method} ${req.originalUrl}`,
      affectedData: req.originalUrl,
      result: res.statusCode,
      ipAddress: req.ip,
    };
  
    // Insert audit record
    try {
      await audit.create(auditData);
      console.log('Action performed and audited successfully.');
    } catch (error) {
      console.log('An error occurred while performing the action. - '+error);
    }
    // Restore the original res.end method and call it
    res.end = originalEnd;
    res.end(chunk, encoding);
  };

  next();
    
    } catch (error) {
        console.log(error)
    } 
})

module.exports = {insertAction}