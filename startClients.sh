echo "Starting $1 clients, using Dispatcher ip $2" 

make
rm -rf output
mkdir -p output/client-log
for ((i = 0 ; i < $1 ; i++));do
    ./startClient.sh $2 > output/client-log/$i &
    echo "PID $!"
done