# Syndicate Content Workflow Trigger Issue - Investigation & Fix

## Issue Summary

The syndicate content workflow (`.github/workflows/syndicate-content.yml`) was running repeatedly every 30 minutes, consuming GitHub Actions minutes and making unnecessary API calls to social media platforms.

## Root Cause

The workflow configuration included a scheduled cron trigger that was set to run every 30 minutes:

```yaml
schedule:
  - cron: "*/30 * * * *"
```

This scheduled trigger was added when the workflow was first created in commit `77d73b7` (Dec 16, 2025) as a "backup check" mechanism to catch any missed posts.

## Why This Was Problematic

1. **Resource Waste**: The workflow ran every 30 minutes regardless of whether new content was published
2. **Unnecessary API Calls**: Social media platforms were queried repeatedly even with no new content
3. **Potential Rate Limiting**: Frequent API calls could lead to rate limiting issues
4. **GitHub Actions Minutes**: Consumed GitHub Actions minutes unnecessarily

## Impact Mitigation

The cache system prevented duplicate posts from being published because:
- The `getItemsNewerThan()` method only processes items published "today" (line 144-152 in `social-media-utils.js`)
- The cache tracks which items have been successfully syndicated to each platform
- Even if the workflow ran multiple times, it wouldn't re-post the same content

However, the workflow still wasted resources by running and fetching feeds unnecessarily.

## Solution Implemented

**Changed the scheduled trigger** from every 30 minutes to once daily at 11am UTC.

The workflow now runs when:
1. **Netlify Deploy Success**: Triggered via `repository_dispatch` webhook after successful Netlify deployment
2. **Manual Trigger**: Via `workflow_dispatch` for testing and manual syndication
3. **Daily Backup Check**: Scheduled to run once per day at 11am UTC via cron trigger

### Files Changed

1. `.github/workflows/syndicate-content.yml`
   - Changed scheduled cron trigger from `*/30 * * * *` (every 30 minutes) to `0 11 * * *` (daily at 11am UTC)

2. `.github/SYNDICATION_SETUP.md`
   - Updated monitoring section to reflect daily backup check at 11am UTC

## Why This Fix Is Appropriate

1. **Primary Trigger Works**: The Netlify webhook (`repository_dispatch`) is the intended trigger mechanism
2. **Manual Override Available**: The `workflow_dispatch` trigger allows manual runs when needed
3. **No Content Loss**: New content will still be syndicated immediately after deployment
4. **Resource Efficient**: Running once daily instead of every 30 minutes reduces resource consumption by 97%
5. **Backup Safety Net**: Daily check ensures nothing is missed if Netlify webhook fails

## Alternative Approaches Considered

1. **Remove scheduled trigger entirely**
   - Initially implemented but reconsidered
   - While the primary trigger should be sufficient, a backup check adds safety

2. **Add conditional logic to skip if no new deploys**
   - Rejected: More complex than necessary; cache already handles duplicates

3. **Use GitHub API to check for new commits before running**
   - Rejected: Adds complexity and still requires the workflow to run periodically

## Final Solution

**Daily scheduled check at 11am UTC** provides the right balance:
- Significantly reduces resource consumption (97% reduction from every 30 minutes)
- Maintains a safety net in case Netlify webhooks fail
- Simple and straightforward implementation

## Testing Recommendations

1. Verify the workflow no longer runs on schedule
2. Test that Netlify webhook trigger still works correctly
3. Test manual trigger via workflow_dispatch
4. Monitor for any missed syndications after the fix
