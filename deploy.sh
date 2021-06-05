
#!/bin/bash
echo '1122';
WEB_PATH='/usr/local/nodejs/webpack+react+staging'
WEB_USER='root'
WEB_USERGROUP='root'
 
echo "Start deployment"
cd $WEB_PATH

echo "------ 开始清理代码 防止冲突 ------"
git reset --hard origin/master
git clean -f
echo "pulling source code..."
git pull origin master

npm install   # 防止有新的包加入
npm build
echo '构建完毕'

echo "changing permissions..."
chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
chmod -R 777 $WEB_PATH
echo "Finished."

sudo /usr/local/nginx/sbin/nginx -s reload

echo '重启服务成功'

