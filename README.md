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