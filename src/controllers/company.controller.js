const pool = require('../config/db');

// Funciones relacionadas con la compañía
const getCompanyInfo = async (req, res, next) => {
    try{
        const  company_id   = req.params.company_id;
        const response = await pool.query(`select c.default_tax as horas_objetivo, o.address_line1 as url_reporte, o.address_line2 as 
            url_roadmap, site_concept as url_informes from im_companies c, im_offices o 
            where c.company_id = o.company_id and c.company_id = ${company_id}`);                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

module.exports = {
  getCompanyInfo
};
