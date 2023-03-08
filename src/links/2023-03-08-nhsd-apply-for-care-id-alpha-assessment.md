---
title: "NHSD Apply for Care ID alpha assessment"
date: 2023-03-08T17:29:45.740Z
tags: ["web development", "progressive enhancement"]
ref_url: https://digitalhealth.blog.gov.uk/2023/03/03/nhsd-apply-for-care-id-alpha-assessment/
in_reply_to: https://digitalhealth.blog.gov.uk/2023/03/03/nhsd-apply-for-care-id-alpha-assessment/
twitter_text: "I love that the UK government is making digital product assessments, like this one for the in-development Care ID Assessment tool, public. There’s a lot to be learned from critiques like this."
ref_source: "GOV.UK - Digital Health and Social Care"
---

I love that the UK government is making digital product assessments, like this one for the in-development Care ID Assessment tool, public. There’s a lot to be learned from critiques like this.

In particular, I was impressed with how they held the line on the importance of robustness in tools like this (from [the “Choose the right tools and technology” section](https://digitalhealth.blog.gov.uk/2023/03/03/nhsd-apply-for-care-id-alpha-assessment/#choose-the-right-tools-and-technology)):


> Before their reassessment, the team needs to … allow users who have issues using services with Javascript or have Javascript disabled. The team must build services for all users and cannot depend on client-side Javascript.


Which yielded results in their reassessment:


> The panel was impressed that:
> 
> * the team has worked around the limitations for progressive enhancement of the service, resulting from the use of a serverless Single Page Application (SPA) architecture, which is a historical technology choice inherited from NHS login
the team has ensured the service now works for all applicants without requiring JavaScript to be enabled
> * the team has used the third party Paycasso identity verification mobile application to automate many parts of the process for validating an identity document, presenting a significant improvement versus the current remote identity check process via video link
> * the team has used the no JavaScript route through the service which re-uses the business logic for the SPA route despite the UI forms being separately maintained for both routes

The assessment also provides guidance for further improvements to be made. Love this!
