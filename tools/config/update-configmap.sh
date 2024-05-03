set -euo pipefail

ENV_VAL=$1
APP_NAME=$2
OPENSHIFT_NAMESPACE_NO_ENV=$3
COMMON_NAMESPACE=$4
D365_API_PREFIX=$5
D365_API_KEY_HEADER=$6
D365_API_KEY_VALUE=$7
SOAM_CLIENT_ID=$8
SOAM_CLIENT_SECRET=$9
SOAM_CLIENT_ID_IDIR=${10}
SOAM_CLIENT_SECRET_IDIR=${11}

SOAM_KC_REALM_ID="standard"
SOAM_KC="$ENV_VAL.loginproxy.gov.bc.ca"
D365_API_ENDPOINT="http://$D365_API_PREFIX-$ENV_VAL:5091"

openshiftNamespace="$OPENSHIFT_NAMESPACE_NO_ENV-$ENV_VAL"
if [ "$ENV_VAL" = "dev" ] || [ "$ENV_VAL" = "test" ]; then
  openshiftNamespace="$OPENSHIFT_NAMESPACE_NO_ENV-dev"
elif [ "$ENV_VAL" = "uat" ]; then
  openshiftNamespace="$OPENSHIFT_NAMESPACE_NO_ENV-test"
fi

SERVER_FRONTEND="https://ofm-frontend-$ENV_VAL-$openshiftNamespace.apps.silver.devops.gov.bc.ca"

siteMinderLogoutUrl=""
logLevel=""
if [ "$ENV_VAL" != "prod" ]
then
  siteMinderLogoutUrl="https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl="
  logLevel="verbose"
else
  SERVER_FRONTEND="https://ofm.gov.bc.ca" # TODO: Set this to whatever our prod domain will be
  siteMinderLogoutUrl="https://logon7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl="
  logLevel="error"
fi

echo Fetching one-liner public key from SOAM
soamOneLineKey=$(curl -sX GET "https://$SOAM_KC/auth/realms/$SOAM_KC_REALM_ID" \
  | jq -r .public_key)

echo Formatting public key from SOAM
formattedPublicKey=$(cat << PUBKEY
-----BEGIN PUBLIC KEY-----
$(echo "$soamOneLineKey" | sed -e "s/.\{64\}/&\n/g")
-----END PUBLIC KEY-----
PUBKEY
)
echo "$formattedPublicKey"

echo Generating private and public keys
ssh-keygen -b 4096 -t rsa -f tempPenBackendkey -m pem -q -N ""
UI_PRIVATE_KEY_VAL="$(cat tempPenBackendkey)"
UI_PUBLIC_KEY_VAL="$(ssh-keygen -f tempPenBackendkey -e -m pem)"

echo Removing key files
rm tempPenBackendkey
rm tempPenBackendkey.pub

echo Creating config map "$APP_NAME-backend-config-map"
oc create -n "$OPENSHIFT_NAMESPACE_NO_ENV-$ENV_VAL" configmap \
  "$APP_NAME-backend-$ENV_VAL-config-map" \
  --from-literal="CLAMAV_HOST=clamav.$COMMON_NAMESPACE-$ENV_VAL.svc.cluster.local" \
  --from-literal=CLAMAV_PORT=3310 \
  --from-literal="UI_PRIVATE_KEY=$UI_PRIVATE_KEY_VAL" \
  --from-literal="UI_PUBLIC_KEY=$UI_PUBLIC_KEY_VAL" \
  --from-literal="SOAM_CLIENT_ID=$SOAM_CLIENT_ID" \
  --from-literal="SOAM_CLIENT_SECRET=$SOAM_CLIENT_SECRET" \
  --from-literal="SOAM_CLIENT_ID_IDIR=$SOAM_CLIENT_ID_IDIR" \
  --from-literal="SOAM_CLIENT_SECRET_IDIR=$SOAM_CLIENT_SECRET_IDIR" \
  --from-literal="SERVER_FRONTEND=$SERVER_FRONTEND" \
  --from-literal=SERVER_PORT=8080 \
  --from-literal=ISSUER=ECC_OFM \
  --from-literal="D365_API_ENDPOINT=$D365_API_ENDPOINT" \
  --from-literal="D365_API_KEY_HEADER=$D365_API_KEY_HEADER" \
  --from-literal="D365_API_KEY_VALUE=$D365_API_KEY_VALUE" \
  --from-literal="SOAM_PUBLIC_KEY=$formattedPublicKey" \
  --from-literal="SOAM_DISCOVERY=https://$SOAM_KC/auth/realms/$SOAM_KC_REALM_ID/.well-known/openid-configuration" \
  --from-literal="SOAM_URL=https://$SOAM_KC/auth/realms/$SOAM_KC_REALM_ID/protocol/openid-connect/logout" \
  --from-literal="SITEMINDER_LOGOUT_ENDPOINT=$siteMinderLogoutUrl" \
  --from-literal="LOG_LEVEL=$logLevel" \
  --from-literal="NODE_ENV=$ENV_VAL" \
  --dry-run -o yaml | oc apply -f -

echo
echo Setting environment variables for "$APP_NAME-backend-$ENV_VAL" application
oc -n "$OPENSHIFT_NAMESPACE_NO_ENV-$ENV_VAL" set env \
  --from="configmap/$APP_NAME-backend-$ENV_VAL-config-map" \
  "dc/$APP_NAME-backend-$ENV_VAL"

