import { Template } from 'aws-cdk-lib/assertions'
import * as cdk from 'aws-cdk-lib'
import * as DnsInfra from '../lib/dns_infra-stack'

test('Stack', () => {
  const app = new cdk.App()
  const stack = new DnsInfra.DnsInfraStack(app, 'MyTestStack')
  const template = Template.fromStack(stack)
  template.resourceCountIs('AWS::Route53::HostedZone', 1)
  template.resourceCountIs('AWS::Route53::RecordSet', 4)
})
