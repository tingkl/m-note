为了方便没有nodejs基础的同学部署，特提供了一个docker环境（如果对docker也不熟悉，请自行学习基础操作）

安装好docker环境后，运行如下命令即可

docker run -it -p 4455:4455 tingkl/mnote:0.1 sh -c 'su esuser'

运行好了上面的命令，会直接进入到docker容器中，在容器中运行以下命令即可

sh /home/esuser/start.sh 

