#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { DnsInfraStack } from '../lib/dns_infra-stack'

const app = new cdk.App()
const env = { region: 'us-east-1' }
new DnsInfraStack(app, 'DnsInfraStack', { env })
