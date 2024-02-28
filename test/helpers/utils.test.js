const {convertToURL} = require('../../helpers/utils')
const config = require('../../config')

describe('utils', () => {
    test('convertToURL', () => {
        
        const uris = [
            {
                gateway: 'http://localhost:8080',
                ipfs: 'ipfs://bafybeics4gipwcek5rzkyfs7t2cptkodoqeguf2ttv4ers7sr4g642tj6q', 
                expected: 'http://bafybeics4gipwcek5rzkyfs7t2cptkodoqeguf2ttv4ers7sr4g642tj6q.ipfs.localhost:8080'
            },
            {
                gateway: 'https://nftstorage.link',
                ipfs: 'ipfs://bafybeics4gipwcek5rzkyfs7t2cptkodoqeguf2ttv4ers7sr4g642tj6q', 
                expected: 'https://bafybeics4gipwcek5rzkyfs7t2cptkodoqeguf2ttv4ers7sr4g642tj6q.ipfs.nftstorage.link'
            }
        ]
        for( const uri of uris) {
            const {gateway, ipfs, expected} = uri
            config.gateway = gateway
            const url = convertToURL(ipfs)
            expect(url).toEqual(expected)
        }
    })
})