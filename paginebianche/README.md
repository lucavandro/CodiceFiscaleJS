## check dependencies
```
./INSTALL.sh
chmod u+x ./*.sh
```
## run in background and create log named nohup.out
```
nohup ./make_list.sh 2>&1 &
```
## read log
```
tail -f nohup.out
```
## make cognomi_nomi lists
```
./make_list.sh
```
## make JSONs
```
./make_json.sh
```