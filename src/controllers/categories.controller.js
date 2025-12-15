const pool = require('../config/db');

// Funciones relacionadas con categorías y catálogos


const types = async (req, res, next) => {
    try{
        const response = await pool.query("select category_id, category from im_categories where category_type = 'Intranet Ticket Type' and enabled_p = 't'");                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

const priority = async (req, res, next) => {
    try{
        const response = await pool.query("select category_id, category from im_categories where category_type = 'Intranet Ticket Priority' and enabled_p = 't'");                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

const catalog = async (req, res, next) => {
    try{
        const response = await pool.query("select category_id, category from im_categories where category_type = 'Intranet Service Catalog' and enabled_p = 't' and aux_int1 is not null");                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

const customer_project = async (req, res, next) => {
    try{
        const  company_id   = req.params.company_id;
        const response = await pool.query(`select category_id, category from im_categories where \
            category_type = 'Intranet Ticket Customer Project' and enabled_p = 't' and aux_int1 = ${company_id}`);                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

const customer_company = async (req, res, next) => {
    try{
         const  company_id   = req.params.company_id;
        const response = await pool.query(`select category_id, category from im_categories where category_type
         = 'Intranet Ticket Customer Company' and enabled_p = 't' and aux_int1 =${company_id} `);                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

const customer_class = async (req, res, next) => {
    try{
        const response = await pool.query(`select category_id, category from im_categories where category_type = 'Intranet Ticket Custom Class' and enabled_p = 't' and aux_string1 is distinct from 'Interno'
`);                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

const getCatalog = async (req, res, next) => {
    try{
        const response = await pool.query(`select 
                                            category_id, category, category_description,
                                            aux_int1 as hours, 
                                            aux_int2 as lead_time,
                                            aux_string1 as downtime, 
                                            aux_string2 as service_type 
                                            from im_categories 
                                            where category_type = 'Intranet Service Catalog' 
                                            and enabled_p = 't' 
                                            and aux_int1 is not null`);                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

const getCatalogPage = async (req, res, next) => {
    try{
        const client = await pool.connect();
        const { page, size } = req.query;
        const query = `
                    select 
                    category_id, category, category_description,
                    aux_int1 as hours, 
                    aux_int2 as lead_time,
                    aux_string1 as downtime, 
                    aux_string2 as service_type 
                    from im_categories 
                    where category_type = 'Intranet Service Catalog' 
                    and enabled_p = 't' 
                    and aux_int1 is not null
                    ORDER BY category
                    LIMIT $2
                    OFFSET (($1 - 1) * $2)
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

const getServiceCatalog = async (req, res, next) => {
    try{
        const  category_id   = req.params.category_id;
        const response = await pool.query(`select category_id,
                                            category, category_description, 
                                            aux_int1 as hours, aux_int2 as lead_time, 
                                            aux_string1 as downtime, aux_string2 as service_type 
                                            from im_categories 
                                            where category_type = 'Intranet Service Catalog' 
                                            and enabled_p = 't' 
                                            and category_id= ${category_id} `);                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

const getRootCatalog = async (req, res, next) => {
    try{
        const response = await pool.query(`select * from im_categories where parent_id is null and category_type = 'Intranet Service Catalog' and enabled_p = 't'`);
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

const getParentCatalog = async (req, res, next) => {
    try{
        const { parent_id } = req.params;
        const response = await pool.query(`select * from im_categories where parent_id = ${parent_id} and category_type = 'Intranet Service Catalog' and enabled_p = 't'`);
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

const getChildCatalog = async (req, res, next) => {
    try{
        const { category_id } = req.params;
        const response = await pool.query(`select * from im_categories where category_id = ${category_id} and category_type = 'Intranet Service Catalog' and enabled_p = 't'`);
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

const getAllCatalog = async (req, res, next) => {
    try{
        const response = await pool.query(`select * from im_categories where category_type = 'Intranet Service Catalog' and enabled_p = 't'`);
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

const create_service = async (req, res, next) => {
    try{   
    var p_category        = req.body.p_category;
    var p_category_description       = req.body.p_category_description;
    var p_category_type       = "Intranet Service Catalog";
    var p_aux_int1         = req.body.p_aux_int1;
    var p_aux_int2         = req.body.p_aux_int2;
    var p_aux_string1     = req.body.p_aux_string1;
    var p_aux_string2    = req.body.p_aux_string2;
   
    console.log('cuerpo', req.body)
    console.log(req.body.p_category)
         
      const response = await pool.query(`SELECT public.im_category_new_api(
                                            '${p_category}', 
                                            '${p_category_description}',                    
                                            '${p_category_type}', 
                                            ${p_aux_int1},  
                                            ${p_aux_int2},  
                                            '${p_aux_string1}',
                                            '${p_aux_string2}')`);                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

const getSapCategoryType = async (req, res, next) => {
    try{
        const client = await pool.connect();
        const { page, size } = req.query;
        const query = `
                    select category_id, category, category_type 
                    from im_categories 
                    where category_type = 'Intranet SAP LMDB It Admin Role'
                    or category_type = 'Intranet SAP BTP Service Environment'
                    or category_type = 'Intranet Conf Item Type'
                    and enabled_p = 't'
                    ORDER BY category_id
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

module.exports = {
  types,
  priority,
  catalog,
  customer_project,
  customer_company,
  customer_class,
  getCatalog,
  getCatalogPage,
  getServiceCatalog,
  getRootCatalog,
  getParentCatalog,
  getChildCatalog,
  getAllCatalog,
  create_service,
  getSapCategoryType
};
