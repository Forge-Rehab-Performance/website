# Go-live walkthrough: Forge Rehab & Performance

**Goal:** Publish `https://rehabforge.com` from Brandon’s Netlify Free account, keep the shared GitHub repo as the source, and keep Porkbun in charge of DNS. Brandon owns the Netlify project and receives contact inquiries; AJ keeps pushing changes to GitHub without needing a Netlify team seat. The [GitHub repo](https://github.com/Forge-Rehab-Performance/website) is public, and [Netlify Free supports deploys from public-repo contributors](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/).

## 1. Deploy under Brandon’s Netlify account

1. In Brandon’s Netlify account, go to **Add new project → Import an existing project → GitHub**. Authorize the Netlify GitHub app for **Forge-Rehab-Performance**. If GitHub asks which repositories the app can access, grant access to `website`; reuse the existing organization installation if GitHub shows one. If the repo is missing, check the [GitHub app’s repository permissions](https://docs.netlify.com/build/git-workflows/repo-permissions-linking/) rather than disconnecting the old site.
2. Select `Forge-Rehab-Performance/website` and confirm these settings:

   | Setting | Value |
   | --- | --- |
   | Production branch | `master` |
   | Base directory | Repo root (leave blank) |
   | Build command | `npm run build` |
   | Publish directory | `dist` |
   | Node.js | `22.19.0` or newer; set `NODE_VERSION=22` to use the current Node 22 patch if needed |
   | `SITE_URL` | `https://rehabforge.com` (already the code default; don't use the temporary URL) |

   Leave `PUBLIC_GA_MEASUREMENT_ID` unset unless the business wants to enable analytics with its own property.
3. Deploy. Copy the new project’s production `.netlify.app` hostname from **Domain management**. Open it and confirm the home, pricing, FAQ, and contact pages load and **Schedule a Visit** opens PT Everywhere. Don't book a real appointment for the test. In **Deploys**, check that the published commit matches GitHub’s `master`.

## 2. Test the contact form before changing DNS

1. In the **new** Netlify project, open **Forms** and [enable form detection](https://docs.netlify.com/manage/forms/setup/) if it isn’t already on. Redeploy after enabling it, then confirm the form named `contact` appears. The form is already in the site’s static HTML; no API key or code change is needed.
2. Go to **Forms → Submission notifications**, add an [email notification](https://docs.netlify.com/manage/forms/notifications/) for `contact`, and send it to `brandon@rehabforge.com`. If Netlify emails Brandon a confirmation link, have him accept it.
3. On the **new `.netlify.app`** site, submit a dummy message on `/contact/` using a real email address you control and no medical information. Confirm the submission appears in **Forms → contact** and in Brandon’s inbox. If it’s missing in Netlify, check the form’s spam submissions and whether detection was enabled before the latest deploy. If it’s in Netlify but not in the inbox, check the notification recipient, confirmation status, and email spam folder.
4. If the business needs old submissions, export them securely from the old project before retiring it. A fresh Netlify project won’t import them. Don’t store submissions or exports in this public repo.

## 3. Point Porkbun DNS to the new Netlify site

Porkbun is currently authoritative for `rehabforge.com`, and the domain has active mail routing records. **Keep the Porkbun nameservers. Change only the website records.**

1. In Porkbun, open **Domain Management → DNS** next to `rehabforge.com`. Save a copy or screenshot of the existing records for rollback. Don’t change MX, SPF, DKIM, DMARC, or other unrelated records. Check whether Porkbun URL forwarding is configured for the root or `www`.
2. In Brandon’s Netlify project, go to **Domain management → Production domains**, add `rehabforge.com`, and keep it as the primary domain to match the site’s canonical URL. Netlify normally adds `www.rehabforge.com` alongside the apex; confirm both are listed. If Netlify says the domain belongs to the old project, handle that during the cutover: remove the custom-domain assignments from the old project and immediately add them to the new one. If it’s still claimed or Netlify asks for ownership verification, follow the dashboard instructions or contact Netlify support before changing DNS. Don’t delete the old project.
3. In Netlify, open **Pending DNS verification** for the custom domain. Use the exact values Netlify shows. The standard [external DNS setup](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/) in [Porkbun’s DNS editor](https://kb.porkbun.com/article/68-how-to-edit-dns-records) is:

   | Type | Porkbun Host | Answer / Value |
   | --- | --- | --- |
   | `ALIAS` | Leave blank (root) | `apex-loadbalancer.netlify.com` |
   | `CNAME` | `www` | The new project’s `.netlify.app` hostname, without `https://` or a path |

   Replace conflicting website records for those two names, including old parking records or forwarding if present. Don’t leave old web `A`/`AAAA` records alongside the root `ALIAS`. If Netlify directs you to use its standard fallback instead, use a root `A` record to `75.2.60.5` **instead of** the `ALIAS`, not both. Keep unrelated records intact.
4. Wait for DNS to propagate and for Netlify to provision HTTPS for both names. Check **Domain management → HTTPS**. This can take several hours; avoid repeatedly changing records while verification is pending. If HTTPS doesn’t provision once DNS looks correct, use [Netlify’s HTTPS troubleshooting guide](https://docs.netlify.com/manage/domains/troubleshooting/troubleshoot-ssl-and-https/).

## 4. Confirm go-live and retire the old deployment

- [ ] `https://rehabforge.com` serves the new project without a certificate warning. `https://www.rehabforge.com` redirects to `https://rehabforge.com`.
- [ ] On the live `/contact/` page, send another dummy inquiry. Confirm it reaches the new project’s `contact` form and Brandon’s inbox. Send a separate normal test email from an outside address to confirm the mailbox still receives mail.
- [ ] **Schedule a Visit** opens the correct PT Everywhere page on the live site.
- [ ] After AJ’s next normal push to `master`, Brandon sees the matching commit publish in his Netlify dashboard. No Netlify invite is required for AJ. Keep an eye on the [Free plan’s monthly credit limit](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/); production deploys and traffic count toward it.
- [ ] Once the cutover is verified, stop automatic builds on the old project. Don’t uninstall the organization’s Netlify GitHub app or remove the new project’s repo access.

**If you need to roll back:** Restore the saved Porkbun website records and, if the previous site was on Netlify, reattach the domain to the old project as needed. DNS caches can delay the rollback. Leave email records alone, and recheck HTTPS and the contact form on whichever site is serving the domain.
