# Serverless Static Website + Contact Form (AWS SAM)

A portfolio-ready AWS reference architecture for a small business (tattoo studio) that provides:
- A static landing page
- A serverless contact / appointment request form
- Email notifications without managing servers

This project is designed to practice and demonstrate core concepts from the **AWS Solutions Architect – Associate** certification: managed services, scalability, security trade-offs, cost awareness, and Infrastructure as Code.

---

## Problem Statement

Small businesses often need a simple website and a reliable way to receive customer inquiries. Traditional hosting solutions introduce unnecessary complexity:

- Servers to provision, patch, and monitor  
- Limited scalability during traffic spikes  
- Fixed monthly costs for low-traffic workloads  

For a tattoo studio, the real need is:
- A fast landing page
- A contact form that reliably delivers messages
- Minimal operational overhead and cost

---

## Solution Overview

This solution uses a **fully serverless architecture** on AWS.

### Architecture Components

- **Amazon S3 (Static Website Hosting)**  
  Hosts the landing page (HTML/CSS/JS).

- **Amazon API Gateway (HTTP API)**  
  Exposes a `POST /contact` endpoint.

- **AWS Lambda**  
  Validates incoming requests and publishes notifications.

- **Amazon SNS**  
  Sends email notifications when a contact request is submitted.

- **Amazon CloudWatch Logs**  
  Provides basic observability for Lambda execution.

> Note:  
> CloudFront is the intended production-grade frontend (HTTPS, caching, private S3 origin).  
> Some AWS accounts require verification before creating CloudFront distributions, so this version uses **S3 Website Hosting as a temporary fallback**.

---

## Repository Structure

```text
.
├── template.yaml         # AWS SAM / CloudFormation template
├── src/
│   └── handler.js        # Lambda contact handler
└── site/
    ├── index.html        # Tattoo studio landing page
    └── config.js         # Runtime configuration (API endpoint)
```

## Deployment
- sam build
- sam deploy --guided


## Post-Deployment Steps

1. **Confirm SNS subscription**  
   Check your inbox and confirm the SNS email subscription.

2. **Configure frontend runtime settings**  
   Copy the `ApiEndpoint` output from the stack and update:  
   `site/config.js`
```javascript
   window.__CONFIG__ = {
     API_BASE_URL: "https://<api-id>.execute-api.<region>.amazonaws.com/prod"
   };
```

3. **Upload the website**
```bash
   aws s3 sync site/ s3://<WebsiteBucketName>/
```

4. **Open the S3 Website URL** from the stack outputs.


## Cleanup

To remove all deployed resources managed by CloudFormation:
```bash
aws cloudformation delete-stack --stack-name <STACK_NAME> --region <REGION>
aws cloudformation wait stack-delete-complete --stack-name <STACK_NAME> --region <REGION>
```

If stack deletion fails because the S3 bucket is not empty:
```bash
aws s3 rm s3://<WebsiteBucketName> --recursive
```

Then retry deleting the stack.

**Optional:** If the S3 bucket has `DeletionPolicy: Retain`, it will remain after stack deletion and must be managed manually.
