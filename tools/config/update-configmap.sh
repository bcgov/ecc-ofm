set -euo pipefail

readonly ENV_VAL=$1
readonly APP_NAME=$2
readonly NAMESPACE_PREFIX=$3
readonly COMMON_NAMESPACE=$4
readonly D365_API_PREFIX=$5
readonly D365_API_KEY_HEADER=$6
readonly D365_API_KEY_VALUE=$7
readonly SOAM_CLIENT_ID=$8
readonly SOAM_CLIENT_SECRET=$9
readonly SOAM_IDP_HINT_BCEID=${10}
readonly SOAM_IDP_HINT_IDIR=${11}
readonly SOAM_KC_REALM_ID="standard"
readonly D365_API_ENDPOINT="http://$D365_API_PREFIX-$ENV_VAL:5091"

NAMESPACE_SUFFIX="$ENV_VAL"
if [ "$ENV_VAL" = "dev" ] || [ "$ENV_VAL" = "test" ]; then
  NAMESPACE_SUFFIX="dev"
elif [ "$ENV_VAL" = "uat" ]; then
  NAMESPACE_SUFFIX="test"
fi
readonly NAMESPACE_SUFFIX
readonly SOAM_KC="$NAMESPACE_SUFFIX.loginproxy.gov.bc.ca"

NODE_ENV="prod"
if [ "$ENV_VAL" != "prod" ]; then
  NODE_ENV="dev"
fi
readonly NODE_ENV

readonly OPENSHIFT_NAMESPACE="$NAMESPACE_PREFIX-$NAMESPACE_SUFFIX"

SITE_MINDER_LOGOUT_URL=""
SERVER_FRONTEND="https://ofm-frontend-$ENV_VAL-$OPENSHIFT_NAMESPACE.apps.silver.devops.gov.bc.ca"
if [ "$ENV_VAL" != "prod" ]
then
  SITE_MINDER_LOGOUT_URL="https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl="
else
  SERVER_FRONTEND="https://ofm.gov.bc.ca" # TODO: Set this to whatever our prod domain will be
  SITE_MINDER_LOGOUT_URL="https://logon7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl="
fi
readonly SITE_MINDER_LOGOUT_URL
readonly SERVER_FRONTEND

LOG_LEVEL="http"
if [ "$ENV_VAL" = "dev" ]; then
  LOG_LEVEL="verbose"
fi
readonly LOG_LEVEL

echo Fetching one-liner public key from SOAM
SOAM_ONE_LINE_KEY=$(curl -sX GET "https://$SOAM_KC/auth/realms/$SOAM_KC_REALM_ID" \
  | jq -r .public_key)
readonly SOAM_ONE_LINE_KEY

echo Formatting public key from SOAM
FORMATTED_PUBLIC_KEY=$(cat << PUBKEY
-----BEGIN PUBLIC KEY-----
$(echo "$SOAM_ONE_LINE_KEY" | sed -e "s/.\{64\}/&\n/g")
-----END PUBLIC KEY-----
PUBKEY
)
readonly FORMATTED_PUBLIC_KEY
echo "$FORMATTED_PUBLIC_KEY"

echo Generating private and public keys
ssh-keygen -b 4096 -t rsa -f tempPenBackendkey -m pem -q -N ""
UI_PRIVATE_KEY_VAL="$(cat tempPenBackendkey)"
UI_PUBLIC_KEY_VAL="$(ssh-keygen -f tempPenBackendkey -e -m pem)"
readonly UI_PRIVATE_KEY_VAL
readonly UI_PUBLIC_KEY_VAL

echo Removing key files
rm tempPenBackendkey
rm tempPenBackendkey.pub

echo Creating config map "$APP_NAME-backend-config-map"
oc create -n "$OPENSHIFT_NAMESPACE" configmap \
  "$APP_NAME-backend-$ENV_VAL-config-map" \
  --from-literal="CLAMAV_HOST=clamav.$COMMON_NAMESPACE-$NAMESPACE_SUFFIX.svc.cluster.local" \
  --from-literal=CLAMAV_PORT=3310 \
  --from-literal="UI_PRIVATE_KEY=$UI_PRIVATE_KEY_VAL" \
  --from-literal="UI_PUBLIC_KEY=$UI_PUBLIC_KEY_VAL" \
  --from-literal="SOAM_CLIENT_ID=$SOAM_CLIENT_ID" \
  --from-literal="SOAM_CLIENT_SECRET=$SOAM_CLIENT_SECRET" \
  --from-literal="SOAM_IDP_HINT_BCEID=$SOAM_IDP_HINT_BCEID" \
  --from-literal="SOAM_IDP_HINT_IDIR=$SOAM_IDP_HINT_IDIR" \
  --from-literal="SERVER_FRONTEND=$SERVER_FRONTEND" \
  --from-literal=SERVER_PORT=8080 \
  --from-literal=ISSUER=ECC_OFM \
  --from-literal="D365_API_ENDPOINT=$D365_API_ENDPOINT" \
  --from-literal="D365_API_KEY_HEADER=$D365_API_KEY_HEADER" \
  --from-literal="D365_API_KEY_VALUE=$D365_API_KEY_VALUE" \
  --from-literal="SOAM_PUBLIC_KEY=$FORMATTED_PUBLIC_KEY" \
  --from-literal="SOAM_DISCOVERY=https://$SOAM_KC/auth/realms/$SOAM_KC_REALM_ID/.well-known/openid-configuration" \
  --from-literal="SOAM_URL=https://$SOAM_KC/auth/realms/$SOAM_KC_REALM_ID/protocol/openid-connect/logout" \
  --from-literal="SITEMINDER_LOGOUT_ENDPOINT=$SITE_MINDER_LOGOUT_URL" \
  --from-literal="LOG_LEVEL=$LOG_LEVEL" \
  --from-literal="NODE_ENV=$NODE_ENV" \
  --dry-run -o yaml | oc apply -f -

echo
echo Setting environment variables for "$APP_NAME-backend-$ENV_VAL" application
oc -n "$OPENSHIFT_NAMESPACE" set env \
  --from="configmap/$APP_NAME-backend-$ENV_VAL-config-map" \
  "dc/$APP_NAME-backend-$ENV_VAL"

