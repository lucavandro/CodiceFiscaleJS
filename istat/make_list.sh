#!/bin/bash

# ISTAT
# WEB PAGE https://www.istat.it/it/prodotti/contenuti-interattivi/calcolatori/nomi
# ENDPOINT https://www.istat.it/iframes/wsnati/index.php
# invoked by ?type=list
# OPTIONAL PARAMETER:
# year (int|NULL) [default:NULL]  ## ["1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015"]
# gender (m|f|NULL) [default:NULL]
# order (percent|count|name|NULL) [default:percent]
# reverseOrder (boolean) [default: FALSE]
# offset (int) [default:0]
# limit (int) [default:20]

for YEAR in {1999..2015}
do
    echo
    echo $YEAR
    echo
    INT=1000000000
    curl "https://www.istat.it/iframes/wsnati/index.php?type=list&limit=${INT}&_=$(date +%s)&year=${YEAR}&order=count" > "./name_lists/${YEAR}.txt"
    sleep 2
done
echo
echo Farewell
echo