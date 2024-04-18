# About this project

The project is the backend part of a web3 marketplace where users can buy and sell their NFTs using ERC20 token
For the front-end part of this project, see https://github.com/JanessaTech/best-second-hand-market

To run this project, make sure you check out both front-end part and backend aprt

## How to play with the project

Check out https://www.youtube.com/watch?v=UCe7ilfKP8o&t=20s about how the project works like

## The key functions of the project

- Mint a NFT
- Explore/filter/search NFTs
- Buy & sell NFT using ERC20 token
- Put NFTs to cart waiting for payment
- Charge account by ERC20 token
- Leave comments for a NFT
- Update user setting

# Install

```
npm install
```

# Installed dependencies

```
mongodb 4.4.27-rc0 installed on local

npm install --save express
npm install --save lodash
npm install --save cookie-parser
npm install --save winston
npm install --save yup
npm install --save dotenv
npm install --save bcrypt
npm install --save jsonwebtoken
npm install --save ethers
npm install --save cors
npm install --save mongoose
npm install --save-dev jest
npm install --save-dev jest-when
npm install --save multer
npm install --save redis
npm install --save nft.storage
npm install --save axios
```

## How to Run

The project can run both local and testnet. For mainnet, I haven't yet published it on it.
If you want to run it locally, check **How to run on local** section.
If you want to run it on testnet(Sepolia), check **How to run on testnet** section
If you want to run it on mainnet, check **How to run on mainnet** section

### How to run on local

The overview of steps:

1. Install tools
2. Edit config file
3. Start backend
4. Run verification

### Install tools

1. Install mongodb
   Check https://www.mongodb.com/try/download/community to download and install mongoBD
2. Install Compass(Optional)
   I strongly recommend you install Compass since it is a convenient tool to analysis MongoDB data. Of course, it is not required.
   If you want to install it, check:
   https://www.mongodb.com/products/tools/compass
3. Install IPFS Desktop
   Check out https://docs.ipfs.tech/install/ipfs-desktop/ to install it
4. Install redis
   You can install redis either by docker or on desktop only. either way is fine.
   For the installtion by docker, here is my command to intall redis:

```
Step1: // install redis client
sudo apt-get install redis-tools

Step2: // install redis server
sudo docker run --name redis \
-v /home/jane/docker/redis/data:/data \
-v /home/jane/docker/redis/conf:/usr/local/etc/redis \
-p 6379:6379 --restart=always \
-d redis:6.2.3 redis-server /usr/local/etc/redis/redis.conf

Note:
- /home/jane/docker/redis/conf is the dir where we put redis.conf
- redis.conf is under installations

Step3: verify installation:
check the line below in file redis.conf for the password:
 #requirepass redis
 Here psw is redis
run cmd below to connect remote redis server:
 # redis-cli -h 192.168.0.102 -a redis

Note: 192.168.0.102 is the ip of the host where you install redis

SET runoobkey redis  => OK
get runoobkey   => "redis"
ping  => pong
```

### Edit config file

- Update address for smart contracts
  Go to front-end part of this project, see https://github.com/JanessaTech/best-second-hand-market, check out readme. Make sure you should follow the readme in front-end part first.
  Once all smart contracts are deployed, edit config/configuration/config.common.js. Update address under chains.local.contracts. The updating steps for config.common.js is the same as what we did for front-end part.
  Once updating is done, make sure config.common.js in backend part is the same as config.common.js in front-end part
- Update config for redis
  Edit config.global.js under config/configuration, update values defined in config.redis:

```
config.redis = {
    username: '',
    password: 'redis',
    host: '192.168.0.102',
    port: 6379
}
Update values for username, password, host and 6379 according to your personal setting
```

- Update config for mongoDB
  Edit config.global.js under config/configuration, update values defined in config.database:

```
config.database = {
    host: '127.0.0.1'
}
```

Update value for host according to your personal setting

config.global.js

### Start backend

- On windows:

```
 npm run start_win_dev
```

Note: Make sure both front-end and backend start project using the same command. Eg. If front-end starts project with command `npm run start_win_dev`, so does back-end

### Run verification

Check https://www.youtube.com/watch?v=UCe7ilfKP8o&t=20s to see how to mint a new NFT and make it public.
Run the restful api in postman:
http://localhost:3100/apis/v1/nfts?page=1&limit=20&sortBy=updatedAt:desc&status=on

If everything works well, there should have one NFT returned

### How to run on testnet

- On windows:

```
 npm run start_win_stage
```

### How to run on mainnet

- On windows:

```
 npm run start_win_prod
```

# Run test cases

```
npm run test
```
