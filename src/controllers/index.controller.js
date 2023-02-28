//const { config } = require('dotenv');
const config =  require('../config/config.js');
const { Pool } = require('pg');
//const keycloak = require('../config/keycloak-config.js').getKeycloak();

const pool = new Pool({
   // user: process.env.SQL_USER,
   user: config.DB_USER,
    host: config.DB_HOST,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    port: config.DB_PORT
});

const support_project = async (req, res, next) => {
    try{
         const company_id = req.params.company_id;
       /* const response = await pool.query(`select project_name from im_projects
         where parent_id is null and project_status_id = 76 and company_id = ${company_id}`);    */
         const response = await pool.query(`select project_id, project_name from im_projects 
             where parent_id is null and project_status_id = 76 and project_type_id = 2502 and company_id = ${company_id}`);                                     
                                         
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}
const system = async (req, res, next) => {
    try{
          const company_id = req.params.company_id;
         console.log(company_id)
      //  const response = await pool.query(`select conf_item_name from im_conf_items where conf_item_customer_id =  ${company_id}`);                                     
        const response = await pool.query(`select conf_item_id, conf_item_name from im_conf_items where conf_item_customer_id =   ${company_id}`);                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}
const getTickets = async (req, res, next) => {
    try{
        // aumentar rol 
        console.log('company_id', req.params.company_id )
         const  company_id   = req.params.company_id;
          const  fecha_inicial   = req.params.fecha_inicial;
           const  fecha_final   = req.params.fecha_final;
        //const response = await pool.query('SELECT * FROM im_tickets ORDER BY ticket_id ASC');
   
        const response = await pool.query(`select p.project_nr as NR, p.project_name as Nombre, 
          
                                            (SELECT string_agg(note, ', ') AS NOTE FROM im_hours WHERE project_id = p.project_id  GROUP BY project_id) ACTIVITIES,
                                            im_category_from_id(t.ticket_status_id) as STATUS, 
                                            im_category_from_id(t.ticket_type_id) as TYPE,
                                            im_category_from_id(t.ticket_prio_id) as PRIO, 
                                            acs_object__name(t.ticket_customer_contact_id) as CONTACT_NAME, 
                                            (SELECT email as MAIL FROM parties where party_id = t.ticket_customer_contact_id ) MAIL,
                                            acs_object__name(t.ticket_assignee_id) as ASSIGNEE, 
                                            acs_object__name(t.ticket_conf_item_id) as CONF_ITEM, 
                                            t.ticket_creation_date as CREATION_DATE, 
                                            t.ticket_done_date as DONE_DATE, t.ticket_irt as IRT, 
                                            t.ticket_mpt as MPT, 
                                            t.ticket_solution as TICKET_SOLUTION, 
                                            t.ticket_quoted_hours as QUOTED_HOURS, 
                                            im_category_from_id(t.ticket_customer_project) as CUSTOMER_PROJECT, 
                                            im_category_from_id(t.ticket_service_catalog) as SERVICE_CATALOG, 
                                            im_category_from_id(t.ticket_customer_company) as CUSTOMER_COMPANY, 
                                            im_category_from_id(t.ticket_custom_class) as CUSTOM_CLASS, 
                                            im_category_from_id(t.ticket_solution_category) as SOLUTION_CATEGORY,
                                            to_char(p.reported_hours_cache, '999D9') as REPORTED_HOURS 
                                            from im_tickets t, im_projects p, acs_objects o 
                                            where t.ticket_id = p.project_id 
                                            and t.ticket_id = o.object_id 
                                            and p.company_id = ${company_id} 
                                            and t.ticket_creation_date >= '${fecha_inicial}' AND t.ticket_creation_date < ('${fecha_final}'::date + '1 day'::interval) 
                                            order by t.ticket_creation_date DESC `);                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}
const getTicketsAdmin = async (req, res, next) => {
    try{
        const  fecha_inicial   = req.params.fecha_inicial;
        const  fecha_final   = req.params.fecha_final;
        const response = await pool.query(`select p.project_nr as NR, p.project_name as Nombre, 
                                            (SELECT string_agg(note, ', ') AS NOTE FROM im_hours WHERE project_id = p.project_id  GROUP BY project_id) ACTIVITIES, 
                                            im_category_from_id(t.ticket_status_id) as STATUS, 
                                            im_category_from_id(t.ticket_type_id) as TYPE, 
                                            t.ticket_description as DESCRIPCION,
                                            im_project_name_from_id(p.parent_id) as PROYECTO, 
                                            p.parent_id as PARENT_ID,
                                            t.ticket_status_id as STATUS_ID, 
                                            t.ticket_type_id as TYPE_ID,
                                            t.ticket_prio_id as PRIO_ID, 
                                            im_category_from_id(t.ticket_prio_id) as PRIO, 
                                            acs_object__name(t.ticket_customer_contact_id) as CONTACT_NAME,
                                            (SELECT email as MAIL FROM parties where party_id = t.ticket_customer_contact_id ) MAIL,
                                            acs_object__name(t.ticket_assignee_id) as ASSIGNEE, 
                                            acs_object__name(t.ticket_conf_item_id) as CONF_ITEM, 
                                            t.ticket_creation_date as CREATION_DATE, 
                                            t.ticket_done_date as DONE_DATE, t.ticket_irt as IRT, 
                                            t.ticket_mpt as MPT, 
                                            t.ticket_solution as TICKET_SOLUTION, 
                                            t.ticket_quoted_hours as QUOTED_HOURS, 
                                            im_category_from_id(t.ticket_customer_project) as CUSTOMER_PROJECT, 
                                            im_category_from_id(t.ticket_service_catalog) as SERVICE_CATALOG, 
                                            im_category_from_id(t.ticket_customer_company) as CUSTOMER_COMPANY, 
                                            im_category_from_id(t.ticket_custom_class) as CUSTOM_CLASS, 
                                            im_category_from_id(t.ticket_solution_category) as SOLUTION_CATEGORY, 
                                            to_char(p.reported_hours_cache, '999D9') as REPORTED_HOURS 
                                            from im_tickets t, im_projects p, acs_objects o 
                                            where t.ticket_id = p.project_id 
                                            and t.ticket_id = o.object_id
                                            and t.ticket_creation_date >= '${fecha_inicial}' AND t.ticket_creation_date < ('${fecha_final}'::date + '1 day'::interval) 
                                             `);                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}
const getTicketsHelpDesk = async (req, res, next) => {
    try{
       const person_id = req.params.person_id;
       const  fecha_inicial   = req.params.fecha_inicial;
       const  fecha_final   = req.params.fecha_final;
       const response = await pool.query(`select p.project_nr as NR, p.project_name as Nombre, 
                                            (SELECT string_agg(note, ', ') AS NOTE FROM im_hours WHERE project_id = p.project_id  GROUP BY project_id) ACTIVITIES, 
                                            im_category_from_id(t.ticket_status_id) as STATUS, 
                                            im_category_from_id(t.ticket_type_id) as TYPE, 
                                            im_category_from_id(t.ticket_prio_id) as PRIO, 
                                             t.ticket_description as DESCRIPCION,
                                            im_project_name_from_id(p.parent_id) as PROYECTO, 
                                            p.parent_id as PARENT_ID,
                                            t.ticket_status_id as STATUS_ID, 
                                            t.ticket_type_id as TYPE_ID,
                                            t.ticket_prio_id as PRIO_ID, 
                                            acs_object__name(t.ticket_customer_contact_id) as CONTACT_NAME,
                                            (SELECT email as MAIL FROM parties where party_id = t.ticket_customer_contact_id ) MAIL,
                                            acs_object__name(t.ticket_assignee_id) as ASSIGNEE, 
                                            acs_object__name(t.ticket_conf_item_id) as CONF_ITEM, 
                                            t.ticket_creation_date as CREATION_DATE, 
                                            t.ticket_done_date as DONE_DATE, t.ticket_irt as IRT, 
                                            t.ticket_mpt as MPT, 
                                            t.ticket_solution as TICKET_SOLUTION, 
                                            t.ticket_quoted_hours as QUOTED_HOURS, 
                                            im_category_from_id(t.ticket_customer_project) as CUSTOMER_PROJECT, 
                                            im_category_from_id(t.ticket_service_catalog) as SERVICE_CATALOG, 
                                            im_category_from_id(t.ticket_customer_company) as CUSTOMER_COMPANY, 
                                            im_category_from_id(t.ticket_custom_class) as CUSTOM_CLASS, 
                                            im_category_from_id(t.ticket_solution_category) as SOLUTION_CATEGORY, 
                                            to_char(p.reported_hours_cache, '999D9') as REPORTED_HOURS 
                                            from im_tickets t, im_projects p, acs_objects o 
                                            where t.ticket_id = p.project_id 
                                            and t.ticket_id = o.object_id
                                            and t.ticket_assignee_id =  ${person_id}
                                            and t.ticket_creation_date >= '${fecha_inicial}' AND t.ticket_creation_date < ('${fecha_final}'::date + '1 day'::interval) 
                                            `);                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}
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
const types = async (req, res, next) => {
    try{
         
     //   const response = await pool.query("select category from im_categories where category_type = 'Intranet Ticket Type' and enabled_p = 't'");                                     
        const response = await pool.query("select category_id, category from im_categories where category_type = 'Intranet Ticket Type' and enabled_p = 't'");                                     
      
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}
const priority = async (req, res, next) => {
    try{
         
        //const response = await pool.query("select category from im_categories where category_type = 'Intranet Ticket Priority' and enabled_p = 't'");                                     
        const response = await pool.query("select category_id, category from im_categories where category_type = 'Intranet Ticket Priority' and enabled_p = 't'");                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}
const catalog = async (req, res, next) => {
    try{
         
       // const response = await pool.query("select category from im_categories where category_type = 'Intranet Service Catalog' and enabled_p = 't' and aux_int1 is not null");
        const response = await pool.query("select category_id, category from im_categories where category_type = 'Intranet Service Catalog' and enabled_p = 't' and aux_int1 is not null");                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}
const status_ticket = async (req, res, next) => {
    try{
         
       // const response = await pool.query("select category from im_categories where category_type = 'Intranet Service Catalog' and enabled_p = 't' and aux_int1 is not null");
        const response = await pool.query("select category_id, category from im_categories where category_type = 'Intranet Ticket Status' and enabled_p = 't'");                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}
const solution_category = async (req, res, next) => {
    try{
         
      const response = await pool.query("select category_id, category from im_categories where category_type = 'Intranet Ticket Solution Category' and enabled_p = 't'");                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}
const customer_project = async (req, res, next) => {
    try{
        const  company_id   = req.params.company_id;
         
       // const response = await pool.query("select category from im_categories where category_type = 'Intranet Ticket Customer Project' and enabled_p = 't'");                                     
        const response = await pool.query(`select category_id, category from im_categories where 
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

const getTicketsAll = async (req, res, next) => {
    try{
        // aumentar rol 
        console.log('company_id', req.params.company_id )
         const  company_id   = req.params.company_id;
        //const response = await pool.query('SELECT * FROM im_tickets ORDER BY ticket_id ASC');
   
        const response = await pool.query(`select p.project_nr as NR, p.project_name as Nombre, 
          
                                            (SELECT string_agg(note, ', ') AS NOTE FROM im_hours WHERE project_id = p.project_id  GROUP BY project_id) ACTIVITIES,
                                            im_category_from_id(t.ticket_status_id) as STATUS, 
                                            im_category_from_id(t.ticket_type_id) as TYPE,
                                            im_category_from_id(t.ticket_prio_id) as PRIO, 
                                            acs_object__name(t.ticket_customer_contact_id) as CONTACT_NAME, 
                                            (SELECT email as MAIL FROM parties where party_id = t.ticket_customer_contact_id ) MAIL,
                                            acs_object__name(t.ticket_assignee_id) as ASSIGNEE, 
                                            acs_object__name(t.ticket_conf_item_id) as CONF_ITEM, 
                                            t.ticket_creation_date as CREATION_DATE, 
                                            t.ticket_done_date as DONE_DATE, t.ticket_irt as IRT, 
                                            t.ticket_mpt as MPT, 
                                            t.ticket_solution as TICKET_SOLUTION, 
                                            t.ticket_quoted_hours as QUOTED_HOURS, 
                                            im_category_from_id(t.ticket_customer_project) as CUSTOMER_PROJECT, 
                                            im_category_from_id(t.ticket_service_catalog) as SERVICE_CATALOG, 
                                            im_category_from_id(t.ticket_customer_company) as CUSTOMER_COMPANY, 
                                            im_category_from_id(t.ticket_custom_class) as CUSTOM_CLASS, 
                                            im_category_from_id(t.ticket_solution_category) as SOLUTION_CATEGORY,
                                            to_char(p.reported_hours_cache, '999D9') as REPORTED_HOURS 
                                            from im_tickets t, im_projects p, acs_objects o 
                                            where t.ticket_id = p.project_id 
                                            and t.ticket_id = o.object_id 
                                            and p.company_id = ${company_id} 
                                            order by t.ticket_creation_date DESC `);                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

const getCatalog = async (req, res, next) => {
    try{
        //paginacion
       // const response = await pool.query("select category from im_categories where category_type = 'Intranet Service Catalog' and enabled_p = 't' and aux_int1 is not null");
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

// tutorial https://dirask.com/posts/Node-js-Express-js-PostgreSQL-rows-pagination-jPEqm1
const getCatalogPage = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
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
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

/* const getServiceCatalog = async (req, res, next) => {
    try{
        // aumentar rol 
        console.log('category_id', req.params.category_id )
        const  category_id   = req.params.category_id;;
        //const response = await pool.query('SELECT * FROM im_tickets ORDER BY ticket_id ASC');
   
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
} */

const create_ticket = async (req, res, next) => {
    try{   
    var p_ticket_id           = req.body.p_ticket_id;
    var p_object_type         = req.body.p_object_type;//"'im_ticket'";//
    var p_creation_date       = 'now()';//req.body.p_creation_date;
    var p_creation_user       = req.body.p_creation_user;
    var p_creation_ip         = req.body.p_creation_ip;
    var p_context_id          = req.body.p_context_id;
    var p_ticket_name         = req.body.p_ticket_name;
    var p_ticket_customer_id  = req.body.p_ticket_customer_id;
    var p_ticket_type_id      = req.body.p_ticket_type_id;
    var p_ticket_status_id    = req.body.p_ticket_status_id;

    var p_ticket_prio_id             = req.body.p_ticket_prio_id;
    var p_parent_id                  = req.body.p_parent_id;
    var p_ticket_description         = req.body.p_ticket_description;
    var p_ticket_service_catalog     = req.body.p_ticket_service_catalog;
    var p_ticket_customer_company    = req.body.p_ticket_customer_company;
    var p_ticket_customer_project    = req.body.p_ticket_customer_project;
    var p_ticket_custom_class        = req.body.p_ticket_custom_class;
    var p_ticket_conf_item_id        = req.body.p_ticket_conf_item_id ;
    var p_ticket_customer_contact_id = req.body.p_ticket_customer_contact_id;
    var p_ticket_customer_deadline   = req.body.p_ticket_customer_deadline ;
 
    if(req.body.p_ticket_customer_deadline === ""){
        p_ticket_customer_deadline = "1900-01-01";
    }
    
    var p_ticket_solution_category   = req.body.p_ticket_solution_category ;
    console.log('cuerpo', req.body)
         
      const response = await pool.query(`SELECT public.im_ticket__new__api(
                                            ${p_ticket_id}, 
                                            '${p_object_type}', 
                                            ${p_creation_date},                    
                                            ${p_creation_user},  
                                            ${p_creation_ip},  
                                            ${p_context_id},  
                                            '${p_ticket_name}',  
                                            ${p_ticket_customer_id},  
                                            ${p_ticket_type_id},  
                                            ${p_ticket_status_id},
                                            ${p_ticket_prio_id},
                                            ${p_parent_id},
                                            '${p_ticket_description}',
                                            ${p_ticket_service_catalog},
                                            ${p_ticket_customer_company},
                                            ${p_ticket_customer_project},
                                            ${p_ticket_custom_class},
                                            ${p_ticket_conf_item_id},
                                            ${p_ticket_customer_contact_id},
                                            '${p_ticket_customer_deadline}',
                                            ${p_ticket_solution_category})`);                                     
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
      }
}

//Service Catalog Creation

const create_service = async (req, res, next) => {
    try{   
    var p_category        = req.body.p_category;//"'im_ticket'";//
    var p_category_description       = req.body.p_category_description;//req.body.p_creation_date;
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

// Servicio para obtener config items:

const getTechSystem = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
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
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

// Servicio para obtener config items en este caso servicios BTP como Integration service

const getBtpService = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
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
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

// Servicio para obtener config items que contengan certificados como Technical systemo o servicios BTP

const getCertInstance = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
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
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

// Servicio para obtener los tipos de config items

const getSapCategoryType = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
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
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

// Servicio para obtener config items que sean tipo SAP PSE (ABAP JAVA)

const getPse = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
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
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}


// Servicio para obtener config items que sean KEYSTORE y SAP PSE

const getPseKey = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
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
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

const getCert = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
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
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

const getAllCert = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
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
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

const getExpiredCert = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
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
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

const getValidCert = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
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
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

const getSoonToExpireCert = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
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
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

const getCertKpi = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
        const company_id   = req.params.company_id;
        const { page, size } = req.query;
        const query = `
                    
                    SELECT
                    (SELECT COUNT(*) FROM im_conf_items WHERE conf_item_type_id IN (10000391, 10000392) AND conf_item_customer_id = ${company_id} AND conf_item_status_id = '11700') AS total_cert,
                    (SELECT COUNT(*) FROM im_conf_items WHERE conf_item_type_id IN (10000391, 10000392) AND conf_item_customer_id = ${company_id} AND conf_item_status_id = '11700' AND CURRENT_DATE < cert_end_date - interval '30 days' ) AS valid_cert,
                    (SELECT COUNT(*) FROM im_conf_items WHERE conf_item_type_id IN (10000391, 10000392) AND conf_item_customer_id = ${company_id} AND conf_item_status_id = '11700' AND cert_end_date <= CURRENT_DATE) AS expired_cert,
                    (SELECT COUNT(*) FROM im_conf_items WHERE conf_item_type_id IN (10000391, 10000392) AND conf_item_customer_id = ${company_id} AND conf_item_status_id = '11700' AND cert_end_date > current_date AND current_date > cert_end_date - interval '30 days') AS soontoexpire_cert     
                    LIMIT $2
                    OFFSET (($1 - 1) * $2);
	
        `;
        try {
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

const getServiceCatalog = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
        const category_id   = req.params.category_id;
        const { page, size } = req.query;
        const query = `
                    
                        select category_id, category,
                        aux_string2 as category_detail, category_description, 
                        aux_int1 as hours, aux_int2 as lead_time, 
                        aux_string1 as downtime  
                        from im_categories 
                        where category_type = 'Intranet Service Catalog' 
                        and enabled_p = 't' 
                        and category_id= ${category_id}
                        ORDER BY category_id
                        LIMIT $2
                        OFFSET (($1 - 1) * $2);  
	
        `;
        try {
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

// SERVICIO PARA OBTENER LOS CATALOS DE NIVEL RAIZ (son padrees mas no hijos)

const getRootCatalog = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
        const { page, size } = req.query;
        const query = `
                    select 
                    category_id,
                    category,
                    aux_string2 as category_detail,
                    category_description,
                    aux_int1 as hours, 
                    aux_int2 as lead_time,
                    aux_string1 as downtime
                    from im_categories 
                    where category_type = 'Intranet Service Catalog' 
                    and enabled_p = 't' 
                    and category_id not in (SELECT child_id FROM im_category_hierarchy)
                    ORDER BY category
                    LIMIT $2
                    OFFSET (($1 - 1) * $2)
        `;
        try {
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

// SERVICIO PARA OBTENER LOS CATALOS DE NIVEL RAIZ (son padrees mas no hijos)

const getParentCatalog = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
        const parent_id   = req.params.parent_id;
        const { page, size } = req.query;
        const query = `
                    select 
                    category_id,
                    category,
                    aux_string2 as category_detail,
                    category_description,
                    aux_int1 as hours, 
                    aux_int2 as lead_time,
                    aux_string1 as downtime
                    from im_categories 
                    where category_type = 'Intranet Service Catalog' 
                    and enabled_p = 't' 
                    and category_id in (SELECT child_id FROM im_category_hierarchy where parent_id = ${parent_id} and category_id in (SELECT parent_id FROM im_category_hierarchy))
                    ORDER BY category
                    LIMIT $2
                    OFFSET (($1 - 1) * $2)
        `;
        try {
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

// SERVICIO PARA OBTENER LOS CATALOS DE NIVEL Hijo , los ultimos

const getChildCatalog = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
        const parent_id   = req.params.parent_id;
        const { page, size } = req.query;
        const query = `
                    select 
                    category_id,
                    category,
                    aux_string2 as category_detail,
                    category_description,
                    aux_int1 as hours, 
                    aux_int2 as lead_time,
                    aux_string1 as downtime
                    from im_categories 
                    where category_type = 'Intranet Service Catalog' 
                    and enabled_p = 't' 
                    and category_id in (SELECT child_id FROM im_category_hierarchy where parent_id = ${parent_id} and category_id not in (SELECT parent_id FROM im_category_hierarchy))
                    ORDER BY category
                    LIMIT $2
                    OFFSET (($1 - 1) * $2)
        `;
        try {
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

// SERVICIO PARA OBTENER LOS CATALOS DE NIVEL RAIZ (son padrees mas no hijos)

const getAllCatalog = async (req, res, next) => {
    try{
        //paginacion
        const client = await pool.connect(); // creates connection
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
                    ORDER BY category
                    LIMIT $2
                    OFFSET (($1 - 1) * $2)
        `;
        try {
            const { rows } = await client.query(query, [page, size]); // sends query
            res.status(200).json(rows);
        } finally {
            await client.release(); // releases connection
        }
    }
    catch (err) {
        next(err);
      }
}

module.exports = {
    getTickets,
    getTicketsAdmin,
    getTicketsHelpDesk,
    types,
    priority,
    catalog,
    customer_project,
    customer_company,
    customer_class,
    support_project,
    solution_category,
    system,
    create_ticket,
    status_ticket,
    getCompanyInfo,
    getTicketsAll,
    getCatalog,
    getCatalogPage,
    getServiceCatalog,
    create_service,
    getTechSystem,
    getRootCatalog,
    getParentCatalog,
    getChildCatalog,
    getAllCatalog,
    getPse,
    getCert,
    getBtpService,
    getCertInstance,
    getPseKey,
    getSapCategoryType,
    getAllCert,
    getExpiredCert,
    getValidCert,
    getSoonToExpireCert,
    getCertKpi
};
/*
ticket_prio_id,ticket_id, ticket_customer_project, ticket_customer_contact_id 

incidente, cambio o solicitud de servicio 
*/