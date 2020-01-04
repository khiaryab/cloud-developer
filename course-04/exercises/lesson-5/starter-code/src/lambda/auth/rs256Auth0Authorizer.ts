
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJDOJtJ7sMppRQMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi1nZm12Nmg0MC5hdXRoMC5jb20wHhcNMTkxMjIzMTAwNzIyWhcNMzMw
ODMxMTAwNzIyWjAhMR8wHQYDVQQDExZkZXYtZ2ZtdjZoNDAuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7uZQPBKm5XLvS1Jsm/g79j8f
1iSZuDKUlVFU9AovPJ7Wj/CVPFFSJWHViA7PBsyIrkiQs51Sv4mxo+/UaH6tUQ8Z
Aog3BQEsWMBBiiJocwEppDbjALn+W5ZaYH17uDK/t0g5xAVYYOcBTJlbR1YGaS8F
RaoXKZuJFRqY3POidGRYJ3N14iyk21RkojY1QKUySsqT2e4/cUh5/9OzOR3X0Iwm
bc5y4kOQ2OGGYaDMLVaq1pVhZijst1ldEd2NlEyXpDchRhjJ5hF7sNEGEQJeeB2r
leXV/YKUYsI9KdDNeCSf9PEfM8L7UAQeZpesPiM6cj9jKq+QZMJeqrn+85waXwID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQ7RJQtnzlYtsSsePRL
yqfxvXEkIDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAFeUDbF3
HgzAfCZtQ2eujlZW9d9TZvOx+O//XsBknz4NxwXRhSbthd4pdiDA4UUg23uqqmKF
HrBCtYi20DYBOozQ/UVHwZFlG1MA7vLoGC0lgI6j01OkuG8sWGU/LtG0QEMU9Nvo
V/NcSi1xzOpKySewBYjrqcI5kSJbFDruMqEuavAgM3Er/LDBV0HZUAoEb7y4TpjW
CuF3dDQ8JQqdQPXi7LJkoQDx2rzzRWaiWSK9FiuIXLfnrv1m+zwvuIuaPFgsBwTX
lG0kG2EZ1jMeiLX5IROAp0DbdnOTDT9kX0fliRmeOH83MgwCuXgaoB5vex+1Y2iX
X4+S/B3Qgnx+cd8=
-----END CERTIFICATE-----
`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken);
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  }catch(e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtToken {
  if(!authHeader)
    throw new Error('No authentication header')

  if(authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(
    token,
    cert,
    { algorithms: ['RS256'] }
  ) as JwtToken
}