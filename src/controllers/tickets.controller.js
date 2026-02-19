const pool = require('../config/db');

// Funciones relacionadas con tickets

const getTickets = async (req, res, next) => {
    try {
        // aumentar rol 
        console.log('company_id', req.params.company_id)
        const company_id = req.params.company_id;
        const fecha_inicial = req.params.fecha_inicial;
        const fecha_final = req.params.fecha_final;
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
    try {
        const fecha_inicial = req.params.fecha_inicial;
        const fecha_final = req.params.fecha_final;
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
    try {
        const person_id = req.params.person_id;
        const fecha_inicial = req.params.fecha_inicial;
        const fecha_final = req.params.fecha_final;
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


// const getOpenTicketsEmail = async (req, res, next) => {
//     try {
//         const client = await pool.connect();
//         const user_email = req.params.user_email;

//         const { page, size } = req.query;

//         const {
//             company_type_ids,  // IDs de tipos de empresa: "57,58,59"
//             status_ids,        // IDs de estados: "80000,80001"
//             ticket_type_ids    // IDs de tipos de ticket: "30200,30201"
//         } = req.query;

//         // ====== Construir condiciones dinámicas ======
//         let filterConditions = [];
//         let filterParams = [page, size]; // Parámetros iniciales ($1, $2)
//         let paramCounter = 3;

//         // Filtro por company_type_ids
//         if (company_type_ids) {
//             const companyTypeArray = Array.isArray(company_type_ids)
//                 ? company_type_ids
//                 : company_type_ids.split(',').map(id => id.trim());

//             const placeholders = companyTypeArray.map(() => `$${paramCounter++}`).join(',');
//             filterConditions.push(`c.company_type_id IN (${placeholders})`);
//             filterParams.push(...companyTypeArray);
//         }

//         // Filtro por status_ids
//         if (status_ids) {
//             const statusArray = Array.isArray(status_ids)
//                 ? status_ids
//                 : status_ids.split(',').map(id => id.trim());

//             const placeholders = statusArray.map(() => `$${paramCounter++}`).join(',');
//             filterConditions.push(`t.ticket_status_id IN (${placeholders})`);
//             filterParams.push(...statusArray);
//         }

//         // Filtro por ticket_type_ids
//         if (ticket_type_ids) {
//             const typeArray = Array.isArray(ticket_type_ids)
//                 ? ticket_type_ids
//                 : ticket_type_ids.split(',').map(id => id.trim());

//             const placeholders = typeArray.map(() => `$${paramCounter++}`).join(',');
//             filterConditions.push(`t.ticket_type_id IN (${placeholders})`);
//             filterParams.push(...typeArray);
//         }

//         // Construir el WHERE dinámico
//         const dynamicFilters = filterConditions.length > 0
//             ? 'AND ' + filterConditions.join(' AND ')
//             : '';

//         // ====== Query con JOINS y filtros dinámicos ======
//         const query = `
//             SELECT p.project_nr AS NR,
//                    t.ticket_id AS TICKET_ID,
//                    p.project_name AS Nombre, 
//                    im_category_from_id(t.ticket_status_id) AS STATUS, 
//                    im_category_from_id(t.ticket_type_id) AS TYPE, 
//                    im_category_from_id(t.ticket_prio_id) AS PRIO, 
//                    acs_object__name(t.ticket_customer_contact_id) AS CONTACT_NAME, 
//                    acs_object__name(t.ticket_assignee_id) AS ASSIGNEE, 
//                    acs_object__name(t.ticket_conf_item_id) AS CONF_ITEM, 
//                    t.ticket_creation_date AS CREATION_DATE, 
//                    t.ticket_done_date AS DONE_DATE, 
//                    t.ticket_irt AS IRT, 
//                    t.ticket_mpt AS MPT, 
//                    t.ticket_solution AS TICKET_SOLUTION, 
//                    t.ticket_quoted_hours AS QUOTED_HOURS, 
//                    im_category_from_id(t.ticket_customer_project) AS CUSTOMER_PROJECT, 
//                    im_category_from_id(t.ticket_service_catalog) AS SERVICE_CATALOG, 
//                    im_category_from_id(t.ticket_customer_company) AS CUSTOMER_COMPANY, 
//                    im_category_from_id(t.ticket_custom_class) AS CUSTOM_CLASS, 
//                    im_category_from_id(t.ticket_solution_category) AS SOLUTION_CATEGORY, 
//                    to_char(p.reported_hours_cache, '999D9') AS REPORTED_HOURS 
//             FROM im_tickets t
//             INNER JOIN im_projects p ON t.ticket_id = p.project_id
//             INNER JOIN im_companies c ON p.company_id = c.company_id
//             INNER JOIN acs_objects o ON t.ticket_id = o.object_id
//             WHERE t.ticket_status_id <> 30001
//               AND t.ticket_assignee_id = (
//                     SELECT u.user_id AS user_id
//                     FROM users u
//                     INNER JOIN im_employees e ON u.user_id = e.employee_id
//                     WHERE u.username = $${paramCounter}
//               )
//               ${dynamicFilters}
//             ORDER BY 
//                 CASE 
//                     WHEN t.ticket_status_id = 30096 THEN 1
//                     ELSE 0
//                 END,
//                 t.ticket_creation_date
//             LIMIT $2
//             OFFSET (($1 - 1) * $2)
//         `;

//         // Agregar user_email al final de los parámetros
//         filterParams.push(user_email);

//         try {
//             const { rows } = await client.query(query, filterParams);
//             res.status(200).json(rows);
//         } finally {
//             await client.release();
//         }
//     } catch (err) {
//         next(err);
//     }
// };


const getOpenTicketsEmail = async (req, res, next) => {
    try {
        const client = await pool.connect();
        const user_email = req.params.user_email;

        const { page, size } = req.query;

        const {
            company_type_ids,  // IDs de tipos de empresa: "57,58,59"
            status_ids,        // IDs de estados: "80000,80001"
            ticket_type_ids,   // IDs de tipos de ticket: "30200,30201"
            date_from,         // Fecha inicio: "2026-02-01"
            date_to            // Fecha fin: "2026-02-28"
        } = req.query;

        // ====== Construir condiciones dinámicas ======
        let filterConditions = [];
        let filterParams = [page, size]; // Parámetros iniciales ($1, $2)
        let paramCounter = 3;

        // Filtro por company_type_ids
        if (company_type_ids) {
            const companyTypeArray = Array.isArray(company_type_ids)
                ? company_type_ids
                : company_type_ids.split(',').map(id => id.trim());

            const placeholders = companyTypeArray.map(() => `$${paramCounter++}`).join(',');
            filterConditions.push(`c.company_type_id IN (${placeholders})`);
            filterParams.push(...companyTypeArray);
        }

        // Filtro por status_ids
        if (status_ids) {
            const statusArray = Array.isArray(status_ids)
                ? status_ids
                : status_ids.split(',').map(id => id.trim());

            const placeholders = statusArray.map(() => `$${paramCounter++}`).join(',');
            filterConditions.push(`t.ticket_status_id IN (${placeholders})`);
            filterParams.push(...statusArray);
        }

        // Filtro por ticket_type_ids
        if (ticket_type_ids) {
            const typeArray = Array.isArray(ticket_type_ids)
                ? ticket_type_ids
                : ticket_type_ids.split(',').map(id => id.trim());

            const placeholders = typeArray.map(() => `$${paramCounter++}`).join(',');
            filterConditions.push(`t.ticket_type_id IN (${placeholders})`);
            filterParams.push(...typeArray);
        }

        // Filtro por rango de fechas (mes actual u otro rango)
        if (date_from) {
            filterConditions.push(`t.ticket_creation_date >= $${paramCounter++}`);
            filterParams.push(date_from);
        }

        if (date_to) {
            filterConditions.push(`t.ticket_creation_date <= $${paramCounter++}`);
            filterParams.push(date_to + ' 23:59:59');
        }

        // Construir el WHERE dinámico
        const dynamicFilters = filterConditions.length > 0
            ? 'AND ' + filterConditions.join(' AND ')
            : '';

        // ====== Query con JOINS y filtros dinámicos ======
        const query = `
            SELECT p.project_nr AS NR,
                   t.ticket_id AS TICKET_ID,
                   p.project_name AS Nombre, 
                   im_category_from_id(t.ticket_status_id) AS STATUS, 
                   im_category_from_id(t.ticket_type_id) AS TYPE, 
                   im_category_from_id(t.ticket_prio_id) AS PRIO, 
                   acs_object__name(t.ticket_customer_contact_id) AS CONTACT_NAME, 
                   acs_object__name(t.ticket_assignee_id) AS ASSIGNEE, 
                   acs_object__name(t.ticket_conf_item_id) AS CONF_ITEM, 
                   t.ticket_creation_date AS CREATION_DATE, 
                   t.ticket_done_date AS DONE_DATE, 
                   t.ticket_irt AS IRT, 
                   t.ticket_mpt AS MPT, 
                   t.ticket_solution AS TICKET_SOLUTION, 
                   t.ticket_quoted_hours AS QUOTED_HOURS, 
                   im_category_from_id(t.ticket_customer_project) AS CUSTOMER_PROJECT, 
                   im_category_from_id(t.ticket_service_catalog) AS SERVICE_CATALOG, 
                   im_category_from_id(t.ticket_customer_company) AS CUSTOMER_COMPANY, 
                   im_category_from_id(t.ticket_custom_class) AS CUSTOM_CLASS, 
                   im_category_from_id(t.ticket_solution_category) AS SOLUTION_CATEGORY, 
                   to_char(p.reported_hours_cache, '999D9') AS REPORTED_HOURS 
            FROM im_tickets t
            INNER JOIN im_projects p ON t.ticket_id = p.project_id
            INNER JOIN im_companies c ON p.company_id = c.company_id
            INNER JOIN acs_objects o ON t.ticket_id = o.object_id
            WHERE t.ticket_status_id <> 30001
              AND t.ticket_assignee_id = (
                    SELECT u.user_id AS user_id
                    FROM users u
                    INNER JOIN im_employees e ON u.user_id = e.employee_id
                    WHERE u.username = $${paramCounter}
              )
              ${dynamicFilters}
            ORDER BY 
                CASE 
                    WHEN t.ticket_status_id = 30096 THEN 1
                    ELSE 0
                END,
                t.ticket_creation_date
            LIMIT $2
            OFFSET (($1 - 1) * $2)
        `;

        // Agregar user_email al final de los parámetros
        filterParams.push(user_email);

        try {
            const { rows } = await client.query(query, filterParams);
            res.status(200).json(rows);
        } finally {
            await client.release();
        }
    } catch (err) {
        next(err);
    }
};

// const getTicketsByCompanyId = async (req, res, next) => {
//     try {
//         const client = await pool.connect();
//         const company_id = req.params.company_id;

//         const { page, size } = req.query;
//         const { status_ids, ticket_type_ids } = req.query;

//         let filterConditions = [];
//         let filterParams = [page, size, company_id];
//         let paramCounter = 4;

//         if (status_ids) {
//             const statusArray = Array.isArray(status_ids)
//                 ? status_ids
//                 : status_ids.split(',').map(id => id.trim());

//             const placeholders = statusArray.map(() => `$${paramCounter++}`).join(',');
//             filterConditions.push(`t.ticket_status_id IN (${placeholders})`);
//             filterParams.push(...statusArray);
//         }

//         if (ticket_type_ids) {
//             const typeArray = Array.isArray(ticket_type_ids)
//                 ? ticket_type_ids
//                 : ticket_type_ids.split(',').map(id => id.trim());

//             const placeholders = typeArray.map(() => `$${paramCounter++}`).join(',');
//             filterConditions.push(`t.ticket_type_id IN (${placeholders})`);
//             filterParams.push(...typeArray);
//         }

//         const dynamicFilters = filterConditions.length > 0
//             ? 'AND ' + filterConditions.join(' AND ')
//             : '';

//         const query = `
//             SELECT 
//                 p.project_nr                                AS NR,
//                 t.ticket_id                                 AS TICKET_ID,
//                 p.project_name                              AS NOMBRE,
//                 im_category_from_id(t.ticket_status_id)    AS STATUS,
//                 im_category_from_id(t.ticket_type_id)      AS TYPE,
//                 im_category_from_id(t.ticket_prio_id)      AS PRIO,
//                 acs_object__name(t.ticket_assignee_id)     AS ASSIGNEE,
//                 acs_object__name(t.ticket_conf_item_id)    AS CONF_ITEM,
//                 t.ticket_creation_date                     AS CREATION_DATE,
//                 t.ticket_done_date                         AS DONE_DATE,
//                 t.ticket_solution                          AS TICKET_SOLUTION,
//                 t.ticket_quoted_hours                      AS QUOTED_HOURS,
//                 to_char(p.reported_hours_cache, '999D9')   AS REPORTED_HOURS,
//                 c.company_name                             AS COMPANY_NAME
//             FROM im_tickets t
//             INNER JOIN im_projects p  ON t.ticket_id = p.project_id
//             INNER JOIN im_companies c ON p.company_id = c.company_id
//             WHERE t.ticket_status_id <> 30001
//               AND p.company_id = $3
//               ${dynamicFilters}
//             ORDER BY
//                 CASE
//                     WHEN t.ticket_status_id = 30096 THEN 1
//                     ELSE 0
//                 END,
//                 t.ticket_creation_date DESC
//             LIMIT $2
//             OFFSET (($1 - 1) * $2)
//         `;

//         try {
//             const { rows } = await client.query(query, filterParams);
//             res.status(200).json(rows);
//         } finally {
//             client.release();
//         }
//     } catch (err) {
//         next(err);
//     }
// };

const getTicketsByCompanyId = async (req, res, next) => {
    try {
        const client = await pool.connect();
        const company_id = req.params.company_id;

        const { page, size } = req.query;
        const { status_ids, ticket_type_ids, date_from, date_to } = req.query;

        let filterConditions = [];
        let filterParams = [page, size, company_id];
        let paramCounter = 4;

        if (status_ids) {
            const statusArray = Array.isArray(status_ids)
                ? status_ids
                : status_ids.split(',').map(id => id.trim());

            const placeholders = statusArray.map(() => `$${paramCounter++}`).join(',');
            filterConditions.push(`t.ticket_status_id IN (${placeholders})`);
            filterParams.push(...statusArray);
        }

        if (ticket_type_ids) {
            const typeArray = Array.isArray(ticket_type_ids)
                ? ticket_type_ids
                : ticket_type_ids.split(',').map(id => id.trim());

            const placeholders = typeArray.map(() => `$${paramCounter++}`).join(',');
            filterConditions.push(`t.ticket_type_id IN (${placeholders})`);
            filterParams.push(...typeArray);
        }

        // Filtro por rango de fechas (mes actual u otro rango)
        if (date_from) {
            filterConditions.push(`t.ticket_creation_date >= $${paramCounter++}`);
            filterParams.push(date_from);
        }

        if (date_to) {
            filterConditions.push(`t.ticket_creation_date <= $${paramCounter++}`);
            filterParams.push(date_to + ' 23:59:59');
        }

        const dynamicFilters = filterConditions.length > 0
            ? 'AND ' + filterConditions.join(' AND ')
            : '';

        const query = `
            SELECT 
                p.project_nr                                AS NR,
                t.ticket_id                                 AS TICKET_ID,
                p.project_name                              AS NOMBRE,
                im_category_from_id(t.ticket_status_id)    AS STATUS,
                im_category_from_id(t.ticket_type_id)      AS TYPE,
                im_category_from_id(t.ticket_prio_id)      AS PRIO,
                acs_object__name(t.ticket_assignee_id)     AS ASSIGNEE,
                acs_object__name(t.ticket_conf_item_id)    AS CONF_ITEM,
                t.ticket_creation_date                     AS CREATION_DATE,
                t.ticket_done_date                         AS DONE_DATE,
                t.ticket_solution                          AS TICKET_SOLUTION,
                t.ticket_quoted_hours                      AS QUOTED_HOURS,
                to_char(p.reported_hours_cache, '999D9')   AS REPORTED_HOURS,
                c.company_name                             AS COMPANY_NAME
            FROM im_tickets t
            INNER JOIN im_projects p  ON t.ticket_id = p.project_id
            INNER JOIN im_companies c ON p.company_id = c.company_id
            WHERE t.ticket_status_id <> 30001
              AND p.company_id = $3
              ${dynamicFilters}
            ORDER BY
                CASE
                    WHEN t.ticket_status_id = 30096 THEN 1
                    ELSE 0
                END,
                t.ticket_creation_date DESC
            LIMIT $2
            OFFSET (($1 - 1) * $2)
        `;

        try {
            const { rows } = await client.query(query, filterParams);
            res.status(200).json(rows);
        } finally {
            client.release();
        }
    } catch (err) {
        next(err);
    }
};

const getTicketsAll = async (req, res, next) => {
    try {
        // aumentar rol 
        console.log('company_id', req.params.company_id)
        const company_id = req.params.company_id;
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


// const getTicket = async (req, res, next) => {
//     try {
//         const client = await pool.connect();
//         const ticket_id = req.params.ticket_id;
//         const { page, size } = req.query;

//         const query = `
//             select 
//                 p.project_nr as NR,
//                 t.ticket_id as TICKET_ID,
//                 t.ticket_type_id as TICKET_TYPE_ID,
//                 t.ticket_service_catalog_new as TICKET_SERVICE_CATALOG_NEW,
//                 t.ticket_solution_category_new as TICKET_SOLUTION_CATEGORY_NEW,
//                 p.project_name as Nombre, 
//                 im_category_from_id(t.ticket_status_id) as STATUS, 
//                 im_category_from_id(t.ticket_type_id) as TYPE, 
//                 im_category_from_id(t.ticket_prio_id) as PRIO, 
//                 acs_object__name(t.ticket_customer_contact_id) as CONTACT_NAME, 
//                 acs_object__name(t.ticket_assignee_id) as ASSIGNEE, 
//                 acs_object__name(t.ticket_conf_item_id) as CONF_ITEM, 
//                 t.ticket_creation_date as CREATION_DATE, 
//                 t.ticket_done_date as DONE_DATE, 
//                 t.ticket_irt as IRT, 
//                 t.ticket_mpt as MPT, 
//                 t.ticket_solution as TICKET_SOLUTION, 
//                 t.ticket_quoted_hours as QUOTED_HOURS, 
//                 im_category_from_id(t.ticket_customer_project) as CUSTOMER_PROJECT, 
//                 im_category_from_id(t.ticket_service_catalog) as SERVICE_CATALOG, 
//                 im_category_from_id(t.ticket_customer_company) as CUSTOMER_COMPANY, 
//                 im_category_from_id(t.ticket_custom_class) as CUSTOM_CLASS, 
//                 im_category_from_id(t.ticket_solution_category) as SOLUTION_CATEGORY, 
//                 to_char(p.reported_hours_cache, '999D9') as REPORTED_HOURS,

//                 (
//                     SELECT SUM(h.hours)
//                     FROM im_hours h
//                     WHERE h.user_id = t.ticket_assignee_id
//                       AND h.project_id IN (
//                             SELECT children.project_id
//                             FROM im_projects parent,
//                                  im_projects children
//                             WHERE children.tree_sortkey BETWEEN parent.tree_sortkey AND tree_right(parent.tree_sortkey)
//                               AND parent.project_id = t.ticket_id
//                             UNION
//                             SELECT t.ticket_id
//                       )
//                 ) AS total_hours_user

//             from im_tickets t, im_projects p, acs_objects o 
//             where t.ticket_id = ${ticket_id}
//             and t.ticket_id = p.project_id 
//             and t.ticket_id = o.object_id 
//             LIMIT $2
//             OFFSET (($1 - 1) * $2)
//         `;

//         try {
//             const { rows } = await client.query(query, [page, size]);
//             res.status(200).json(rows);
//         } finally {
//             await client.release();
//         }
//     } catch (err) {
//         next(err);
//     }
// };


const getTicket = async (req, res, next) => {
    try {
        const client = await pool.connect();
        const ticket_id = req.params.ticket_id;
        const { page, size } = req.query;

        const query = `
            select 
                p.project_nr as NR,
                t.ticket_id as TICKET_ID,
                t.ticket_type_id as TICKET_TYPE_ID,
                t.ticket_service_catalog_new as TICKET_SERVICE_CATALOG_NEW,
                t.ticket_solution_category_new as TICKET_SOLUTION_CATEGORY_NEW,
                p.project_name as Nombre, 
                im_category_from_id(t.ticket_status_id) as STATUS, 
                im_category_from_id(t.ticket_type_id) as TYPE, 
                im_category_from_id(t.ticket_prio_id) as PRIO, 
                acs_object__name(t.ticket_customer_contact_id) as CONTACT_NAME, 
                acs_object__name(t.ticket_assignee_id) as ASSIGNEE, 
                acs_object__name(t.ticket_conf_item_id) as CONF_ITEM, 
                t.ticket_creation_date as CREATION_DATE, 
                t.ticket_done_date as DONE_DATE, 
                t.ticket_irt as IRT, 
                t.ticket_mpt as MPT, 
                t.ticket_solution as TICKET_SOLUTION, 
                t.ticket_quoted_hours as QUOTED_HOURS, 
                im_category_from_id(t.ticket_customer_project) as CUSTOMER_PROJECT, 
                im_category_from_id(t.ticket_service_catalog) as SERVICE_CATALOG, 
                im_category_from_id(t.ticket_customer_company) as CUSTOMER_COMPANY, 
                im_category_from_id(t.ticket_custom_class) as CUSTOM_CLASS, 
                im_category_from_id(t.ticket_solution_category) as SOLUTION_CATEGORY, 
                to_char(p.reported_hours_cache, '999D9') as REPORTED_HOURS,

                (
                    SELECT SUM(h.hours)
                    FROM im_hours h
                    WHERE h.user_id = t.ticket_assignee_id
                      AND h.project_id IN (
                            SELECT children.project_id
                            FROM im_projects parent,
                                 im_projects children
                            WHERE children.tree_sortkey BETWEEN parent.tree_sortkey 
                                                          AND tree_right(parent.tree_sortkey)
                              AND parent.project_id = t.ticket_id
                            UNION
                            SELECT t.ticket_id
                      )
                ) AS total_hours_user,

                (
                    SELECT COUNT(*)
                    FROM acs_rels r
                    WHERE r.object_id_one = t.ticket_id
                      AND r.rel_type = 'im_biz_object_member'
                ) AS number_members_in_ticket

            from im_tickets t, im_projects p, acs_objects o 
            where t.ticket_id = $3
            and t.ticket_id = p.project_id 
            and t.ticket_id = o.object_id 
            LIMIT $2
            OFFSET (($1 - 1) * $2)
        `;

        try {
            const { rows } = await client.query(query, [page, size, ticket_id]);
            res.status(200).json(rows);
        } finally {
            await client.release();
        }
    } catch (err) {
        next(err);
    }
};




const create_ticket = async (req, res, next) => {
    try {
        const {
            p_ticket_id,
            p_object_type,
            p_creation_user,
            p_creation_ip,
            p_context_id,
            p_ticket_name,
            p_ticket_customer_id,
            p_ticket_type_id,
            p_ticket_status_id,
            p_ticket_prio_id,
            p_parent_id,
            p_ticket_description,
            p_ticket_service_catalog,
            p_ticket_customer_company,
            p_ticket_customer_project,
            p_ticket_custom_class,
            p_ticket_conf_item_id,
            p_ticket_customer_contact_id,
            p_ticket_customer_deadline,
            p_ticket_solution_category,
            // nuevos campos
            p_ticket_assignee_id,
            p_ticket_service_catalog_new,
            p_bex_ticket_overtime,
            p_bex_ticket_downtime_hours,
            p_bex_ticket_customer_initial_date,
            p_ticket_config_item_new
        } = req.body;

        const p_creation_date = 'now()';

        // Valor por defecto si no hay fecha
        const deadline = p_ticket_customer_deadline && p_ticket_customer_deadline !== ""
            ? `'${p_ticket_customer_deadline}'`
            : "'1900-01-01'";

        const initial_date = p_bex_ticket_customer_initial_date && p_bex_ticket_customer_initial_date !== ""
            ? `'${p_bex_ticket_customer_initial_date}'`
            : "'1900-01-01'";

        // Ejecuta la nueva función V2
        const query = `
      SELECT public.im_ticket__new__api_v2(
        ${p_ticket_id || null},
        '${p_object_type}',
        ${p_creation_date},
        ${p_creation_user || null},
        '${p_creation_ip}',
        ${p_context_id || null},
        '${p_ticket_name}',
        ${p_ticket_customer_id || null},
        ${p_ticket_type_id || null},
        ${p_ticket_status_id || null},
        ${p_ticket_prio_id || null},
        ${p_parent_id || null},
        '${p_ticket_description}',
        ${p_ticket_service_catalog || null},
        ${p_ticket_customer_company || null},
        ${p_ticket_customer_project || null},
        ${p_ticket_custom_class || null},
        ${p_ticket_conf_item_id || null},
        ${p_ticket_customer_contact_id || null},
        ${deadline},
        ${p_ticket_solution_category || null},
        ${p_ticket_assignee_id || null},
        ${p_ticket_service_catalog_new || null},
        '${p_bex_ticket_overtime || ''}',
        ${p_bex_ticket_downtime_hours || 0},
        ${initial_date},
        ${p_ticket_config_item_new || null}
      )
    `;

        console.log('🧾 Ejecutando query:\n', query);

        const response = await pool.query(query);
        res.status(200).json(response.rows);
    } catch (err) {
        console.error('❌ Error en create_ticket_v2:', err);
        next(err);
    }
};
const create_ticket_v3 = async (req, res, next) => {
    try {
        const {
            p_ticket_id,
            p_object_type,
            p_creation_user,
            p_creation_ip,
            p_context_id,
            p_ticket_name,
            p_ticket_customer_id,
            p_ticket_type_id,
            p_ticket_status_id,
            p_ticket_prio_id,
            p_parent_id,
            p_ticket_description,
            p_ticket_service_catalog,
            p_ticket_customer_company,
            p_ticket_customer_project,
            p_ticket_custom_class,
            p_ticket_conf_item_id,
            p_ticket_customer_contact_id,
            p_ticket_customer_deadline,
            p_ticket_solution_category,
            // nuevos campos
            p_ticket_assignee_id,
            p_ticket_service_catalog_new,
            p_bex_ticket_overtime,
            p_bex_ticket_downtime_hours,
            p_bex_ticket_customer_initial_date,
            p_ticket_config_item_new
        } = req.body;

        const p_creation_date = 'now()';

        // Valor por defecto si no hay fecha
        const deadline = p_ticket_customer_deadline && p_ticket_customer_deadline !== ""
            ? `'${p_ticket_customer_deadline}'`
            : "'1900-01-01'";

        const initial_date = p_bex_ticket_customer_initial_date && p_bex_ticket_customer_initial_date !== ""
            ? `'${p_bex_ticket_customer_initial_date}'`
            : "'1900-01-01'";

        // Ejecuta la nueva función V2
        const query = `
      SELECT public.im_ticket__new__api_v3(
        ${p_ticket_id || null},
        '${p_object_type}',
        ${p_creation_date},
        ${p_creation_user || null},
        '${p_creation_ip}',
        ${p_context_id || null},
        '${p_ticket_name}',
        ${p_ticket_customer_id || null},
        ${p_ticket_type_id || null},
        ${p_ticket_status_id || null},
        ${p_ticket_prio_id || null},
        ${p_parent_id || null},
        '${p_ticket_description}',
        ${p_ticket_service_catalog || null},
        ${p_ticket_customer_company || null},
        ${p_ticket_customer_project || null},
        ${p_ticket_custom_class || null},
        ${p_ticket_conf_item_id || null},
        ${p_ticket_customer_contact_id || null},
        ${deadline},
        ${p_ticket_solution_category || null},
        ${p_ticket_assignee_id || null},
        ${p_ticket_service_catalog_new || null},
        '${p_bex_ticket_overtime || ''}',
        ${p_bex_ticket_downtime_hours || 0},
        ${initial_date},
        ${p_ticket_config_item_new || null}
      )
    `;

        console.log('🧾 Ejecutando query:\n', query);

        const response = await pool.query(query);
        res.status(200).json(response.rows);
    } catch (err) {
        console.error('❌ Error en create_ticket_v2:', err);
        next(err);
    }
};





const update_ticket = async (req, res, next) => {
    try {
        const ticket_id = req.params.ticket_id;

        const {
            ticket_status_id,
            ticket_quoted_hours,
            ticket_solution,
            ticket_service_catalog_new,
            ticket_solution_category_new
        } = req.body;

        console.log("cuerpo", req.body);

        // Validar campos obligatorios
        if (
            ticket_status_id === undefined ||
            ticket_quoted_hours === undefined ||
            ticket_solution === undefined
        ) {
            return res.status(400).json({
                error: "ticket_status_id, ticket_quoted_hours y ticket_solution son obligatorios"
            });
        }

        // Construcción dinámica del UPDATE
        let fields = [];

        // Obligatorios
        fields.push(`ticket_status_id = ${ticket_status_id}`);
        fields.push(`ticket_quoted_hours = ${ticket_quoted_hours}`);
        fields.push(`ticket_solution = '${ticket_solution}'`);

        // Opcionales
        if (ticket_service_catalog_new !== undefined) {
            fields.push(`ticket_service_catalog_new = ${ticket_service_catalog_new}`);
        }

        if (ticket_solution_category_new !== undefined) {
            fields.push(`ticket_solution_category_new = ${ticket_solution_category_new}`);
        }

        const query = `
            UPDATE im_tickets
            SET ${fields.join(", ")}
            WHERE ticket_id = ${ticket_id}
        `;

        await pool.query(query);

        res.status(200).json({ message: "Ticket updated successfully" });

    } catch (err) {
        next(err);
    }
};

const status_ticket = async (req, res, next) => {
    try {
        const query = `
            select category_id, category 
            from im_categories 
            where category_type = 'Intranet Ticket Status' 
            and enabled_p = 't'
            and category not in ('Closed','Open')
        `;

        const response = await pool.query(query);
        res.status(200).json(response.rows);
    } catch (err) {
        console.error("Error al ejecutar status_ticket:", err); // ✅ Mensaje explícito
        return res.status(500).json({
            message: err.message,
            stack: err.stack, // ✅ Mostrar trazado completo
        });
    }
};

const ticket_type = async (req, res, next) => {
    try {
        const query = `
            SELECT c.category_id, c.category 
            FROM im_categories c
            INNER JOIN im_category_hierarchy ch ON c.category_id = ch.child_id
            INNER JOIN im_categories parent ON ch.parent_id = parent.category_id
            WHERE parent.category IN ($1, $2)
            AND parent.category_type = $3
            AND parent.enabled_p = $4
            AND c.enabled_p = $4
        `;

        const values = ['Service Req Ticket', 'Incident Ticket', 'Intranet Ticket Type', 't'];
        const response = await pool.query(query, values);
        res.status(200).json(response.rows);
    } catch (err) {
        console.error("Error al ejecutar ticket_type:", err);
        return res.status(500).json({
            message: err.message,
            stack: err.stack,
        });
    }
};

const ticket_company_type = async (req, res, next) => {
    try {
        const query = `
            select category_id, category 
            from im_categories 
            where category_type = 'Intranet Company Type' 
            and enabled_p = 't'
            and category in ('Internal', 'Customer')
        `;

        const response = await pool.query(query);
        res.status(200).json(response.rows);
    } catch (err) {
        console.error("Error al ejecutar status_ticket:", err); // ✅ Mensaje explícito
        return res.status(500).json({
            message: err.message,
            stack: err.stack, // ✅ Mostrar trazado completo
        });
    }
};

const solution_category = async (req, res, next) => {
    try {
        const response = await pool.query("select category_id, category from im_categories where category_type = 'Intranet Ticket Solution Category' and enabled_p = 't'");
        res.status(200).json(response.rows);
    }
    catch (err) {
        next(err);
    }
}

const addMemberToTicket = async (req, res) => {
    const client = await pool.connect();
    try {
        const { ticket_id } = req.params;
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "user_id es requerido" });
        }

        await client.query('BEGIN');

        // 1. Ejecutar acs_rel__new
        const relResult = await client.query(
            `
            SELECT acs_rel__new(
                NULL::integer,
                'im_biz_object_member'::varchar,
                $1::integer,
                $2::integer,
                $1::integer,
                NULL::integer,
                NULL::varchar
            ) AS rel_id;
            `,
            [ticket_id, user_id]
        );

        const rel_id = relResult.rows[0].rel_id;

        // 2. Insertar en im_biz_object_members
        await client.query(
            `
            INSERT INTO im_biz_object_members (rel_id, object_role_id)
            VALUES ($1, 1300);
            `,
            [rel_id]
        );

        await client.query('COMMIT');

        return res.json({
            message: "Miembro agregado correctamente",
            rel_id
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error agregando miembro:", error);
        return res.status(500).json({ error: "Error agregando miembro" });
    } finally {
        client.release();
    }
};

module.exports = {
    getTickets,
    getTicketsAdmin,
    getTicketsHelpDesk,
    getOpenTicketsEmail,
    getTicketsAll,
    getTicket,
    create_ticket,
    update_ticket,
    status_ticket,
    solution_category,
    addMemberToTicket,
    ticket_type, 
    ticket_company_type,
    getTicketsByCompanyId
};
