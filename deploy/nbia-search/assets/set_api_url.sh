#!/bin/bash

OS=`uname`
if [  "$OS" == "Darwin" ]
then
    echo "Does not run on Mac (incompatible sed)"
    exit 1
fi

if [[ $1 == *"help"* ]]
then
    echo
    echo "Call from within nbia-search/assets/ directory"
    echo "Ex: set_api_url.sh https://public-dev.cancerimagingarchive.net"
    echo "Ex: set_api_url.sh http://192.168.1.14:8080"
    echo
    exit 0
fi

CORRECT_PATH="nbia-search/assets"

MATCH_COUNT=`pwd | grep -c ${CORRECT_PATH}$`
# echo MATCH_COUNT: ${MATCH_COUNT}

if [ ${MATCH_COUNT} -lt 1 ]
then
    echo "This utility must be launched from within ${CORRECT_PATH}." >&2
    exit 1
fi


# Make sure we got an API url as a parameter
if [ $# != 1 ]
then
    echo "Error: Need API url" >&2
    echo "Ex: set_api_url.sh https://public-dev.cancerimagingarchive.net" >&2
    echo "Ex: set_api_url.sh http://192.168.1.14:8080"
    exit 1
fi

PROP_FILE=properties.ts

API_SERVER_URL=$1

# Make sure the property file is there.
if [ ! -f  ${PROP_FILE} ]
then
	echo "Error: I could not find ${PROP_FILE} in the current directory." >&2
	exit 1
fi

sed -i 's@^\s*API_SERVER_URL:.*,@API_SERVER_URL: \x27'"${API_SERVER_URL}"'\x27,@g'  ${PROP_FILE}

for f in `ls ../ | grep main`
do
	sed -i 's@API_SERVER_URL:"[^"]*",@API_SERVER_URL:\"'"${API_SERVER_URL}"'\",@g'  ../${f}
done

# Make sure it worked.
MATCH_COUNT=`grep -c API_SERVER_URL:\ \'${API_SERVER_URL}\',  ${PROP_FILE}`
if [ ${MATCH_COUNT} -lt 1 ]
then
    echo "Error: I did not find any API Server url entries in  ${PROP_FILE}" >&2
    exit 1
fi
# echo Found ${MATCH_COUNT}
echo "Set API server url to API_SERVER_URL: '${API_SERVER_URL}'"
