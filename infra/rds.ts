import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const dbPassword = config.requireSecret("dbPassword");

const vpc = new aws.ec2.Vpc("infra-vpc", {
  cidrBlock: "10.0.0.0/16",
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

// Create subnets within the VPC
const subnet1 = new aws.ec2.Subnet("subnet-1", {
  vpcId: vpc.id,
  cidrBlock: "10.0.1.0/24",
  availabilityZone: "ap-southeast-1a",
});
const subnet2 = new aws.ec2.Subnet("subnet-2", {
  vpcId: vpc.id,
  cidrBlock: "10.0.2.0/24",
  availabilityZone: "ap-southeast-1b",
});

const gateway = new aws.ec2.InternetGateway("infra-igw", {
  vpcId: vpc.id,
});

const publicRouteTable = new aws.ec2.RouteTable("public-routes", {
  vpcId: vpc.id,
  routes: [
    {
      cidrBlock: "0.0.0.0/0",
      gatewayId: gateway.id,
    },
  ],
});

new aws.ec2.RouteTableAssociation("subnet1-assoc", {
  subnetId: subnet1.id,
  routeTableId: publicRouteTable.id,
});

new aws.ec2.RouteTableAssociation("subnet2-assoc", {
  subnetId: subnet2.id,
  routeTableId: publicRouteTable.id,
});
