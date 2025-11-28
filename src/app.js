const session = require('express-session');
const config = require('./config/config.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();

const memoryStore = new session.MemoryStore();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Importación de routers modularizados
const categoriesRouterTest = require('./routes/categories.routes.js');
const companyRouterTest = require('./routes/company.routes.js');
const confItemsRouterTest = require('./routes/conf_items.routes.js');
const projectsRouterTest = require('./routes/projects.routes.js');
const ticketRoutes = require('./routes/tickets.routes.js');
const serviceCatalogRoutes = require('./routes/service-catalog.routes.js');
const timesheetRoutes = require('./routes/timesheet.routes.js');
const solutionCategoryRoutes = require('./routes/solution-category.routes.js');
// Uso de routers
app.use(categoriesRouterTest);
app.use(companyRouterTest);
app.use(confItemsRouterTest);
app.use(projectsRouterTest);
app.use(ticketRoutes);
app.use(timesheetRoutes);
app.use(serviceCatalogRoutes);
app.use(solutionCategoryRoutes);

// Ruta raíz
app.get('/', function(req, res) {
  res.json({ status: 'API is ready listen request from ' + config.PORT });
});

module.exports = app;
