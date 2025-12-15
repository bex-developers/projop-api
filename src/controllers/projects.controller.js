const pool = require('../config/db');

// Funciones relacionadas con proyectos
const support_project = async (req, res, next) => {
    try{
         const company_id = req.params.company_id;
         const response = await pool.query(`select project_id, project_name from im_projects 
             where parent_id is null and project_status_id = 76 and project_type_id = 2502 and company_id = ${company_id}`);                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

module.exports = {
  support_project
};
