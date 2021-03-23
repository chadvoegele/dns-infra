import { expect as expectCDK, countResources } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as DnsInfra from '../lib/dns_infra-stack'

test('Stack', () => {
  const app = new cdk.App()
  const stack = new DnsInfra.DnsInfraStack(app, 'MyTestStack')
  expectCDK(stack).to(countResources('AWS::Route53::HostedZone', 1))
  expectCDK(stack).to(countResources('AWS::Route53::RecordSet', 7))
})
