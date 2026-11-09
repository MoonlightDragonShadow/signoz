# Bilingual console maintenance

The interface language selector is available on the sign-in page and under Account Settings. English is the default. Language preferences are stored in the current browser and scoped to the deployment path.

- Keep Chinese resources under `public/locales/zh-CN`. The `console` namespace uses original English display strings as keys. Existing namespaces retain their upstream keys.
- Keep route IDs, query syntax, log attributes, API values, and user content independent of translated labels.
- From a new upstream release tag, create an upgrade branch and cherry-pick the bilingual commits in order. Reconcile changed source strings and prefer upstream translation keys when the new release introduces them.
- Run `pnpm build` to refresh the locale hashes and bundle the resources. Check both languages on the sign-in page, sidebar, time picker, and log explorer. Verify a refresh preserves the selection and that an untranslated label falls back to English.
- To reuse an existing SigNoz instance during local development, set `VITE_FRONTEND_API_ENDPOINT` to its origin before running `pnpm dev`. The endpoint should support the browser's development origin. Use a matching frontend and backend release when validating a production deployment.
