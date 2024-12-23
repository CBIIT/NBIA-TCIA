#!/bin/bash

OS=`uname`
if [ "$OS" == "Darwin" ]
then
    echo "Does not run on Mac (incompatible sed)"
    exit 1
fi

if [[ $1 == *"help"* ]]
then
    echo
    echo "Call from within nbia-search/assets/ directory"
    echo
    exit 0
fi

CORRECT_PATH="nbia-search/assets"

PROP_FILE=properties.ts

# Make sure the property file is there.
if [ ! -f  ${PROP_FILE} ]
then
	echo "Error: I could not find ${PROP_FILE} in the current directory." >&2
	exit 1
fi

sed -i 's@^\s*SHOW_OHIF_SERIES_VIEWER:.*,@SHOW_OHIF_SERIES_VIEWER:true,@g'  ${PROP_FILE}

for f in `ls ../ | grep main`
do
	sed -i 's@^\s*SHOW_OHIF_SERIES_VIEWER:.*,@SHOW_OHIF_SERIES_VIEWER:true,@g'  ../${f}
done

## This needs to wait until we have OHIF API call for Study and Subject.
# sed -i 's@^\s*SHOW_OHIF_VIEWER:.*,@SHOW_OHIF_VIEWER:true,@g'  ${PROP_FILE}

# for f in `ls ../ | grep main`
# do
#	sed -i 's@^\s*SHOW_OHIF_VIEWER:.*,@SHOW_OHIF_VIEWER:true,@g'  ../${f}
# done


# SHOW_OHIF_VIEWER
echo "Set OHIFViewer on."
