const config = {};

// basic config
config.env = 'dev'
config.port = 3100
config.apiPrefix = '/apis/v1'
config.database = {
    host: '127.0.0.1'
}
config.CATEGORIES = ['pets', 'clothes', 'cosmetics', 'outfits', 'car', 'devices', 'books']
config.NFTSTATUS = ['on', 'off']
config.chains = { 
    local: [
      {
      chainId: 31337,
      chainName: 'hardhat',
      currency: 'HardHatETH',
      rpcUrl:'http://127.0.0.1:8545/',
      contracts: [  // configure at least one
          {
            address: '0x5FbDB2315678afecb367f032d93F642f64180aa3', 
            abi: [
                'function symbol() public view returns (string)',
                'function ownerOfToken(uint _tokenId) public view returns (address)',
                'function tokensOfAddress(address _address) public view returns(uint[])',
                'function mint(address to, string _uri) public returns(uint)',
                'function mintBatch(address to, string[] _uris) public returns(uint[])',
                'function getAllTokenIds() public view returns(uint[])',
                'function getNextToken() public view returns(uint)',
                'function getUri(uint _id) public view returns(string)',
                'function buy(address from, address to, uint[] ids) public',
                'function doSafeBuy(address from, address to, uint[] ids) public',
                'function buyBatch(address[] froms, address to, uint[][] idss) public',
                'function doSafeBuyBatch(address[] froms, address to, uint[][] idss) public'
            ],
            tokenStandard: '1155'
          }
        ]
      }
    ],
    testnet:[
      {
        chainId: 11155111,
        chainName: 'sepolia',
        currency: 'SepoliaETH',
        rpcUrl:'https://sepolia.infura.io/v3/',
        contracts:[
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bbf2', tokenStandard: 'aaaa'},
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bbf3', tokenStandard: 'bbbb'},
        ]
      },
      {
        chainId: 80001,
        chainName: 'mumbai',
        currency: 'MATIC',
        rpcUrl:'https://rpc-mumbai.maticvigil.com',
        contracts:[
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bbf4', tokenStandard: 'cccc'},
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bbf5', tokenStandard: 'dddd'}
        ]
      },
      {
        chainId: 43113,
        chainName: 'fuji',
        currency: 'AVAX',
        rpcUrl:'https://api.avax-test.network/ext/bc/C/rpc',
        contracts:[
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bbf6', tokenStandard: 'eeee'},
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bbf7', tokenStandard: 'ffff'}
        ]
      },
      {
        chainId: 10200,
        chainName: 'chiado',
        currency: 'XDAI',
        rpcUrl:'https://rpc.chiadochain.net',
        contracts:[
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bbf8', tokenStandard: 'gggg'},
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bbf9', tokenStandard: 'hhhh'}
        ]
      }
    ],
    mainnet: [
      {
        chainId: 1,
        chainName: 'ethereum',
        currency: 'ETH',
        rpcUrl:'https://mainnet.infura.io/v3/',
        contracts:[
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bb18', tokenStandard: 'iiii'},
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bb28', tokenStandard: 'jjjj'},
        ]
      },
      {
        chainId: 137,
        chainName: 'polygon',
        currency: 'MATIC',
        rpcUrl:'https://polygon-rpc.com',
        contracts:[
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bb38', tokenStandard: 'kkkk'},
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bb48', tokenStandard: '1llll'},
        ]
      },
      {
        chainId: 43114,
        chainName: 'avalanche',
        currency: 'AVAX',
        rpcUrl:'https://avalanche-mainnet.infura.io',
        contracts:[
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bb58', tokenStandard: 'mmmm'},
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bb68', tokenStandard: 'nnnn'},
        ]
      },
      {
        chainId: 100,
        chainName: 'gnosis',
        currency: 'XDAI',
        rpcUrl:'https://rpc.gnosischain.com',
        contracts:[
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bb78', tokenStandard: 'oooo'},
          {address: '0xcdcbb4f79e3770252ee32d89b6673eb68f27bb88', tokenStandard: 'pppp'},
        ]
      }
    ]
  }

module.exports = config