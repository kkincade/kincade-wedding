-- Connecting with DigitalOcean
1. Get domain name from namecheap.com.
2. Configure the new domain in namecheap.com settings to use the DigitalOcean DNS *nameservers* listed below.
    - ns1.digitalocean.com
    - ns2.digitalocean.com
    - ns3.digitalocean.com
3. Create *droplet* on DigitalOcean.com.
4. Run this command to access your new DigitalOcean server machine `ssh root@IPADDRESS`
5. Use the default password provided by DigitalOcean and then change your password to something new.
6. Run `npm install -g forever` in your new server.
7. Create new user for the new DigitalOcean server.
    - sudo useradd --create-home -s /bin/bash username
    - sudo adduser username sudo
    - sudo passwd username
8. Run `exit` and then log back in as the newly created user `ssh username@IPADDRESS`
9. Create an SSH folder using `mkdir .ssh` and the `exit` once more.
10. Push your SSH key from your local machine to the new DigitalOcean server by running:
    `scp ~/.ssh/id_rsa.pub username@IPADDRESS:~/.ssh/authorized_keys`
11. Install Flightplan 
Install this on your local machine to pull your github files onto the PROD server.
1. 

Install bower and other essential programs to your server.
````
sudo apt-get update
sudo apt-get upgrade
sudo npm install -g bower
sudo npm install -g mysql
sudo apt-get install build-essential g++
sudo apt-get install git
sudo apt-get install mysql-server
````

mysql -u root -p
create database database-name;
create user 'kkincade'@'localhost' identified by 'kincade-mysql';
grant all on database-name.* to 'kkincade';

Install Nginx and modify '/etc/nginx/sites-available/default'
server {
    listen 80;
        
    server_name kincadewedding.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

git rm -r --cached node_modules
git commit -am "node_modules be gone!"
git push origin master

git rm -r --cached bower_components
git commit -am "bower_components be gone!"
git push origin master

