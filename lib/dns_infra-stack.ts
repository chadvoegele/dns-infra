import * as cdk from '@aws-cdk/core'
import * as route53 from '@aws-cdk/aws-route53'

export class DnsInfraStack extends cdk.Stack {
  constructor (scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const domainName = 'voegele.me'
    const zone = new route53.PublicHostedZone(this, `${domainName}Zone`, {
      zoneName: domainName
    })
    new route53.MxRecord(this, `${domainName}MX`, {
      zone: zone,
      values: [{
        hostName: 'in1-smtp.messagingengine.com',
        priority: 10
      }, {
        hostName: 'in2-smtp.messagingengine.com',
        priority: 20
      }]
    })
    new route53.TxtRecord(this, `${domainName}SPF`, {
      zone: zone,
      values: ['v=spf1 include:spf.messagingengine.com ?all']
    })
    new route53.TxtRecord(this, `${domainName}DMARC`, {
      zone: zone,
      recordName: `_dmarc.${domainName}`,
      values: [`v=DMARC1; p=none; sp=quarantine; rua=mailto:mailauth-reports@${domainName}`]
    })
    new route53.CnameRecord(this, `${domainName}FM1`, {
      zone: zone,
      recordName: `fm1._domainkey.${domainName}`,
      domainName: `fm1.${domainName}.dkim.fmhosted.com`
    })
    new route53.CnameRecord(this, `${domainName}FM2`, {
      zone: zone,
      recordName: `fm2._domainkey.${domainName}`,
      domainName: `fm2.${domainName}.dkim.fmhosted.com`
    })
    new route53.CnameRecord(this, `${domainName}FM3`, {
      zone: zone,
      recordName: `fm3._domainkey.${domainName}`,
      domainName: `fm3.${domainName}.dkim.fmhosted.com`
    })
    new route53.CnameRecord(this, `${domainName}MESMTP`, {
      zone: zone,
      recordName: `mesmtp._domainkey.${domainName}`,
      domainName: `mesmtp.${domainName}.dkim.fmhosted.com`
    })
    const outputZoneIdName = `${domainName.replace('.', '')}ZoneId`
    new cdk.CfnOutput(this, outputZoneIdName, { value: zone.hostedZoneId, exportName: outputZoneIdName })
  }
}
