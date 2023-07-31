const autopatient = require('../model/patientModel')


//creating a function to authomatically delete
async function handleAutomatinDelete(){
    try {
        //find all patient that thedelete is true and the delete at is not set

        const result = await autopatient.deleteMany({deleted:true})
        console.log(`${result.deletedCount}patient permently deleted`)
        
    } catch (error) {
      console.log('errror occured during authomtic delete')  
    }
}

   
const getTotalDataCount = async(req,res)=>{
    try {
        const count = await autopatient.countDocuments();
      if (count){
          res.status(200).json({message:'totalnumber of patient in the database is:', data:count})
      }
      else(
          res.status(400  ).json({message:'no data found'})
      )
      } catch (error) {
        console.error('Error fetching data count:', error.message);
        return 0;
      }
}

//creating a function to authomatically update counts
// async function getTotalDataCount() {
//     try {
//       const count = await autopatient.countDocuments();
//     if (count){
//         res.status(200).json({message:'totalnumber of patient in the database is:', data:count})
//     }
//     else(
//         res.status(400).json({message:'no data found'})
//     )
//     } catch (error) {
//       console.error('Error fetching data count:', error.message);
//       return 0;
//     }
//   }

module.exports={
    handleAutomatinDelete,
    getTotalDataCount
}