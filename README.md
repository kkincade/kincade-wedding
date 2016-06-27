### Connecting with DigitalOcean
1. Get domain name from [namecheap.com](namecheap.com) or another domain name provider.

2. Configure the new domain in [namecheap.com](namecheap.com) settings to use the DigitalOcean DNS *nameservers* listed below.
  - ns1.digitalocean.com
  - ns2.digitalocean.com
  - ns3.digitalocean.com

3. Create *droplet* on [DigitalOcean.com](DigitalOcean.com). You should receive an email with your IP address and a temporary password.

4. Run `ssh root@IPADDRESS` to access your new DigitalOcean server machine.

5. Use the default password provided by DigitalOcean to create a new password.

6. Create new user for the new DigitalOcean server.
```
sudo useradd --create-home -s /bin/bash <user-name>
sudo adduser <user-name> sudo
sudo passwd <user-name>
```
7. Run `exit` and then log back in as the newly created user `ssh <user-name>@IP.ADDRESS`

8. Create an SSH folder using `mkdir .ssh` and the `exit` once more.

9. Push your SSH key from your local machine to the new DigitalOcean server by running:
```
scp ~/.ssh/id_rsa.pub <user-name>@IP.ADDRESS:~/.ssh/authorized_keys
```
  - If you don't have SSH keys already, visit [Github's instructions](https://help.github.com/articles/generating-an-ssh-key/) for generating them.
  - You also need to add them to your *ssh-agent* using `eval "$(ssh-agent -s)"` and `ssh-add ~/.ssh/id_rsa`

### Running Locally

1. Change directories to the *kincade-wedding* project.

2. Run `node server.js` and visit *localhost:8080* in your browser.

3. To debug server side code, open a new terminal and run `node-debug server.js` in addition to the node command in step 2. You must have the *node-inspector* npm package installed for this to work. It should open a browser window with developer tools that allow you to debug the server side code.

4. For auto-compilation of SCSS, cd to the CSS folder in the project and run `sass --watch index.scss:index.min.css --style compressed`. When a change is made to the CSS, this will automatically minify the file.

### Deployment

The keys to deployment are installing *Flightplan* on your local machine, which allows you to pull your github files onto the PROD server without needing to log in to your PROD server, and ensuring your PROD server has the necessary components to run your application (e.g. node, bower, mysql, etc). I selected a Node.js equipped Ubuntu machine when setting up my server from DigitalOcean, so below is an example of the extra commands I needed to run.


1. Install *Flightplan* on your local machine by running `npm install -g flightplan`.

2. SSH into your DigitalOcean server `ssh <user-name>@IP.ADDRESS`.

3. Install essential programs to your server. An example might be installing g++, git, mysql, forever, and bower.
```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install build-essential g++
sudo apt-get install git
sudo apt-get install mysql-server
sudo npm install -g bower
sudo npm install -g mysql
sudo npm install -g forever
```

4. Install Nginx and modify */etc/nginx/sites-available/default* to look like the code below. This is known as a reverse proxy server, which listens for any activity on the default port 80 and redirects the traffic to a different port (e.g. port 8080).
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

5. Restart nginx using `service nginx restart` for the changes to take place.

6. Create a *flightplan.js* file that determines the files needed to be copied and the commands that need to be run.

7. From your local machine `add` and `commit` all files to Github.

8. Ensure your ssh-agent is running and connected by running `eval "$(ssh-agent -s)"` and `ssh-add ~/.ssh/id_rsa`.

9. Run the command `fly production`.

### Using MySQL
In the case you need a database for your site, here is an example showing how to get MySQL up and running on a machine. You will need to do this on your DEV and PROD machines.

1. Download and install MySQL from the [MySQL website](https://dev.mysql.com/downloads/mysql/).

2. Run `mysql.server start` to start the MySQL server.

3. Run `mysql -p` to open a MySQL session (*-p* prompts for a password).

4. Enter MySQL password.

5. Within MySQL, run `CREATE DATABASE <database-name>;` to create a database.

6. The run `use <database-name>;` to select that database.

7. Create a user and give them privileges.
```
mysql -u root -p
create database <database-name>;
create user 'kkincade'@'localhost' identified by 'my-password';
grant all on <database-name>.* to 'kkincade';
```

8. Create a table:
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

Get list of RSVPs:
```
ssh kkincade@107.170.211.204
sudo /etc/init.d/mysql start;
mysql -p;
use wedding;
select * from lu_rsvp;
```