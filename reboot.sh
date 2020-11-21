# mongod -f /root/app/MNote/cf/primary.conf
# mongod -f /root/app/MNote/cf/secondary.conf
# mongod -f /root/app/MNote/cf/arbiter.conf
mongod -f /root/app/MNote/cf/single.conf

pm2 start pm2.json

nginx -c /etc/nginx/nginx.conf
nginx -s reload