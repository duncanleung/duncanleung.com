---
date: 2020-06-17
title: AWS - Set Up Billing Alerts
template: post
thumbnail: "../thumbnails/aws.png"
slug: aws-set-up-email-billing-alert
categories:
  - AWS
tags:
  - aws
---

It's a good practice to set up billing alerts when you're first getting started with AWS to avoid unexpected charges than can be caused by forgetting to clean up and remove unused services.

## Enable Billing Alerts in "Billing preferences"

1. Navigate to <a href='https://console.aws.amazon.com/billing/home?region=us-east-1#/preferences' target='_blank'>My Billing Dashboard > Billing preferences</a>
2. Enable **"Receive Free Tier Usage Alerts"** to receive email alerts when AWS service usage is approaching, or has exceeded, the AWS Free Tier usage limits.
3. Enter the **Email Address to send the alerts to**
4. Enable **"Receive Billing Alerts"** to send billing alerts to via email when your charges reach a specified threshold.

<img className="avatar" src='../../content/images/post-images/2020-06-17-billing-preferences.png' alt="" />

## Create a CloudWatch Billing Alarm

1. Navigate to <a href='https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#alarmsV2:!namespace=AWS/Billing' target='_blank'>CloudWatch > Alarms > Billing</a>
2. **"Create Alarm"**

<img className="avatar" src='../../content/images/post-images/2020-06-17-cloudwatch-billing-alarms-dashboard.png' alt="" />

<br />
<br />

1. Specify the **threshold dollar value** to trigger an alarm

Here, the dollar threshold value is \$10 USD

2. Click **Next**

<img className="avatar" src='../../content/images/post-images/2020-06-17-billing-alarm-threshold.png' alt="" />

<br />
<br />

3. **Create a new SNS topic** for Billing Alerts
4. Specify the **email address to send Billing Alerts** to
5. Click **"Create topic"**
6. Click **Next**

<img className="avatar" src='../../content/images/post-images/2020-06-17-billing-alarm-sns-topic.png' alt="" />

<br />
<br />

7. Set the **Alarm Name and Description**
8. Click **Next**

<img className="avatar" src='../../content/images/post-images/2020-06-17-billing-alarm-set-name.png' alt="" />

<br />
<br />

9. Review the summary of the alarm to be created
10. Click **Create alarm**

<img className="avatar" src='../../content/images/post-images/2020-06-17-billing-alarm-preview-create.png' alt="" />

<br />
<br />

The CloudWatch Billing alarm is created. However, we need to confirm the SNS Subscription.

11. Click **"View SNS Subscriptions"**

<img className="avatar" src='../../content/images/post-images/2020-06-17-cloudwatch-pending.png' alt="" />

## Confirm the SNS Subscription

1. Navigate to <a href='https://console.aws.amazon.com/sns/v3/home?region=us-east-1#/subscriptions' target='_blank'>Amazon SNS > Subscriptions</a>

We can see that the new SNS subscription is **"Pending confirmation"**

<img className="avatar" src='../../content/images/post-images/2020-06-17-sns-pending-confirmation.png' alt="" />

<br />
<br />

2. Go to the email inbox you designated for alerts and find the email **"AWS Notification - Subscription Confirmation"**

3. Click **"Confirm subscription"**

<img className="avatar" src='../../content/images/post-images/2020-06-17-sns-email.png' alt="" />

<br />
<br />

<img className="avatar" src='../../content/images/post-images/2020-06-17-sns-email-confirmed.png' alt="" />

<br />
<br />

You'll now see in Amazon SNS that the subscription has been confirmed

<img className="avatar" src='../../content/images/post-images/2020-06-17-sns-confirmed.png' alt="" />
