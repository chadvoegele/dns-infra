import * as cdk from 'aws-cdk-lib'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'

export class DnsInfraStack extends cdk.Stack {
  constructor (scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const domainName = 'voegele.me'
    const zone = new route53.PublicHostedZone(this, `${domainName}Zone`, {
      zoneName: domainName
    })
    new route53.ARecord(this, `${domainName}localhost`, {
      zone: zone,
      recordName: 'localhost',
      target: route53.RecordTarget.fromIpAddresses('127.0.0.1')
    })
    const DKIM_P = process.env.DKIM_P
    if (!DKIM_P) {
      throw new Error('DKIM_P not specified!')
    }
    new route53.MxRecord(this, `${domainName}MX`, {
      zone: zone,
      values: [{
        hostName: 'ASPMX.L.GOOGLE.COM',
        priority: 1
      }, {
        hostName: 'ALT1.ASPMX.L.GOOGLE.COM',
        priority: 5
      }, {
        hostName: 'ALT2.ASPMX.L.GOOGLE.COM',
        priority: 5
      }, {
        hostName: 'ALT3.ASPMX.L.GOOGLE.COM',
        priority: 10
      }, {
        hostName: 'ALT4.ASPMX.L.GOOGLE.COM',
        priority: 10
      }]
    })
    new route53.TxtRecord(this, `${domainName}SPF`, {
      zone: zone,
      values: ['v=spf1 include:_spf.google.com ~all']
    })
    new route53.TxtRecord(this, `${domainName}DMARC`, {
      zone: zone,
      recordName: `_dmarc.${domainName}`,
      values: [`v=DMARC1; p=quarantine; rua=mailto:mailauth-rua@${domainName};`]
    })
    new route53.TxtRecord(this, `${domainName}DKIM`, {
      zone: zone,
      recordName: `google._domainkey.${domainName}`,
      values: [`v=DKIM1; k=rsa; p=${DKIM_P}`]
    })
    const outputZoneIdName = `${domainName.replace('.', '')}ZoneId`
    new cdk.CfnOutput(this, outputZoneIdName, { value: zone.hostedZoneId, exportName: outputZoneIdName })
  }
}
