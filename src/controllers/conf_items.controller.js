const pool = require('../config/db');

// Funciones relacionadas con configuration items y certificados
const system = async (req, res, next) => {
    try{
          const company_id = req.params.company_id;
         console.log(company_id)
        const response = await pool.query(`select conf_item_id, conf_item_name from im_conf_items where conf_item_customer_id =   ${company_id}`);                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

const getTechSystem = async (req, res, next) => {
    try{
        const client = await pool.connect();
        const company_id   = req.params.company_id;
        const { page, size } = req.query;
        const query = `
                    SELECT 
                    conf_item_id, conf_item_name, conf_item_nr,
                    conf_item_version, conf_item_code,
                    lmdb_it_admin_role, lmdb_long_sid,
                    lmdb_type, lmdb_install_number
                    FROM im_conf_items
                    where conf_item_customer_id = ${company_id}
                    and conf_item_type_id = '10000316' 
                    ORDER BY conf_item_id
                    LIMIT $2
                    OFFSET (($1 - 1) * $2);
        `;
        try {
            const { rows } = await client.query(query, [page, size]);
            res.status(200).json(rows);
        } finally {
            await client.release();
        }
    }
    catch (err) {
        next(err);
      }
}

const getBtpService = async (req, res, next) => {
    try{
        const client = await pool.connect();
        const company_id   = req.params.company_id;
        const { page, size } = req.query;
        const query = `
                    SELECT 
                    conf_item_id, conf_item_name, conf_item_nr,
                    conf_item_version, conf_item_code,
                    lmdb_it_admin_role, lmdb_long_sid,
                    lmdb_type, lmdb_install_number
                    FROM im_conf_items
                    where conf_item_customer_id = ${company_id}
                    and conf_item_type_id = '10000530' 
                    ORDER BY conf_item_id
                    LIMIT $2
                    OFFSET (($1 - 1) * $2);
        `;
        try {
            const { rows } = await client.query(query, [page, size]);
            res.status(200).json(rows);
        } finally {
            await client.release();
        }
    }
    catch (err) {
        next(err);
      }
}

const getCertInstance = async (req, res, next) => {
    try{
        const client = await pool.connect();
        const company_id   = req.params.company_id;
        const { page, size } = req.query;
        const query = `
                    SELECT 
                    conf_item_id, conf_item_name, conf_item_nr,
                    conf_item_version, conf_item_code,
                    conf_item_type_id, im_category_from_id(conf_item_type_id) as conf_item_type_name,
                    sap_btp_srv_environment, im_category_from_id(sap_btp_srv_environment) as sap_btp_srv_environment_name,
                    sap_lmdb_it_admin_role,im_category_from_id(sap_lmdb_it_admin_role) as sap_lmdb_it_admin_role_name,
                    lmdb_long_sid,
                    lmdb_type, lmdb_install_number
                    FROM im_conf_items
                    where conf_item_customer_id = ${company_id}
                    and conf_item_type_id in (10000316,10000530)
                    ORDER BY conf_item_id
                    LIMIT $2
                    OFFSET (($1 - 1) * $2);
        `;
        try {
            const { rows } = await client.query(query, [page, size]);
            res.status(200).json(rows);
        } finally {
            await client.release();
        }
    }
    catch (err) {
        next(err);
      }
}

const getPse = async (req, res, next) => {
    try{
        const client = await pool.connect();
        const conf_item_id   = req.params.conf_item_id;
        const { page, size } = req.query;
        const query = `
                    SELECT 
                    conf_item_id, conf_item_name, conf_item_nr,
                    conf_item_parent_id, conf_item_code,
                    conf_item_type_id,
                    conf_item_customer_id
                    FROM im_conf_items
                    where conf_item_parent_id = ${conf_item_id}
                    and conf_item_type_id = '10000389'
                    and conf_item_status_id = '11700' 
                    ORDER BY conf_item_id
                    LIMIT $2
                    OFFSET (($1 - 1) * $2);
        `;
        try {
            const { rows } = await client.query(query, [page, size]);
            res.status(200).json(rows);
        } finally {
            await client.release();
        }
    }
    catch (err) {
        next(err);
      }
}

const getPseKey = async (req, res, next) => {
    try{
        const client = await pool.connect();
        const conf_item_id   = req.params.conf_item_id;
        const { page, size } = req.query;
        const query = `
                    SELECT 
                    conf_item_id, conf_item_name, conf_item_nr,
                    conf_item_parent_id, conf_item_code,
                    conf_item_type_id,
                    conf_item_customer_id
                    FROM im_conf_items
                    where conf_item_parent_id = ${conf_item_id}
                    and conf_item_type_id in (10000389,10000390)
                    and conf_item_status_id = '11700' 
                    ORDER BY conf_item_id
                    LIMIT $2
                    OFFSET (($1 - 1) * $2);
        `;
        try {
            const { rows } = await client.query(query, [page, size]);
            res.status(200).json(rows);
        } finally {
            await client.release();
        }
    }
    catch (err) {
        next(err);
      }
}

const getCert = async (req, res, next) => {
    try{
        const client = await pool.connect();
        const conf_item_id   = req.params.conf_item_id;
        const { page, size } = req.query;
        const query = `
                    SELECT 
                    conf_item_id, conf_item_name, conf_item_nr,
                    conf_item_parent_id, conf_item_code,
                    conf_item_customer_id,
                    conf_item_type_id,
                    cert_start_date,
                    cert_end_date,
					CASE 
      					WHEN cert_end_date > CURRENT_DATE - interval '30 days' THEN 'valid'
      					WHEN cert_end_date <= CURRENT_DATE THEN 'expired'
      					WHEN cert_end_date > current_date AND cert_end_date < current_date + interval '30 days' THEN 'soon_to_expire'
					END as cert_status
                    FROM im_conf_items
                    where conf_item_parent_id = ${conf_item_id}
                    and conf_item_type_id in (10000391,10000392)
                    and conf_item_status_id = '11700' 
                    ORDER BY conf_item_id
                    LIMIT $2
                    OFFSET (($1 - 1) * $2);
        `;
        try {
            const { rows } = await client.query(query, [page, size]);
            res.status(200).json(rows);
        } finally {
            await client.release();
        }
    }
    catch (err) {
        next(err);
      }
}

const getSingleCert = async (req, res, next) => {
    try{
        const client = await pool.connect();
        const conf_item_id   = req.params.conf_item_id;
        const { page, size } = req.query;
        const query = `
                    SELECT 
                    conf_item_id, conf_item_name, conf_item_nr,
                    conf_item_parent_id, conf_item_code,
                    conf_item_customer_id,
                    conf_item_type_id,
                    cert_start_date,
                    cert_end_date,
					CASE 
      					WHEN cert_end_date > CURRENT_DATE - interval '30 days' THEN 'valid'
      					WHEN cert_end_date <= CURRENT_DATE THEN 'expired'
      					WHEN cert_end_date > current_date AND cert_end_date < current_date + interval '30 days' THEN 'soon_to_expire'
					END as cert_status
                    FROM im_conf_items
                    where conf_item_id = ${conf_item_id}
                    and conf_item_type_id in (10000391,10000392)
                    and conf_item_status_id = '11700' 
                    ORDER BY conf_item_id
                    LIMIT $2
                    OFFSET (($1 - 1) * $2);
        `;
        try {
            const { rows } = await client.query(query, [page, size]);
            res.status(200).json(rows);
        } finally {
            await client.release();
        }
    }
    catch (err) {
        next(err);
      }
}

const getAllCert = async (req, res, next) => {
    try{
        const client = await pool.connect();
        const company_id   = req.params.company_id;
        const { page, size } = req.query;
        const query = `
                    SELECT 
                    conf_item_id, conf_item_name, conf_item_nr,
                    conf_item_parent_id, acs_object__name(conf_item_parent_id) as conf_item_parent_name,
                    conf_item_code,
                    conf_item_customer_id,
                    conf_item_type_id,
                    cert_start_date,
                    cert_end_date,
                    CASE
                        WHEN CURRENT_DATE < cert_end_date - interval '30 days' THEN 'valid'
      					WHEN cert_end_date <= CURRENT_DATE THEN 'expired'
      					WHEN cert_end_date > current_date AND current_date > cert_end_date - interval '30 days' THEN 'soon_to_expire'
					END as cert_status
                    FROM im_conf_items
                    where conf_item_customer_id = ${company_id}
                    and conf_item_type_id in (10000391,10000392)
                    and conf_item_status_id = '11700' 
                    ORDER BY conf_item_id
                    LIMIT $2
                    OFFSET (($1 - 1) * $2);
        `;
        try {
            const { rows } = await client.query(query, [page, size]);
            res.status(200).json(rows);
        } finally {
            await client.release();
        }
    }
    catch (err) {
        next(err);
      }
}

const getExpiredCert = async (req, res, next) => {
    try{
        const client = await pool.connect();
        const company_id   = req.params.company_id;
        const { page, size } = req.query;
        const query = `
                    SELECT 
                    conf_item_id, conf_item_name, conf_item_nr,
                    conf_item_parent_id, acs_object__name(conf_item_parent_id) as conf_item_parent_name,
                    conf_item_code,
                    conf_item_customer_id,
                    conf_item_type_id,
                    cert_start_date,
                    cert_end_date
                    FROM im_conf_items
                    where conf_item_customer_id = ${company_id}
                    and conf_item_type_id in (10000391,10000392)
                    and conf_item_status_id = '11700' 
                    and cert_end_date <= CURRENT_DATE
                    ORDER BY conf_item_id
                    LIMIT $2
                    OFFSET (($1 - 1) * $2);
        `;
        try {
            const { rows } = await client.query(query, [page, size]);
            res.status(200).json(rows);
        } finally {
            await client.release();
        }
    }
    catch (err) {
        next(err);
      }
}

const getValidCert = async (req, res, next) => {
    try{
        const client = await pool.connect();
        const company_id   = req.params.company_id;
        const { page, size } = req.query;
        const query = `
                    SELECT 
                    conf_item_id, conf_item_name, conf_item_nr,
                    conf_item_parent_id, acs_object__name(conf_item_parent_id) as conf_item_parent_name,
                    conf_item_code,
                    conf_item_customer_id,
                    conf_item_type_id,
                    cert_start_date,
                    cert_end_date
                    FROM im_conf_items
                    where conf_item_customer_id = ${company_id}
                    and conf_item_type_id in (10000391,10000392)
                    and conf_item_status_id = '11700' 
                    and CURRENT_DATE < cert_end_date - interval '30 days'
                    ORDER BY conf_item_id
                    LIMIT $2
                    OFFSET (($1 - 1) * $2);
        `;
        try {
            const { rows } = await client.query(query, [page, size]);
            res.status(200).json(rows);
        } finally {
            await client.release();
        }
    }
    catch (err) {
        next(err);
      }
}

const getSoonToExpireCert = async (req, res, next) => {
    try{
        const client = await pool.connect();
        const company_id   = req.params.company_id;
        const { page, size } = req.query;
        const query = `
                    SELECT 
                    conf_item_id, conf_item_name, conf_item_nr,
                    conf_item_parent_id, acs_object__name(conf_item_parent_id) as conf_item_parent_name,
                    conf_item_code,
                    conf_item_customer_id,
                    conf_item_type_id,
                    cert_start_date,
                    cert_end_date
                    FROM im_conf_items
                    where conf_item_customer_id = ${company_id}
                    and conf_item_type_id in (10000391,10000392)
                    and conf_item_status_id = '11700' 
                    and cert_end_date > current_date AND current_date > cert_end_date - interval '30 days'
                    ORDER BY conf_item_id
                    LIMIT $2
                    OFFSET (($1 - 1) * $2);
        `;
        try {
            const { rows } = await client.query(query, [page, size]);
            res.status(200).json(rows);
        } finally {
            await client.release();
        }
    }
    catch (err) {
        next(err);
      }
}

const getCertKpi = async (req, res, next) => {
    try{
        const client = await pool.connect();
        const company_id   = req.params.company_id;
        const { page, size } = req.query;
        const query = `
                    SELECT 
                    conf_item_id, conf_item_name, conf_item_nr,
                    conf_item_parent_id, acs_object__name(conf_item_parent_id) as conf_item_parent_name,
                    conf_item_code,
                    conf_item_customer_id,
                    conf_item_type_id,
                    cert_start_date,
                    cert_end_date
                    FROM im_conf_items
                    where conf_item_customer_id = ${company_id}
                    and conf_item_type_id in (10000391,10000392)
                    and conf_item_status_id = '11700' 
                    ORDER BY conf_item_id
        `;
        try {
            const { rows } = await client.query(query, [page, size]);
            res.status(200).json(rows);
        } finally {
            await client.release();
        }
    }
    catch (err) {
        next(err);
      }
}

module.exports = {
  system,
  getTechSystem,
  getBtpService,
  getCertInstance,
  getPse,
  getPseKey,
  getCert,
  getSingleCert,
  getAllCert,
  getExpiredCert,
  getValidCert,
  getSoonToExpireCert,
  getCertKpi
};
