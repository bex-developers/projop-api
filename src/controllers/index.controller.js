const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.SQL_USER,
    host: '35.226.131.136',
    password: 'Basis2020$',
    database: 'projop_sbx',
    port: '5432'
});



const getTickets = async (req, res) => {
    const response = await pool.query('SELECT * FROM im_tickets ORDER BY ticket_id ASC');
    res.status(200).json(response.rows);
};

module.exports = {
    getTickets,
};