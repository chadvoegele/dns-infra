import * as cdk from 'aws-cdk-lib'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'

export class DnsInfraStack extends cdk.Stack {
  constructor (scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const domainName = 'voegele.me'
    const onmicrosoftName = 'thevoegeles.onmicrosoft.com'
    const zone = new route53.PublicHostedZone(this, `${domainName}Zone`, {
      zoneName: domainName
    })
    new route53.MxRecord(this, `${domainName}MX`, {
      zone: zone,
      values: [{
        hostName: 'voegele-me.mail.protection.outlook.com',
        priority: 0
      }]
    })
    new route53.TxtRecord(this, `${domainName}SPF`, {
      zone: zone,
      values: ['v=spf1 include:spf.protection.outlook.com -all']
    })
    new route53.TxtRecord(this, `${domainName}DMARC`, {
      zone: zone,
      recordName: `_dmarc.${domainName}`,
      values: [`v=DMARC1; p=quarantine; rua=mailto:mailauth-rua@${domainName}; ruf=mailto:mailauth-ruf@${domainName}`]
    })
    new route53.CnameRecord(this, `${domainName}DKIM1`, {
      zone: zone,
      recordName: `selector1._domainkey.${domainName}`,
      domainName: `selector1-${domainName.replace('.', '-')}._domainkey.${onmicrosoftName}`
    })
    new route53.CnameRecord(this, `${domainName}DKIM2`, {
      zone: zone,
      recordName: `selector2._domainkey.${domainName}`,
      domainName: `selector2-${domainName.replace('.', '-')}._domainkey.${onmicrosoftName}`
    })
    new route53.CnameRecord(this, `${domainName}AUTO`, {
      zone: zone,
      recordName: `autodiscover.${domainName}`,
      domainName: 'autodiscover.outlook.com'
    })
    const outputZoneIdName = `${domainName.replace('.', '')}ZoneId`
    new cdk.CfnOutput(this, outputZoneIdName, { value: zone.hostedZoneId, exportName: outputZoneIdName })
  }
}
