#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DnsInfraStack } from '../lib/dns_infra-stack';

const app = new cdk.App();
new DnsInfraStack(app, 'DnsInfraStack');
