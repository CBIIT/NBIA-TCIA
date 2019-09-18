#!/bin/bash


OS=`uname`
if [  "$OS" == "Darwin" ]
then
    echo "Does not run on Mac (incompatible sed)"
    exit 1
fi

function show_help
{
    echo
    echo "Usage: set_banner.sh \"<message>\" <expiration date as MM/DD/YY>"
    echo "Ex: set_banner.sh \"Outage October 15-17\" 10/18/19"
    echo
    exit 0
}

if [[ $1 == *"help"* ]]
then
    show_help
    exit 0
fi

CORRECT_PATH="nbia-search/assets"

MATCH_COUNT=`pwd | grep -c ${CORRECT_PATH}$`
# echo MATCH_COUNT: ${MATCH_COUNT}

if [[ ${MATCH_COUNT} -lt 1 ]]
then
    echo "This utility must be launched from within ${CORRECT_PATH}." >&2
    echo " " >&2
#    exit 1
fi

echo arg count $#

########################################
## Make sure we have two arguments
if [[ $# -ne 2 ]]
then
    echo "This utility requires two parameters received $#." >&2
    show_help
    exit 1
fi

########################################
## Set values
message=$1
exp_date=$2

echo "message: [${message}]  exp_date: [${exp_date}]."

#echo ${exp_date} | grep -e '[0-9]{1,2}/[0-9]{1,2}/[0-9]{1,2}'
echo ${exp_date} | grep -E '^[0-9][0-9]?/[0-9][0-9]?/[0-9][0-9]$'

if [[ $? -ne 0 ]]
then
    echo "Invalid date: \"${exp_date}\"." >&2
    show_help
    exit 1
fi

message_marker=BANNER_TEXT_NBIA_
date_marker=BANNER_EXP_NBIA_


PROP_FILE=properties.ts

# Make sure the property file is there.
if [[ ! -f  ${PROP_FILE} ]]
then
	echo "Error: I could not find ${PROP_FILE} in the current directory." >&2
	exit 1
fi

sed -i "s@^\s*${message_marker}:.*,@${message_marker}:'${message}',@g"  ${PROP_FILE}

for f in `ls ../ | grep main`
do
	sed -i "s@^\s*${message_marker}:.*,@${message_marker}:'${message}',@g"  ../${f}
done

sed -i "s@^\s*${date_marker}:.*,@${date_marker}:'${exp_date}',@g"  ${PROP_FILE}

for f in `ls ../ | grep main`
do
	sed -i "s@^\s*${date_marker}:.*,@${date_marker}:'${exp_date}',@g"  ../${f}
done
