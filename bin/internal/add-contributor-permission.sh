#!/bin/bash

USR="$1"

if [ "$USR" == "" ]; then
    echo >&2 "Usage: $0 USER"
    exit 1
fi

if ! cf api | grep >/dev/null https://api.cf.sap.hana.ondemand.com; then
    echo >&2 "ERROR: Wrong CF API Endpoint"
    echo >&2 ""
    echo >&2 "Execute & Re-try script:"
    echo >&2 "cf api https://api.cf.sap.hana.ondemand.com"
    echo >&2 "cf login"
    exit 1
fi

cf set-org-role "$USR" SAP_cpes_refapps OrgManager
for SPACE in custom-domains dev workflow; do
    cf set-space-role "$USR" SAP_cpes_refapps $SPACE SpaceManager
done