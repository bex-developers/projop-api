  
# This script deploys the REST API code (index.js) to Cloud Run. When it has
# run, try opening the URL of the newly deployed service, followed by "/1".
# Using Postman or another REST API tool, you can POST new appointments,
# search for appointments, and delete appointmenst.

GOOGLE_CLOUD_PROJECT=p2021-0002-bex-soporte-dev
ROOT_PASSWORD=Basis2020$
REGION=us-west4

# gcloud builds submit --tag gcr.io/$PROJECT_ID/pet-theory-appointments \
#   --project $PROJECT_ID

gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/projop-api \
  --project $PROJECT_ID

# gcloud beta run deploy pet-theory-appointments \
#   --image gcr.io/$PROJECT_ID/pet-theory-appointments \
#   --platform managed \
#   --region us-central1 \
#   --allow-unauthenticated \
#   --set-cloudsql-instances $INST_CON_NAME \
#   --update-env-vars INST_CON_NAME=$INST_CON_NAME,SQL_USER=root,SQL_PASSWORD=$ROOT_PASSWORD,SQL_NAME=$DB_NAME \
#   --project $PROJECT_ID

gcloud run deploy projop-api \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/projop-api \
  --platform managed \
  --region us-west4 \
  --allow-unauthenticated