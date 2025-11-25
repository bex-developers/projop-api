const pool = require('../config/db');

// GET: Obtener todos los registros de itsm_service_catalog
const getServiceCatalog = async (req, res, next) => {
    try {
        const client = await pool.connect();

        const query = `
            SELECT *
            FROM itsm_service_catalog
        `;

        try {
            const { rows } = await client.query(query);
            res.status(200).json(rows);
        } finally {
            client.release();
        }

    } catch (err) {
        next(err);
    }
};


module.exports = {
    getServiceCatalog
};
