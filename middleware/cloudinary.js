const cloudinary = require("cloudinary").v2

cloudinary.config({ 
    cloud_name: 'dkrhzbg4g', 
    api_key: '191643223956539', 
    api_secret: 'vjf90aMF9CWlTxDjMuKAMJjh95c' 
  });


module.exports = cloudinary;