const pool = require('../config/db');

const getSolutionCategories = async (req, res, next) => {
    try{
        const response = await pool.query(`
            SELECT *
            FROM itsm_solution_category
            WHERE active = true
        `);
        
        res.status(200).json(response.rows);
    }
    catch(err){
        next(err);
    }
};

module.exports = {
    getSolutionCategories
}