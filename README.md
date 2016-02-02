### Connecting with DigitalOcean
1. Get domain name from namecheap.com.

2. Configure the new domain in namecheap.com settings to use the DigitalOcean DNS *nameservers* listed below.
    - ns1.digitalocean.com
    - ns2.digitalocean.com
    - ns3.digitalocean.com

3. Create *droplet* on DigitalOcean.com.

4. Run `ssh root@IPADDRESS` to access your new DigitalOcean server machine.

5. Use the default password provided by DigitalOcean and then change your password to something new.

6. Run `npm install -g forever` in your new server.

7. Create new user for the new DigitalOcean server.
```
sudo useradd --create-home -s /bin/bash <user-name>
sudo adduser <user-name> sudo
sudo passwd <user-name>
```
8. Run `exit` and then log back in as the newly created user `ssh <user-name>@IP.ADDRESS`

9. Create an SSH folder using `mkdir .ssh` and the `exit` once more.
10. Push your SSH key from your local machine to the new DigitalOcean server by running:
```
scp ~/.ssh/id_rsa.pub <user-name>@IP.ADDRESS:~/.ssh/authorized_keys
```
  - If you don't have SSH keys already, visit [Github's instructions](https://help.github.com/articles/generating-an-ssh-key/) for generating them.
  - You also need to add them to your *ssh-agent* using `eval "$(ssh-agent -s)"` and `ssh-add ~/.ssh/id_rsa`

### Deployment

The keys to deployment are installing *Flightplan* on your local machine, which allows you to pull your github files onto the PROD server without needing to log in to your PROD server, and ensuring your PROD server has the necessary components to run your application (e.g. node, bower, mysql, etc). I selected a Node.js equipped Ubuntu machine when setting up my server from DigitalOcean, so below is an example of the extra commands I needed to run.


1. Install *Flightplan* on your local machine by running `npm install -g flightplan`.

2. SSH into your DigitalOcean server `ssh <user-name>@IP.ADDRESS`.

3. Install essential programs to your server. An example might be installing g++, git, mysql, and bower.
```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install build-essential g++
sudo apt-get install git
sudo apt-get install mysql-server
sudo npm install -g bower
sudo npm install -g mysql
```

4. Install Nginx and modify */etc/nginx/sites-available/default* to look like the following:
```
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
```

5. Restart nginx using `service nginx restart`

6. Create a flightplan.js file that determines the files needed to be copied and the commands that need to be run.

7. From your local machine `add` and `commit` all files to Github.

8. Run the command `fly production`.

git rm -r --cached node_modules
git commit -am "node_modules be gone!"
git push origin master

git rm -r --cached bower_components
git commit -am "bower_components be gone!"
git push origin master

1. Run "mysql.server start"
2. Run "mysql -p"
3. Enter MySQL password
4. Within mysql, run `use wedding;`


```
mysql -u root -p
create database wedding;
create user 'kkincade'@'localhost' identified by 'my-password';
grant all on database-name.* to 'kkincade';
```

**Schema of RSVP table**
```
CREATE TABLE lu_rsvp (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    attending BOOL NOT NULL,
    adultCount INT NOT NULL,
    childrenCount INT NOT NULL,
    guestNames VARCHAR(250),
    veganCount INT NOT NULL,
    vegetarianCount INT NOT NULL,
    glutenFreeCount INT NOT NULL,
    comment LONGTEXT
);
```
